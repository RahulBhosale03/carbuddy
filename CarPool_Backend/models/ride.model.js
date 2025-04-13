const mongoose = require('mongoose');

const rideSchema = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId
    },
    driverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    startLocation: {
        address: String,
        fullAddress: String,
        place_id: String,
        coordinates: {
            lat: Number,
            lng: Number
        }
    },
    endLocation: {
        address: String,
        fullAddress: String,
        place_id: String,
        coordinates: {
            lat: Number,
            lng: Number
        }
    },
    route:[
        {
            lat: Number,
            lng: Number
        }
    ],
    distance: Number,
    startTime: Date,
    endTime: Date,
    farePerPerson: {
        type: Number,
        default:0
    },
    totalSeats: {
        type: Number,
        default: 0
    },
    bookedSeats: {
        type: Number,
        default: 0
    },
    availableSeats:{
        type: Number,
        default: 0
    },
    passengers: [
        {
            primaryPassenger:{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            },
            bookingId:{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Booking'
            },
            allPassengers: [
                {
                    name: String,
                    age: Number,
                    gender: String
                }
            ],
            paymentStatus: {
                type: Boolean,
                default: false
            }
        }
    ],
    status:{
        type: String,
        enum: ['active','started','completed', 'cancelled']
    },
    vehicleDetails:{
        vehicleName: String,
        vehicleColor: String,
        vehiclePlate: String
    },
    createdDate: Date,
    updatedDate: Date
});

module.exports = rideSchema;