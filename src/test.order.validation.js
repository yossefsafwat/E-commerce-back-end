// import { createOrderValidation } from "./validation/order.validation.js";

// // =========================================================
// // TEST 1: Valid Order
// // =========================================================

// const validOrder = {
//   shippingAddress: {
//     fullName: "Youssef Ahmed",
//     phone: "01012345678",
//     country: "Egypt",
//     city: "Assiut",
//     address: "123 Main Street",
//     postalCode: "71511",
//   },
//   paymentMethod: "cash",
//   customerNote: "Please deliver in the afternoon.",
// };

// const validResult = createOrderValidation.validate(validOrder, {
//   abortEarly: false,
// });

// console.log("TEST 1 - Valid Order");

// if (!validResult.error) {
//   console.log("PASSED: Valid order was accepted");
// } else {
//   console.log("FAILED: Valid order was rejected");
//   console.log(validResult.error.details);
// }

// console.log("----------------------------------");

// // =========================================================
// // TEST 2: Missing Shipping Address
// // =========================================================

// const missingAddress = {
//   paymentMethod: "cash",
// };

// const result2 = createOrderValidation.validate(missingAddress, {
//   abortEarly: false,
// });

// console.log("TEST 2 - Missing Shipping Address");

// if (result2.error) {
//   console.log("PASSED: Missing shipping address was rejected");
//   console.log(result2.error.details);
// } else {
//   console.log("FAILED: Missing shipping address was accepted");
// }

// console.log("----------------------------------");

// // =========================================================
// // TEST 3: Missing Required Address Fields
// // =========================================================

// const incompleteAddress = {
//   shippingAddress: {
//     fullName: "Youssef Ahmed",
//     phone: "01012345678",
//     country: "Egypt",
//     // city missing
//     address: "123 Main Street",
//     // postalCode missing
//   },
//   paymentMethod: "cash",
// };

// const result3 = createOrderValidation.validate(incompleteAddress, {
//   abortEarly: false,
// });

// console.log("TEST 3 - Incomplete Shipping Address");

// if (result3.error) {
//   console.log("PASSED: Incomplete address was rejected");
//   console.log(result3.error.details);
// } else {
//   console.log("FAILED: Incomplete address was accepted");
// }

// console.log("----------------------------------");

// // =========================================================
// // TEST 4: Invalid Payment Method
// // =========================================================

// const invalidPayment = {
//   shippingAddress: {
//     fullName: "Youssef Ahmed",
//     phone: "01012345678",
//     country: "Egypt",
//     city: "Assiut",
//     address: "123 Main Street",
//     postalCode: "71511",
//   },
//   paymentMethod: "bitcoin",
// };

// const result4 = createOrderValidation.validate(invalidPayment, {
//   abortEarly: false,
// });

// console.log("TEST 4 - Invalid Payment Method");

// if (result4.error) {
//   console.log("PASSED: Invalid payment method was rejected");
//   console.log(result4.error.details);
// } else {
//   console.log("FAILED: Invalid payment method was accepted");
// }

// console.log("----------------------------------");

// // =========================================================
// // TEST 5: Customer Note Too Long
// // =========================================================

// const longNote = {
//   shippingAddress: {
//     fullName: "Youssef Ahmed",
//     phone: "01012345678",
//     country: "Egypt",
//     city: "Assiut",
//     address: "123 Main Street",
//     postalCode: "71511",
//   },
//   paymentMethod: "cash",
//   customerNote: "A".repeat(1001),
// };

// const result5 = createOrderValidation.validate(longNote, {
//   abortEarly: false,
// });

// console.log("TEST 5 - Customer Note Too Long");

// if (result5.error) {
//   console.log("PASSED: Long customer note was rejected");
//   console.log(result5.error.details);
// } else {
//   console.log("FAILED: Long customer note was accepted");
// }

// console.log("----------------------------------");

// // =========================================================
// // TEST 6: Invalid Phone / Empty Required Fields
// // =========================================================

// const invalidAddress = {
//   shippingAddress: {
//     fullName: "",
//     phone: "",
//     country: "",
//     city: "",
//     address: "",
//     postalCode: "",
//   },
//   paymentMethod: "cash",
// };

// const result6 = createOrderValidation.validate(invalidAddress, {
//   abortEarly: false,
// });

// console.log("TEST 6 - Empty Shipping Address Fields");

// if (result6.error) {
//   console.log("PASSED: Empty required fields were rejected");
//   console.log(result6.error.details);
// } else {
//   console.log("FAILED: Empty required fields were accepted");
// }

// console.log("----------------------------------");

// // =========================================================
// // TEST 7: Default Payment Method
// // =========================================================

// const noPaymentMethod = {
//   shippingAddress: {
//     fullName: "Youssef Ahmed",
//     phone: "01012345678",
//     country: "Egypt",
//     city: "Assiut",
//     address: "123 Main Street",
//     postalCode: "71511",
//   },
// };

// const result7 = createOrderValidation.validate(noPaymentMethod, {
//   abortEarly: false,
// });

// console.log("TEST 7 - Default Payment Method");

// if (!result7.error && result7.value.paymentMethod === "cash") {
//   console.log("PASSED: Default payment method is cash");
// } else {
//   console.log("FAILED: Default payment method is not cash");
// }

// console.log("----------------------------------");

// console.log("All Order validation tests completed.");