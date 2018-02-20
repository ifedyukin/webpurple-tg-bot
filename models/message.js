const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  text: { type: String },
  chat_id: { type: Number },
  message_id: { type: String },
});

module.exports = mongoose.model('Message', MessageSchema);
