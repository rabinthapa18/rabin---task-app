const mongoose = require('mongoose')
const validator = require("validator")
const chalk = require('chalk')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('./tasks')


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        minlength: 6,
        required: true,
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error(chalk.red('Error!!! Password cannot be "password"'))
            }
        }
    },
    email: {
        type: String,
        unique: true,
        trim: true,
        required: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error(chalk.red("error!!! not a email."));
            }
        },
    },
    age: {
        type: Number,
        validate(value) {
            if (value < 0) {
                console.log(chalk.red("error!!! age must be a positive number"));
            }
        },
        default: 0
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    avatar: {
        type: Buffer
    }
}, {
    timestamps: true
})

//connecting to task
userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'user'
})

//genetating auth-token
userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, 'rabinkotaskapp')

    user.tokens = user.tokens.concat({ token })
    await user.save()

    return token
}


//creating publicprofile to hide password and tokens
userSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar

    return userObject
}


//finding users credentials for logging in
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email })
    if (!email) {
        throw new Error('please check email and password again')
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
        throw new Error('please check email and password again')
    }

    return user
}


// hashing password before saving
userSchema.pre('save', async function (next) {
    const user = this

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }
})

userSchema.pre('remove', async function (next) {
    const user = this
    await Task.deleteMany({ user: user._id })

    next()
})


//

const User = mongoose.model('User', userSchema)

module.exports = User