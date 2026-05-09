require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");
const cheerio = require("cheerio");

const app = express();

// CORS settings
app.use(
  cors({
    origin: true,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json());

// In-memory storage
let stories = [];

// HEALTH CHECK
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Server is running!",
    timestamp: new Date(),
  });
});

// STORIES API
app.get("/api/stories", (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const start = (page - 1) * limit;
  const end = start + limit;

  const paginatedStories = stories.slice(start, end);

  res.json({
    stories: paginatedStories,
    pagination: {
      page,
      limit,
      total: stories.length,
      pages: Math.ceil(stories.length / limit),
    },
  });
});

// SCRAPE FUNCTION
async function scrapeTopStories(limit = 10) {
  try {
    console.log("🔄 Scraping Hacker News...");
    const { data } = await axios.get("https://news.ycombinator.com", {
      timeout: 10000,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    });

    const $ = cheerio.load(data);
    const newStories = [];

    $(".athing").each((index, element) => {
      if (index >= limit) return false;

      const $row = $(element);
      const $titleLine = $row.find(".titleline");
      const $subtext = $row.next("tr").find(".subtext");

      const title = $titleLine.find("a").first().text().trim();
      let url = $titleLine.find("a").first().attr("href") || "";
      const hackerNewsId = $row.attr("id");
      const pointsText = $subtext.find(".score").text();
      const points = parseInt(pointsText) || 0;
      const author = $subtext.find(".hnuser").text() || "unknown";
      const postedText = $subtext.find(".age").attr("title");
      const postedAt = postedText ? new Date(postedText) : new Date();

      if (url && !url.startsWith("http")) {
        url = `https://news.ycombinator.com/${url}`;
      }

      newStories.push({
        _id: hackerNewsId,
        title,
        url,
        points,
        author,
        postedAt,
        hackerNewsId,
      });
    });

    stories = newStories;
    console.log(`✅ Scraped ${stories.length} stories`);
    return stories;
  } catch (error) {
    console.error("❌ Scraping failed:", error.message);
    return [];
  }
}

// SCRAPE ENDPOINT
app.post("/api/scrape", async (req, res) => {
  const newStories = await scrapeTopStories(10);
  res.json({ message: "Scraping completed", count: newStories.length });
});

// START SERVER
const PORT = 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log("=".repeat(50));
  console.log("✅ SERVER IS RUNNING!");
  console.log("=".repeat(50));
  console.log(`📡 Address: http://localhost:${PORT}`);
  console.log(`🔗 Test URL: http://localhost:${PORT}/api/health`);
  console.log(`📚 Stories URL: http://localhost:${PORT}/api/stories`);
  console.log("=".repeat(50));
  console.log("⚠️  DO NOT CLOSE THIS TERMINAL");
  console.log("⚠️  Press Ctrl+C to stop the server");
  console.log("=".repeat(50));
});

// Run initial scrape
scrapeTopStories(10);
