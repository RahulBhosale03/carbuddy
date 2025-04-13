const axios = require("axios");
const { customError } = require("../middlewares/errorhandler.middleware");


const mapServices = {
    // Service to get co-ordinates of loacation string
    getGeocodes: async(address)=>{
        // Check if address is not empty
        if (!address) {
            throw new customError(400, "Address cannot be empty")
        }
        // customize url 
        const API_KEY = process.env.GOOGLE_MAPS_API_KEY;
        const URL = `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${API_KEY}`;
        try {
            const response = await axios.get(URL);
            // console.log(response);

            // if data is fetched successfully then return it
            if (response.data.status=='OK') {
                const result = response.data.results[0];
                const geocodes = {
                    formatted_address: result.formatted_address,
                    lat: result.geometry.location.lat,
                    lng: result.geometry.location.lng,
                    place_id: result.place_id
                }
                return geocodes;
            } else {
                throw new customError(404, "Provide valid address. Check typo or try different location")
            }
        } catch (error) {
            throw new customError(error.statusCode || 500, error.message || "Unable to fetch coordinates")
        }
    },

    // Service to get Place suggestions
    // https://maps.googleapis.com/maps/api/place/autocomplete/json?input=amoeba&types=(cities)&key=YOUR_API_KEY
    getPredictions: async (input)=>{
        // check if input is not empty
        if (!input) {
            throw new customError(400, "Input cannot be empty");
        }
        // customize url 
        const API_KEY = process.env.GOOGLE_MAPS_API_KEY;
        const URL = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${input}&components=country:in&key=${API_KEY}`;
        try {
            const response = await axios.get(URL);
            if (response.data.status == 'OK') {
                const data = {
                    total: response.data.predictions.length,
                    predictions: response.data.predictions.map((pred)=>{return{place_id: pred.place_id,mainText: pred.structured_formatting.main_text ,description: pred.structured_formatting.secondary_text}})
                }
                return data;
            } else {
                throw new customError(404,'Location not found')
            }
        } catch (error) {
            throw new customError(error.statusCode || 500, error.message || "Unable to fetch suggetions");
        }
    },

    // Service to get distance and time between two places
    // https://maps.googleapis.com/maps/api/distancematrix/json?destinations=New%20York%20City%2C%20NY&origins=Washington%2C%20DC&units=metric&key=YOUR_API_KEY
    getDistanceAndTime: async(origin, destination)=>{
        // check if origin and destination are not empty
        if (!origin || !destination) {
            throw new customError(400, "Origin and Destination cannot be empty");
        }
        // customize url 
        const API_KEY = process.env.GOOGLE_MAPS_API_KEY;
        const URL = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origin}&destinations=${destination}&units=metric&key=${API_KEY}`;
        try {
            const response = await axios.get(URL);
            if (response.data.status == 'OK' && response.data.rows[0].elements[0].status=='OK') {
                const data = {
                    origin_address: response.data.origin_addresses[0],
                    destination_address: response.data.destination_addresses[0],
                    distance: response.data.rows[0].elements[0].distance.text,
                    duration: response.data.rows[0].elements[0].duration.text,
                }
                return data;
            } else {
                throw new customError(404, "Location not found. Check typo or try different places");
            }
        } catch (error) {
            throw new customError(error.statusCode||500, error.message || "Unable to fetch distance and time")
        }
        
    },

    // Service to get optimized route between STOPS
    // https://maps.googleapis.com/maps/api/directions/json?origin=New+York+City&waypoints=Chicago,IL|Denver,CO|Dallas,TX|San+Francisco,CA&waypoint_order=3,2,0,1&key=YOUR_API_KEY
    getDirections: async (origin, destination, waypoints)=>{
        // check if origin and destination are not empty
        if (!origin || !destination) {
            throw new customError(400, "Origin and Destination cannot be empty");
        }
        // customize url 
        const API_KEY = process.env.GOOGLE_MAPS_API_KEY;
        const URL = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&mode=driving&key=${API_KEY}`;
        try {
            const response = await axios.get(URL);
            if (response.data.status == 'OK') {
                return response.data;
            } else {
                throw new customError(404, "Directions not found");
            }
        } catch (error) {
            throw new customError(error.statusCode||500, error.message || "Unable to get directions")
        }
    },
    getDirectionsByPlaceId: async (originId, destinationId)=>{
        // check if origin and destination are not empty
        if (!originId || !destinationId) {
            throw new customError(400, "OriginID and DestinationID cannot be empty");
        }
        // customize url 
        const API_KEY = process.env.GOOGLE_MAPS_API_KEY;
        const URL = `https://maps.googleapis.com/maps/api/directions/json?origin=place_id:${originId}&destination=place_id:${destinationId}&region=in&key=${API_KEY}`;
        try {
            const response = await axios.get(URL);
            if (response.data.status=='OK') {
                return response.data.routes[0]?.legs[0];
            } else {
                throw new customError(404, "Directions not found");
            }
        } catch (error) {
            throw new customError(error.statusCode||500, error.message || "Unable to get directions")
        }
    }
}
module.exports = mapServices;