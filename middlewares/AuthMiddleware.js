import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
    const token = req.cookies.jwt;

    if(!token) return res.status(401).send("Unauthorized");

    jwt.verify(token, process.env.JWTKEY, async(err,payload) =>{
        if(err) return res.status(403).send("Token is invalid");
        req.userId = payload.userId;
    })

    next();
}