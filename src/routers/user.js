const express = require('express')
const router = new express.Router()
const User=require('../models/users')


// ------- creating user -------
router.post('/users', async (req, res) => {
    const user = new User(req.body)

    try {
        await user.save()
        res.status(201).send(user)
    } catch (e) {
        //console.log(e);
        res.status(400).send(e)
    }
})


// ------- reading user/users -------
// ---- reading all users ----
router.get('/users', async (req, res) => {

    try {
        const users = await User.find({})
        res.send(users)
    } catch (e) {
        res.status(500).send(e)
    }
})

// ---- reading single user ----
router.get('/users/:id', async (req, res) => {
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
router.patch('/users/:id', async (req, res) => {
    const _id = req.params.id
    if (_id.toString().length != 24) {
        return res.status(404).send({ error: "invalid id" })
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
router.delete('/users/:id', async (req, res) => {
    const _id = req.params.id
    if (_id.toString().length != 24) {
        return res.status(404).send({ error: "wrong id" })
    }
    try {
        const user = await User.findByIdAndDelete(req.params.id)

        if (!user) {
            return res.status(404).send({ error: "user not found" })
        }
        res.send(user)
    } catch (e) {
        res.status(500).send(e)
    }

})

module.exports = router