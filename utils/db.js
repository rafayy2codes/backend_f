import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        const uri = process.env.MONGO_DB_URI;
        if (!uri) {
            throw new Error('MONGO_URI is not defined in environment variables');
        }
        await mongoose.connect(uri);
        console.log('MongoDB connected');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error.message);
        process.exit(1);
    }
};

export default connectDB;
