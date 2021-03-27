const user=require('../models/users');
const jwt=require('jsonwebtoken');

const auth=async function(req,res,next){
   try{
       
       const token=(req.header('Authorization')).replace('Bearer ','');
       
       const v=jwt.verify(token,'---token_name_here---');
       const cuser=await user.findOne({_id:v._id,'tokens.token':token});
       
       if(!cuser)
        throw new Error({error:'this is error in auth'});
       
        req.cuser=cuser; // ctreated a new prorerty in req;
        req.token=token;  // ctreated a new prorerty in req;
    
       next();
     }catch{
         res.send('please valiate first');
     } 
}
module.exports=auth;