const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ConversationSchema = new Schema({
	members: Array,
	messages: Array,
	lastContent: String,
	lastContentType: String,
	lastTime: Date,
	isWriting: Array
});

module.exports = mongoose.model("Conversation", ConversationSchema);