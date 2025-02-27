const express = require("express");
const multer = require("multer");
const { uploadUserData, getAllUsers } = require("../controller/userController");
const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

// Routes
router.post("/upload", upload.array("images", 10), uploadUserData);
router.get("/allUsers", getAllUsers);

module.exports = router;
