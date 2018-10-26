const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NotificationSchema = new Schema({
	contributorID: String,
	eventType: String,
	redirectID: String,
	time: Date
});

module.exports = mongoose.model("Notification", NotificationSchema);