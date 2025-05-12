import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "name is required"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: [true, "Email is required"],
      minlength: [8, "Password must be at least 8 character long"],
    },

    cartItems: [
      {
        quantity: {
          type: Number,
          default: 1,
        },
        product: {
          type: Schema.Types.ObjectId,
          ref: "Product",
        },
      },
    ],

    role: {
      type: String,
      enum: ["buyer", "seller"],
      default: "buyer",
    },

    resetPasswordToken: String,
	resetPasswordExpiresAt: Date,

  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
