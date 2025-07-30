const mongoose = require('mongoose');
const {Schema} = mongoose
const DependencySchema = new mongoose.Schema({
  fromEvent: { type: Schema.Types.ObjectId,ref:'Task', required: true },
  toEvent: { type: Schema.Types.ObjectId,ref:'Task', required: true },
  type: { type: Number }
});

module.exports = mongoose.model('Dependency', DependencySchema);

