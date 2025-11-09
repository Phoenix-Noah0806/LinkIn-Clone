// ===== IMPORTS =====
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

// ===== INITIALIZE APP FIRST ===== ✅
const app = express();

// ===== CORS CONFIGURATION =====
const allowedOrigins = [
  "http://localhost:3000",
  "https://linkin-clone.netlify.app"
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      // ✅ Allow local dev, live Netlify site, and Netlify preview URLs
      if (
        allowedOrigins.includes(origin) ||
        /\.netlify\.app$/.test(origin) // matches ANY subdomain ending with .netlify.app
      ) {
        return callback(null, true);
      }

      console.log("❌ Blocked by CORS:", origin);
      return callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// ✅ Important: handle preflight requests
app.options("*", cors());


// Optional: preflight requests
app.options("*", cors());

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
