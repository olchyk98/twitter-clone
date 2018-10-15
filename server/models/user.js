const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: String,
  login: String,
  password: String,
  url: String,
  image: String,
  subscribedTo: Array
});

module.exports = mongoose.model("User", UserSchema);
