const express = require('express');
const BookingController = require('../controllers/booking.controller.js');
const auth = require('../middlewares/auth.middleware.js');

const bookingRouter = express.Router();
const bookingController = new BookingController();

bookingRouter.post('/', auth, (req, res, next)=>{
    bookingController.bookRide(req, res, next);
})
bookingRouter.put('/:id', auth, (req, res, next)=>{
    bookingController.updateBooking(req, res, next);
})
bookingRouter.get('/:id', (req, res, next)=>{
    bookingController.getBookingById(req, res, next);
})
bookingRouter.get('/', auth, (req, res, next)=>{
    bookingController.getBookingsByPassengerId(req, res, next);
})
bookingRouter.put('/cancel/:id',auth, (req, res, next)=>{
    bookingController.cancelBooking(req, res, next);
})

module.exports = bookingRouter;