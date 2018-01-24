const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  uid: { type: String, unique: true, required: true },
  subscribe: { type: Boolean },
  subscribes: { type: Object },
});

module.exports = mongoose.model('User', UserSchema);
