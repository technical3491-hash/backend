// Import necessary modules
import express from 'express'; // Express framework for building web applications
import mongoose from 'mongoose'; // Mongoose for MongoDB object modeling
import cors from 'cors'; // CORS middleware to enable Cross-Origin Resource Sharing
import morgan from 'morgan'; // Morgan for HTTP request logging
import dotenv from 'dotenv'; // Load environment variables
import weatherRouter from './routes/weather.js';

dotenv.config(); // Load .env file;

const app = express(); // Initialize an Express application
const port = 7800; // Define the port number for the server

// Middleware setup
app.use(morgan("dev")); // Use Morgan to log requests in 'dev' format
app.use(express.json({ limit: "30mb", extended: true })); // Parse incoming JSON requests with a size limit of 30mb
app.use(express.urlencoded({ limit: "30mb", extended: true })); // Parse URL-encoded data with a size limit of 30mb
app.use(cors()); // Enable CORS for all routes

// Route setup
app.use("/weather", weatherRouter);

// MongoDB connection URL
const MONGODB_URL = process.env.MONGODB_URL || "mongodb://localhost:27017/weather_db";

// Connect to MongoDB and start the server
mongoose.connect(MONGODB_URL).then(() => {
    app.listen(port, () => {
        console.warn(`Server is running on port : ${port}`); // Log a message when the server starts successfully
    });
}).catch((error) => console.log(`${error} did not connect`)); // Log an error message if the connection fails