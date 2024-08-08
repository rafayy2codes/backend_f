// src/middleware/checkFreelancer.js
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const checkFreelancer = async (req, res, next) => {
    try {
        // Extract token from cookies
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({
                message: "No token provided",
                success: false
            });
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const user = await User.findById(decoded.userId);

        if (!user || user.role !== 'freelancer') {
            return res.status(403).json({
                message: "Access denied: Freelancer role required",
                success: false
            });
        }

        // Attach user to the request object
        req.user = user;
        next();
    } catch (error) {
        console.error("Error in freelancer role check:", error.message);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

export default checkFreelancer;
