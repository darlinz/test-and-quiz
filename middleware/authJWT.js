const jwt = require("jsonwebtoken");
require('dotenv').config();

verifyToken = (req, res, next) => {
    console.log("Request Headers:", req.headers); // Log headers
    const token = req.headers["x-access-token"];
    if (!token) {
        return res.status(403).send({
            message: "No token provided!"
        });
    }
    jwt.verify(token, process.env.SECRET_WORD, (err, decoded) => {
        if (err) {
            return res.status(401).send({
                message: "Unauthorized!",
            });
        }
        req.userId = decoded.userId;
        next();
    });
};


checkUserId = (req, res, next) => {
    if (req.params.id && req.userId !== parseInt(req.params.id)) {
        return res.status(403).send({
            message: "Unauthorized! You can only access your own data."
        });
    }
    next();
}

const authJwt = {
    verifyToken: verifyToken,
    checkUserId: checkUserId
};
module.exports = authJwt