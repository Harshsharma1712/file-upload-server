import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fs from "fs";
import authRoutes from "./routes/auth.route.js";
import fileRoutes from "./routes/files.route.js";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// --- Middleware Setup ---
app.use(cors());
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

const UPLOAD_ROOT = process.env.UPLOAD_ROOT || "./uploads";
fs.mkdirSync(UPLOAD_ROOT, { recursive: true });

// --- API Routes ---
app.use("/api/auth", authRoutes);
app.use("/api/files", fileRoutes);
app.use("/api/download", fileRoutes);

// NOTE: The conflicting route below has been REMOVED.
// app.get("/", (req, res) => {
//     res.json({ message: "File Share Server is running." });
// });

// --- Frontend Serving Logic ---

// 1. Define the absolute path to your frontend build folder
// Assumes 'frontend/dist' relative to your index.js file
const frontendPath = path.join(__dirname, "frontend", "dist");

// 2. Serve static assets (CSS, JS, images) from the build folder
// This must be placed AFTER your API routes to avoid conflicts (e.g., if you have /api/download, it won't try to find a file in 'dist').
app.use(express.static(frontendPath));

app.use((req, res) => {
    // Check if the file exists before sending to prevent a server crash
    if (fs.existsSync(path.join(frontendPath, 'index.html'))) {
        res.sendFile(path.join(frontendPath, 'index.html'));
    } else {
        res.status(404).send("Frontend build not found. Did the build step run correctly?");
    }
});


const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));