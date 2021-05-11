const express = require('express')
const router = new express.Router()
const User = require('../models/users')
const auth = require('../middlewares/auth')
const multer = require('multer')
const sharp = require('sharp')
const { sendWelcomeEmail, sendByeEmail } = require('../email/account')




// ------- creating user -------
router.post('/users/signup', async (req, res) => {
    const user = new User(req.body)
    try {
        if (User.findOne({ email: req.body.email })) {
            return res.send({ error: "Account with same email exist" })
        }
        await user.save()
        sendWelcomeEmail(user.email, user.name)
        const token = await user.generateAuthToken()
        res.status(201).send({ user, token })
    } catch (e) {
        res.status(400).send()
    }
})


// ------- logging users in --------
router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({ user, token })
    } catch (e) {
        res.status(400).send({ error: "E-mail or Password is wrong" })
    }
})


// ------- logging users out -------
router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()

        res.send()
    } catch (e) {
        res.status(500).send(e)
    }
})


//------- logging out of all sessions -------
router.post('/users/logoutall', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()

        res.status(200).send()
    } catch (e) {
        res.status(500).send()
    }
})


// ------ reading profile ------
router.get('/users/me', auth, async (req, res) => {
    res.send(req.user)
})


// ------- updating user -------
router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'age', 'email', 'password']
    const isValidUpdate = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidUpdate) {
        return res.status(400).send({ error: 'invalid update arguements' })
    }

    try {
        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()

        res.send(req.user)
    } catch (e) {
        res.status(400).send(e)
    }
})


// ------- remove user -------
router.delete('/users/me', auth, async (req, res) => {
    try {
        await req.user.remove()
        sendByeEmail(req.user.email, req.user.name)
        res.send(req.user)
    } catch (e) {
        res.status(500).send(e)
    }

})


// ------- adding user profile picture -------
const upload = multer({
    limits: {
        fileSize: 2000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please upload file in JPG, JPEG or PNG'))
        }

        cb(undefined, true)
    }
})

router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})


// ------- showing profile pic -------
router.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)

        if (!user || !user.avatar) {
            throw new Error
        }

        res.set('Content-Type', 'image/png')
        res.send(user.avatar)
    } catch (e) {
        res.status(404).send(e)
    }
})


// ------- deleting user profile picture -------
router.delete('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    req.user.avatar = undefined
    await req.user.save()
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})


module.exports = router