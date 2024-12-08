const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/users')


const userSchema = mongoose.Schema({
    username: String,
    email: String,
    userprofile:Buffer,
    password:String,
})

const user = mongoose.model('user',userSchema)
module.exports = user