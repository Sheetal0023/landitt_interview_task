const express = require('express')
const app = express()
const router = new express.Router()
const User = require('../models/users')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const auth = require('../middleware/auth')

//Register routes
router.post('/register', async(req, res)=>{
   try{
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
        res.status(201).send('User register successfully')   
   
    } catch(e){
        res.status(400).send(e.message)
        
    }

})

//Login routes
router.post('/login', async(req, res)=>{
    try{

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
        

        res.send(user)
        await user.save()  

    } catch(e){
        res.status(400).send(e.message)
    }
})

//Profile routes
router.get('/profile', auth, async(req, res)=>{
    try{
        res.send(req.user)

    } catch(e){
        res.status(401).send('You are not Authenticate')
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

        console.log(logoutToken)
        res.send('You are logout')

    } catch(e){
        res.status(401).send('You are not Authenticate')
    }
})



module.exports = router
