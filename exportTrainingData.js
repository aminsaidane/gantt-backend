// exportTrainingData.js

const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const csvWriter = require('csv-writer').createObjectCsvWriter;

// Load your models
const Task = require('./models/Task');
const Resource = require('./models/Resource');
const Assignment = require('./models/Assignment');

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/ganttDB-replica', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function exportData() {
  try {
    // Load assignments with populated task and resource
    const assignments = await Assignment.find()
      .populate('event')
      .populate('resource');

    const records = [];

    for (const assign of assignments) {
      const { event: task, resource } = assign;

      // Skip if missing
      if (!task || !resource) continue;

      // Compute success/failure from resource history if needed
      const total = (resource.successfulAssignments || 0) + (resource.failedAssignments || 0);
      const successRate = total > 0 ? resource.successfulAssignments / total : 0;

      records.push({
        task_id: task._id,
        task_name: task.name,
        task_duration: task.duration,
        task_percentDone: task.percentDone,
        task_requiredProfile: task.requiredProfile || '',
        task_businessUnit: task.businessUnit || '',
        task_requiredCompetences: (task.requiredCompetences || []).join(';'),
        task_requiredFormations: (task.requiredFormations || []).join(';'),
        task_requiredCertifications: (task.requiredCertifications || []).join(';'),

        resource_id: resource._id,
        resource_name: resource.name,
        resource_profile: resource.profile || '',
        resource_businessUnit: resource.businessUnit || '',
        resource_competences: (resource.competences || []).join(';'),
        resource_formations: (resource.formations || []).join(';'),
        resource_certifications: (resource.certifications || []).join(';'),
        resource_successRate: successRate,
        assignment_units: assign.units || 100,
      });
    }

    // Write to CSV
    const outputPath = path.join(__dirname, 'training_data.csv');

    const writer = csvWriter({
      path: outputPath,
      header: Object.keys(records[0] || {}).map(key => ({ id: key, title: key })),
    });

    await writer.writeRecords(records);
    console.log(`✅ Exported ${records.length} records to ${outputPath}`);

    mongoose.connection.close();
  } catch (err) {
    console.error('❌ Error exporting data:', err);
    mongoose.connection.close();
  }
}

exportData();
