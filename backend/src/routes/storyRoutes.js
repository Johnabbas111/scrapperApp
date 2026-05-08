const express = require("express");
const {
  getStories,
  getStoryById,
  toggleBookmark,
  triggerScrape,
} = require("../controllers/storyController");
const authMiddleware = require("../middleware/auth");
const router = express.Router();

router.get("/", getStories);
router.get("/:id", getStoryById);
router.post("/:id/bookmark", authMiddleware, toggleBookmark);
router.post("/scrape", triggerScrape);

module.exports = router;
