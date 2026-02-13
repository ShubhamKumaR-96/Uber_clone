import mongoose from "mongoose";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const userSchema = new mongoose.Schema({
  fullname: {
    firstName: {
      type: String,
      required: true,
      minlength: [3, "Firstname must be contains 3 characters as long "],
    },
    lastName: {
      type: String,
      minlength: [3, "lasttname must be contains 3 characters as long "],
    },
  },
  email:{
    type:String,
    required:true,
    unique:true,
    minlength:[5, "email must be contains atleast 5 chars"]
  },
  password:{
    type:String,
    required:true
  },
  socketId:{
    type:String
  }

});

userSchema.methods.generateAuthToken=function(){
  const token=jwt.sign({_id:this._id},process.env.JWT_SECRET)
  return token
}

userSchema.methods.comparePassword= async function (password){
  return await bcrypt.compare(password,this.password)
}

userSchema.statics.hashPassword= async function (password){
  return await bcrypt.hash(password,10)
}

const UserModel=mongoose.model("user",userSchema)

export default UserModel
