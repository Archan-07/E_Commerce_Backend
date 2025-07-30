import { Category } from "../models/category.model.js";
import apiError from "../utils/apiError.js";
import apiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

const createCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;

  if (!name) throw new apiError(400, "Category name is required");

  const existingCategory = await Category.findOne({ name: name.toLowerCase() });
  if (existingCategory) throw new apiError(400, "Category already exists");

  const slug = name.toLowerCase().replace(/ /g, "-");

  const category = await Category.create({
    name,
    slug,
  });

  res
    .status(201)
    .json(new apiResponse(201, category, "Category created successfully"));
});

const getAllCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({});
  return res
    .status(200)
    .json(new apiResponse(200, categories, "Fetched all categories"));
});

const updateCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;

  const category = await Category.findByIdAndUpdate(
    req.params?.categoryId,
    {
      $set: {
        name,
        slug: name,
      },
    },
    { new: true }
  );
  if (!category) throw new apiError(404, "Category not found");

  await category.save();

  return res
    .status(200)
    .json(new apiResponse(200, category, "Category updated successfully"));
});

const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findByIdAndDelete(req.params?.categoryId);
  if (!category) throw new apiError(404, "Category not found");

  res
    .status(200)
    .json(new apiResponse(200, {}, "Category deleted successfully"));
});

export { createCategory, getAllCategories, updateCategory, deleteCategory };
