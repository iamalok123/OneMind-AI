import mongoose from "mongoose";
import dns from "node:dns";

// Use public DNS to resolve MongoDB Atlas SRV records reliably on Windows/local networks
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const connectDB = async (): Promise<void> => {
    try {
        const mongoURI = process.env.MONGODB_URI;
        if (!mongoURI) {
            throw new Error("MONGODB_URI is not defined in environment variables");
        }

        const conn = await mongoose.connect(mongoURI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error("MongoDB connection error:", error);
        process.exit(1);
    }
};

export default connectDB;
