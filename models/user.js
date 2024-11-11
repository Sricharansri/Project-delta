const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose=require("passport-local-mongoose");
const usersc=new Schema({
    email:{
        type:String,
        required:true,
    },
    username: {
        type: String,
        required: true,
        unique: true, // Ensure that the username is unique
      }
    });

usersc.plugin(passportLocalMongoose);
module.exports=mongoose.model('User',usersc);