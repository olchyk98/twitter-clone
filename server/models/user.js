const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: String,
  login: String,
  password: String,
  url: String,
  image: String,
  profileBackground: String,
  profileDescription: String,
  location: String,
  joinedDate: Date,
  subscribedTo: Array,
  notifications: Array,
  isVertificated: Boolean
});

module.exports = mongoose.model("User", UserSchema);
