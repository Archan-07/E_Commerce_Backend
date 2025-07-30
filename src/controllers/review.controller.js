import { Product } from "../models/product.model.js";
import { Review } from "../models/review.model.js";
import apiError from "../utils/apiError.js";
import apiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import mongoose from "mongoose";

const addOrUpdateReview = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { productId } = req.params;
  const { rating, comment } = req.body;

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new apiError(400, "Invalid product ID");
  }

  const product = await Product.findById(productId);
  if (!product) {
    throw new apiError(404, "Product not found");
  }

  let review = await Review.findOne({ product: productId, user: userId });

  if (review) {
    // update existing review

    ((review.rating = rating), (review.comment = comment));
    await review.save();
  } else {
    review = await Review.create({
      product: productId,
      user: userId,
      rating,
      comment,
    });
    product.review.push(review._id);
  }

  // Recalculate averegeRating

  const allReviews = await Review.find({ product: productId });
  const avgRating =
    allReviews.reduce((acc, r) => acc + r.rating, 0) / allReviews.length;

  product.averageRating = avgRating.toFixed(1);
  await product.save();

  return res
    .status(200)
    .json(
      new apiResponse(
        200,
        review,
        review.isNew ? "Review added" : "Review updated"
      )
    );
});

const deleteReview = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { reviewId } = req.params;

  const review = await Review.findById(reviewId);
  if (!review) {
    throw new apiError(404, "Review not found");
  }

  if (review.user.toString() !== userId.toString()) {
    throw new apiError(403, "You are not allowed to delete this review");
  }

  await Review.findByIdAndDelete(reviewId);

  // Remove review from the product
  await Product.findByIdAndUpdate(review.product, {
    $pull: {
      review: reviewId,
    },
  });

  // Recalculate average rating

  const allReview = await Review.find({ product: review.product });
  const avgRating =
    allReview.length > 0
      ? allReview.reduce((acc, r) => (acc + r.rating, 0) / allReview.length)
      : 0;

  await Product.findByIdAndUpdate(review.product, {
    averageRating: avgRating.toFixed(1),
  });
  return res
    .status(200)
    .json(new apiResponse(200, {}, "Review deleted successfully"));
});

const getProductReview = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new apiError(400, "Invalid product ID");
  }

  const reviews = await Review.find({ product: productId }).populate(
    "user",
    "name"
  );

  return res
    .status(200)
    .json(new apiResponse(200, reviews, "Product reviews fetched"));
});

export { addOrUpdateReview, deleteReview, getProductReview };
