const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    _id:{
        type: mongoose.Schema.Types.ObjectId
    },
    rideId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ride',
        required: true
    },
    passengerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    totalPassengers: Number,
    allPassengers:[
        {
            name: String,
            age: Number,
            gender: String
        }
    ],
    status:{
        type: String,
        enum: ['confirmed', 'cancelled']
    },
    createdDate: Date,
    updatedDate: Date
});

module.exports = bookingSchema;