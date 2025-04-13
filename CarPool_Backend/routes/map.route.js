const express = require("express");
const MapController = require('../controllers/map.controller');
const auth = require('../middlewares/auth.middleware');

const mapRouter = express.Router();
const mapControllerObj = new MapController();

mapRouter.get('/geocode', (req, res, next)=>{
    mapControllerObj.getGeocodes(req, res, next);
})
mapRouter.get('/prediction', (req, res, next)=>{
    mapControllerObj.getPredictions(req, res, next);
})
mapRouter.get('/route-info', (req, res, next)=>{
    mapControllerObj.getDistanceAndTime(req, res, next);
})
mapRouter.get('/get-directions', (req, res, next)=>{
    mapControllerObj.getDirections(req, res, next);
})

module.exports = mapRouter;