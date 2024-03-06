const express = require('express');
const router = express.Router();
const {profileimagemodel} = require("../database");

const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({storage:storage});


router.post("/storeimages",upload.single("image"),async(req,res)=>{

     const checkifexistimg =await profileimagemodel.findOne({userid:req.body.userid});

    // console.log(req.file);
   try{

    if(checkifexistimg){
      await profileimagemodel.updateOne({userid:req.body.userid},
        {$set:
          {
            name:req.file.originalname,
            image:{
             data:req.file.buffer,
             contentType:req.file.mimetype
           } 
          }
        })

        res.status(200).json("image updated");
    }else{
        const imagemodel = new profileimagemodel({
          userid:req.body.userid,
          name:req.file.originalname,
          image:{
              data:req.file.buffer,
              contentType:req.file.mimetype
          }
         })
         
         await imagemodel.save(); 
         res.status(200).json("image saved");
    }
      
     }catch(err){
        res.status(400).json(err);
   } 
})


router.get("/getimage/:userid",async(req,res)=>{
   try{

     const image =await profileimagemodel.findOne({userid:req.params.userid});
      if(image){
        res.status(200).json(image);
      }else{
        res.status(200).json("not found");
      }
    }catch(err){
      console.log(err);
      res.status(400).json(err);
   }
  })


module.exports = router