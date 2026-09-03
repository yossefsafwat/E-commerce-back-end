import { updateUserSchema, changePasswordSchema } from "./user.validation.js";

const validUser = {
  username: "Arwa",
  email: "arwa@example.com",
  phone: "01012345678",
  avatar: "https://example.com/avatar.jpg",
};

const invalidUser = {
  username: "A",
  email: "wrong-email",
  phone: "abc",
  avatar: "not-a-url",
};

const userResult = updateUserSchema.validate(invalidUser, {
  abortEarly: false,
});
console.log("Update User validation:");
console.log(userResult.error?.details);

const validPassword = {
  currentPassword: "OldPassword123",
  newPassword: "NewPassword123",
};

const invalidPassword = {
  currentPassword: "",
  newPassword: "123",
};

const passwordResult = changePasswordSchema.validate(invalidPassword, {
  abortEarly: false,
});

console.log("Change Password validation:");
console.log(passwordResult.error?.details);