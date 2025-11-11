import React, { useState, useEffect } from "react";
import axios from "axios";

const FileUpload = ({ onUpload }) => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [progress, setProgress] = useState(0);

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
    setMessage("");
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      setMessage("⚠️ Please select at least one file");
      return;
    }

    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));

    setUploading(true);
    setProgress(0);
    setMessage("");

    try {
      const token = localStorage.getItem("token");

      const res = await axios.post("/api/files/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
        onUploadProgress: (event) => {
          const percent = Math.round((event.loaded * 100) / event.total);
          setProgress(percent);
        },
      });

      setMessage("✅ Files uploaded successfully!");
      setFiles([]);
      if (onUpload) onUpload();
    } catch (err) {
      console.error("Upload error:", err);
      setMessage("❌ Upload failed! Try again later.");
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  // Auto-clear message after 3 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <div className="space-y-4">
      {/* File input */}
      <input
        type="file"
        multiple
        onChange={handleFileChange}
        className="file-input file-input-bordered w-full"
      />

      {/* Selected files list */}
      {files.length > 0 && (
        <div className="bg-base-200 p-3 rounded-lg max-h-32 overflow-auto">
          <h3 className="text-sm font-semibold mb-2">Selected Files:</h3>
          <ul className="list-disc list-inside text-sm text-base-content/80">
            {files.map((file, i) => (
              <li key={i}>{file.name}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Upload progress */}
      {uploading && (
        <div>
          <progress
            className="progress progress-primary w-full"
            value={progress}
            max="100"
          ></progress>
          <p className="text-center text-sm mt-1">{progress}% uploaded</p>
        </div>
      )}

      {/* Upload button */}
      <button
        onClick={handleUpload}
        disabled={uploading}
        className={`btn w-full ${uploading ? "btn-disabled" : "btn-primary"}`}
      >
        {uploading ? "Uploading..." : "Upload Files"}
      </button>

      {/* Message alert */}
      {message && (
        <div
          className={`alert mt-2 ${message.startsWith("✅")
              ? "alert-success"
              : message.startsWith("❌")
                ? "alert-error"
                : "alert-warning"
            }`}
        >
          <span>{message}</span>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
