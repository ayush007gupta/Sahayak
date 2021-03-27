const mongoose=require('mongoose');
const validator=require('validator');
// used schema as it provide feature for many task like middleware

const schema=new mongoose.Schema({
    describe:{
        type:String,
        required:true,
        trim:true,
    },
   status:{
       type:Boolean,
       default:false,
   },
   owner:{
       type:mongoose.Schema.Types.ObjectId,
       required:true,
       ref:'users',
   }
},{
    timestamps:true,
});
const task=mongoose.model('tasks',schema);

module.exports=task;