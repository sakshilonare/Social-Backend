const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const userRoutes = require("./routes/userRoutes");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const corsOptions = {
    origin: 'https://social-3w.netlify.app',
    methods: 'GET, POST, PUT, DELETE, PATCH, HEAD',
    credentials: true,
};
app.use(cors(corsOptions));

app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('MongoDB connected successfully');
});

// Cloudinary Configuration
const cloudinary = require('./config/cloudinary');
cloudinary.cloudinaryConnect();

// Routes
app.use("/api/user", userRoutes); 
app.use("/uploads", express.static("uploads"));

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
