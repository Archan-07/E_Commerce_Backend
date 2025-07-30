import { Cart } from "../models/cart.model.js";
import { Product } from "../models/product.model.js";
import { User } from "../models/user.model.js";
import apiError from "../utils/apiError.js";
import apiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

const addToCart = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { productId, quantity } = req.body;
  if (!productId || !quantity) {
    throw new apiError(400, "Product ID and quantity are required");
  }

  const product = await Product.findById(productId);
  if (!product) {
    throw new apiError(404, "Product not found");
  }

  let cart = await Cart.findOne({ user: userId });

  if (!cart) {
    // if there is no cart then create the cart
    cart = await Cart.create({
      user: userId,
      items: [{ product: productId, quantity }],
    });
  } else {
    // if there is the cart then update the cart
    const existingItem = cart.items.find(
      (item) => item.product.toString() == productId
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }
    await cart.save();
  }

  await User.findByIdAndUpdate(userId, {
    $push: {
      cart: cart._id,
    },
  });
  res
    .status(200)
    .json(new apiResponse(200, cart, "Product added to cart successfully"));
});

const getCart = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const cart = await Cart.findOne({ user: userId }).populate(
    "items.product",
    "title image price"
  );

  if (!cart) {
    return res.status(200).json(new apiResponse(200, [], "Cart is empty"));
  }
  res.status(200).json(new apiResponse(200, cart, "Cart fetched successfully"));
});

const removerFromCart = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { productId } = req.params;

  const cart = await Cart.findOne({ user: userId });
  if (!cart) {
    throw new apiError(404, "Cart not found");
  }

  cart.items = cart.items.filter(
    (item) => item.product.toString() !== productId
  );

  await cart.save();

  res.status(200).json(new apiResponse(200, cart, "Item removed from cart"));
});

const clearCart = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const cart = await Cart.findOneAndDelete({ user: userId });

  res.status(200).json(new apiResponse(200, {}, "Cart cleared"));
});

export { addToCart, getCart, removerFromCart, clearCart };
