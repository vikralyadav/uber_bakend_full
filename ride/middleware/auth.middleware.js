const jwt = require('jsonwebtoken')
const axios = require('axios')

module.exports.userAuth = async (req, res, next)=>{
    try{
        const token = req.cookies.token || req.headers.authorization.split(' ')[1];

        if(!token){
            return res.status(401).json({message: "unauthorized"});

        }
        const decode = jwt.verify(token, process.env.JWT_SECRET);

        const response = await axios.get(`${process.env.BASE_URL}/user/profile`,{
            headers: {
                Authorization: `Bearer ${token}`
            }
     })

        const user = response.data;

        if(!user){
            req.status(401).json({message: "unauthorized",
               
                
        })

        }

        req.user = user;
        next();

    }catch(err){
        res.status(500).json({message: err.message})


    }
}

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