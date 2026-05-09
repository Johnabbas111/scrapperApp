require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./src/routes/authRoutes");
const storyRoutes = require("./src/routes/storyRoutes");
const scraper = require("./src/services/scraper");

const app = express();

// ENHANCED CORS - Add this exact configuration
app.use(
  cors({
    origin: true, // Allows all origins for development
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/stories", storyRoutes);

// Health check endpoint (ADD THIS)
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Server is running!" });
});

// Database connection and server start
mongoose
  .connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log("✅ Connected to MongoDB");

    // Run initial scrape on server start
    await scraper.scrapeTopStories(10);
    console.log("✅ Initial scraping completed");

    // CRITICAL CHANGE: Add '0.0.0.0' and log URLs
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, "0.0.0.0", () => {
      // ← Added '0.0.0.0'
      console.log(`✅ Server running on:`);
      console.log(`   http://localhost:${PORT}/api/health`);
      console.log(`   http://127.0.0.1:${PORT}/api/health`);
    });
  })
  .catch((error) => {
    console.error("❌ MongoDB connection error:", error.message);
    process.exit(1);
  });
