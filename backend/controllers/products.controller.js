import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { cloudinary } from "../utils/cloudinary.config.js";
import { Product } from "../models/product.model.js";

import { redis } from "../config/redis.js";

export const createProducts = asyncHandler(async (req, res) => {
  const { name, description, price, stock, image, category } = req.body;
  if (
    [name, description, price, stock, image, category].some(
      (field) => field.trim() === ""
    )
  ) {
    throw new ApiError(403, "All fields are required");
  }
  const seller = req.user;
  if (!seller) throw new ApiError(401, "Unauthorized");

  try {
    let cloudinaryResponse = null;
    if (image) {
      cloudinaryResponse = await cloudinary.uploader.upload(image, {
        folder: "productsImg",
      });
    }

    const product = new Product({
      name,
      description,
      price,
      stock,
      image: cloudinaryResponse?.secure_url
        ? cloudinaryResponse.secure_url
        : "",
      category,
      seller: req.user?._id,
    });

    return res
      .status(201)
      .json(new ApiResponse(201, { product }, "Product created successfully"));
  } catch (error) {
    console.log("Error in createProducts", error.message);
    throw new ApiError(500, "Internal server error");
  }
});

export const updateProducts = asyncHandler(async (req, res) => {
  const { name, description, price, category } = req.body;

  if (!name || !description || !price || !category) {
    throw new ApiError(400, "All fields are required");
  }

  const { id: productId } = req.params;

  const user = req.user;
  if (!user) throw new ApiError(401, "Unauthorized");

  try {
    // Find the product and confirm ownership
    const product = await Product.findById(productId);
    if (!product) throw new ApiError(404, "Product not found");

    // Check if the product belongs to the current logged-in seller
    if (product.seller.toString() !== user._id.toString()) {
      throw new ApiError(403, "You are not allowed to update this product");
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      {
        $set: {
          name,
          description,
          price,
          category,
        },
      },
      { new: true }
    );

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { updatedProduct },
          "Product details updated successfully"
        )
      );
  } catch (error) {
    console.log("Error in updateProducts", error.message);
    throw new ApiError(500, "Internal server error");
  }
});

export const updateProductImg = asyncHandler(async (req, res) => {
  const { id: productId } = req.params;
  const { img } = req.body;
  const user = req.user;
  if (!user) throw new ApiError(401, "Unauthorized");

  if (!img) throw new ApiError(400, "Image is required");

  try {
    const product = await Product.findById(productId);
    if (!product) throw new ApiError(404, "Product not found");

    if (product.seller.toString() !== user._id.toString()) {
      throw new ApiError(403, "You are not allowed to update this product");
    }

    if (product.image) {
      try {
        const public_id = product.image.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(`productsImg/${public_id}`);
        console.log("Image deleted successfully");
      } catch (error) {
        console.log("Error while deleting image from cloudinary");
      }
    }

    const cloudinaryResponse = await cloudinary.uploader.upload(img, {
      folder: "productsImg",
    });

    const updatedImg = await Product.findByIdAndUpdate(
      productId,
      {
        $set: {
          image: cloudinaryResponse.secure_url,
        },
      },
      { new: true }
    );

    if (!updatedImg) {
      throw new ApiError(400, "Error while updating Image");
    }

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { updatedImg },
          "Product image updated successfully"
        )
      );
  } catch (error) {
    console.log("Error in updateProductImg", error.message);
    throw new ApiError(500, "Internal server error");
  }
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const { id: productId } = req.params;
  const user = req.user;
  if (!user) throw new ApiError(403, "Unauthorized");
  try {
    const product = await Product.findById(productId);
    if (!product) throw new ApiError(404, "Product not found");

    // Check if the product belongs to the current logged-in seller
    if (product.seller.toString() !== user._id.toString()) {
      throw new ApiError(403, "You are not allowed to delete this product");
    }

    if (product.image) {
      try {
        const public_id = product.image.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(`productsImg/${public_id}`);
        console.log("Image deleted successfully");
      } catch (error) {
        console.log("Error while deleting image from cloudinary");
      }
    }

    await Product.findOneAndDelete(product);

    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Product deleted successfully"));
  } catch (error) {
    console.log("Error in deleteProduct", error.message);
    throw new ApiError(500, "Internal server error");
  }
});

export const getAllProducts = asyncHandler(async (req, res) => {
  const user = req.user;
  if (!user) throw new ApiError(403, "Unauthorized");
  try {
    const products = await Product.find({ seller: user._id });

    if (products.length === 0) {
      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            { products: [] },
            "No products found. Create products"
          )
        );
    }

    return res
      .status(200)
      .json(
        new ApiResponse(200, { products }, "All product fetched successfully")
      );
  } catch (error) {
    console.log("Error in getAllProducts", error.message);
    throw new ApiError(500, "Internal server error");
  }
});

export const getProductsByCategory = asyncHandler(async (req, res) => {
  const { category } = req.params;
  try {
    const products = await Product.find({ category });
    return res
      .status(200)
      .json(
        new ApiResponse(200, { products }, "All product fetched by category")
      );
  } catch (error) {
    console.log("Error in getProductsByCategory", error.message);
    throw new ApiError(500, "Internal server error");
  }
});

export const getFeaturedProducts = asyncHandler(async (req, res) => {
  try {
    let featuredProducts = await redis.get("featured_products");
    if (featuredProducts) {
      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            { featuredProducts },
            "featured products fetched successfully"
          )
        );
    }

    // if not in redis, fetch from mongoDB
    // .lean() is gonna return a plain javascript object instead of a mongodb document

    featuredProducts = await Product.find({ isFeatured: true }).lean();
    if (!featuredProducts) {
      throw new ApiError(404, "No featured products found");
    }

    // store in redis for quick future access
    await redis.set("featured_products", JSON.stringify(featuredProducts));

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { featuredProducts },
          "featured products fetched successfully"
        )
      );
  } catch (error) {
    console.log("Error in getFeaturedProducts code ", error.message);
    throw new ApiError(500, "Internal server error");
  }
});

export const toggleFeaturedProducts = asyncHandler(async (req, res) => {
  const { id: featuredId } = req.params;
  const user = req.user;
  if (!user) throw new ApiError(401, "Unauthorized");
  try {
    const product = await Product.findById(featuredId);
    if (product.seller.toString() !== user._id.toString()) {
      throw new ApiError(403, "You are not allowed to featured this product");
    }

    if (product) {
      product.isFeatured = !product.isFeatured;
      const updateProduct = await product.save();
      await updateFeaturedProductsCache();

      return res
        .status(200)
        .json(new ApiResponse(200, { updateProduct }, "Product featured"));
    } else {
      throw new ApiError(404, "Product not found");
    }
  } catch (error) {
    console.log("Error in getFeaturedProducts code ", error.message);
    throw new ApiError(500, "Internal server error");
  }
});

async function updateFeaturedProductsCache(req, res) {
  const user = req.user;
  if (!user) throw new ApiError(403, "Unauthorized");
  try {
    const featuredProducts = await Product.find({
      seller: user._id,
      isFeatured: true,
    }).lean();
    await redis.set("featured_products", JSON.stringify(featuredProducts));
  } catch (error) {
    console.log("error in update cache function ", error.message);
  }
}

export const addReviews = asyncHandler(async (req, res) => {
  const { id: productId } = req.params;
  const { rate, comment } = req.body;
  if (!rate || !comment) throw new ApiError(403, "All fields are required");

  const user = req.user;
  if (!user) throw new ApiError(403, "Unauthorized request");
  try {
    const product = await Product.findById(productId);
    if (!product) throw new ApiError(404, "Product not found");

    // Add the new review
    product.reviews.push({
      user: user._id,
      rate,
      comment,
      createdAt: Date.now(),
    });

    // Recalculate average rating
    product.numReviews = product.reviews.length;
    product.rating =
      product.reviews.reduce((acc, review) => acc + review.rate, 0) /
      product.numReviews;

    await product.save();

    return res
      .status(201)
      .json(new ApiResponse(201, { reviews: product.reviews }, "Rating added"));
  } catch (error) {
    console.log("Error in addReviews", error.message);
    throw new ApiError(500, "Internal server error");
  }
});
