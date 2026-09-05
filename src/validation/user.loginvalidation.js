import Joi from "joi";

const loginValidation = Joi.object({
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
    })
});

export {
  loginValidation,
}

