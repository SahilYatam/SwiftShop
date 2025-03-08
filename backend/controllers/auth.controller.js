import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";

import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import {
  generateTokens,
  setCookies,
  storeRefreshToken,
} from "../utils/setCookiesAndToken.js";
import { redis } from "../config/redis.js";
import {
  sendPasswordResetEmail,
  sendResetSuccessEmail,
} from "../email/email.js";

export const signup = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      throw new ApiError(400, "Invalid email format");
    }

    const existingtUser = await User.findOne({ email });
    if (existingtUser) {
      throw new ApiError(400, "User already exist");
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      password: hashPassword,
    });

    await newUser.save();

    const { accessToken, refreshToken } = generateTokens(newUser._id);
    await storeRefreshToken(newUser._id, refreshToken);

    setCookies(res, accessToken, refreshToken);

    const user = {
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
    };

    return res
      .status(201)
      .json(new ApiResponse(201, { user }, "User created successfully"));
  } catch (error) {
    console.log(`Error in signup controller code: ${error.message}`);
    throw new ApiError(500, "Internal server error");
  }
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) throw new ApiError(404, "User not found");

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) throw new ApiError(400, "Invalid password");

    const { accessToken, refreshToken } = generateTokens(user._id);
    await storeRefreshToken(user._id, refreshToken);

    setCookies(res, accessToken, refreshToken);

    const loginUser = {
      id: user._id,
      name: user.name,
      email: user.email,
    };

    return res
      .status(200)
      .json(new ApiResponse(200, { loginUser }, "Login successfull"));
  } catch (error) {
    console.log(`Error in login controller code ${error.message}`);
    throw new ApiError(500, "Internal server error");
  }
});

export const logout = asyncHandler(async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) {
      const decoded = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECERET
      );
      await redis.del(`refresh_token:${decoded.userId}`);
    }
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "User logout sucessfully"));
  } catch (error) {
    console.log("Error in getUserProfile", error.message);
    throw new ApiError(500, "Internal server error");
  }
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) throw new ApiError(404, "User not found");

    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString("hex");
    const restTokenExpireAt = Date.now() + 1 * 60 * 60 * 1000; // 1 hour

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiresAt = restTokenExpireAt;

    user.save();

    // send email
    await sendPasswordResetEmail(
      user.email,
      `${process.env.CLIENT_URL}/reset-password/${resetToken}`
    );

    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Password reset link sent to your email"));
  } catch (error) {
    console.log(`Error in forgot password controller ${error.message}`);
    throw new ApiError(500, "Internal server error");
  }
});

export const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      throw new ApiError(403, "Invalid or Expired reset token");
    }

    // update hashPassword
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    user.password = hashPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiresAt = undefined;
    user.save();

    await sendResetSuccessEmail(user.email);

    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Password reset successfull"));
  } catch (error) {
    console.log(`Error in reset password controller ${error.message}`);
    throw new ApiError(500, "Internal server error");
  }
});
