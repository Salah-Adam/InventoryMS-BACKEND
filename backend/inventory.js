import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import dotenv from 'dotenv'; // For loading local .env file -- new

// Load environment variables.
// In production on Railway, environment variables are injected directly
// and dotenv.config() might not be strictly necessary, but it's good practice
// for local development consistency.

dotenv.config(); // new


import userRoutes from "./routes/user.js";
import products from "./routes/product.js";
import sales from "./routes/sales.js";
import orderRoutes from "./routes/order.js";
import customerRoutes from "./routes/customer.js";
import dashboardRoutes from "./routes/dashboard.js";
import reportRoutes from "./routes/report.js"


const app = express();


// --- CORS Configuration ---
// The origin needs to be dynamic based on the environment.
// In development, process.env.FRONTEND_URL will be 'http://localhost:5173' (from your .env)
// In production on Railway, process.env.FRONTEND_URL will be your Netlify URL (set in Railway's env vars)
const allowedOrigins = [
  process.env.FRONTEND_URL,
  // Add other origins if your API needs to be accessed from multiple frontends or other services
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or same-origin requests)
      // AND requests from explicitly allowed origins.
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        // Log for debugging if an unauthorized origin tries to access
        console.warn(`CORS: Request from unauthorized origin: ${origin}`);
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true, // Allow cookies and authorization headers
    optionsSuccessStatus: 200 // For preflight requests
  })
);
// --- End CORS Configuration --


app.use(bodyParser.json());
app.use(cookieParser());

app.use("/api/users", userRoutes);
app.use("/products", products);
app.use("/sales", sales);
app.use("/orders", orderRoutes);
app.use("/customers", customerRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/report", reportRoutes);


// Generic error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack); // Log the full stack trace for debugging
  // In production, avoid sending detailed error info to the client for security
  res.status(500).send("Something broke! Please try again later.");
});


// --- Server Listening Port ---
// Use the PORT environment variable provided by Railway (or any hosting provider)
// Fallback to 3000 for local development if PORT is not set.
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`CORS allowed origin(s): ${process.env.FRONTEND_URL}`); // For verification during deployment
});
