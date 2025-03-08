import { transporter } from "./nodemailer.config.js";
import {
  PASSWORD_RESET_REQUEST_TEMPLATE,
  PASSWORD_RESET_SUCCESS_TEMPLATE,
} from "./emailTamplates.js";
import { ApiError } from "../utils/ApiError.js";

export const sendPasswordResetEmail = async (email, resetUrl) => {
  try {
    await transporter.sendMail({
      from: process.env.SENDER,
      to: email,
      subject: "Reset your password",
      html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetUrl}", resetUrl),
    });
  } catch (error) {
    console.log(`Error sending reset password Email ${error.message}`);
    throw new ApiError(`Error sending reset password Email ${error}`);
  }
};

export const sendResetSuccessEmail = async (email) => {
  try {
    await transporter.sendMail({
      from: process.env.SENDER,
      to: email,
      subject: "Password Reset Successful",
      html: PASSWORD_RESET_SUCCESS_TEMPLATE,
    });
  } catch (error) {
    console.log(`Error sending password reset success Email ${error.message}`);
    throw new ApiError(
      `Error sending password reset success Email ${error.message}`
    );
  }
};
