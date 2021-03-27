const mongoose=require('mongoose');
const validator=require('validator');
const bcrypt=require('bcrypt');
const jwt=require("jsonwebtoken");
const task = require('./tasks');

// added schema here

const schema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        lowercase:true,
        required:true,
        unique:true,
        validate(value){
            if(!validator.isEmail(value))
              throw new Error("error in email");
        }
    },
    age:{
        type:Number,
        default:0,
        validate:function(val){
             if(val<0)
                throw new Error('age must be positive number');
                 
        }

    },
    password:{
        type:String,
        trim:true,
        minLength:7, 
        validate(val){
            if(val==='password')
              throw new Error('invalid password');
        }
    },
    data:{
        type:Buffer,
    },
    tokens:[
        {
            token:{
                type:String,
                required:true
            }
        }
    ]

},{
    timestamps:true,
})



// middle ware pre which checks everytime we try to save document in model we use next()in every middleware 
schema.pre('save',async function(next){
    const cuser=this;
    if(cuser.isModified('password'))
     {
          cuser.password=await bcrypt.hash(cuser.password,8);
     }
     next(); 
})
// before removing user remove all the r=tasks associated with it
schema.pre('remove',async function(next){
   const cuser=this;
   await task.deleteMany({owner:cuser._id});
   next();  
});


// schema stataic method for
schema.statics.login=async function(email, password){
    
    const cuser=await user.findOne({email:email});

    if(!cuser)
      throw new Error('ubable to login incorrect email'); 

    const match=await bcrypt.compare(password,cuser.password);  // comparing the password with the server password(hashed)
    
    if(match)
        return cuser;
    throw new Error('ubable to login invalid password');
}


// schema methods for each document
schema.methods.gettoken=async function(){
     
     const cuser=this;
     const token =jwt.sign({_id:cuser._id.toString()},'secured token');  // creating jwt
     cuser.tokens=cuser.tokens.concat({token:token});
     await cuser.save();
     return token;
};

schema.methods.toJSON=function(){
    const cuser=this;
    const publicdata=cuser.toObject();
  
    delete publicdata.password;
    delete publicdata.tokens;
   
    return publicdata;
}
//created model here
// each time a model is created it associaes itself with a default opened mongodatabase*****


// here we create a relation b/w task in user 
schema.virtual('tasks',{
    ref:'tasks',
    localField:'_id',
    foreignField:'owner',
})
const user=mongoose.model('users',schema);

module.exports=user;


