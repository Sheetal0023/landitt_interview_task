const express = require('express')
const app = express()
const port = process.env.PORT
require('./db/mongoose')


//For Body-parser
const bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(express.urlencoded({ extended: true }))


//use routers
const UserRouter = require('./routes/user')
app.use(UserRouter)

//Server listening
app.listen(port, ()=>{
    console.log(`Server is on ${port}`)
})