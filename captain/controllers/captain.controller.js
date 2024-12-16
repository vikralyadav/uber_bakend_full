const captainModel = require('../models/captain.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const BlacklistedToken = require('../models/blacklistToken')
const {subscribeToQueue}= require('../service/rabbit')

const pendingRequests = [];

module.exports.register = async (req, res)=>{
    try{
        const {name, email, password} = req.body;
        const captain= await captainModel.findOne({email});

        if(captain){
            res.status(401).json({message: 'captain already exists'})
        }

        const hash= await bcrypt.hash(password, 10);

        const newcaptain = new captainModel({name, email, password});

        await newcaptain.save();

        const token = jwt.sign({id: newcaptain._id}, process.env.JWT_SECRET, {expiresIn: '1h'});

        res.cookie('token', token);

        res.send({message: "captain registered successfully"})




    }catch(error){
        res.status(500).json({message: error.message});

    }
}

module.exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const captain = await captainModel.findOne({ email });

        if (!captain) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, captain.password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: captain._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.cookie('token', token);

        res.send({ message: "Login successful" });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports.logout = async (req, res) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(400).json({ message: 'No token provided' });
        }

        const blacklistedToken = new BlacklistedToken({ token });
        await blacklistedToken.save();

        res.clearCookie('token');

        res.send({ message: "Logout successful" });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports.profile = async (req, res) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const captain = await captainModel.findById(decoded.id);

        if (!captain) {
            return res.status(404).json({ message: 'captain not found' });
        }

        res.send(captain);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports.toggleAvailability = async (req, res) => {
    try{
        const captain = await captainModel.findById(req.params.id);
        captain.isAvilable = !captain.isAvilable;
        await captain.save();
        res.send(captain)
    }catch(err){
        res.status(500).json({ message: err.message})
    }

}

module.exports.waitForNewRide = async(req, res)=>{
    req.setTimeout(30000, ()=>{
        res.status(204).end();
    });
    pendingRequests.push(res);

};

subscribeToQueue("new-ride",(data)=>{
    console.log(JSON.parse(data));

    pendingRequests.forEach(res =>{
        res.json(rideData);
    });

    pendingRequests.length = 0;
})



