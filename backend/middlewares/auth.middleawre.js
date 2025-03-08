import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";

export const authentication = async (req, _, next) => {
  try {
    const accessToken = req.cookies.accessToken;
    if (!accessToken)
      throw new ApiError(401, "Unauthorized - No access token provided");

    const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECERET);

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) throw new ApiError(404, "User not found");

    req.user = user;
    next();
  } catch (error) {
    console.log(`Error in authentication middleware code: ${error.message}`);
  }
};

export const sellerRoute = async (req, _, next) => {
  try {
    if (req.user.role === "seller") next();
  } catch (error) {
    throw new ApiError(403, "Access denied - Admin only");
  }
};
