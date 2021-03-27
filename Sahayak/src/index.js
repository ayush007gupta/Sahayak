const express=require('express');
const bcrypt=require('bcrypt');
const routertask=require('./router/task.js');
const routeruser=require('./router/user.js');
require('./mongodb/mongoose.js');// require read file ,execute it, ans then return the desired object mention in module.export function


const app=express();
app.use(express.json());

// connect to router only for better code management

app.use(routertask);
app.use(routeruser);

app.use(function (err, req, res, next) {
     res.status(440).send('Something went wrong please check the deatails or request!')          /// setting errror handling for route 
})


app.listen(___port__,()=>{
    console.log('connected');
})