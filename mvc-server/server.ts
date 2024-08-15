import mongoose = require("mongoose");
import express = require("express");
import bodyParser = require("body-parser");
import router from "./src/routes/index";

import * as dotenv from 'dotenv';
dotenv.config();


const app = express();

// Middleware to parse JSON bodies in incoming requests
app.use(bodyParser.json());
app.use(router);

// an asynchronous function to start the server and connect to MongoDB
async function startServer() {
  const dbUrl = process.env.DB_CONN;

  if (!dbUrl) {
    throw new Error("DATABASE_URL is not defined in the .env file");
  }

  try {
    // Connect to MongoDB using the provided URL
    await mongoose.connect(dbUrl);
    console.log("Connected to MongoDB");

    app.listen(8080, () => {
      console.log("Server listening on port 8080");
    });

  } catch (error) {
    console.error("Failed to connect to MongoDB", error);
  }
}

startServer();