const jwt = require('jsonwebtoken');
require('dotenv').config()

const authentication = (req,res,next)=>{
    const token= req.headers?.authorization?.split(" ")[1]
    if(!token){
        res.send("Plz login!")
    }
    // verify a token symmetric - synchronous
        var decoded = jwt.verify(token, process.env.SECRET_KEY);
        const user_id=decoded.userId    //decoded.userId from login
        console.log(user_id)
        if(decoded){
            //to get on ui
            req.body.user_id=user_id;
          
            next()
        }
        else{
            res.send("plz login")
        }
}


module.exports= {authentication}