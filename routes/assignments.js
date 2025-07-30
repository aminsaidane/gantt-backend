const express = require('express');
const router = express.Router();
const Assignment = require('../models/Assignment');
const Resource = require('../models/Resource');


/**
 * @swagger
 * components:
 *   schemas:
 *     Assignment:
 *       type: object
 *       required:
 *         - event
 *         - resource
 *         - units
 *       properties:
 *         _id:
 *           type: string
 *           description: MongoDB ObjectId (optional; auto-generated)
 *         event:
 *           type: string
 *           description: MongoDB ObjectId of the task this assignment belongs to
 *         resource:
 *           type: string
 *           description: MongoDB ObjectId of the resource assigned to the task
 *         units:
 *           type: number
 *           description: Percentage (0–100) of the resource's capacity
 *       example:
 *         _id: "66dca78017f379d47a15f3b1"
 *         event: "66dca77f17f379d47a15f2fd"
 *         resource: "66dca77e17f379d47a15f2a3"
 *         units: 50
 */

/**
 * @swagger
 * /assignments/{taskId}:
 *   put:
 *     summary: Replace all assignments for a task
 *     tags: [Assignments]
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the task whose assignments will be replaced
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               assignments:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/Assignment'
 *     responses:
 *       200:
 *         description: Assignments replaced successfully
 *       500:
 *         description: Failed to replace assignments
 */
router.put('/:taskId', async (req, res) => {
  const taskId = req.params.taskId; // Use as string (_id from MongoDB)
  let newAssignments = req.body.assignments;
  if(newAssignments){

  
  try {
   // Delete all assignments related to the given task _id
      const oldAssignments = await Assignment.find({ event: taskId });
    await Assignment.deleteMany({ event: taskId });

    // For each old assignment, remove the task from the resource's currentTasks
    for (const assign of oldAssignments) {
      const resource = await Resource.findById(assign.resource);
      if (resource) {
        resource.currentTasks = resource.currentTasks.filter(
          (prestationId) => !prestationId.equals(assign.event)
        );
        await resource.save();
       
      }
    }
   // Ensure each assignment has an _id or remove id field entirely (let Mongo generate one)
    

    if (newAssignments.length > 0) {
      await Assignment.insertMany(newAssignments);
    }
  for(let assignment of newAssignments){
    const resource_id= assignment.resource
 
    const resource = await Resource.findById(resource_id);
    resource.currentTasks.push(assignment.event)
    await resource.save()
    
  }
    res.status(200).json({ message: 'Assignments replaced' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to replace assignments' });
   }}else{
    res.send('no new assignments')
   }
});

module.exports = router;