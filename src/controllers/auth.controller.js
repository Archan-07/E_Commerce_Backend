import { User } from "../models/user.model.js";
import apiError from "../utils/apiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import apiResponse from "../utils/apiResponse.js";
import jwt from "jsonwebtoken";

const generateAccessRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;

    user.save({
      validateBeforeSave: false,
    });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new apiError(500, "Access and Refresh Tokens are not generated");
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, address, phone, role } = req.body;

  if (!name || !email || !password || !address || !phone || !role) {
    throw new apiError(400, "Please provide all required fields");
  }
  if (phone.length < 10 || phone.length > 15) {
    throw new apiError(
      400,
      "Phone number must be between 10 and 15 characters"
    );
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new apiError(400, "Invalid email format");
  }

  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  if (!passwordRegex.test(password)) {
    throw new apiError(
      400,
      "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character"
    );
  }

  const existedUser = await User.findOne({ email });
  if (existedUser) {
    throw new apiError(409, "User with email already exists");
  }
  const existedPhone = await User.findOne({ phone });
  if (existedPhone) {
    throw new apiError(409, "User with phone number already exists");
  }

  const user = await User.create({
    name,
    email,
    password,
    address,
    role: role || "user",
    phone,
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  return res
    .status(201)
    .json(new apiResponse(200, createdUser, "User registered successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new apiError(400, "Please provide email and password");
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (email && !emailRegex.test(email)) {
    throw new apiError(400, "Invalid email format");
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new apiError(404, "User not found");
  }

  const isPasswordCorrect = await user.isPasswordCorrect(password);
  if (!isPasswordCorrect) {
    throw new apiError(401, "Incorrect password");
  }

  const { accessToken, refreshToken } = await generateAccessRefreshTokens(
    user._id
  );

  const loggedInUser = await User.findById(user._id)
    .select("-password -refreshToken")
    .populate({
      path: "orders",
      populate: {
        path: "items.product",
        select: "title price",
      },
    })
    .populate({
      path: "cart",
      populate: {
        path: "items.product",
        select: "title price",
      },
    });

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new apiResponse(
        200,
        {
          loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged in successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: { refreshToken: 1 },
    },
    { new: true }
  );
  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .cookie("accessToken", "", options)
    .cookie("refreshToken", "", options)
    .json(new apiResponse(200, null, "User logged out successfully"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incommingRefreshToken =
    req.cookies?.refreshToken || req.body?.refreshToken;
  if (!incommingRefreshToken) {
    throw new apiError(401, "Refresh token is missing");
  }

  let decodedToken;
  try {
    decodedToken = jwt.verify(
      incommingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
  } catch (error) {
    throw new apiError(401, error?.message || "Invalid Refresh Token");
  }

  const user = await User.findById(decodedToken?._id);
  if (!user) {
    throw new apiError(401, "User not found");
  }

  if (incommingRefreshToken !== user?.refreshToken) {
    throw new apiError(401, "Refresh token is invalid or expired");
  }
  const options = {
    httpOnly: true,
    secure: true,
  };

  const { accessToken, newRefreshToken } = await generateAccessRefreshTokens(
    user._id
  );
  user.refreshToken = newRefreshToken;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", newRefreshToken, options)
    .json(
      new apiResponse(
        200,
        { accessToken, refreshToken: newRefreshToken },
        "Access token refreshed successfully"
      )
    );
});

export { registerUser, loginUser, logoutUser, refreshAccessToken };
