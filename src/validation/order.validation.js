import Joi from 'joi'

export const createOrderValidation = Joi.object({
  shippingAddress: Joi.object({
    fullName: Joi.string().trim().required(),
    phone: Joi.string().trim().required(),
    country: Joi.string().trim().required(),
    city: Joi.string().trim().required(),
    address: Joi.string().trim().required(),
    postalCode: Joi.string().trim().required(),
  }).required(),

  paymentMethod: Joi.string()
    .valid('cash', 'stripe', 'paypal', 'paymob')
    .default('cash'),

  customerNote: Joi.string().max(1000).allow('', null),
})