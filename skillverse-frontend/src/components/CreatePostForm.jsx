import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const CreatePostForm = ({ onPostCreated }) => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    userId: "",
    skillName: "",
    description: "",
  });

  const [mediaFiles, setMediaFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [user, setUser] = useState(null);

  // ✅ Check for user and redirect if not logged in
  useEffect(() => {
    const storedUser = JSON.parse(sessionStorage.getItem('userProfile'));
    if (storedUser?.username) {
      setUser(storedUser);
      setForm(f => ({ ...f, userId: storedUser.username }));
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append(
      "post",
      new Blob([JSON.stringify(form)], { type: "application/json" })
    );
    mediaFiles.slice(0, 3).forEach(file => {
      formData.append("files", file);
    });

    const token = sessionStorage.getItem('authToken');

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "http://localhost:8081/api/posts", true);
    xhr.setRequestHeader("Authorization", `Bearer ${token}`);

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) {
        const percent = Math.round((e.loaded / e.total) * 100);
        setUploadProgress(percent);
      }
    };

    xhr.onload = () => {
      if (xhr.status === 200) {
        const data = JSON.parse(xhr.responseText);
        onPostCreated?.(data);
        setForm(f => ({
          userId: f.userId,
          skillName: "",
          description: "",
        }));
        setMediaFiles([]);
        setUploadProgress(null);
        setSuccessMessage("Post added successfully!");
        setTimeout(() => navigate("/"), 2000);
      } else {
        console.error("Upload failed:", xhr.statusText);
        setUploadProgress(null);
      }
    };

    xhr.onerror = () => {
      console.error("Upload error");
      setUploadProgress(null);
    };

    xhr.send(formData);
  };

  // ✅ Don't render form until user is confirmed
  if (!user) return null;

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 shadow mb-6 rounded">
      <h2 className="text-lg font-semibold mb-2">Share a Skill</h2>

      {successMessage && (
        <div className="text-green-600 font-medium mb-4">{successMessage}</div>
      )}

      <input
        type="text"
        placeholder="Username"
        className="w-full border p-2 mb-2 rounded bg-gray-100"
        value={form.userId}
        disabled
      />

      <input
        type="text"
        placeholder="Skill Name"
        className="w-full border p-2 mb-2 rounded"
        value={form.skillName}
        onChange={e => setForm({ ...form, skillName: e.target.value })}
        required
      />

      <textarea
        placeholder="Description"
        className="w-full border p-2 mb-2 rounded"
        value={form.description}
        onChange={e => setForm({ ...form, description: e.target.value })}
        required
      />

      <input
        type="file"
        multiple
        accept="image/*,video/*"
        className="w-full border p-2 mb-4 rounded"
        onChange={e => setMediaFiles(Array.from(e.target.files))}
      />
      <p className="text-xs text-gray-500 mb-2">
        You may upload up to 3 media files.
      </p>

      {uploadProgress !== null && (
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
          <div
            className="bg-green-500 h-2.5 rounded-full transition-all"
            style={{ width: `${uploadProgress}%` }}
          ></div>
          <p className="text-sm text-gray-600 mt-1">{uploadProgress}% uploaded</p>
        </div>
      )}

      <button className="bg-green-600 text-white px-4 py-2 rounded">
        Post
      </button>
    </form>
  );
};

export default CreatePostForm;
