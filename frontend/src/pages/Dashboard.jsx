import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import FileUpload from "../components/FileUpload.jsx";
import axios from "axios";

export default function Dashboard() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const navigate = useNavigate();
  const modalRef = useRef(null); // <-- useRef for modal

  // Fetch uploaded files
  const fetchFiles = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("/api/files", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFiles(res.data.files || []);
    } catch (err) {
      console.error("Error fetching files:", err);
      setFiles([]);
    } finally {
      setLoading(false);
    }
  };

  // File download
  const handleDownload = async (url, filename) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  // Open modal for delete confirmation
  const confirmDelete = (id) => {
    setDeleteId(id);
    modalRef.current?.showModal(); // open DaisyUI modal
  };

  // Handle delete file
  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/api/files/${deleteId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setFiles((prev) => prev.filter((file) => file.id !== deleteId));
      setAlertType("success");
      setAlertMessage("File deleted successfully!");
    } catch (error) {
      console.error("Error deleting file:", error);
      setAlertType("error");
      setAlertMessage("Failed to delete file. Please try again.");
    } finally {
      setDeleteId(null);
      modalRef.current?.close(); // close modal after action
      setTimeout(() => {
        setAlertMessage("");
        setAlertType("");
      }, 3000);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  return (
    <div className="min-h-screen bg-base-200 p-6">
      {/* Navbar */}
      <div className="navbar bg-base-100 shadow-md rounded-xl mb-6">
        <div className="flex-1">
          <h1 className="text-xl md:text-2xl font-bold text-primary">
            📂 File Uploader Dashboard
          </h1>
        </div>
        <div className="flex-none">
          <button onClick={logout} className="btn btn-error btn-sm md:btn-md">
            Logout
          </button>
        </div>
      </div>

      {/* Alert Section */}
      {alertMessage && (
        <div
          className={`alert mb-6 shadow-lg ${
            alertType === "error"
              ? "alert-error"
              : alertType === "success"
              ? "alert-success"
              : "alert-info"
          }`}
        >
          <span>{alertMessage}</span>
        </div>
      )}

      {/* Upload Card */}
      <div className="card bg-base-100 shadow-xl mb-8">
        <div className="card-body">
          <h2 className="text-lg font-semibold mb-2 text-center md:text-left">
            Upload New Files
          </h2>
          <FileUpload onUpload={fetchFiles} />
        </div>
      </div>

      {/* Files List */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="text-lg font-semibold mb-4 text-center md:text-left">
            Your Uploaded Files
          </h2>

          {loading ? (
            <div className="flex justify-center items-center">
              <span className="loading loading-spinner text-primary"></span>
              <p className="ml-2">Loading your files...</p>
            </div>
          ) : files.length === 0 ? (
            <div className="alert alert-info">
              <span>No files uploaded yet. Try uploading some!</span>
            </div>
          ) : (
            <ul className="space-y-3">
              {files.map((f) => (
                <li
                  key={f.id}
                  className="flex justify-between items-center bg-base-200 p-3 rounded-lg hover:shadow-md transition"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{f.original_name}</span>
                  </div>
                  <div className="space-x-2">
                    <button
                      onClick={() => handleDownload(f.url, f.original_name)}
                      className="btn btn-sm btn-outline btn-primary"
                    >
                      Download
                    </button>
                    <button
                      onClick={() => confirmDelete(f.id)}
                      className="btn btn-sm btn-outline btn-error"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* DaisyUI Confirm Delete Modal */}
      <dialog ref={modalRef} id="confirm_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg text-error">Confirm Deletion</h3>
          <p className="py-4">
            Are you sure you want to delete this file? This action cannot be
            undone.
          </p>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn">Cancel</button>
            </form>
            <button onClick={handleDelete} className="btn btn-error">
              Delete
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
}
