const mongoose = require('mongoose');
const {Schema} = mongoose
const ResourceSchema = new mongoose.Schema({

  name: String,
  initials: String,
  profile: String,
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
    required: true
  },
  competences: [String],
  formations: [String],
  certifications: [String],
   historiqueDePrestation: [
    { type: Schema.Types.ObjectId, ref: 'Task' }
  ],
  currentTasks: [{ type: Schema.Types.ObjectId, ref: 'Task' }],
  successfulAssignments: { type: Number, default: 0 },
  failedAssignments: { type: Number, default: 0 },
}, { toJSON: { virtuals: true }, toObject: { virtuals: true } });


ResourceSchema.virtual('successRate').get(function(){
  const total = this.successfulAssignments + this.failedAssignments;
  if(total === 0) return 0;
   return Math.round((this.successfulAssignments / total) * 100);
})

module.exports = mongoose.model('Resource', ResourceSchema);