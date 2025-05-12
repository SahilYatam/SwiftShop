import { Router } from "express";
import {
  getAnalyticsData,
  getDailySalesData,
} from "../controllers/analytics.controller.js";
import { authentication, sellerRoute } from "../middlewares/auth.middleawre.js";

import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const rotuer = Router();

rotuer.get("/", authentication, sellerRoute, async (req, res) => {
  try {
    const analyticsData = await getAnalyticsData();

    const endDate = new Date();
    const startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000);

    const dailySalesData = getDailySalesData(startDate, endDate);

    return res.json(
      new ApiResponse(
        200,
        { analyticsData, dailySalesData },
        "Daily sales data fetched successfully"
      )
    );
  } catch (error) {
    console.log("Error in getAnalyticsData router code", error.message);
    throw new ApiError(500, "Internal server error ");
  }
});
