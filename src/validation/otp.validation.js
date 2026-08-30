import Joi from "joi";

const otpValidationSchema = Joi.object({
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

export const verfiyOTP = async (req, res) => {
  try {
    const { error } = otpValidationSchema.validate(req.body);

    if (error) {
      const allerrors = error.details.map((err) => ({
        field: err.context.key,
        message: err.message,
      }));

      return res.status(400).json({
        success: false,
        errors: allerrors,
        message: "otp validation failed",
      });
    } else {
      return res.status(200).json({
        success: true,
        message: "otp validation successfully",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
