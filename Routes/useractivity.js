const express = require('express');
const router = express.Router();
const {userprofiledetailsmodel} = require("../database");
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({storage:storage});

router.post('/savefollowactivity',async (req,res)=>{
try{
      const {useridfollowedby,useridfollowedto} = req.body;

       const updatefollowing = await userprofiledetailsmodel.findOneAndUpdate({userid:useridfollowedby},{$push:{
            followings:useridfollowedto
        }})     
        if(updatefollowing){
            console.log("following added");
        }
    
        const updatefollower =await userprofiledetailsmodel.findOneAndUpdate({userid:useridfollowedto},{$push:{
            followers:useridfollowedby
        }})    
        if(updatefollower){
            console.log("follower added");
        }

        res.status(200).json("activity saved");
 
}catch(err){
   // console.log(err);
    res.status(400).json(err);
}
    
})


router.post('/saveunfollowactivity',async (req,res)=>{
    try{
          const {useridfollowedby,useridfollowedto} = req.body;
    
           const updatefollowing = await userprofiledetailsmodel.findOneAndUpdate({userid:useridfollowedby},{$pull:{
                followings:useridfollowedto
            }})     
            if(updatefollowing){
                console.log("unfollowed");
            }
        
            const updatefollower =await userprofiledetailsmodel.findOneAndUpdate({userid:useridfollowedto},{$pull:{
                followers:useridfollowedby
            }})    
            if(updatefollower){
                console.log("follower decreased");
            }
    
            res.status(200).json("activity saved");
     
    }catch(err){
       // console.log(err);
        res.status(400).json(err);
    }
        
    })

    router.post('/savebio',async (req,res)=>{
        try{
              const {userid,bio} = req.body;
        
               const updatebio = await userprofiledetailsmodel.findOneAndUpdate({userid:userid},{$set:{
                    bio:bio
                }})     
                if(updatebio){
                    console.log("bio updated");
                }
        
                res.status(200).json("bio saved");
         
        }catch(err){
           // console.log(err);
            res.status(400).json(err);
        }
            
        })

        router.post('/savepost',upload.single("image"),async (req,res)=>{
            try{
                  const {userid} = req.body;
            
                   const updatebio = await userprofiledetailsmodel.findOneAndUpdate({userid:userid},{$push:{
                        posts:{
                            name:req.file.originalname,
                            image:{
                                data:req.file.buffer,
                                contentType:req.file.mimetype
                            } 
                        }
                    }})     
                    if(updatebio){
                        console.log("post uploaded");
                    }
            
                    res.status(200).json("post saved");
             
            }catch(err){
               // console.log(err);
                res.status(400).json(err);
            }
                
            })
    


module.exports = router;