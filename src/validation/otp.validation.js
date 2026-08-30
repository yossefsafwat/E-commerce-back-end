import Joi from "joi";

const sendOTPRegisterValidation = Joi.object({
  username: Joi.string()
    .min(3)
    .max(20)
    .pattern(/^[a-zA-Z0-9_]+$/)
    .required()
    .trim()
    .lowercase()
    .messages({
      "string.min": "username must be at least 3 characters",
      "string.max": "username cannot exceed 20 characters",
      "string.pattern.base":
        "username can only contain letters, numbers, and underscores",
      "any.required": "username is required",
      "string.empty": "username cannot be empty",
    }),
  email: Joi.string().email().required().trim().lowercase().messages({
    "string.email": "please enter a valid email address",
    "any.required": "email is required",
  }),
  password: Joi.string()
    .min(8)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])/)
    .required()
    .messages({
      "string.min": "password must be at least 8 characters",
      "string.pattern.base":
        "password must include uppercase, lowercase, numbers, and special characters (!@#$%^&*)",
      "any.required": "password is required",
      "string.empty": "password cannot be empty",
    }),
  phone: Joi.string()
    .pattern(/^(\+[0-9]{1,3})?[0-9]{7,15}$/)
    .optional()
    .messages({
      "string.pattern.base":
        "please enter a valid phone number with country code (e.g., +201012345678)",
    }),
});

const verifyOTPRegisterValidation = Joi.object({
  email: Joi.string().email().required().trim().lowercase().messages({
    "string.email": "please enter a valid email address",
    "any.required": "email is required",
  }),

  otp: Joi.string()
    .length(6)
    .pattern(/^[0-9]+$/)
    .required()
    .messages({
      "string.length": "OTP must be exactly 6 digits",
      "string.pattern.base": "OTP must contain only numbers",
      "any.required": "OTP is required",
    }),
});

const sendOTPForgetPassValidation = Joi.object({
  email: Joi.string().email().required().trim().lowercase().messages({
    "string.email": "please enter a valid email address",
    "any.required": "email is required",
  }),
});

const verifyOTPForgetPassValidation = Joi.object({
  email: Joi.string().email().required().trim().lowercase().messages({
    "string.email": "please enter a valid email address",
    "any.required": "email is required",
  }),
  otp: Joi.string()
    .length(6)
    .pattern(/^[0-9]+$/)
    .required()
    .messages({
      "string.length": "OTP must be exactly 6 digits",
      "string.pattern.base": "OTP must contain only numbers",
      "any.required": "OTP is required",
    }),
  newPassword: Joi.string()
    .min(8)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])/)
    .required()
    .messages({
      "string.min": "password must be at least 8 characters",
      "string.pattern.base":
        "password must include uppercase, lowercase, numbers, and special characters (!@#$%^&*)",
      "any.required": "password is required",
      "string.empty": "password cannot be empty",
    }),
});

export {
  sendOTPRegisterValidation,
  verifyOTPRegisterValidation,
  sendOTPForgetPassValidation,
  verifyOTPForgetPassValidation
}
