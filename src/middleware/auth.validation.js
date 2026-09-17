import {
  sendOTPRegisterValidation,
  verifyOTPRegisterValidation,
  sendOTPForgetPassValidation,
  verifyOTPForgetPassValidation,
} from "../validation/otp.validation.js";
import { loginValidation } from "../validation/user.loginvalidation.js";
// import { changePasswordSchema } from "../validation/user.updatevalidation.js";
import { adminAddUserSchema } from "../validation/admin.user.validation.js";
function sendOTPRegister(req, res, next) {
  try {
    let { error } = sendOTPRegisterValidation.validate(req.body);
    if (error) {
      let allErrors = error.details.map((err) => ({
        field: err.context.key,
        message: err.message,
      }));

      return res.status(400).json({
        success: false,
        message: "validation failed: invalid data for sending registration OTP",
        errors: allErrors,
      });
    }
    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `internal server error while sending registration OTP: ${error.message}`,
    });
  }
}

function verifyOTPRegister(req, res, next) {
  try {
    let { error } = verifyOTPRegisterValidation.validate(req.body);
    if (error) {
      let allErrors = error.details.map((err) => ({
        field: err.context.key,
        message: err.message,
      }));

      return res.status(400).json({
        success: false,
        message:
          "validation failed: invalid data for verifying registration OTP",
        errors: allErrors,
      });
    }
    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `internal server error while verifying registration OTP: ${error.message}`,
    });
  }
}

function sendOTPForgetPass(req, res, next) {
  try {
    let { error } = sendOTPForgetPassValidation.validate(req.body);
    if (error) {
      let allErrors = error.details.map((err) => ({
        field: err.context.key,
        message: err.message,
      }));

      return res.status(400).json({
        success: false,
        message:
          "validation failed: invalid data for sending password reset OTP",
        errors: allErrors,
      });
    }
    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `internal server error while sending password reset OTP: ${error.message}`,
    });
  }
}

function verifyOTPForgetPass(req, res, next) {
  try {
    let { error } = verifyOTPForgetPassValidation.validate(req.body);
    if (error) {
      let allErrors = error.details.map((err) => ({
        field: err.context.key,
        message: err.message,
      }));

      return res.status(400).json({
        success: false,
        message:
          "validation failed: invalid data for verifying password reset OTP",
        errors: allErrors,
      });
    }
    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `internal server error while verifying password reset OTP: ${error.message}`,
    });
  }
}

function verfiylogin(req, res, next) {
  try {
    let { error } = loginValidation.validate(req.body);
    if (error) {
      let allErrors = error.details.map((err) => ({
        field: err.context.key,
        message: err.message,
      }));

      return res.status(400).json({
        success: false,
        message: "validation failed: invalid login credentials",
        errors: allErrors,
      });
    }
    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Internal server error while validating login data: ${error.message}`,
    });
  }
}
// function validateChangePassword(req, res, next) {
//   try {
//     const { error } = changePasswordSchema.validate(req.body);

//     if (error) {
//       const allErrors = error.details.map((err) => ({
//         field: err.context.key,
//         message: err.message,
//       }));

//       return res.status(400).json({
//         success: false,
//         message: "Validation failed: invalid password data",
//         errors: allErrors,
//       });
//     }

//     next();
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: `Internal server error while validating password data: ${error.message}`,
//     });
//   }
// }

function validateAdminAddUser(req, res, next) {
  try {
    const { error } = adminAddUserSchema.validate(req.body);

    if (error) {
      const allErrors = error.details.map((err) => ({
        field: err.context.key,
        message: err.message,
      }));

      return res.status(400).json({
        success: false,
        message: "Validation failed: invalid user data",
        errors: allErrors,
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Internal server error while validating user data: ${error.message}`,
    });
  }
}

export {
  sendOTPRegister,
  verifyOTPRegister,
  sendOTPForgetPass,
  verifyOTPForgetPass,
  verfiylogin,
  
  validateAdminAddUser,
};

// export {
//   sendOTPRegister,
//   verifyOTPRegister,
//   sendOTPForgetPass,
//   verifyOTPForgetPass,
//   verfiylogin,
// };
