import apiError from "../utils/apiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import apiResponse from "../utils/apiResponse.js";
import { Cart } from "../models/cart.model.js";
import { Order } from "../models/order.model.js";
import { User } from "../models/user.model.js";

const placeOrder = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const cart = await Cart.findOne({ user: userId }).populate("items.product");
  if (!cart || cart.items.length === 0) {
    throw new apiError(400, "Cart is empty");
  }

  const orderItems = cart.items.map((item) => ({
    product: item.product._id,
    quantity: item.quantity,
    price: item.product.price,
  }));

  const totalAmount = orderItems.reduce((acc, item) => {
    return acc + item.quantity * item.price;
  }, 0);

  const order = await Order.create({
    user: userId,
    items: orderItems,
    totalamount: Number(totalAmount),
    paymentstatus: "pending", // You can change this based on your flow
    shipmentstatus: "pending",
  });

  await User.findByIdAndUpdate(userId, {
    $push: { orders: order._id },
  });
  await Cart.findOneAndDelete({ user: userId });

  return res
    .status(201)
    .json(new apiResponse(201, order, "Order placed successfully"));
});

const getUserOrders = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const orders = await Order.find({ user: userId }).populate(
    "items.product",
    "title image price"
  );

  return res
    .status(200)
    .json(new apiResponse(200, orders, "User orders fetched successfully"));
});

const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find()
    .populate("user", "name email")
    .populate("items.product", "title price image");
  return res
    .status(200)
    .json(new apiResponse(200, orders, "All orders fetched successfully"));
});

const updateOrderStatus = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const { paymentstatus, shipmentstatus } = req.body;

  const order = await Order.findById(orderId);
  if (!order) {
    throw new apiError(404, "Order not found");
  }

  if (paymentstatus) order.paymentstatus = paymentstatus;
  if (shipmentstatus) order.shipmentstatus = shipmentstatus;

  await order.save();

  res
    .status(200)
    .json(new apiResponse(200, order, "Order status updated successfully"));
});



export { placeOrder, getUserOrders, getAllOrders, updateOrderStatus };
