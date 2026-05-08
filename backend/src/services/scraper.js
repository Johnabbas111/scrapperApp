const axios = require("axios");
const cheerio = require("cheerio");
const Story = require("../models/Story");

class hackerNewsScraper {
  async scrapeTopStories(limit = 10) {
    try {
      const { data } = await axios.get("https://news.ycombinator.com/");
      const $ = cheerio.load(data);
      const stories = [];

      $(".athing").each((index, element) => {
        if (index >= limit) return false;

        const $row = $(element);
        const $titleLine = $row.find(".titleline");
        const $subtext = $row.next("tr").find(".subtext");
        //Extract data
        const title = $titleLine.find("a").first().text().trim();
        const url = $titleLine.find("a").first().attr("href") || "";
        const hackerNewsId = $row.attr("id");
        const pointsText = $subtext.find(".score").text();
        const author = $subtext.find(".hnuser").text() || "unknown";
        const postedText = $subtext.find(".age").attr("title");

        const parsedDate = new Date(postedText);

        const postedAt =
          postedText && !isNaN(parsedDate) ? parsedDate : new Date();
        stories.push({
          title,
          url: url.startsWith("http")
            ? url
            : `https://news.ycombinator.com/${url}`,
          hackerNewsId,
          pointsText,

          author,
          postedAt,
        });
      });
      //save to database
      for (const story of stories) {
        await Story.findOneAndUpdate(
          { hackerNewsId: story.hackerNewsId },
          story,
          { upsert: true, new: true },
        );
      }
      return stories;
    } catch (error) {
      console.error("Error scraping Hacker News:", error);
      throw error;
    }
  }
}
module.exports = new hackerNewsScraper();
