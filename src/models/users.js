const mongoose = require('mongoose')
const validator = require("validator")
const chalk = require('chalk')

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

module.exports = User