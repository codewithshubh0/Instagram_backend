const express = require('express');
const router = express.Router();
const {usermodel,userprofiledetailsmodel} = require("../database");


router.post('/createuser',async (req,res)=>{
try{
    const {email,fullname,username,password} = req.body;
  // console.log(email,fullname,username,password);
    const checkexist = await usermodel.findOne({email:email});

    if(checkexist==null){

             const checkexistusername = await usermodel.findOne({username:username});
             if(checkexistusername==null){

                const newuser = new usermodel({email,fullname,username,password})
                const result = newuser.save();
                if(result!=null){
                    const activitydetails = new userprofiledetailsmodel({userid:newuser._id,username:username});
                    activitydetails.save();
                }
             res.status(200).json("1");
       }else{
        res.status(200).json("Username Already Exist");
       }     
       
    }else{
        res.status(200).json("Email Already Exist");
    }
   
}catch(err){
    console.log(err);
    res.status(400).json(err);
}
    
})

module.exports = router;