import asyncHandler from "../utils/asyncHandler.js";
import { Product } from "../models/product.model.js";
import uploadOnCloudinary from "../utils/cloudinary.js";
import apiResponse from "../utils/apiResponse.js";
import apiError from "../utils/apiError.js";
import { Category } from "../models/category.model.js";
import { Review } from "../models/review.model.js";

const createProduct = asyncHandler(async (req, res) => {
  const { title, description, price, category, stock } = req.body;
  if (!title || !description || !price || !category || !stock) {
    throw new apiError(400, "All fields are required");
  }

  const productImageLocalPath = req.file?.path;
  console.log(productImageLocalPath);

  if (!productImageLocalPath) {
    throw new apiError(400, "Product Image is required");
  }
  const uploadedImage = await uploadOnCloudinary(productImageLocalPath);
  console.log(uploadedImage);

  if (!uploadedImage || !uploadedImage.url) {
    throw new apiError(500, "Image upload failed");
  }

  const existingProduct = await Product.findOne({ title });
  if (existingProduct) {
    throw new apiError(400, "Product with same name already exists");
  }

  const categoryDoc = await Category.findOne({ name: category });
  if (!categoryDoc) {
    throw new apiError(404, "Category not found");
  }

  const newProduct = await Product.create({
    title,
    description,
    price,
    category: categoryDoc._id,
    stock,
    image: uploadedImage.url,
    averageRating: 0,
  });

  return res
    .status(201)
    .json(new apiResponse(201, newProduct, "Product is created"));
});

const getProductById = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const product = await Product.findById(productId)
    .populate("category", "name")
    .populate({
      path: "review",
      populate: {
        path: "user",
        select: "name",
      },
    });
  if (!product) {
    throw new apiError(404, "Product not found");
  }

  res.status(200).json(new apiResponse(200, product, "Product fetched by id"));
});

const updateProduct = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const { title, description, price, category, stock } = req.body;
  if (!title || !description || !price || !category || !stock) {
    throw new apiError(400, "All fields are required");
  }

  const categoryDoc = await Category.findOne({ name: category });
  if (!categoryDoc) {
    throw new apiError(404, "Category not found");
  }
  const product = await Product.findByIdAndUpdate(
    productId,
    {
      $set: { title, description, price, category: categoryDoc._id, stock },
    },
    {
      new: true,
    }
  );
  if (!product) {
    throw new apiError(404, "Product not found");
  }

  res.status(200).json(new apiResponse(200, product, "Product updated"));
});

const deleteProduct = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const product = await Product.findByIdAndDelete(productId);
  if (!product) {
    throw new apiError(404, "Product not found");
  }

  res.status(200).json(new apiResponse(200, {}, "Product deleted"));
});

const getAllProducts = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, keyword, category } = req.query;
  const filter = {};
  if (keyword) {
    filter.title = { $regex: keyword, $options: "i" };
  }
  if (category) {
    filter.category = category;
  }

  const total = await Product.countDocuments(filter);

  const products = await Product.find(filter)
    .populate("category", "name")
    .skip((page - 1) * limit)
    .limit(parseInt(limit));
  return res.status(200).json(
    new apiResponse(
      200,
      {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        products,
      },
      "Fetched all products"
    )
  );
});

export {
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct,
  getAllProducts,
};
