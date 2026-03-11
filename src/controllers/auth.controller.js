const bcrypt=require("bcrypt")

const jwt=require("jsonwebtoken")

const {v4:uuidv4}=require("uuid")

const User=require("../models/User")

const UserDTO=require("../dto/user.dto")

const sendResetEmail=require("../services/mail.service")

const {JWT_SECRET,BASE_URL}=require("../config/config")

exports.register=async(req,res)=>{

const hashed=await bcrypt.hash(req.body.password,10)

const user=await User.create({...req.body,password:hashed})

res.json(user)

}

exports.login=async(req,res)=>{

const user=await User.findOne({email:req.body.email})

if(!user) return res.status(404).json({error:"user not found"})

const valid=await bcrypt.compare(req.body.password,user.password)

if(!valid) return res.status(401).json({error:"wrong password"})

const token=jwt.sign({

id:user._id,

role:user.role,

email:user.email

},JWT_SECRET,{expiresIn:"1h"})

res.json({token})

}

exports.current=async(req,res)=>{

const user=await User.findById(req.user.id)

res.json(new UserDTO(user))

}

exports.forgotPassword=async(req,res)=>{

const user=await User.findOne({email:req.body.email})

if(!user) return res.status(404).json({error:"no existe"})

const token=uuidv4()

user.resetToken=token

user.resetTokenExpire=Date.now()+3600000

await user.save()

await sendResetEmail(user.email,token,BASE_URL)

res.json({message:"email enviado"})

}

exports.resetPassword=async(req,res)=>{

const user=await User.findOne({

resetToken:req.params.token,

resetTokenExpire:{$gt:Date.now()}

})

if(!user) return res.status(400).json({error:"token invalido"})

const same=await bcrypt.compare(req.body.password,user.password)

if(same) return res.status(400).json({error:"no puede repetir contraseña"})

user.password=await bcrypt.hash(req.body.password,10)

user.resetToken=null

user.resetTokenExpire=null

await user.save()

res.json({message:"password actualizado"})

}