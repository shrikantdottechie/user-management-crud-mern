
const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
    firstName:String,
    lastName:String,
    gender:String,
    email: String,
    password: String,
    address: String,
    profession: String
});


module.exports=mongoose.model('User', UserSchema);