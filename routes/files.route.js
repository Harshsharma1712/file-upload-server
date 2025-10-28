import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import { db } from "../db/index.js";
import { files } from "../db/schema.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import imagekit from "../utils/imagekit.js";

const router = express.Router();
// const UPLOAD_ROOT = process.env.UPLOAD_ROOT || "./uploads";

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const userDir = path.join(UPLOAD_ROOT, String(req.user.id));
//     fs.mkdirSync(userDir, { recursive: true });
//     cb(null, userDir);
//   },
//   filename: (req, file, cb) => {
//     const filename = Date.now() + "-" + file.originalname.replace(/\s+/g, "_");
//     cb(null, filename);
//   }
// });
// const upload = multer({ storage });

const upload = multer({
  dest: "temp/"   // temprary folder 
})

router.post("/upload", authMiddleware, upload.array("files", 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    const uploadedRecords = [];

    // Loop through each uploaded file
    for (const file of req.files) {
      const fileBuffer = fs.readFileSync(file.path);

      // Upload to ImageKit
      const uploadResponse = await imagekit.upload({
        file: fileBuffer.toString("base64"), // Base64 encoding required by ImageKit
        fileName: file.originalname,
        folder: "/uploads", // optional folder in your ImageKit dashboard
      });

      // Insert into DB (store ImageKit URL)
      const record = await db
        .insert(files)
        .values({
          user_id: req.user.id,
          filename: file.filename,
          original_name: file.originalname,
          mime: file.mimetype,
          size: file.size,
          url: uploadResponse.url, // ImageKit hosted URL
        })
        .returning();

      // Remove temp file
      fs.unlinkSync(file.path);

      uploadedRecords.push(record[0]);
    }

    res.json({
      message: "Files uploaded successfully",
      files: uploadedRecords,
    });
  } catch (err) {
    console.error("Upload Error:", err);
    res.status(500).json({ message: "File upload failed", error: err.message });
  }
});


router.get("/", authMiddleware, async (req, res) => {
  const userFiles = await db.select().from(files).where(files.user_id.eq(req.user.id));
  res.json({ files: userFiles });
});


router.get("/:id/download", authMiddleware, async (req, res) => {
  const id = Number(req.params.id);

  try {
    const result = await db.select().from(files).where(files.id.eq(id));
    const file = result[0];

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    if (file.user_id !== req.user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    // Redirect to ImageKit URL (browser will download it automatically)
    return res.redirect(file.url);
  } catch (err) {
    console.error("Download error:", err);
    return res.status(500).json({ message: "Error downloading file" });
  }
});

export default router;
