const chalk=require('chalk')
const mongoose = require ('mongoose')

mongoose.connect('mongodb://127.0.0.1:27017/taskmanager-api',{
    useNewUrlParser:true,
    useCreateIndex:true
})

// --- user parameters---
const User=mongoose.model('User',{
    name:{
        type:String
    },
    age:{
        type:Number
    }
})


const me = new User({
    name:'rabinson',
    age:22
})

me.save().then((result)=>{
    console.log(result);
}).catch((error)=>{
    console.log(chalk.red("error!!!" + error));
})