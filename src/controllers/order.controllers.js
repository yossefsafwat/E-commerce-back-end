import { sendEmail, formatDate } from "../utils/email.js";

const sendOrderConfirmation = async (req, res) => {
  try {
    const orderData = {
      _id: "6a9c993c00e48b7cb37a1fd3",
      user: "64b8f1a2e4b0a1a2b3c4d001",
      items: [
        {
          product: "64b8f1a2e4b0a1a2b3c4d101",
          name: "Mechanical Keyboard RGB",
          image: "https://res.cloudinary.com/demo/image/upload/keyboard.jpg",
          price: 600,
          quantity: 2,
          _id: "6a9c993c00e48b7cb37a1fd4",
        },
        {
          product: "64b8f1a2e4b0a1a2b3c4d102",
          name: "Wireless Ergonomic Mouse",
          image: "https://res.cloudinary.com/demo/image/upload/mouse.jpg",
          price: 250,
          quantity: 3,
          _id: "6a9c993c00e48b7cb37a1fd5",
        },
      ],
      shippingAddress: {
        fullName: "Omar Khaled",
        phone: "01099998888",
        country: "Egypt",
        city: "Cairo",
        address: "15 Nasr City, Abbas El Akkad",
        postalCode: "11765",
      },
      paymentMethod: "cash",
      paymentStatus: "pending",
      subtotal: 1950,
      shippingFee: 50,
      tax: 119,
      discount: 0,
      totalPrice: 2119,
      status: "pending",
      customerNote: "Please deliver in the evening",
      createdAt: "2026-09-05T22:35:40.888+00:00",
      cancelledAt: "2026-09-05T23:00:42.004+00:00",
    };

    const { success } = await sendEmail(
      "nnanahamoud123@gmail.com",
      `Order Confirmation ${orderData.shippingAddress.fullName}`,
      "orderConfirm-template.hbs",
      {
        orderId: orderData._id,
        customerName: orderData.shippingAddress.fullName,
        status: orderData.status,
        orderDate: formatDate(Date.now()),
        items: orderData.items,
        subtotal: orderData.subtotal,
        shippingFee: orderData.shippingFee,
        tax: orderData.tax,
        discount: orderData.discount,
        totalPrice: orderData.totalPrice,
        shippingAddress: orderData.shippingAddress,
        paymentMethod: orderData.paymentMethod,
        paymentStatus: orderData.paymentStatus,
        year: new Date().getFullYear(),
      },
    );

    if (success) {
      console.log("order confirmation email sent successfully");
      // return res.status(200).json({
      //     success: true,
      //     message: "order confirmation email sent successfully",
      // });
    } else {
      console.log("failed to send order confirmation");
      // return res.status(500).json({
      //     success: false,
      //     message: "failed to send order confirmation",
      // });
    }
  } catch (error) {
    console.log(`Order confirmation error: ${error.message}`);
    // return res.status(500).json({
    //     success: false,
    //     message: `Order confirmation error: ${error.message}`,
    // });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const orderData = {
      _id: "6a9c993c00e48b7cb37a1fd3",
      user: "64b8f1a2e4b0a1a2b3c4d001",
      items: [
        {
          product: "64b8f1a2e4b0a1a2b3c4d101",
          name: "Mechanical Keyboard RGB",
          image: "https://res.cloudinary.com/demo/image/upload/keyboard.jpg",
          price: 600,
          quantity: 2,
          _id: "6a9c993c00e48b7cb37a1fd4",
        },
        {
          product: "64b8f1a2e4b0a1a2b3c4d102",
          name: "Wireless Ergonomic Mouse",
          image: "https://res.cloudinary.com/demo/image/upload/mouse.jpg",
          price: 250,
          quantity: 3,
          _id: "6a9c993c00e48b7cb37a1fd5",
        },
      ],
      shippingAddress: {
        fullName: "Omar Khaled",
        phone: "01099998888",
        country: "Egypt",
        city: "Cairo",
        address: "15 Nasr City, Abbas El Akkad",
        postalCode: "11765",
      },
      paymentMethod: "cash",
      paymentStatus: "pending",
      transactionId: "1111111",
      subtotal: 1950,
      shippingFee: 50,
      tax: 119,
      discount: 0,
      totalPrice: 2119,
      status: "shipped",
      paidAt: "2026-09-06T18:53:10.103Z",
      deliveredAt: "2026-09-06T18:53:10.103Z",
      cancelledAt: "2026-09-06T18:53:10.103Z",
      customerNote: "Please deliver before 5 PM",
      adminNote: "Shipped via FedEx",
      createdAt: "2026-09-06T18:53:10.103Z",
      updatedAt: "2026-09-06T18:53:10.103Z",
    };

    const { success } = await sendEmail(
      "nnanahamoud123@gmail.com",
      `Order Status Update #${orderData._id}`,
      "orderStatusUpdate-template.hbs",
      {
        orderId: orderData._id,
        customerName: orderData.shippingAddress.fullName,
        status: orderData.status,
        orderDate: formatDate(Date.now()),
        items: orderData.items,
        totalPrice: orderData.totalPrice,
        adminNote: orderData.adminNote,
        year: new Date().getFullYear(),
      },
    );

    if (success) {
      console.log("order status update email sent successfully");
      //   return res.status(200).json({
      //     success: true,
      //     message: "order status update email sent successfullyy",
      //   });
    } else {
      console.log("failed to send order status update");
      //   return res.status(500).json({
      //     success: false,
      //     message: "failed to send order status update",
      //   });
    }
  } catch (error) {
    console.log(`order status update error: ${error.message}`);
    // return res.status(500).json({
    //   success: false,
    //   message: `order status update error: ${error.message}`,
    // });
  }
};

export { sendOrderConfirmation, updateOrderStatus };
