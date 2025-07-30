import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) {
      throw new Error("No file path provided for upload.");
    }

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "image",
    });

    console.log(`File uploaded successfully: ${response.secure_url}`);
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath); // Delete the file after upload
    }
    return response;
  } catch (error) {
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath); // Delete the file if it exists
    }
    return null;
  }
};

export default uploadOnCloudinary;
