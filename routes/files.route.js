import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import { db } from "../db/index.js";
import { files } from "../db/schema.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();
const UPLOAD_ROOT = process.env.UPLOAD_ROOT || "./uploads";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const userDir = path.join(UPLOAD_ROOT, String(req.user.id));
    fs.mkdirSync(userDir, { recursive: true });
    cb(null, userDir);
  },
  filename: (req, file, cb) => {
    const filename = Date.now() + "-" + file.originalname.replace(/\s+/g, "_");
    cb(null, filename);
  }
});
const upload = multer({ storage });

router.post("/upload", authMiddleware, upload.array("files", 10), async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: "No files uploaded" });
  }

  const uploadedRecords = [];

  // Loop through all uploaded files
  for (const file of req.files) {
    const record = await db
      .insert(files)
      .values({
        user_id: req.user.id,
        filename: file.filename,
        original_name: file.originalname,
        mime: file.mimetype,
        size: file.size,
        path: file.path,
      })
      .returning();

    uploadedRecords.push(record[0]);
  }

  res.json({ files: uploadedRecords });
});


router.get("/", authMiddleware, async (req, res) => {
  const userFiles = await db.select().from(files).where(files.user_id.eq(req.user.id));
  res.json({ files: userFiles });
});

router.get("/:id/download", authMiddleware, async (req, res) => {
  const id = Number(req.params.id);
  const result = await db.select().from(files).where(files.id.eq(id));
  const file = result[0];
  if (!file) return res.status(404).json({ message: "File not found" });
  if (file.user_id !== req.user.id) return res.status(403).json({ message: "Forbidden" });

  res.download(file.path, file.original_name);
});

export default router;
