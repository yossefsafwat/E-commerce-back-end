import express from 'express';
import { createPaymentIntent, createCheckoutSession, handleStripeWebhook } from '../controllers/payment.controllers.js';
import { authentication } from '../middleware/auth.middleware.js';

const paymentRouter = express.Router();

paymentRouter.post('/create-payment-intent', authentication, createPaymentIntent);
paymentRouter.post('/create-payment-intent/:orderId', authentication, createPaymentIntent);

paymentRouter.post('/create-checkout-session', authentication, createCheckoutSession);
paymentRouter.post('/create-checkout-session/:orderId', authentication, createCheckoutSession);

paymentRouter.post('/webhook', express.raw({ type: 'application/json' }), handleStripeWebhook);

export default paymentRouter;
