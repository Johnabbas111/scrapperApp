//main file
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes.js");
const storyRoutes = require("./routes/storyRoutes");

const scapper = require("./services/scraper.js");
const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
mongoose = require("mongoose");
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));
const scaperFile = async () => {
  try {
    await scapper.scrapeTopStories(10);
  } catch (error) {
    console.error("Error occurred while scraping top stories:", error);
  }
};
scaperFile();
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
