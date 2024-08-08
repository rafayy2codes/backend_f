import jwt from 'jsonwebtoken';

const isAuthenticated = (req, res, next) => {
    try {

        const token = req.cookies.token;


        if (!token) {
            return res.status(401).json({
                message: "No token provided, authorization denied",
                success: false
            });
        }


        jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
            if (err) {
                return res.status(401).json({
                    message: "Invalid token",
                    success: false
                });
            }


            req.user = decoded;


            next();
        });

    } catch (error) {
        console.error("Authentication error:", error.message);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

export default isAuthenticated;
