const express = require('express')
require('./db/mongoose')
const User = require('./models/users')
const Task = require('./models/tasks')
const { ResumeToken } = require('mongodb')
const userRouter = require('./routers/user')
const taskRouter = require ('./routers/task')

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())

// ----- using router -----

app.use(userRouter)
app.use(taskRouter)


// port
app.listen(port, () => {
    console.log("server up and running on port " + port)
})