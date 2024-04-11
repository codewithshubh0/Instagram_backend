const express = require('express');
const router = express.Router();
const {userprofiledetailsmodel,allpostsmodel} = require("../database");
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({storage:storage});






router.get('/getuserpost/:page',async (req,res)=>{
    
    try{
        const page = req.params.page;
        console.log(page+" page size");
        const dataperpage = 1;
    //    const users = await userprofiledetailsmodel.find({}).skip(page*dataperpage).limit(dataperpage);
    const users = await allpostsmodel.find({}).sort({'createdAt':-1}).skip(page*dataperpage).limit(dataperpage);
       //console.log(users.length+" length");
       var ar = [];
    //    users.map(e=>{
    //       ar.push(e.username);
    //    })
      // res.status(200).json(users[0].username);
      res.status(200).json(users);
    }catch(err){
        res.status(400).json(err);
    }    
})

router.get('/gettotalpostcount',async (req,res)=>{
    
    try{
       
    const users = await allpostsmodel.find({});
      // console.log(users.length+" length");
       var ar = [];
    //    users.map(e=>{
    //       ar.push(e.username);
    //    })
      // res.status(200).json(users[0].username);
      res.status(200).json(users.length);
    }catch(err){
        res.status(400).json(err);
    }    
})


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
                  const {userid,caption,postdate,username} = req.body;

            

                  const checkifpresent = await userprofiledetailsmodel.findOne({userid:userid,'posts.name':req.file.originalname})
                  if(checkifpresent==null){
                   const updatepost = await userprofiledetailsmodel.findOneAndUpdate({userid:userid},{$push:{
                        posts:{
                            name:req.file.originalname,
                            image:{
                                data:req.file.buffer,
                                contentType:req.file.mimetype
                            },
                            postcaption:caption,
                            postdate:postdate
                        }
                    }})     
                    if(updatepost){
                        console.log("post uploaded");
                    }

                    const newpost = new allpostsmodel({
                        userid:userid,
                        username:username,

                        postname:req.file.originalname,
                        image:{
                            data:req.file.buffer,
                            contentType:req.file.mimetype
                        },
                        postcaption:caption,
                        postdate:postdate
                    })

                    await newpost.save();
                    
                    res.status(200).json("Successfully posted");
                }else{
                    res.status(200).json("Same Image already Posted");
                }
                   
             
            }catch(err){
               // console.log(err);
                res.status(400).json(err);
            }
                
            })
    
            router.post('/deletepost',async (req,res)=>{
                try{
                      const {userid,imagename} = req.body;
                      console.log(imagename);
                       const updatepost = await userprofiledetailsmodel.findOneAndUpdate({userid:userid},{$pull:{
                            posts:{
                                name:imagename
                            }
                        }})     
                        if(updatepost){
                            console.log("post deleted");
                        }
                
                        res.status(200).json("post deleted");
                 
                }catch(err){
                   // console.log(err);
                    res.status(400).json(err);
                }
                    
                })

                router.post('/savelikes',async (req,res)=>{
                    try{
                          const {userid,imagename,like_userid} = req.body;
                          console.log(imagename);
                           const updatepost = await userprofiledetailsmodel.findOneAndUpdate({userid:userid,'posts.name':imagename},{$push:{
                               'posts.$.likes':like_userid
                            }})     
                            if(updatepost){
                                console.log("likes added");
                            }

                            const updatepostinpostdata = await allpostsmodel.findOneAndUpdate({userid:userid,postname:imagename},{$push:{
                                'likes':like_userid
                             }})     
                             if(updatepostinpostdata){
                                 console.log("likes added for postdata");
                             }
                            res.status(200).json("likes added");
                     
                    }catch(err){
                       // console.log(err);
                        res.status(400).json(err);
                    }
                        
                    })

                    router.post('/savedislikes',async (req,res)=>{
                        try{
                              const {userid,imagename,dislike_userid} = req.body;
                              console.log(imagename);
                               const updatepost = await userprofiledetailsmodel.findOneAndUpdate({userid:userid,'posts.name':imagename},{$pull:{
                                   'posts.$.likes':dislike_userid
                                }})     
                                if(updatepost){
                                    console.log("disliked");
                                }
                        

                                const updatepostinpostdata = await userprofiledetailsmodel.findOneAndUpdate({userid:userid,'postname':imagename},{$pull:{
                                    'likes':dislike_userid
                                 }})     
                                 if(updatepostinpostdata){
                                     console.log("disliked in postdata");
                                 }
                                res.status(200).json("disliked");
                         
                        }catch(err){
                           // console.log(err);
                            res.status(400).json(err);
                        }
                            
                        })
    
                router.post('/addcomment',async (req,res)=>{
                    try{
                             const {profileuserid,commentuserid,imagename,comment} = req.body;
                            console.log(profileuserid,commentuserid,imagename,comment);
                             const updatepost = await userprofiledetailsmodel.findOneAndUpdate({userid:profileuserid,'posts.name':imagename},{$push:{
                                'posts.$.comments':{
                                    userid:commentuserid,
                                    commenttext:comment,
                                }
                             }})     
                            if(updatepost){
                                  console.log("comment added");
                             }

                             const updatePostinPostData = await allpostsmodel.findOneAndUpdate({userid:profileuserid,'postname':imagename},{$push:{
                                'postcomments':{
                                    userid:commentuserid,
                                    commenttext:comment,
                                }
                             }})     
                             if(updatePostinPostData){
                                console.log("update in post");
                             }
                            
                              res.status(200).json("comment added");
                             
                         }catch(err){
                               // console.log(err);
                                res.status(400).json(err);
                            }
                                
                })

                router.post('/deletecomment',async (req,res)=>{
                    try{
                             const {profileuserid,commentuserid,imagename,comment} = req.body;
                            console.log(profileuserid,commentuserid,imagename,comment);
                             const updatepost = await userprofiledetailsmodel.findOneAndUpdate({userid:profileuserid,'posts.name':imagename},{$pull:{
                                'posts.$.comments':{
                                    userid:commentuserid,
                                    commenttext:comment,
                                }
                             }})     
                            if(updatepost){
                                  console.log("comment deleted");
                             }
                            

                             const updatepostforpostdata = await allpostsmodel.findOneAndUpdate({userid:profileuserid,'postname':imagename},{$pull:{
                                'postcomments':{
                                    userid:commentuserid,
                                    commenttext:comment,
                                }
                             }})     
                            if(updatepostforpostdata){
                                  console.log("comment deleted in postdata");
                             }
                            
                              res.status(200).json("comment deleted");
                             
                         }catch(err){
                               // console.log(err);
                                res.status(400).json(err);
                            }
                                
                })

module.exports = router;