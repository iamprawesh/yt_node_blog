const mongoose = require("mongoose");
const user = require("../model/user");
const Joi = require("@hapi/joi");
const bcrypt = require('bcrypt')
// hjcsg yusdgvcfsa
const SECRET_KEY = 'This is secret Key asdfg'
const jwt = require('jsonwebtoken')
const SALT_ROUND = 10
const login = async(req,res)=>{
    let {email,password} =req.body;
    email = email.toLowerCase()
    let currentuser = await user.findOne({email})
    if(currentuser == null) {
        return res.status(401).json({
            message:'Auth Failed'
        })
    }
    let compairpassword = bcrypt.compareSync(password,currentuser.password)
    if(!compairpassword) {
        return res.status(401).json({
            message:'Invald Password'
        })
    }
    let {_id,name} = currentuser;
    let token = jwt.sign({
        _id,
        email,
        name
    },SECRET_KEY,{expiresIn:'48h'})
    res.status(200).json({
        token
    })
}
const signup = async(req,res)=>{
    let{name,email,password,conformpassword} =req.body;

      try{
        const schema = Joi.object({
            password: Joi.string()
              .min(4)
              .max(30)
              .required(),
              email:Joi.any(),
              conformpassword:Joi.any(),
              name:Joi.any(),
          });
        const validationErr = schema.validate(req.body, { abortEarly: false });
        if (validationErr && validationErr.error) {
          let message = validationErr.error.details.map(dat => {
            return dat.message;
          });
          return res.status(422).json({
            message
          });
        }
        if(password!== conformpassword){
            return res.status(401).json({
                message:'Password Must be Same'
            })
        }
        email = email.toLowerCase()
        let olduser = await user.find({email})
        if(olduser.length >0){
            return res.status(422).json({
                message:'Email Already Exist'
            })
        }

        let hash = bcrypt.hashSync(password,SALT_ROUND)
        console.log(hash)
        let newUser = user({
            name,
            email,
            password:hash
        })
        console.log(newUser)
        let result = await newUser.save()
        res.status(200).json({
            status:'Ok',
            newUser:result
        })
    
      }
      catch(err){
        res.status(500).json({
            message: err.message
          });
      }
}

module.exports = {login,signup}