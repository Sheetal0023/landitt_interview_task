const jwt = require('jsonwebtoken')
const User = require('../models/users')

const auth = async(req, res, next)=>{
    try{
        const token = req.header('Authorization').replace('Bearer ', '')
        const decode = jwt.verify(token, process.env.SECRET_KEY)
        if(!decode){
            throw new Error('You are not Authenticated')
        }

        const user = await User.findById(decode.id)
        const isValidToken = user.tokens.find((data)=>{
            return data.token === token
        })

        if(!isValidToken){
            throw new Error('You are not Authenticated')
        }
        
        req.user = user
        req.token = token
        next()

    } catch(e){
        res.status(401).send({
            status:401,
            data:'null',
            message:e.message
        })
        
    }
}

module.exports = auth