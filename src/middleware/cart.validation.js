import {
  addItemToCartValidation,
  updateItemQuantityValidation,
  applyCouponValidation
} from "../validation/cart.validation.js";

function validateAddItemToCart(req, res, next) {
  try {
    let { error } = addItemToCartValidation.validate(req.body);
    if (error) {
      let allErrors = error.details.map((err) => ({
        field: err.context.key,
        message: err.message,
      }));

      return res.status(400).json({
        success: false,
        message: "validation failed: invalid data for adding item to cart",
        errors: allErrors,
      });
    }
    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `internal server error while adding item to cart: ${error.message}`,
    });
  }
}

function validateUpdateItemQuantity(req, res, next) {
  try {
    let { error } = updateItemQuantityValidation.validate(req.body);
    if (error) {
      let allErrors = error.details.map((err) => ({
        field: err.context.key,
        message: err.message,
      }));

      return res.status(400).json({
        success: false,
        message:
          "validation failed: invalid data for updating item quantity",
        errors: allErrors,
      });
    }
    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `internal server error while updating item quantity: ${error.message}`,
    });
  }
}

function validateApplyCoupon(req, res, next) {
  try {
    let { error } = applyCouponValidation.validate(req.body);
    if (error) {
      let allErrors = error.details.map((err) => ({
        field: err.context.key,
        message: err.message,
      }));

      return res.status(400).json({
        success: false,
        message:
          "validation failed: invalid data for applying coupon",
        errors: allErrors,
      });
    }
    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `internal server error while applying coupon: ${error.message}`,
    });
  }
}

export {
  validateAddItemToCart,
  validateUpdateItemQuantity,
  validateApplyCoupon,
};
