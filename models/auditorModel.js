// auditModel.js
const mongoose = require('mongoose');

const auditSchema = new mongoose.Schema({
  action: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  username: { type: String},
  timestamp: { type: Date, default: Date.now },
  details: { type: String }
});

const Audit = mongoose.model('Audit', auditSchema);

module.exports = Audit;
