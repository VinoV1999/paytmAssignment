const mongoose = require('mongoose');

mongoose.connect("mongodb+srv://mongoos1:mongoos1_Vinoth@testingdb.5lhbvx6.mongodb.net/");

const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        require: true
    },
    lastName:{
        type:String,
        require: true
    },
    email:{
        type:String,
        require: true
    },
    password:{
        type:String,
        require: true
    }
})

const accountSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId, // Reference to User model
        ref: 'User',
        required: true
    },
    balance: {
        type: Number,
        required: true
    }
});

const Account = mongoose.model('Account', accountSchema);
const User = mongoose.model('User', userSchema);

module.exports = {
    User, Account
};