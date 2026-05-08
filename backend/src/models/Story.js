const mongoose = require("moongoose");

const storySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  points: {
    type: Number,
    default: 0,
  },
  author: {
    type: String,
    required: true,
  },
  postedAt: {
    type: Date,
    required: true,
  },
  hackerNewsId: {
    type: String,
    unique: true,
  },
  timestamps: true,
});
module.exports = mongoose.model("Story", storySchema);
