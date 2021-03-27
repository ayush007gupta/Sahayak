
const express=require('express');
const user=require('../models/users');
const auth=require('../middleware/auth');
const app=new express.Router(); // our router for user elated requests
const multer=require('multer');
const sharp=require('sharp');
// for creating a new user but email should be unique

app.post('/user',async (req,res)=>{
     const cuser=new user(req.body)
     try{
        
        await cuser.save();
        const token= await cuser.gettoken();
        console.log('asvs  ');
        await cuser.save();
        res.status(200).send({cuser,token});
       }catch{ 
        res.status(400).send('error');
       }
})

app.post('/user/login',async (req,res)=>{
  try{
         const cuser=await user.login(req.body.email,req.body.password);// we use static method login since it fill wiil look user in db
         const token=await cuser.gettoken();  ///get the current user tken for authentication
         
         if(!cuser)
          return res.status(400).send('invalid credentials');
        
         res.status(200).send({cuser,token:token});  
   } catch{

     res.send('something went wrong');
  }   
})

app.get('/user/logout',auth,async(req,res)=>{
    try{
         console.log('inside logout') 
          req.cuser.tokens=req.cuser.tokens.filter((token)=>{
               return token.token!==req.token;
          });
          await req.cuser.save();
          res.send('successfull logout');
    }catch{
       res.send({error:"error caught in logout"});
    }
})


 app.get('/users/me',auth,async (req, res) => {
    
      res.send(req.cuser);
 })

 app.patch('/user/update',auth,async (req, res) => {
     const updates = Object.keys(req.body)
     const allowedUpdates = ['name', 'email', 'password', 'age']
     const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
 
     if (!isValidOperation) {
         return res.status(400).send({ error: 'Invalid updates!' })
     }


     try {
         
            updates.forEach((update)=>{
             req.cuser[update]=req.body[update];
          })

         console.log(req.cuser); 
         await req.cuser.save(); 
         res.send(req.cuser)
     } catch (e) {
         res.status(400).send(e+"sc");
     }
 });
 
 app.delete('/user/delete',auth, async (req, res) => {
     try {
         //const ans = await user.findByIdAndDelete(req.cuser._id);
         await req.cuser.remove();
         res.send(req.cuser)
     } catch (e) {
         res.status(500).send()
     }
 });

const upload=multer({
    limits:{
        fileSize:1000000,
    },
    fileFilter (req, file, cb){
          if(!(file.originalname.match(/\.(jpg|jpeg|png)$/))){
              new cb(new Error('I don\'t have a clue!'));
          }
          cb(null,true);
    }
})

//route related to file(image)
app.post('/user/me/file',auth,upload.single('upload'),async (req,res)=>{
    const image=await sharp(req.file.buffer).resize(200,250).png().toBuffer();
    req.cuser.data=image;
    await req.cuser.save();
    res.send('imgage send');
})
app.delete('/user/me/deletefile',auth,async(req,res)=>{
      req.cuser.data=undefined;
     await req.cuser.save();
     res.send('image deleted');
})
app.get('/user/:id/file',async (req,res)=>{
    try{
        const cuser=await user.findOne({
            _id:req.params.id,
        })
        
      
        if(!cuser||!cuser.data)
          throw new Error('id or file does not exit');
       
        res.set('Content-Type','image/png');
        res.send(cuser.data);  
    }catch{
         res.status(400).send('id or file does not exit');
    }
})
module.exports= app;