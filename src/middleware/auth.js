const jwt = require('jsonwebtoken')
const User = require('../models/users')

const auth = async(req, res, next)=>{
    try{
        const token = req.header('Authorization').replace('Bearer ', '')
        const decode = jwt.verify(token, process.env.SECRET_KEY)
        console.log('before if decode')
        if(!decode){
            console.log('inside decode')
            throw new Error
        }

        const user = await User.findById(decode.id)
        const isValidToken = user.tokens.find((data)=>{
            return data.token === token
        })

        if(!isValidToken){
            throw new Error
        }
        
        req.user = user
        req.token = token
        next()

    } catch(e){
        res.status(401).send('You are not authorized')
        
    }
}

module.exports = auth