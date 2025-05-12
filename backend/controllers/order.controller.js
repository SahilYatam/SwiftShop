import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { stripe } from "../utils/stripe.js";

import { Order } from "../models/order.model.js";
import { Product } from "../models/product.model.js";
import { Notification } from "../models/notification.model.js";

export const orderProduct = asyncHandler(async (req, res) => {
  const { id: productId } = req.params;
  const { quantity, address } = req.body;

  const user = req.user;
  if (!user) throw new ApiError(403, "Unauthorized to order the product");

  if (!quantity || quantity < 1) throw new ApiError(400, "Invalid quantity");

  try {
    // Find the product in db
    const product = await Product.findById(productId);
    if (!product) throw new ApiError(404, "Product not found");

    // Ensure enough stock is available
    if (product.stock < quantity)
      throw new ApiError(400, "Not enough stock available");

    // Claculate price based on quantity
    const totalPrice = product.price * quantity;

    // Reduce stock
    product.stock -= quantity;

    // create stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: product.name,
            },
            unit_amount: product.price * 100, // convert to cents
          },
          quantity,
        },
      ],
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/purchase-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/purchase-cancel`,
    });

    const order = new Order({
      user: user._id,
      products: [
        {
          product: productId,
          quantity,
          price: product.price,
        },
      ],
      address,
      totalAmount: totalPrice,
      stripeSessionId: session.id,
    });

    await Promise.all([product.save(), order.save()]);

    await Notification.create({
      user: product.seller, // Seller ID
      message: `${user.name} ordered your product: ${product.name}`,
    });

    return res
      .status(201)
      .json(new ApiResponse(201, { order }, "Order created successfully"));
  } catch (error) {
    console.log("Error in orderProduct", error.message);
    throw new ApiError(500, "Internal server error");
  }
});

export const cancelOrder = asyncHandler(async (req, res) => {
  const user = req.user;
  if (!user) throw new ApiError(403, "Unauthorized");

  const { id: productId } = req.params;
  try {
    const order = await Order.findOne({
      user: user._id,
      "products.product": productId,
    });
    if (!order) throw new ApiError(404, "Order not found or already canceled");

    // Check time limit - Allow cancellation within 2 days (48 hours) for order creation

    const cancellationLimit = 2 * 24 * 60 * 60 * 1000; // 2 days
    const timeSinceOrder = Date.now() - new Date(order.createdAt).getTime();

    if (timeSinceOrder > cancellationLimit) {
      throw new ApiError(403, "Cancellation window has expired");
    }

    // Remove the product from the order
    order.products = order.products.filter(
      (item) => item.product.toString() !== productId
    );

    // if the order becomes empty after removing the product, delete the order
    if (order.products.length === 0) {
      await Order.findByIdAndDelete(order._id);
    } else {
      await order.save();
    }

    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Order canceld successfully"));
  } catch (error) {
    console.log("Error in orderProduct", error.message);
    throw new ApiError(500, "Internal server error");
  }
});

export const getOrderForSeller = asyncHandler(async (req, res) => {
  const user = req.user;
  if (!user) throw new ApiError(403, "Unauthorized");

  try {
    // Find the order where seller is the current user
    const orders = await Order.findOne({
      "products.product": {
        $in: await Product.findOne({ seller: user._id }).distinct("_id"),
      },
    })
      .populate("user", "name email") // Get customer details
      .populate("products.product", "name price image"); // Get product details

    if (!orders.length) throw new ApiError(404, "No orders found");

    return res
      .status(200)
      .json(new ApiResponse(200, { orders }, "Orders fetched successfully"));
  } catch (error) {
    console.log("Error in getOrderForSeller", error.message);
    throw new ApiError(500, "Internal server error");
  }
});

export const getNotifications = asyncHandler(async (req, res) => {
  const user = req.user;
  if (!user) throw new ApiError(403, "Unauthorized");

  const notifications = await Notification.findOne({ user: user._id }).sort({
    createdAt: -1,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, { notifications }, "Notifications fetched"));
});
