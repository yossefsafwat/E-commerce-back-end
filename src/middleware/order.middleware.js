import {
  createOrderValidation,
 updateOrderStatusValidation
} from "../validation/order.validation.js";

function validatecreateOrder(req, res, next) {
  try {
    let { error } = createOrderValidation.validate(req.body);
    if (error) {
      let allErrors = error.details.map((err) => ({
        field: err.context.key,
        message: err.message,
      }));

      return res.status(400).json({
        success: false,
        message: "validation failed: invalid data for creating order",
        errors: allErrors,
      });
    }
    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `internal server error while creating order: ${error.message}`,
    });
  }
}

function validateUpdateOrderStatus(req, res, next) {
  try {
    let { error } = updateOrderStatusValidation.validate(req.body);
    if (error) {
      let allErrors = error.details.map((err) => ({
        field: err.context.key,
        message: err.message,
      }));

      return res.status(400).json({
        success: false,
        message: "validation failed: invalid data for updating order status",
        errors: allErrors,
      });
    }
    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `internal server error while updating order status: ${error.message}`,
    });
  }
}


export {
  validatecreateOrder,
  validateUpdateOrderStatus
};
