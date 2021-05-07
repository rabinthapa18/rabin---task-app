const mongoose = require('mongoose')
const validator = require("validator")
const chalk = require('chalk')


const taskSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
})

//hiding user id
taskSchema.methods.toJSON = function () {
    const task = this
    const taskObject = task.toObject()

    //delete taskObject.user
    //delete taskObject._id

    return taskObject
}

const Task = mongoose.model('Task', taskSchema)

module.exports = Task