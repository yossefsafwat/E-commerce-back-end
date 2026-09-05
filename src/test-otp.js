// import mongoose from "mongoose";
// import OTP from "./models/OTP.model.js";
// import Cart from "./models/Cart.model.js";
// import dotenv from "dotenv";
// import path from "path";
// import { fileURLToPath } from "url";


// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// dotenv.config({ path: path.join(__dirname, ".env") });

// const MONGODB_URL = process.env.MONGODB_URL;

// async function testOTP() {
//   try {
//     await mongoose.connect(MONGODB_URL);
//     console.log("successfully connected to database\n");

//     const newOTP = await OTP.createOTP("yasmeen123@gamil.com", {
//       username: "yasmeen_sharaf",
//       email: "yasmeen123@gamil.com",
//       password: "mypassword123",
//       phone: "+201234567890",
//     });
//     const OTPuser = new OTP(newOTP);
//     if (OTPuser.isValid()) {
//       await OTPuser.save();
//       console.log("OTP valid");
//     } else {
//       console.log("OTP Is Expired");
//     }

//     const expiredOTP = new OTP({
//       email: "omar123@gmail.com",
//       otp: OTP.generateOTP(),
//       expiresAt: new Date(Date.now() - 1000),
//       userData: {
//         username: "omar_sharaf",
//         email: "omar123@gmail.com",
//         password: "mypassword123",
//         phone: "+201234567890",
//       },
//     });
//     if (expiredOTP.isValid()) {
//       await expiredOTP.save();
//       console.log("OTP is valid ");
//     } else {
//       console.log("OTP is expired");
//     }


//     const cartUser =  await new Cart({
//   user: new mongoose.Types.ObjectId(),
//   items: [
//     {
//       product: new mongoose.Types.ObjectId(),
//       name: "iPhone 15 Pro",
//       image: "https://example.com/iphone15.jpg",
//       price: 999,
//       quantity: 2
//     },
//     {
//       product: new mongoose.Types.ObjectId(),
//       name: "Samsung Galaxy S24",
//       image: "https://example.com/galaxy_s24.jpg",
//       price: 899,
//       quantity: 1
//     }
//   ],
//   coupon: {
//     code: "SAVE10",
//     discountType: "percentage",
//     discountValue: 10
//   }
// });
// await cartUser.save()








//   } catch (err) {
//     console.log(`error in server ${err} `);
//   } finally {
//     // if (mongoose.connection.readyState === 1) {
//     //   await mongoose.disconnect();
//     //   console.log("\n disconnected from database");
//     // }
//   }
// }

// testOTP();
