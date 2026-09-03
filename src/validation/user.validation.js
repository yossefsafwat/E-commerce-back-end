import Joi from "joi";

export const updateUserSchema = Joi.object({
  username: Joi.string()
    .min(3)
    .max(30),

  email: Joi.string()
    .email(),

  phone: Joi.string()
    .pattern(/^[0-9]{10,15}$/),

  avatar: Joi.string()
    .uri(),
});

export const changePasswordSchema = Joi.object({
  currentPassword: Joi.string()
    .required(),

  newPassword: Joi.string()
    .min(8)
    .required(),
});