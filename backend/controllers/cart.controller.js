import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

import { Product } from "../models/product.model.js";
import { redis } from "../config/redis.js";

export const addCart = asyncHandler(async (req, res) => {
  const { productId } = req.body;
  const user = req.user;

  try {
    const existingItem = user.cartItems.find((item) => item.id === productId);

    if (!user.cartItems) user.cartItems = [];

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      user.cartItems.push({ id: productId, quantity: 1 });
    }

    await redis.set(`cart:${user._id}`, JSON.stringify(user.cartItems));
    await user.save();
    return res
      .status(200)
      .json(
        new ApiResponse(200, { cartItem: user.cartItems }, "Item add to cart")
      );
  } catch (error) {
    console.log("Error in addToCart code ", error.message);
    throw new ApiError(500, "Internal server error");
  }
});

export const updateQuantity = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const { quantity } = req.body;
  const user = req.user;
  try {
    const existingItem = user.cartItems.find((item) => item.id === productId);

    if (existingItem) {
      if (quantity === 0) {
        user.cartItems = user.cartItems.filter((item) => item.id !== productId);
        await user.save();
        return res.json(
          new ApiResponse(200, { cartItem: user.cartItems }, "Cart items")
        );
      }

      existingItem.quantity = quantity;
      await user.save();
      return res.json(
        new ApiResponse(200, { cartItem: user.cartItems }, "Cart items")
      );
    } else {
      throw new ApiError(404, "Product not found");
    }
  } catch (error) {
    console.log("Error in updateQuantity code ", error.message);
    throw new ApiError(500, "Internal server error");
  }
});

export const getCartProducts = asyncHandler(async (req, res) => {
  try {
    const redisKey = `cart:${req.user?._id}`;
    const cachedCart = await redis.get(redisKey);

    let cartItems;
    if (cachedCart) {
      const cartFromRedis = JSON.parse(cachedCart);
      const productIds = cartFromRedis.map((item) => item.id);

      const products = await Product.find({ _id: { $in: productIds } }).lean();

      cartItems = products.map((product) => {
        const item = cartFromRedis.find(
          (cartItems) => (cartItems.id = product._id.toString())
        );
        return { ...product, quantity: item?.quantity || 1 };
      });
    } else {
      const cartFromUser = req.user.cartItems || [];
      const productIds = cartFromUser.map((item) => item.id);

      // Fetch product details from MongoDB
      const products = await Product.find({ _id: { $in: productIds } }).lean();

      // Map products to include quantity
      cartItems = products.map((product) => {
        const item = req.user.cartItems.find(
          (cartItem) => cartItem.product.toString() === product._id.toString()
        );
        return { ...product, quantity: item?.quantity || 1 };
      });
    }

    return res
      .status(200)
      .json(
        new ApiResponse(200, { cartItems }, "CartItems fetched successfully")
      );
  } catch (error) {
    console.error("Error in getCartProducts controller", error.message);
    throw new ApiError(500, "Internal Server error");
  }
});

export const removeAllFromCart = asyncHandler(async (req, res) => {
  const { productId } = req.body;
  const user = req.user;
  try {
    if (!user.cartItems) user.cartItems = [];

    if (!productId) {
      // Clear entire cart
      user.cartItems = [];
    } else {
      // Remove only the specified item
      user.cartItems = user.cartItems.filter((item) => item.id !== productId);
    }

    await user.save();
    await redis.del(`cart:${user._id}`);

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { cartItems: user.cartItems },
          productId ? "Item removed from cart" : "All items removed from cart"
        )
      );
  } catch (error) {
    console.error("Error in removeAllFromCart controller", error.message);
    throw new ApiError(500, "Internal Server error");
  }
});
