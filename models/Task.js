const mongoose = require('mongoose');
const {Schema} = mongoose
const TaskSchema = new mongoose.Schema({

  name: String,
  duration: Number,
  percentDone: Number,
  startDate: String,
  endDate:String,
  parentId: {
    type:Schema.Types.ObjectId,
    ref:'Task'
  },
  expanded: Boolean,
  status: {
    type: String,
    enum: ['pending', 'in_progress', 'done', 'failed'],
    default: 'pending'
  },
  requiredProfile: {
    type:String,
    default:''
  },        // ✅ Ensures proper roles are assigned
  requiredCompetences: [String],     // ✅ Ensures skill match
  requiredCertifications: [String],  // ✅ Ensures certificate match
  requiredFormations: [String],      // ✅ Ensures training match
  businessUnit: {
    type: String,
    enum: [
      'Maintenance',
      'Distribution',
      'Metering',
      'Safety & Compliance',
      'Operations',
      'Technical Support'
    ],
    default:'Operations'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  
});

module.exports = mongoose.model('Task', TaskSchema);
