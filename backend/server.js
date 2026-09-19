import "dotenv/config";

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import connectDB from "./config/db.js";

import {
  initializeAgenda,
  startAgenda,
  stopAgenda,
} from "./jobs/postScheduler.js";

import authRoutes from "./routes/authRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import sponsorRoutes from "./routes/sponsorRoutes.js";
import memberRoutes from "./routes/memberRoutes.js";
import serviceRoutes from "./routes/serviceRoutes.js";
import homeRoutes from "./routes/homeRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import mediaRoutes from "./routes/mediaRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import posterRoutes from "./routes/posterRoutes.js";

const app = express();

/* ==================================================
   MIDDLEWARE
================================================== */

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  }),
);

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  }),
);

app.use(cookieParser());

/* ==================================================
   AUTH
================================================== */

app.use("/api/auth", authRoutes);

/* ==================================================
   API ROUTES
================================================== */

app.use("/api/upload", uploadRoutes);

app.use("/api/projects", projectRoutes);

app.use("/api/sponsors", sponsorRoutes);

app.use("/api/members", memberRoutes);

app.use("/api/services", serviceRoutes);

app.use("/api/home", homeRoutes);

app.use("/api/jobs", jobRoutes);

app.use("/api/blog", postRoutes);

app.use("/api/media", mediaRoutes);

app.use("/api/contact", contactRoutes);

app.use("/api/posters", posterRoutes);

/* ==================================================
   HEALTH CHECK
================================================== */

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Being IBAN backend is running.",
    timestamp: new Date().toISOString(),
  });
});

/* ==================================================
   ROOT
================================================== */

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Being IBAN Entertainments API",
  });
});

/* ==================================================
   404 HANDLER
================================================== */

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.originalUrl,
  });
});

/* ==================================================
   SERVER
================================================== */

const PORT = process.env.PORT || 5000;

/* ==================================================
   START SERVER
================================================== */

const startServer = async () => {
  try {
    /*
     * ==================================================
     * 1. CONNECT MONGOOSE
     * ==================================================
     *
     * Mongoose is responsible for your application
     * models such as Post.
     */

    await connectDB();

    console.log("[MongoDB] Mongoose connection established.");

    /*
     * ==================================================
     * 2. INITIALIZE AGENDA
     * ==================================================
     *
     * IMPORTANT:
     *
     * Agenda now uses its own native MongoClient.
     *
     * DO NOT use:
     *
     * mongoose.connection.db
     *
     * inside postScheduler.js.
     *
     * This separation prevents the BSON 6 / BSON 7
     * version conflict.
     */

    await initializeAgenda();

    /*
     * ==================================================
     * 3. START AGENDA
     * ==================================================
     */

    await startAgenda();

    /*
     * ==================================================
     * 4. START EXPRESS
     * ==================================================
     */

    const server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

    /*
     * ==================================================
     * GRACEFUL SHUTDOWN
     * ==================================================
     */

    let shuttingDown = false;

    const shutdown = async (signal) => {
      /*
       * Prevent shutdown from running twice.
       */

      if (shuttingDown) {
        return;
      }

      shuttingDown = true;

      console.log(`${signal} received. Shutting down...`);

      /*
       * Stop accepting new HTTP connections.
       */

      server.close(async () => {
        try {
          /*
           * Stop Agenda and close its
           * dedicated MongoDB connection.
           */

          await stopAgenda();

          console.log("Server shut down cleanly.");

          process.exit(0);
        } catch (error) {
          console.error("Shutdown error:", error);

          process.exit(1);
        }
      });
    };

    process.on("SIGTERM", () => shutdown("SIGTERM"));

    process.on("SIGINT", () => shutdown("SIGINT"));
  } catch (error) {
    console.error("Server startup failed:", error);

    process.exit(1);
  }
};

/* ==================================================
   START APPLICATION
================================================== */

startServer();
