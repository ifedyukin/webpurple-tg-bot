const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  id: { type: String },
  title: { type: String },
  description: { type: String },
  start: { type: Array },
  location: { type: String },
  url: { type: String },
  status: { type: String, default: 'CONFIRMED' },
  end: { type: mongoose.Schema.Types.Mixed },
  duration: { type: mongoose.Schema.Types.Mixed },
  file_id: { type: String, default: null },
});

module.exports = mongoose.model('Event', EventSchema);
