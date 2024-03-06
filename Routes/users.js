const express = require('express');
const router = express.Router();
const {usermodel,userprofiledetailsmodel} = require("../database");

router.get('/getallusers/:userid',async (req,res)=>{
    
    try{
       const users = await usermodel.find({_id:{$ne:req.params.userid}});
       res.status(200).json(users);
    }catch(err){
        res.status(400).json(err);
    }    
})

router.get('/getuserdetail/:userid',async (req,res)=>{
    
    try{
       const users = await userprofiledetailsmodel.find({userid:req.params.userid});
       res.status(200).json(users);
    }catch(err){
        res.status(400).json(err);
    }    
})

module.exports = router;