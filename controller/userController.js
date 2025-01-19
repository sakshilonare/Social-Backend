const multer = require("multer");
const path = require("path");
const User = require("../models/userModel");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const dotenv = require("dotenv");
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
      cloudinary.uploader.upload(file.path, { folder: "user_uploads" })
    );

    const uploadResults = await Promise.all(uploadPromises);

    const imageUrls = uploadResults.map((result) => result.secure_url);

    const newUser = new User({ name, email, images: imageUrls });
    await newUser.save();

    req.files.forEach((file) => fs.unlinkSync(file.path));

    res.status(201).json({ message: "User data and images uploaded successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to upload images", details: err.message });
  }
};

// Fetch All Users with their images
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
