import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../utils/api";
import FileUpload from "../components/FileUpload.jsx";

export default function Dashboard() {
  const [files, setFiles] = useState([]);
  const navigate = useNavigate();

  const fetchFiles = async () => {
    try {
      const res = await api.get("/files");
      // res.data.files is your actual array
      setFiles(res.data.files || []);
    } catch (err) {
      console.error("Error fetching files:", err);
      setFiles([]);
    }
  };

  const handleDownload = async (url, filename) => {
    try {
      const resposne = await fetch(url)
      const blob = await resposne.blob()
      const link = document.createElement("a")
      link.href = window.URL.createObjectURL(blob)
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this file?")) return;

    try {
      const token = localStorage.getItem("token")
      await api.delete(`/files/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      })
      // Remove the deleted file from UI without refreshing
      setFiles((prev) => prev.filter((file) => file.id !== id));
    } catch (error) {
      console.error("Error deleting file:", err);
      alert("Failed to delete file. Check console for details.");
    }

  }

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  useEffect(() => { fetchFiles(); }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">File Uploader</h1>
        <button onClick={logout} className="bg-red-500 text-white px-4 py-2 rounded">Logout</button>
      </div>

      <FileUpload onUpload={fetchFiles} />

      <h2 className="text-xl font-semibold mt-6 mb-2">Your Files</h2>
      <ul className="space-y-2">
        {files.map((f) => (
          <li key={f.id} className="bg-white p-3 rounded shadow flex justify-between items-center">
            <span>{f.original_name}</span>
            <div className="space-x-3">
              <button
                onClick={() => handleDownload(f.url, f.original_name)}
                className="text-blue-600 underline"
              >
                Download
              </button>
              <button
                onClick={() => handleDelete(f.id)}
                className="text-red-500 underline"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
