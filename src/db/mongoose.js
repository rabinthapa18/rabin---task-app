const chalk = require('chalk')
const mongoose = require('mongoose')
const validator = require("validator")

mongoose.connect('mongodb://127.0.0.1:27017/taskmanager-api', {
    useNewUrlParser: true,
    useCreateIndex: true
})

// --- user model ---
const User = mongoose.model('User', {
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
        trim: true,
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
    }
})

// --- task model ---
const Task = mongoose.model('Task', {
    description: {
        type: String,
        required: true,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    }
})


// --- user data ---
const me = new User({
    name: '    Rabinson Thapa',
    password: 'Password',
    email: 'RABinha@pa.COM'
})

me.save().then((result) => {
    console.log(result);
}).catch((error) => {
    console.log(chalk.red("error!!! " + error));
})

// --- task data ---
const task = new Task({
    description: ' task1'
})

task.save().then((result) => {
    console.log(result);
}).catch((error) => {
    console.log(chalk.red('error!!! ' + error));
})