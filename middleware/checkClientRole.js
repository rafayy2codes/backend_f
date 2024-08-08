// src/middleware/checkClient.js
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const checkClient = async (req, res, next) => {
    try {

        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({
                message: "No token provided",
                success: false
            });
        }


        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const user = await User.findById(decoded.userId);

        if (!user || user.role !== 'client') {
            return res.status(403).json({
                message: "Access denied: Client role required",
                success: false
            });
        }
        req.user = user;
        next();
    } catch (error) {
        console.error("Error in client role check:", error.message);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

export default checkClient;
