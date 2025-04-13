const rideServices = require('../services/ride.services');

// const {customError} = require('./../middlewares/errorhandler.middleware');

class rideController{
    async publishRide(req, res, next){
        try {
            const userId = req.userId;
            const rideData = req.body;
            const result = await rideServices.publishRide(userId, rideData);
            res.status(201).json(result);
        } catch (error) {
            next(error);
        }
    }
    async updateRide(req, res, next){
        try {
            const userId = req.userId;
            const rideId = req.params.id;
            const updateData = req.body;
            const result = await rideServices.updateRide(userId, rideId, updateData);
            res.status(201).json(result);
        } catch (error) {
            next(error);
        }
    }
    async updateRideStatus(req, res, next){
        try {
            const userId = req.userId;
            const rideId = req.params.id;
            const {status} = req.body;
            const result = await rideServices.updateStatus(userId, rideId, status);
            res.status(201).json(result);
        } catch (error) {
            next(error);
        }
    }

    async getActiveRides(req, res, next){
        try {
            const result = await rideServices.getActiveRides();
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }
    async getUserRides(req, res, next){
        try {
            const userId = req.userId;
            const result = await rideServices.getRidesByUserId(userId);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }
    async getRideById(req, res, next){
        try {
            const rideId = req.params.id;
            const result = await rideServices.getRideById(rideId);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }
    async getFilteredRides(req, res, next){
        try {
            const criteria = req.query;
            const result = await rideServices.getFilteredRides(criteria);
            res.status(200).json(result);
        } catch (error) {
            next(error)
        }
    }
    async sendLocation(req, res, next){
        try {
            const userId = req.userId;
            const {rideId, lat, lng} = req.query;
            const result = await rideServices.alertEmergencyContacts(userId, rideId, lat, lng);
            res.status(200).json(result);
        } catch (error) {
            next(error)
        }
    }
}

module.exports = rideController;