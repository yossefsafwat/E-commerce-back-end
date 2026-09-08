import Joi from "joi";
//create Product Schema
const createProductSchema = Joi.object({
  name: Joi.string().max(200).required(),

  shortDescription: Joi.string().max(500).required(),

  description: Joi.string().required(),

  price: Joi.number().min(0).required(),

  discountPrice: Joi.number().min(0),

  stock: Joi.number().min(0).required(),

  sku: Joi.string(),

  category: Joi.string().required(),

  subcategory: Joi.string(),

  brand: Joi.string(),

  tags: Joi.array().items(Joi.string()),
});
//update Product Schema
const updateProductSchema = Joi.object({
  name: Joi.string().max(200),
  shortDescription: Joi.string().max(500),
  description: Joi.string(),
  price: Joi.number().min(0),
  discountPrice: Joi.number().min(0),
  stock: Joi.number().min(0),
  sku: Joi.string(),
  category: Joi.string(),
  subcategory: Joi.string(),
  brand: Joi.string(),
  tags: Joi.array().items(Joi.string()),
}).min(1);

export {
  createProductSchema,
  updateProductSchema,
};