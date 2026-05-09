const axios = require("axios");
const cheerio = require("cheerio");
const Story = require("../models/Story");

class HackerNewsScraper {
  async scrapeTopStories(limit = 10) {
    try {
      console.log("🔄 Starting scrape...");
      const { data } = await axios.get("https://news.ycombinator.com/", {
        timeout: 10000,
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        },
      });

      const $ = cheerio.load(data);
      const stories = [];

      $(".athing").each((index, element) => {
        if (index >= limit) return false;

        const $row = $(element);
        const $titleLine = $row.find(".titleline");
        const $subtext = $row.next("tr").find(".subtext");

        const title = $titleLine.find("a").first().text().trim();
        let url = $titleLine.find("a").first().attr("href") || "";
        const hackerNewsId = $row.attr("id");
        const pointsText = $subtext.find(".score").text();
        const points = pointsText ? parseInt(pointsText) : 0;
        const author = $subtext.find(".hnuser").text() || "unknown";
        const postedText = $subtext.find(".age").attr("title");

        let postedAt = new Date();
        if (postedText) {
          const parsedDate = new Date(postedText);
          if (!isNaN(parsedDate)) {
            postedAt = parsedDate;
          }
        }

        if (url && !url.startsWith("http")) {
          url = `https://news.ycombinator.com/${url}`;
        }

        stories.push({
          title,
          url,
          points,
          author,
          postedAt,
          hackerNewsId,
        });
      });

      console.log(`📊 Scraped ${stories.length} stories`);

      // Save to database with error handling for each story
      for (const story of stories) {
        try {
          await Story.findOneAndUpdate(
            { hackerNewsId: story.hackerNewsId },
            story,
            { upsert: true, new: true },
          );
        } catch (saveError) {
          console.error(
            `Failed to save story ${story.hackerNewsId}:`,
            saveError.message,
          );
        }
      }

      return stories;
    } catch (error) {
      console.error("❌ Error scraping Hacker News:", error.message);
      // Don't throw - just return empty array so server doesn't crash
      return [];
    }
  }
}

module.exports = new HackerNewsScraper();
