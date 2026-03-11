const jwt=require("jsonwebtoken")

const {JWT_SECRET}=require("../config/config")

const auth=(roles=[])=>{

return(req,res,next)=>{

const header=req.headers.authorization

if(!header) return res.status(401).json({error:"No token"})

const token=header.split(" ")[1]

try{

const decoded=jwt.verify(token,JWT_SECRET)

if(roles.length && !roles.includes(decoded.role)){

return res.status(403).json({error:"No autorizado"})
}

req.user=decoded

next()

}catch{

res.status(401).json({error:"Token invalido"})
}

}

}

module.exports=auth