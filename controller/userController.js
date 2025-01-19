const User = require("../models/userModel");
const cloudinary = require("cloudinary").v2;
const dotenv = require("dotenv");
const fs = require("fs");
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const uploadUserData = async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name || !email || !req.files || req.files.length === 0) {
      return res.status(400).json({ error: "Name, email, and images are required!" });
    }

    const uploadPromises = req.files.map((file) =>
      new Promise((resolve, reject) => {
        const byteArrayBuffer = file.buffer; // Get buffer from Multer

        cloudinary.uploader.upload_stream(
          { folder: "user_uploads" }, // Specify folder on Cloudinary
          (error, result) => {
            if (error) {
              reject(error);
            }
            resolve(result);
          }
        ).end(byteArrayBuffer); 
      })
    );

    const uploadResults = await Promise.all(uploadPromises);

    const imageUrls = uploadResults.map((result) => result.secure_url);

    const newUser = new User({ name, email, images: imageUrls });
    await newUser.save();

    res.status(201).json({ message: "User data and images uploaded successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to upload images", details: err.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch users", details: err.message });
  }
};

module.exports = { uploadUserData, getAllUsers };
