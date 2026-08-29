import Joi from "joi"

const orderValidation = Joi.object().keys({
  user: Joi.string().hex().length(24).required(),
  items: Joi.array()
    .items(
      Joi.object().keys({
        product: Joi.string().hex().length(24).required(),
        name: Joi.string().trim().required(),
        image: Joi.string().required(),
        price: Joi.number().min(0).required(),
        quantity: Joi.number().integer().min(1).required(),
      }),
    )
    .min(1)
    .required(),
  shippingAddress: Joi.object()
    .keys({
      fullName: Joi.string().trim().required(),
      phone: Joi.string().trim().required(),
      country: Joi.string().trim().required(),
      city: Joi.string().trim().required(),
      address: Joi.string().trim().required(),
      postalCode: Joi.string().trim().required(),
    })
    .required(),

  paymentMethod: Joi.string()
    .valid("cash", "paypal", "stripe", "paymob")
    .default("cash"),

  paymentStatus: Joi.string()
    .valid("pending", "paid", "failed", "refunded")
    .default("pending"),

  transactionId: Joi.string().allow(null, ""),

  subtotal: Joi.number().min(0).required(),

  shippingFee: Joi.number().min(0).default(0),

  tax: Joi.number().min(0).default(0),

  discount: Joi.number().min(0).default(0),

  totalPrice: Joi.number().min(0).required(),

  status: Joi.string()
    .valid(
      "pending",
      "confirmed",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
      "returned",
    )
    .default("pending"),

  paidAt: Joi.date().allow(null),

  deliveredAt: Joi.date().allow(null),

  cancelledAt: Joi.date().allow(null),

  customerNote: Joi.string().max(1000).allow(null, ""),

  adminNote: Joi.string().max(1000).allow(null, ""),
})

export default orderValidation
