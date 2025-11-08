// server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();

// ===== CORS CONFIGURATION =====
// Only allow your frontend (Netlify) and localhost for security
const allowedOrigins = [
  "http://localhost:3000",              // local dev
  "https://linkin-clone.netlify.app"    // your deployed frontend domain
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (e.g. mobile apps, curl)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg = "CORS policy: This origin is not allowed.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);

// ===== BODY PARSERS =====
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ===== STATIC FILES =====
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ===== ROUTES =====
app.use("/api/auth", require("./routes/auth"));
app.use("/api/posts", require("./routes/posts"));
app.use("/api/users", require("./routes/users"));

// ===== DATABASE CONNECTION =====
const MONGO_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/linkedin-clone";

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ===== HEALTH CHECK ROUTE =====
app.get("/", (req, res) => {
  res.send("LinkedIn Clone API is running 🚀");
});

// ===== START SERVER =====
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
