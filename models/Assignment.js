const mongoose = require('mongoose');
const {Schema} = mongoose
const AssignmentSchema = new mongoose.Schema({
 
  event: { type:Schema.Types.ObjectId ,ref: 'Task', required: true },
  resource: { type:Schema.Types.ObjectId ,ref: 'Resource', required: true },
  units: { type: Number, default: 100 }
});

module.exports = mongoose.model('Assignment', AssignmentSchema);