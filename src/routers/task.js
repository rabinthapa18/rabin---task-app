const express = require('express')
const router = new express.Router()
const Task = require('../models/tasks')

// ------- creating task -------
router.post('/tasks', async (req, res) => {
    const task = new Task(req.body)

    try {
        await task.save()
        res.status(201).send(task)
    } catch (e) {
        res.status(400).send(e)
    }
})

// ------- reading tasks -------
// ----- reading all tasks -----
router.get('/tasks', async (req, res) => {

    try {
        const tasks = await Task.find({})
        res.send(tasks)
    } catch (e) {
        res.status(500).send(e)
    }
})


// ----- reading single task -----
router.get('/tasks/:id', async (req, res) => {
    const _id = req.params.id

    if (_id.toString().length != 24) {
        return res.status(404).send({ error: "invalid id" })
    }

    try {
        const task = await Task.findById(_id)
        if (!task) {
            return res.status(404).send("task does not exist")
        }
        res.send(task)
    } catch (e) {
        res.status(500).send(e)
    }
})


// ------- updating task -------
router.patch('/tasks/:id', async (req, res) => {
    const _id = req.params.id
    if (_id.toString().length != 24) {
        return res.status(404).send({ error: "invalid id" })
    }
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isValidUpdate = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidUpdate) {
        return res.status(400).send({ error: "invalid update argument" })
    }

    try {
        const task = await Task.findByIdAndUpdate(_id, req.body, { new: true, runValidators: true })
        if (!task) {
            return res.status(404).send({ error: "task does not exist" })
        }
        res.send(task)
    } catch (e) {
        return res.status(400).send(e)
    }
})

// ------ remove task -------
router.delete('/tasks/:id', async (req, res) => {
    const _id = req.params.id
    if (_id.toString().length != 24) {
        return res.status(404).send({ error: "invalid id" })
    }
    try {
        const task = await Task.findByIdAndDelete(_id)

        if (!task) {
            return res.status(404).send({ error: "task does not exist" })
        }
        res.send(task)
    } catch (e) {
        res.status(500).send(e)
    }
})

module.exports = router