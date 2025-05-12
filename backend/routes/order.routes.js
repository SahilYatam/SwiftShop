import { Router } from "express";
import {
    orderProduct,
    cancelOrder,
    getOrderForSeller,
    getNotifications
} from "../controllers/order.controller.js";
import { authentication, sellerRoute } from "../middlewares/auth.middleawre.js";

const router = Router();

router.post("/:id", authentication, orderProduct);
router.post("/cancel-product/:id", authentication, cancelOrder);

router.get("/", authentication, sellerRoute, getOrderForSeller);

router.get("/notification", authentication, sellerRoute, getNotifications);