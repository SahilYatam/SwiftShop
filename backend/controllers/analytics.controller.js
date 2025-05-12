import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

import { Order } from "../models/order.model.js";
import { Product } from "../models/product.model.js";

export const getAnalyticsData = async (req, res) => {
  const sellerId = req.user?._id;
  try {
    // Count total products uploaded by this seller
    const totalProducts = await Product.countDocuments({ seller: sellerId });

    // Get total sales and revenue for this seller
    const salesData = await Order.aggregate([
      {
        $unwind: "$products", // Flatten the products array
      },
      {
        $lookup: {
          from: "products",
          localField: "products.product",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      {
        $match: {
          "productDetails.seller": sellerId, // Filter orders that contain the seller's products
        },
      },
      {
        $group: {
          _id: null,
          totalSales: { $sum: 1 }, // Count numbers of orders
          totalRevenue: { $sum: "$totalAmount" }, // Sum order revenue
        },
      },
    ]);

    const { totalSales, totalRevenue } = salesData[0] || {
      totalSales: 0,
      totalRevenue: 0,
    };

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { analyticsData: { totalProducts, totalSales, totalRevenue } },
          "Seller analytics fetched successfully"
        )
      );
  } catch (error) {
    console.log("Error in getAnalyticsData", error.message);
    throw new ApiError(500, "Internal server error");
  }
};

export const getDailySalesData = asyncHandler(async (startDate, endDate, req, res) => {
  const sellerId = req.user?._id;
  try {
    const dailySalesData = await Order.aggregate([
      {
        $match: {
          $createdAt: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $unwind: "$products", // Flatten the products array
      },
      {
        $lookup: {
          from: "products",
          localField: "products.product",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      {
        $match: {
          "productDetails.seller": sellerId, // Filter by seller's products
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          sales: { $sum: 1 },
          revenue: { $sum: "$totalAmount" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const dateArray = getDatesInRange(startDate, endDate);

    const formatData = dateArray.map((date) => {
      const foundData = dailySalesData.find((item) => item._id === date);
      return {
        date,
        sales: foundData?.sales || 0,
        revenue: foundData?.revenue || 0,
      };
    });

    return formatData;

  } catch (error) {
    console.log("Error in getDailySalesData", error.message);
    throw new ApiError(500, "Internal server error");
  }
});

function getDatesInRange(startDate, endDate) {
  const dates = [];
  let currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    dates.push(currentDate.toISOString().split("T")[0]);
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
}
