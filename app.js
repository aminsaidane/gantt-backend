const express = require('express');
const mongoose = require('mongoose');
const setupSwagger = require("./swager");
const cors = require('cors');
const app = express();
setupSwagger(app);
const port = 3000;

// Connect DB
mongoose.connect('mongodb://127.0.0.1:27017/ganttDB-replica')
  .then(() => console.log("Connected to DB"))
  .catch(err => console.error("DB connection error:", err));

// Middleware
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes
app.use('/tasks', require('./routes/tasks'));
app.use('/assignments', require('./routes/assignments'));

// Main data fetch
const Task = require('./models/Task');
const Dependency = require('./models/Dependency');
const Resource = require('./models/Resource');
const Assignment = require('./models/Assignment');

app.get('/data', async (req, res) => {
  try {
    const [tasks, dependencies, resources, assignments] = await Promise.all([
      Task.find({}),
      Dependency.find({}),
      Resource.find({}),
      Assignment.find({})
    ]);
 
    res.json({ data: { tasks, dependencies, resources, assignments } });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

// Start server
app.listen(port, () => console.log(`Serving on port ${port}`));
