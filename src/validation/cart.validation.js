import Joi from "joi";

//add item to cart validation
export const addItemToCartValidation = Joi.object({
  productId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base": "invalid product id",
      "any.required": "product id is required",
    }),
  quantity: Joi.number().integer().min(1).default(1).messages({
    "number.min": "Quantity must be at least 1",
  }),
});

// update item quantity validation
export const updateItemQuantityValidation = Joi.object({
  productId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base": "invalid product id",
      "any.required": "product id is required",
    }),
  quantity: Joi.number().integer().min(0).required().messages({
    "number.min": "quantity must be at least 0",
    "any.required": "quantity is required",
  }),
});

// apply coupon validation
export const applyCouponValidation = Joi.object({
  code: Joi.string()
    .uppercase()
    .trim()
    .valid("SAVE10", "SAVE20", "SAVE50", "SAVE80", "OFF50")
    .required()
    .messages({
      "any.only":
        "invalid coupon code. available codes only: SAVE10, SAVE20, SAVE50, SAVE80, OFF50",
      "any.required": "coupon code is required",
      "string.empty": "coupon code cannot be empty",
    }),
});

//verify:
//1_ verify add item to cart validation
export const verfiyAddItemToCart = async (req, res) => {
  try {
    const { error } = addItemToCartValidation.validate(req.body);

    if (error) {
      const allerrors = error.details.map((err) => ({
        field: err.context.key,
        message: err.message,
      }));

      return res.status(400).json({
        success: false,
        errors: allerrors,
        message: "add item to cart validation failed",
      });
    } else {
      return res.status(200).json({
        success: true,
        message: "add item to cart validation successfully",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//2_ verify update item quantity validation
export const verfiyUpdateItemQuantity = async (req, res) => {
  try {
    const { error } = updateItemQuantityValidation.validate(req.body);

    if (error) {
      const allerrors = error.details.map((err) => ({
        field: err.context.key,
        message: err.message,
      }));

      return res.status(400).json({
        success: false,
        errors: allerrors,
        message: "update item quantity validation failed",
      });
    } else {
      return res.status(200).json({
        success: true,
        message: "update item quantity validation successfully",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//3_ verify apply coupon validation
export const verfiyApplyCoupon = async (req, res) => {
  try {
    const { error } = applyCouponValidation.validate(req.body);

    if (error) {
      const allerrors = error.details.map((err) => ({
        field: err.context.key,
        message: err.message,
      }));

      return res.status(400).json({
        success: false,
        errors: allerrors,
        message: "apply coupon validation failed",
      });
    } else {
      return res.status(200).json({
        success: true,
        message: "apply coupon validation successfully",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
