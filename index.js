import express from "express";
import cors from "cors"
import dotenv from "dotenv";
import fs from "fs";
import authRoutes from "./routes/auth.route.js";
import fileRoutes from "./routes/files.route.js";
import cookieParser from "cookie-parser"
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express();

app.use(cors())

app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(express.static("public"))
app.use(cookieParser())

const UPLOAD_ROOT = process.env.UPLOAD_ROOT || "./uploads";
fs.mkdirSync(UPLOAD_ROOT, { recursive: true });

app.use("/api/auth", authRoutes);
app.use("/api/files", fileRoutes);
// app.use("/api/get-files", fileRoutes);
app.use("/api/download", fileRoutes)

app.get("/", (req, res) => {
  res.json({ message: "File Share Server is running." });
});

// Serve the React build
const frontendPath = path.join(__dirname, "frontend", "dist");
app.use(express.static(frontendPath));

app.get(/.*/, (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});


const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
