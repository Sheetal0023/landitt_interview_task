const express = require('express')
const app = express()
const router = new express.Router()
const User = require('../models/users')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const auth = require('../middleware/auth')
const {isEmpty} = require('lodash')

//Register routes
router.post('/register', async(req, res)=>{
   try{
        let errors = {}

        if(!req.body.username){
            errors.username = 'Username is required'
        }

        if(!req.body.password){
            errors.password = 'Password is required'
        }
    
        if(!req.body.phone){
            errors.phone = 'Phone number is required' 
                
        }

        if(!req.body.email){
            errors.email = 'Email is required'
        }
        
        if(req.body.phone){
            if(req.body.phone.length !== 10){
                errors.phone = 'Provide a valid Phone Number'
            } 
        }
        

        if(!isEmpty(errors)) {
            res.send({
                status:400,
                data:'null',
                message:errors
            })
            return
        }
        


        const hashedPassword = await bcrypt.hash(req.body.password, 8)
        
        const user = await new User({
        username:req.body.username,
        email:req.body.email,
        password:hashedPassword,
        phone:req.body.phone
        })

        const existUser = await User.findOne({
            email:req.body.email
        })

        if(existUser){
            throw new Error('Email is already exist')
        }

        await user.save()
        res.status(201).send({
            status:201,
            data:user,
            message:'You are register successfully, Please Login'
        })   
   
    } catch(e){
        res.status(400).send({
            status:400,
            data:'null',
            message:e.message
        })

    }
})

//Login routes
router.post('/login', async(req, res)=>{
    try{

        let errors = {}

        if(!req.body.email){
            errors.email = 'Email is required'
        }

        if(!req.body.password){
            errors.password = 'Password is required'
        }

        if(!isEmpty(errors)) {
            res.send({
                status:400,
                data:'null',
                message:errors
            })
            return
        }

        const user = await User.findOne({
            email:req.body.email
        })

        if(!user){
            throw new Error('Unable to login')
        }
        
        const isMatch = await bcrypt.compare(req.body.password, user.password)
        
        if(isMatch === false){
            throw new Error('Unable to login')
        }

        const newtoken = jwt.sign({ id:user.id.toString() }, process.env.SECRET_KEY);
        user.tokens = user.tokens.concat({token:newtoken})
        

        res.send({
            status:200,
            data:user
        })
        await user.save()  

    } catch(e){
        res.status(400).send({
            status:400,
            data:'null',
            message:e.message
        })
    }
})

//Profile routes
router.get('/profile', auth, async(req, res)=>{
    try{
        res.send({
            status:200,
            data:req.user
        })

    } catch(e){
        res.status(401).send({
            status:401,
            data:null,
            message:e.message
        })
    }
          
})

//Logout routes
router.post('/logout', auth, async(req, res)=>{
    try{
        const logoutToken = req.user.tokens.filter((data)=>{
            return data.token !== req.token
        })

        const user = req.user
        user.tokens = logoutToken
        await user.save()

        res.send({
            status:200,
            data:req.user.email,
            message:'You are logout'
        })

    } catch(e){
        res.status(401).send({
            status:401,
            data:null,
            message:e.message
        })
    }
})



module.exports = router
