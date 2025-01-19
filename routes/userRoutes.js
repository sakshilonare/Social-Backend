const express = require('express');
const { uploadUserData, getAllUsers } = require('../controller/userController');
const router = express.Router();

const multer = require('multer');
const upload = multer({ dest: '../uploads/' }); 

// Routes
router.post("/upload", upload.array("images", 10), uploadUserData); 
router.get("/allUsers", getAllUsers); 

module.exports = router;
