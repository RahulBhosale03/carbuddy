const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    mobile: {
        type: Number,
        required: true,
        unique: true
    },
    emergencyContacts:[
        {
            friendlyName: String,
            email: String,
            contact: Number
        }
    ],
    age: Number,
    gender: String,
    createdDate: Date,
    updatedDate: Date
  
});



module.exports = userSchema;
