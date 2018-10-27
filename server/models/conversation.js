const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ConversationSchema = new Schema({
	members: Array,
	messages: Array,
	lastContent: String,
	lastTime: Date,
	isWriting: Array
});

module.exports = mongoose.model("Conversation", ConversationSchema);