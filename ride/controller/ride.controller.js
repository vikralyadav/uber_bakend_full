const rideModel = require('../models/ride.model');
const {subscribeToQueue,publishToQueue} = require('../service/rabbit')

module.exports.createRide = async (req, res)=>{

    const {pickup, destination} = req.body;

    const newRide = new rideModel({
        user: req.user.id,
        pickup,
        destination,
        
    })
     
   

    await newRide.save();
    publishToQueue("new-ride",JSON.stringify(newRide))
    res.send(JSON.stringify(newRide));

}

module.exports.acceptRide = async(req, res)=>{
    const {rideId}= req.query;
    const ride = await rideModel.findById(rideId);
    if(!ride){
        return res.status(404).json({message: "Ride Not Found"});
    }

    ride.status = 'accepted';
    await ride.save();
    publishToQueue("ride-accepted", JSON.stringify(ride));
    res.send(ride);

}

