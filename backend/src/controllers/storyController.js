const Story = require("../models/Story");
const scraper = require("../services/scraper");

exports.getStories = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const stories = await Story.find()
      .sort({ points: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Story.countDocuments();

    res.json({
      stories,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getStoryById = async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);
    if (!story) {
      return res.status(404).json({ message: "Story not found" });
    }
    res.json(story);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.toggleBookmark = async (req, res) => {
  try {
    const user = req.user;
    const storyId = req.params.id;

    const bookmarkIndex = user.bookmarks.indexOf(storyId);

    if (bookmarkIndex === -1) {
      user.bookmarks.push(storyId);
      await user.save();
      res.json({ message: "Bookmark added", bookmarked: true });
    } else {
      user.bookmarks.splice(bookmarkIndex, 1);
      await user.save();
      res.json({ message: "Bookmark removed", bookmarked: false });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.triggerScrape = async (req, res) => {
  try {
    const stories = await scraper.scrapeTopStories(10);
    res.json({ message: "Scraping completed", count: stories.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
