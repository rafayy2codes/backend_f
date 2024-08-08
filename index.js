import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import dotenv from 'dotenv';
import connectDB from './utils/db.js';
import registerRoute from './routes/register.route.js';
import projectRoute from './routes/project.route.js';
import helmet from 'helmet';
import compression from 'compression'; // Import compression middleware

// Load environment variables from .env file
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Use gzip compression
app.use(compression()); // Enable gzip compression

app.use(helmet({
    contentSecurityPolicy: false, // Disables the default Content Security Policy (CSP) settings
    dnsPrefetchControl: { allow: true }, // Allows DNS prefetching
    frameguard: { action: 'deny' }, // Prevents your site from being framed
    hsts: { maxAge: 31536000, includeSubDomains: true }, // Enforces HTTP Strict Transport Security
    hidePoweredBy: true, // Removes the X-Powered-By header
    noSniff: true, // Prevents the browser from MIME-sniffing
    xssFilter: true // Enables the XSS filter
}));
app.disable('x-powered-by');

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// CORS configuration
app.use(cors({
    origin: process.env.CLIENT_URL, // or ['http://localhost:3000'] for local development
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

// Route definition
app.get('/', (req, res) => {
    res.status(200).json({
        message: 'You are connected!',
        success: true
    });
});

// Database connection
connectDB();

// Use routes
app.use('/api/v1/users', registerRoute);
app.use('/api/v1/projects', projectRoute);

// Start the server
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
