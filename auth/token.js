var jwt = require('jsonwebtoken');
const env = process.env;

let checkToken = (req, res, next) => {
    let token = req.headers['x-access-token'] || req.headers['authorization'];


    try {
        if(token) {
            
            if(token.startsWith('Bearer ')) {
                token = token.slice(7, token.length);
    
            }

            jwt.verify(token, env.SECRET, (error, decoded) => {
                if(error) {
                    return res.status(401).send("Invalid token");

                } else {
                    req.decoded = decoded;
                    req.username = decoded.username;
                    req.role = decoded.role;
                    next();

                }
            });

        } else {
            return res.status(401).send("Missing authorization token");
        }
    } catch(error) {
        console.log(error);
        return res.status(500).send("Error authenticating user");

    }
}

module.exports = {
    checkToken: checkToken
};