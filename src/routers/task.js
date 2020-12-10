const express = require('express');
const Task = require('../models/task');
const auth = require('../middleware/auth');

const router = new express.Router();

router.post('/tasks', auth, async (req, res) => {

  try {
    const task = new Task({
      ...req.body,
      owner: req.user._id
    });
    await task.save();
    res.status(201).send(task);
  } catch (e) {
    res.status(400).send(e);
  }
});


/*
    limit=10&skip=0 : first 10 results
    limit=10&skip=10 : second 10 results
    limit=10&skip=20 : third 10 results
    limit=20&skip=15 : results 16-36
    sort 1 : asc
    sort -1 : desc
*/
// /tasks?SortBy=createdAt:desc
router.get('/tasks', auth, async (req, res) => {

  const match = {
    owner: req.user._id,
  };
  const sort = {};
  if (req.query.sortBy) {
    const parts = req.query.sortBy.split(':');
    sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
  }

  if (req.query.completed) {
    match.completed = req.query.completed === 'true'
  }

  try {

    const tasks = await Task.find(match)
      .sort(sort)
      .limit(parseInt(req.query.limit))
      .skip(parseInt(req.query.skip))

    res.status(200).send(tasks);
  } catch (e) {
    res.status(500).send(e);
  }
});

router.get('/tasks/:id', auth, async (req, res) => {


  try {
    // const task = await Task.findById(req.params.id);
    const task = await Task.findOne({ _id: req.params.id, owner: req.user._id })
    if (!task) {
      return res.status(404).send('task not found');
    }
    res.status(200).send(task);

  } catch (e) {
    res.send(500).send(e);
  }

});

router.patch('/tasks/:id', auth, async (req, res) => {
  const newUpdates = Object.keys(req.body);
  const allowedUpdates = ['description', 'completed'];
  const isValidOperation = newUpdates.every((operation) => allowedUpdates.includes(operation));

  if (!isValidOperation) {
    return res.status(400).send({ 'error': 'Invalid operation' });
  }
  try {
    // const task = await Task.findByIdAndUpdate(req.params.id, req.body); this also works
    const task = await Task.findOne({ _id: req.params.id, owner: req.user._id });

    if (!task) {
      return res.status(404).send('Task not found');
    }

    newUpdates.forEach((update) => task[update] = req.body[update]);
    await task.save();

    res.status(201).send(task);
  } catch (e) {
    res.status(500).send(e);
  }
});


router.delete('/tasks/:id', auth, async (req, res) => {
  try {
    // const task = await Task.findByIdAndDelete(req.params.id); this also works
    const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
    if (!task) {
      return res.status(404).send('Task not found');
    }
    res.status(201).send(task);
  } catch (e) {
    res.status(500).send(e);
  }
});

module.exports = router;
