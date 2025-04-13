const bookingServices = require('../services/booking.services');

class BookingController{
    async bookRide(req, res, next){
        try {
            const userId = req.userId;
            const bookingData = req.body;
            const result = await bookingServices.bookRide(userId, bookingData);
            res.status(201).json(result);
        } catch (error) {
            next(error)
        }
    };
    async updateBooking(req, res, next){
        try {
            const userId = req.userId;
            const bookingId = req.params.id;
            const updateData = req.body;
            const result = await bookingServices.updateBooking(userId, bookingId, updateData);
            res.status(201).json(result);
        } catch (error) {
            next(error);
        }
    };
    async getBookingById(req, res, next) {
        try {
            const bookingId = req.params.id;
            const result = await bookingServices.getBookingById(bookingId);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }
    async getBookingsByPassengerId(req, res, next){
        try {
            const userId = req.userId;
            const result = await bookingServices.getBookingsByPassengerId(userId);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }
    async cancelBooking(req, res, next){
        try {
            const userId = req.userId;
            const bookingId = req.params.id;
            const result = await bookingServices.cancelBooking(userId, bookingId);
            res.status(201).json(result);
        } catch (error) {
            next(error);
        }
    }
}
module.exports = BookingController;