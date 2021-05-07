const express = require('express')
const router = new express.Router()
const Task = require('../models/tasks')
const auth = require('../middlewares/auth')

// ------- creating task -------
router.post('/tasks', auth, async (req, res) => {
    const task = new Task({
        ...req.body,
        user: req.user._id
    })

    try {
        await task.save()
        res.status(201).send(task)
    } catch (e) {
        res.status(400).send(e)
    }
})

// ------- reading tasks -------
// ----- reading all tasks -----
router.get('/tasks', auth, async (req, res) => {

    try {
        const tasks = await Task.find({ user: req.user._id })
        res.send(tasks)
    } catch (e) {
        res.status(500).send(e)
    }
})


// ----- reading single task -----
router.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id
    try {
        const task = await Task.findOne({ _id, user: req.user._id })
        if (!task) {
            return res.status(404).send("task does not exist")
        }
        res.send(task)
    } catch (e) {
        res.status(500).send(e)
    }
})


// ------- updating task -------
router.patch('/tasks/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isValidUpdate = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidUpdate) {
        return res.status(400).send({ error: "invalid update argument" })
    }

    try {
        const task = await Task.findOne({ _id: req.params.id, user: req.user._id })
        if (!task) {
            return res.status(404).send({ error: "task does not exist" })
        }
        updates.forEach((update) => task[update] = req.body[update])
        await task.save()
        res.send(task)
    } catch (e) {
        return res.status(400).send(e)
    }
})

// ------ remove task -------
router.delete('/tasks/:id', auth, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user._id })

        if (!task) {
            return res.status(404).send({ error: "task does not exist" })
        }
        res.send(task)
    } catch (e) {
        res.status(500).send(e)
    }
})

module.exports = router