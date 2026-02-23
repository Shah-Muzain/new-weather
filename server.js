const express = require("express");
const mongoose = require("mongoose");
const axios = require("axios");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const morgan = require("morgan");
require("dotenv").config();

const User = require("./models/User");

const app = express();
const PORT = process.env.PORT || 8001;


//
// ================= DATABASE =================
//
mongoose.connect("mongodb://127.0.0.1:27017/weatherApp")
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.log("❌ DB Error:", err));

//
// ================= MIDDLEWARE =================
//
app.use(cors());
app.use(express.json());
app.use(express.static("public"));
app.use(morgan("dev"));

//
// ================= WEATHER ROUTE =================
//
app.get("/weather", async (req, res) => {
  const city = req.query.city;
  const apiKey = process.env.WEATHER_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: "API key missing" });
  }

  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
    const response = await axios.get(url);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch weather" });
  }
});

//
// ================= REGISTER ROUTE =================
//
app.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // HASH PASSWORD ⭐
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword
    });

    await newUser.save();

    res.json({ message: "✅ User registered successfully" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//
// ================= LOGIN ROUTE =================
//
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Wrong password" });
    }
    // CREATE TOKEN ⭐⭐⭐
    const token = jwt.sign(
       
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
 console.log("yes token is",token);

    res.json({
      message: "Login successful",
      token: token
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }



});

//
// ================= SERVER START =================
//
app.listen(PORT, () => {
  console.log("====================================");
  console.log(`✅ Server running on port ${PORT}`);
  console.log("====================================");
});
