import express from "express";
import multer from "multer";
import fs from "fs";
import { db } from "../db/index.js";
import { files } from "../db/schema.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import imagekit from "../utils/imagekit.js";
import { eq } from "drizzle-orm";
import axios from "axios";

const router = express.Router();

const upload = multer({
  dest: "temp/"   // temprary folder 
})

// Upload file on server
router.post("/upload", authMiddleware, upload.array("files", 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    const uploadedRecords = [];

    // Loop through each uploaded file
    for (const file of req.files) {
      
      try {
        const fileBuffer = fs.readFileSync(file.path);

      // Upload to ImageKit
      const uploadResponse = await imagekit.upload({
        file: fileBuffer.toString("base64"), // Base64 encoding required by ImageKit
        fileName: file.originalname,
        folder: "/uploads", // optional folder in your ImageKit
      });

      // Insert into DB (store ImageKit URL)
      const [record] = await db
        .insert(files)
        .values({
          user_id: req.user.id,
          filename: file.filename,
          original_name: file.originalname,
          mime: file.mimetype,
          size: file.size,
          url: uploadResponse.url, // ImageKit hosted URL
          imagekit_file_id: uploadResponse.fileId
        })
        .returning();


      uploadedRecords.push(record);

      // Remove temp file
      fs.unlinkSync(file.path);
      } catch (error) {
        console.log(`Error processing file ${file.originalname}`)
      }

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

// Get All file
router.get("/", authMiddleware, async (req, res) => {
  const userFiles = await db.select()
    .from(files)
    .where(eq(files.user_id, req.user.id));

  res.json({ files: userFiles });
});


// Download file 
router.get("/:id/", authMiddleware, async (req, res) => {
  const id = Number(req.params.id);

  try {
    const result = await db.select()
      .from(files)
      .where(eq(files.id, id))

    const file = result[0];

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    if (file.user_id !== req.user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    // Fetch file from ImageKit or remote URL
    const response = await axios.get(file.url, { responseType: "arraybuffer" });

    // Set headers for download
    res.setHeader("Content-Type", file.mime);
    res.setHeader("Content-Disposition", `attachment; filename="${file.original_name}"`);

    // Send file buffer
    return res.send(response.data);

    // return res.redirect(file.url);
  } catch (err) {
    console.error("Download error:", err);
    return res.status(500).json({ message: "Error downloading file" });
  }
});


// delete file
router.delete("/:id", authMiddleware, async (req, res) => {

  const id = Number(req.params.id)

  try {

    // Fetch file from DB
    const result = await db.select()
      .from(files)
      .where(eq(files.id, id))

    const file = result[0]

    if (!file) {
      return res
        .status(404)
        .json({ message: "File not found" })
    }

    // Check if the file belongs to the current user
    if (file.user_id !== req.user.id) {
      return res
        .status(403)
        .json({ message: "File is not for you" })
    }

    // Delete from ImageKit
    try {
      if (file.imagekit_file_id) {
        await imagekit.deleteFile(file.imagekit_file_id)
      }
    } catch (error) {
      console.error("Error while deleting imagekit file:", error);
    }

    // Delete from DB
    await db
      .delete(files)
      .where(eq(files.id, id))


    return res.json({
      message: "File delete successfully from db"
    })


  } catch (error) {
    console.error("Delete error:", error);
    return res.status(500).json({ message: "Error deleting file" });
  }

})


export default router;
