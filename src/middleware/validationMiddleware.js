// export const validate = (schema) => {
//   return (req, res, next) => {
//     const { error } = schema.validate(req.body);

//     if (error) {
//       return res.status(400).json({
//         message: error.details[0].message,
//       });
//     }

//     next();
//   };
// };
 
// export const validate = (schema, source = "body") => {
//   return (req, res, next) => {
//     const { error } = schema.validate(req[source]);

//     if (error) {
//       return res.status(400).json({
//         message: error.details[0].message,
//       });
//     }

//     next();
//   };
// };
export const validate = (schema, source = "body") => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[source]);

    if (error) {
      return res.status(400).json({
        message: error.details[0].message,
      });
    }

    req[source] = value;

    next();
  };
};