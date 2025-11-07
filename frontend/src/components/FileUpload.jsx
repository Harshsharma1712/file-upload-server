import React, { useState } from "react";
import axios from "axios";

const FileUpload = ({onUpload}) => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  
  // handle file selection
  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files)); // store multiple files
  };

  // handle upload
  const handleUpload = async () => {
    if (files.length === 0) {
      alert("Please select at least one file");
      return;
    }

    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));

    setUploading(true);
    setMessage("");

    try {
      const token = localStorage.getItem("token"); // if using JWT
      const res = await axios.post("/api/files/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`, // if authMiddleware is active
        },
      });

      console.log("Upload response:", res.data);
      setMessage("✅ Files uploaded successfully!");
      setFiles([]);

       if (onUpload) onUpload();


    } catch (err) {
      console.error("Upload error:", err);
      setMessage("❌ Upload failed! Check console for details.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ padding: 20, border: "1px solid #ccc", borderRadius: 10, width: 400 }}>
      <h3>Upload Multiple Files</h3>

      <input
        type="file"
        multiple
        onChange={handleFileChange}
        style={{ marginBottom: 10 }}
      />

      {files.length > 0 && (
        <ul>
          {files.map((file, i) => (
            <li key={i}>{file.name}</li>
          ))}
        </ul>
      )}

      <button onClick={handleUpload} disabled={uploading}>
        {uploading ? "Uploading..." : "Upload"}
      </button>

      {message && <p>{message}</p>}
    </div>
  );
};

export default FileUpload;
