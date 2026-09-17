import Joi from "joi";
import {
  usernameValidation,
  emailValidation,
  passwordValidation,
  phoneValidation,
} from "./common.validation.js";

export const adminAddUserSchema = Joi.object({

    username: usernameValidation,
  email: emailValidation,
  password: passwordValidation,
  phone: phoneValidation,

  avatar: Joi.string()
    .uri()
    .optional()
    .messages({
      "string.uri": "avatar must be a valid URL",
    }),

  role: Joi.string()
    .valid("admin", "customer")
    .optional()
    .default("customer"),

  addresses: Joi.array()
    .items(
      Joi.object({
        country: Joi.string().optional(),
        city: Joi.string().optional(),
        street: Joi.string().optional(),
        postalCode: Joi.string().optional(),
      }),
    )
    .optional(),
});

  // username: Joi.string()
  //   .min(3)
  //   .max(30)
  //   .required()
  //   .messages({
  //     "string.min": "username must be at least 3 characters",
  //     "string.max": "username cannot exceed 30 characters",
  //     "any.required": "username is required",
  //     "string.empty": "username cannot be empty",
  //   }),

  // email: Joi.string()
  //   .email()
  //   .required()
  //   .messages({
  //     "string.email": "please enter a valid email address",
  //     "any.required": "email is required",
  //     "string.empty": "email cannot be empty",
  //   }),

  // password: Joi.string()
  //   .min(8)
  //   .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])/)
  //   .required()
  //   .messages({
  //     "string.min": "password must be at least 8 characters",
  //     "string.pattern.base":
  //       "password must include uppercase, lowercase, numbers, and special characters (!@#$%^&*)",
  //     "any.required": "password is required",
  //     "string.empty": "password cannot be empty",
  //   }),

  // phone: Joi.string()
  //   .pattern(/^[0-9]{10,15}$/)
  //   .optional()
  //   .messages({
  //     "string.pattern.base": "phone must contain 10 to 15 digits",
  //   }),


