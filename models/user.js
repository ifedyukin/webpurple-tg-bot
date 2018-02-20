const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  uid: { type: String, unique: true, required: true },
  subscribe: { type: Boolean },
  subscribes: { type: Object },
  admin: { type: Boolean, default: false },
});

module.exports = mongoose.model('User', UserSchema);
