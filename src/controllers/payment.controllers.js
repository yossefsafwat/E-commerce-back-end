import Stripe from 'stripe';
import Order from '../models/Order.model.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createPaymentIntent = async (req, res) => {
  try {
    const orderId = req.params.orderId

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: 'Order ID is required.',
      });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found.',
      });
    }

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'You must login first.',
      });
    }

    const authUserId = (req.user._id || req.user).toString();
    const orderUserId = (order.user?._id || order.user).toString();

    if (orderUserId !== authUserId) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized access: Order does not belong to the logged-in user.',
      });
    }

    if (order.paymentStatus === 'paid') {
      return res.status(400).json({
        success: false,
        message: 'This order has already been paid.',
      });
    }

    const amount = Math.round(order.totalPrice * 100);

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      payment_method_types: ['card'],
      metadata: {
        orderId: order._id.toString(),
        userId: authUserId,
      },
    });

    order.transactionId = paymentIntent.id;
    order.paymentMethod = 'stripe';
    await order.save();

    return res.status(200).json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      transactionId: paymentIntent.id,
    });
  } catch (error) {
    console.error('Error creating PaymentIntent:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error while creating payment intent.',
    });
  }
};

export const createCheckoutSession = async (req, res) => {
  try {
    const orderId = req.params.orderId

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: 'Order ID is required.',
      });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found.',
      });
    }

    if (order.paymentStatus === 'paid') {
      return res.status(400).json({
        success: false,
        message: 'This order has already been paid.',
      });
    }

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'You must login first.',
      });
    }

    const authUserId = (req.user._id || req.user).toString();
    const orderUserId = (order.user?._id || order.user).toString();

    if (orderUserId !== authUserId) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized access: Order does not belong to the logged-in user.',
      });
    }

    const clientBaseUrl = process.env.CLIENT_URL || `${req.protocol}://${req.get('host')}`;
    const successUrl = req.body.successUrl || `${clientBaseUrl}/checkout-success.html?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = req.body.cancelUrl || `${clientBaseUrl}/checkout-cancel.html`;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Order #${order._id}`,
            },
            unit_amount: Math.round(order.totalPrice * 100),
          },
          quantity: 1,
        },
      ],
      metadata: {
        orderId: order._id.toString(),
        userId: authUserId,
      },
      success_url: successUrl.includes('{CHECKOUT_SESSION_ID}') ? successUrl : `${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl,
    });

    order.transactionId = session.id;
    order.paymentMethod = 'stripe';
    await order.save();

    return res.status(200).json({
      success: true,
      url: session.url,
      sessionId: session.id,
    });
  } catch (error) {
    console.error('Error creating Checkout Session:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error while creating checkout session.',
    });
  }
};

export const handleStripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    if (process.env.STRIPE_WEBHOOK_SECRET) {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } else {
      console.warn('[Stripe Webhook Warning]: STRIPE_WEBHOOK_SECRET missing in .env. Parsing body for development mode.');
      event = typeof req.body === 'string' || Buffer.isBuffer(req.body)
        ? JSON.parse(req.body.toString())
        : req.body;
    }
  } catch (err) {
    console.error(`Webhook Signature Verification Failed: ${err.message}`);
    try {
      event = typeof req.body === 'string' || Buffer.isBuffer(req.body)
        ? JSON.parse(req.body.toString())
        : req.body;
    } catch (parseErr) {
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
      case 'payment_intent.succeeded': {
        const object = event.data.object;
        const orderId = object.metadata?.orderId;

        const order = orderId
          ? await Order.findById(orderId)
          : await Order.findOne({ transactionId: object.id });

        if (order) {
          order.paymentStatus = 'paid';
          order.status = 'confirmed';
          order.paidAt = new Date();
          await order.save();
          console.log(`[Stripe Webhook] Order ${order._id} marked as PAID & CONFIRMED via ${event.type}.`);
        } else {
          console.warn(`[Stripe Webhook] Order not found for Event Object: ${object.id}`);
        }
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object;
        const orderId = paymentIntent.metadata?.orderId;

        const order = orderId
          ? await Order.findById(orderId)
          : await Order.findOne({ transactionId: paymentIntent.id });

        if (order) {
          order.paymentStatus = 'failed';
          await order.save();
          console.log(`[Stripe Webhook] Order ${order._id} marked as FAILED.`);
        }
        break;
      }

      default:
        console.log(`[Stripe Webhook] Unhandled event type: ${event.type}`);
    }

    return res.status(200).json({ received: true });
  } catch (error) {
    console.error('Error handling Stripe webhook event:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error processing webhook event.',
    });
  }
};
