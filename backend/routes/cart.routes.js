import { Router } from "express";
import {
    addCart
} from "../controllers/cart.controller.js";
import { authentication } from "../middlewares/auth.middleawre.js";

const router = Router();

router.post("/", authentication, addCart);

export default router;