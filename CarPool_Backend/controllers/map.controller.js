const mapServices = require("../services/map.service");

class MapController{
    async getGeocodes(req, res, next){
        try {
            const address = req.query.address;
            const result = await mapServices.getGeocodes(address);
            res.status(200).send({success: true, result});
        } catch (error) {
            next(error)
        }
    }
    async getPredictions(req, res, next){
        try {
            const input  = req.query.input;
            const result = await mapServices.getPredictions(input);
            res.status(200).send({success: true, result});
        } catch (error) {
            next(error)
        }
    }
    async getDistanceAndTime(req, res, next){
        try {
            const {origin, destination} = req.query;
            const result = await mapServices.getDistanceAndTime(origin, destination);
            res.status(200).send({success: true, result});
        } catch (error) {
            next(error)
        }
    }
    async getDirections(req, res, next){
        try {
            const {origin, destination} = req.query;
            const {waypoints} = req.body;
            const result = await mapServices.getDirections(origin, destination, waypoints);
            res.status(200).json(result);
        } catch (error) {
            next(error)
        }
    }
}
module.exports = MapController;