import { Router } from "express";
import {
  signup,
  login,
  logout,
  forgotPassword,
  resetPassword,
  refreshAccessToken,
  getUserProfile
} from "../controllers/auth.controller.js";

import { authentication } from "../middlewares/auth.middleawre.js";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.post("/refresh-token", refreshAccessToken);
router.get("/user", authentication, getUserProfile);

export default router;
