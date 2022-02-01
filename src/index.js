const express = require('express')
const app = express()
const port = process.env.PORT
const User = require('./models/users')
require('./db/mongoose')


app.get('/', async(req, res)=>{
    const user = await new User({
        username:'Sheetal',
        email:'abc'
    })
    res.send(user)
    await user.save()
})

app.listen(port, ()=>{
    console.log(`Server is on ${port}`)
})