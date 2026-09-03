
import bcryptjs from "bcryptjs";
import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
  country: {
    type: String,
    trim: true
  },

  city: {
    type: String,
    trim: true
  },

  street: {
    type: String,
    trim: true
  },

  postalCode: {
    type: String,
    trim: true
  }
});

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    password: {
      type: String,
      required: true,
      select: false
    },

    phone: {
      type: String,
      trim: true,
      default: ""
    },

    avatar: {
      type: String,
      default: ""
    },

    role: {
      type: String,
      enum: ["admin", "customer"],
      default: "customer"
    },

    addresses: [addressSchema],

    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
      }
    ],

    isVerified: {
      type: Boolean,
      default: false
    },

    resetPasswordToken: {
      type: String,
      default: null
    },

    resetPasswordExpire: {
      type: Date,
      default: null
    }
  },

  {
    timestamps: true
  }
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }

  this.password = await bcryptjs.hash(this.password, 10);
});

userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcryptjs.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;