

const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.DATABASE).then(()=>{console.log("db connected");});

const usersdetails = new mongoose.Schema(
    {
        email:String,
        fullname:String,
        username:String,
        password:String,
    },
    {timestamps:true}
)

const ProfileimageSchema = new mongoose.Schema(
    {
     userid:String,
     username:String,
     name:String,
     image:{
        data:Buffer,
        contentType:String
     }
    },{timestamps:true}
)

const userProfileDetail = new mongoose.Schema(
    {
     userid:String,
     username:String,
     followers:[String],
     followings:[String],
     posts:[
        {
           name:String,
           image:{
                data:Buffer,
                contentType:String
           },
           postcaption:String,
           likes:[String],
           comments:{
               userid:String,
               commenttext:String,
           },
           postdate:String
        }
       ],
     bio:String
    },{timestamps:true}
)

const usermodel = new mongoose.model("userdetails",usersdetails);
const profileimagemodel = new mongoose.model("profilepics",ProfileimageSchema);
const userprofiledetailsmodel = new mongoose.model("userprofiledetails",userProfileDetail);

module.exports = {usermodel,profileimagemodel,userprofiledetailsmodel}