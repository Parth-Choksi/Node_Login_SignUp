const mongoose = require('mongoose');

//  Now Create User Schema

const UserSchema = mongoose.Schema({
    username:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
    },
    password:{
        type: String,
        required: true,
    }
})

// means a UserSchema has model User which we use for routing
module.exports = mongoose.model('User', UserSchema);