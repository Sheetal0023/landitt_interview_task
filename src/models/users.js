const mongoose = require('mongoose')
const bcrypt = require('bcryptjs');
const validator = require('validator')


const userSchema = new mongoose.Schema({
    username:{
        type:String,
    },
    email:{
        type:String,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Invalid E-mail')
            }
        }
    },
    password:{
        type:String,
    },
    phone:{
        type:Number,
    },
    tokens:[{
        token:{
            type:String,
            }
    }]
})



const User = mongoose.model('User', userSchema)

// userSchema.statics.findByCredentials = async(email, password)=>{
//     const user = await User.findOne({
//         email:email
//     })
    
//     if(!user){
//         throw new Error('Unale to login')
//     }

//     const isMatch = await bcrypt.compare(password, user.password)

//     if(isMatch === false){
//         throw new Error('Unable to login')
//     }

//     return user
// }


module.exports = User