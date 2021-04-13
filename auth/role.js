/**
 * role.js
 *  Definition for the BCS (SER416) role system
 * 
 * @author Joel Casteel
 * @version April2021
 * @copyright Joel Casteel, April 2021 (MIT)
 * 
 */

const roles = {
    User: 'user',
    Admin: 'admin'
};

const checkAdmin = (req, res, next) => {
    try {

        if(req.role.toLowerCase() === roles.Admin) {
            return next();

        }

        return res.status(401).send("You are not authorized to access this.");

    } catch(error) {
        return res.status(500).send("Error checking role");

    }
}

module.exports ={
    roles: roles,
    checkAdmin: checkAdmin
};