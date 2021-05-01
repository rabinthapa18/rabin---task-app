const express = require('express')
require('./db/mongoose')
const User = require('./models/users')
const Task = require('./models/tasks')
const e = require('express')
const { ResumeToken } = require('mongodb')

const app = express()

const port = process.env.PORT || 3000

app.use(express.json())


// -------------------- user model --------------------

// ------- creating user -------
app.post('/users', async (req, res) => {
    const user = new User(req.body)

    try {
        await user.save()
        res.status(201).send(users)
    } catch (e) {
        res.status(400).send(e)
    }
})


// ------- reading user/users -------

// ---- reading all users ----
app.get('/users', async (req, res) => {

    try {
        const users = await User.find({})
        res.send(users)
    } catch (e) {
        res.status(500).send(e)
    }
})

// ---- reading single user ----
app.get('/users/:id', async (req, res) => {
    const _id = req.params.id

    if (_id.toString().length != 24) {
        return res.status(404).send({ error: "invalid id" })
    }

    try {
        const user = await User.findById(_id)
        if (!user) {
            return res.status(404).send({ error: "user dosent exist" })
        }
        res.send(user)
    } catch (e) {
        res.status(500).send(e)
    }
})


// ------- updating user -------

app.patch('/users/:id', async (req, res) => {
    const _id = req.params.id
    if (_id.toString().length != 24) {
        return res.status(404).send({error:"invalid id"})
    }
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'age', 'email', 'password']
    const isValidUpdate = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidUpdate) {
        return res.status(400).send({ error: 'invalid update arguements' })
    }

    try {
        const user = await User.findByIdAndUpdate(_id, req.body, { new: true, runValidators: true })
        if (!user) {
            return res.status(404).send({ error: 'user does not exist' })
        }
        res.send(user)
    } catch (e) {
        res.status(400).send(e)
    }
})


// ------- remove user -------
app.delete('/users/:id', async (req, res) => {
    const _id = req.params.id
    if (_id.toString().length != 24) {
        return res.status(404).send({error:"wrong id"})
    }
    try {
        const user = await User.findByIdAndDelete(req.params.id)

        if(!user){
            return res.status(404).send({error:"user not found"})
        }
        res.send(user)
    }catch(e){
        res.status(500).send(e)
    }
    
})




// -------------------- task model --------------------

// ------- creating task -------
app.post('/tasks', async (req, res) => {
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
app.get('/tasks', async (req, res) => {

    try {
        const tasks = await Task.find({})
        res.send(tasks)
    } catch (e) {
        res.status(500).send(e)
    }
})


// ----- reading single task -----

app.get('/tasks/:id', async (req, res) => {
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
app.patch('/tasks/:id', async (req, res) => {
    const _id = req.params.id
    if (_id.toString().length != 24) {
        return res.status(404).send({error:"invalid id"})
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
app.delete('/tasks/:id', async (req,res)=>{
    const _id = req.params.id
    if (_id.toString().length != 24) {
        return res.status(404).send({error:"invalid id"})
    }
    try{
        const task=await Task.findByIdAndDelete(_id)

        if(!task)
        {
            return res.status(404).send({error:"task does not exist"})
        }
        res.send(task)
    }catch(e){
        res.status(500).send(e)
    }
})

// port
app.listen(port, () => {
    console.log("server up and running on port " + port)
})