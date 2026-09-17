
import Joi from "joi";

import {
  usernameValidation,
  emailValidation,
  phoneValidation,
} from "./common.validation.js";

export const updateUserSchema = Joi.object({
  username: usernameValidation.optional(),
  email: emailValidation.optional(),
  phone: phoneValidation.optional(),

  avatar: Joi.string()
    .uri()
    .optional()
    .messages({
      "string.uri": "avatar must be a valid URL",
    }),
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
}).min(1);
// import Joi from "joi";

// export const updateUserSchema = Joi.object({
//   username: Joi.string()
//     .min(3)
//     .max(30),

//   email: Joi.string()
//     .email(),

//   phone: Joi.string()
//     .pattern(/^[0-9]{10,15}$/),

//   avatar: Joi.string()
//     .uri(),
// });

// export const changePasswordSchema = Joi.object({
//   currentPassword: Joi.string()
//     .required(),

//   newPassword: Joi.string()
//     .min(8)
//     .required(),
// });