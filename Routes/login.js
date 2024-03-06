const express = require('express');
const router = express.Router();
const {usermodel} = require("../database");

router.post('/checkuser',async (req,res)=>{
    const {email,password} = req.body;
  //console.log(email+" email");
try{
   
   const checkuser = await usermodel.findOne({email:email});

   if(checkuser){
    if(password==checkuser.password){
        res.status(200).json(checkuser);
    }else{
        res.status(200).json("Incorrect Password");
    }
   }else{
       res.status(200).json("User Doesn't Exist");
   }
    
}catch(err){
    res.status(400).json(err); 
}
   
})

module.exports = router;