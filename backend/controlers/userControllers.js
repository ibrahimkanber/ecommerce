import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/utils.js";
import data from "../data.js";

export const seed = asyncHandler(async (req, res) => {
  await User.remove({});
  const createdUsers = await User.insertMany(data.users);
  res.send({ createdUsers });
});

export const signIn = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  if (user) {
    if (bcrypt.compareSync(req.body.password, user.password)) {
      res.send({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user),
      });
      return;
    }
  }

  res.status(401).send({ message: "invalid email or password" });
});

export const register = asyncHandler(async (req, res) => {
  const user = await User({
    name: req.body.name,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
  });

  const createdUser = await user.save();
  res.send({
    _id: user._id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
    token: generateToken(createdUser),
  });
});

export const userDetail = asyncHandler(async (req,res) => {
  console.log(req.params.id)
  const user=await User.findById(req.params.id)

  if(user){
      res.send(user);
  }else{
    res.status(404).send({message:"User not found"})
  }



});
export const updateUserProfile = asyncHandler(async (req,res) => {
  const user=await User.findById(req.user._id)
  console.log("user",user)

  if(user){
      user.name=req.body.name || user.name
      user.email=req.body.email || user.email
      if(req.body.password){
        user.password=bcrypt.hashSync(req.body.password,8)
      }

    const updatedUser=await user.save()
    res.send({
      _id:updatedUser._id,
      name:updatedUser.name,
      email:updatedUser.email,
      isAdmin:updatedUser.isAdmin,
      token:generateToken(updatedUser)

    })
  }else{
    res.status(404).send({message:"User not found"})
  }

});


export const getUserList = asyncHandler(async (req,res) => {
 
  const users=await User.find({})

  res.send(users)
  


});