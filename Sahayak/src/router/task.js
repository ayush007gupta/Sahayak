const express=require('express');
const task=require('../models/tasks');
const auth=require('../middleware/auth');
const app=new express.Router();


app.post('/task',auth,async(req,res)=>{
     const obj=new task({
           ...req.body,
           owner:req.cuser._id, 
     });
    
     try{
          await obj.save();
          res.send(obj);
     }catch{
        res.status(400).send('please check your desription again');
     }
      
})


// we can use sever filertering options in match and option parameter to populate the filterd results
// we could pass limit and skip option to view our content
// we uuse match as a filtering criteria
app.get('/tasks',auth,async(req,res)=>{
       // const tasks=await task.find({owner:req.cuser._id});
       const match={};
       if(req.query.status)
         {
             match.status=(req.query.status==='true');
         }
        try{
         await req.cuser.populate(
             {
                 path:'tasks',
                 match,
                 options:{
                     limit:parseInt(req.query.limit),
                     skip:parseInt(req.query.skip),
                     sort:1,// ascending order -1 for desc
                 }
           }).execPopulate(); 
         res.send(req.cuser.tasks); 
        }catch{
            res.send('error in findinag all');
        }  
});


app.get('/task/:id',auth,async(req,res)=>{
         
         try {
               const id=req.params.id;
               const ans=await task.findOne({_id:id,owner:req.cuser._id});  // we created cuser in authentication using tweb token
               if(!ans)                                                     // from token we find id and then eith id and checking token in token array inside user model we find cuser using findOne in user model
                 return res.status(400).send('Error');                      // if token fails then return error
                
                res.send(ans); 
          } catch (error) {
                 res.send(error);
         }
})
app.patch('/task/:id',auth,async (req,res)=>{
     const updates = Object.keys(req.body)
   
     const allowedUpdates = ['describe', 'status'];
     
     const isValidOperation = updates.every((update) =>{  
  
        return allowedUpdates.includes(update);
     
     })

     if (!isValidOperation) {
         return res.status(402).send({ error: 'Invalid updates!' })
     }

    try {
        const ctask=await task.findOne({_id:req.params.id,owner:req.cuser._id});
        
        if(!ctask)
          return res.status(400).send('no such task');

        updates.forEach((update)=>{
            ctask[update]=req.body[update];
        })
        
        await ctask.save(); 
        res.send(ctask);
    } catch  {
        res.status(400).send('caught error');
    }
})
app.delete('/task/:id',auth,async  function (req, res) {
        try {
                const id=req.params.id;
                const ans=await task.findOneAndDelete({_id:id,owner:req.cuser._id})
                if(!ans)
                  return res.status(400).send('Error');
                 
                 res.send(ans); 
           } catch (error) {
                  res.send(error);
          }    
 
});
module.exports=app;