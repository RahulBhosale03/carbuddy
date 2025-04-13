const express = require('express');
const rideController = require('../controllers/ride.controller.js');
const auth = require('../middlewares/auth.middleware.js');

const rideRouter = express.Router();
const rideControllerObj = new rideController();

rideRouter.post('/', auth, (req, res, next)=>{
    rideControllerObj.publishRide(req, res, next);
});
rideRouter.put('/updateStatus/:id', auth, (req, res, next)=>{
    rideControllerObj.updateRideStatus(req, res, next);
});
rideRouter.put('/:id', auth, (req, res, next)=>{
    rideControllerObj.updateRide(req, res, next);
});
rideRouter.get('/active', (req, res, next)=>{
    rideControllerObj.getActiveRides(req, res, next);
});
rideRouter.get('/', auth, (req, res, next)=>{
    rideControllerObj.getUserRides(req, res, next);
});
rideRouter.get('/filter', auth,(req, res, next)=>{
    rideControllerObj.getFilteredRides(req, res, next);
});
rideRouter.get('/emergency',auth, (req, res, next)=>{
    rideControllerObj.sendLocation(req, res, next);
})
rideRouter.get('/:id', (req, res, next)=>{
    rideControllerObj.getRideById(req, res, next);
});




module.exports = rideRouter;