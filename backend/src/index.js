// ================================
// ENV CONFIG (MUST BE FIRST)
// ================================
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Explicitly load .env from backend/.env
dotenv.config({ path: path.resolve(__dirname, "../.env") });

// ================================
// IMPORTS
// ================================
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import { connectDB } from "./lib/db.js";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { app, server } from "./lib/socket.js";

// ================================
// BASIC SETUP
// ================================
const PORT = process.env.PORT || 5000;

// ================================
// MIDDLEWARE
// ================================
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// ================================
// ROUTES
// ================================
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// ================================
// PRODUCTION BUILD (OPTIONAL)
// ================================
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(
      path.join(__dirname, "../frontend", "dist", "index.html")
    );
  });
}

// ================================
// START SERVER + CONNECT DB
// ================================
server.listen(PORT, () => {
  console.log("server is running on PORT:" + PORT);
  connectDB();
});
