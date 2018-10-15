const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TweetSchema = new Schema({
  creatorID: String,
  content: String,
  likes: Array,
  time: Date
});

module.exports = mongoose.model("Tweet", TweetSchema);
