const jwt = require('jsonwebtoken')
const captainModel = require('../models/captain.model')


module.exports.captainAuth = async (req, res, next)=>{
    try{
        const token = req.cookies.token;

        if(!token){
            return res.status(401).json({message: unauthorized})
        }
        const decode = jwt.verify(token, process.env.JWT_SECRET);

        const captain = await captainModel.findById(decode.id);

        if(!user){
            return res.status(401).json({message: 'unauthorized'});
        }

        req.captain= captain;

        next();

    }catch(err){
        return res.status(500).json({message: err})

    }
}

