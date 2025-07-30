const mongoose = require('mongoose');
const { initialData } = require('./intialData')
const Task = require('./models/Task');
const Dependency = require('./models/Dependency');
const Resource = require('./models/Resource');
const Assignment = require('./models/Assignment');

const MONGO_URI = 'mongodb://127.0.0.1:27017/ganttDB-replica'; // Replace with your DB
console.log(initialData)
async function seedDatabase() {
  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB');

  await Task.deleteMany({});
  await Dependency.deleteMany({});
  await Resource.deleteMany({});
  await Assignment.deleteMany({});
  console.log('Cleared existing data');

  await Task.insertMany(initialData.tasks);
  console.log('Tasks seeded');

  await Dependency.insertMany(initialData.dependencies.map(dep => ({
    id: dep.id,
    fromEvent: dep.fromEvent,
    toEvent: dep.toEvent,
    type: dep.type
  })));
  console.log('Dependencies seeded');

  await Resource.insertMany(initialData.resources);
  console.log('Resources seeded');

  await Assignment.insertMany(initialData.assignments.map(a => ({
    id: a.id,
    event: a.event,
    resource: a.resource,
    units: 100
  })));
  console.log('Assignments seeded');

  await mongoose.disconnect();
  console.log('Seeding complete & disconnected');
}

seedDatabase().catch(err => {
  console.error('Error while seeding:', err);
  mongoose.disconnect();
});
