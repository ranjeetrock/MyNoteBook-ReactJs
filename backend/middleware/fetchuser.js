const jwt = require("jsonwebtoken");
const JWT_SECRET = "have a nice day";

const fetchuser = (req, res, next) =>{
    // get the user from the jwt token and id to the request object
    const token = req.header('authtoken')
    if(!token){
        res.status(401).send({error: "Please authenticate a valid token"})

    }
    try {
        const data = jwt.verify(token, JWT_SECRET)
        req.user = data.user;
        next();
        
    } catch (error) {
        res.status(401).send({error: "Please authenticate a valid token"})
        
    }

   
}


module.exports = fetchuser;