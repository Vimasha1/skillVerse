// src/components/EditPostForm.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

export default function EditPostForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const BASE = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8081';

  const [form, setForm] = useState({
    userId: '',
    skillName: '',
    description: '',
  });
  const [existingMedia, setExistingMedia] = useState([]);  // URLs already on server
  const [newFiles, setNewFiles] = useState([]);            // freshly picked File objects
  const [uploadProgress, setUploadProgress] = useState(null);
  const [message, setMessage] = useState('');

  // 1️⃣ Ensure user is logged in and set userId
  useEffect(() => {
    const stored = sessionStorage.getItem('userProfile');
    if (!stored) {
      navigate('/login');
      return;
    }
    const me = JSON.parse(stored);
    setForm(f => ({ ...f, userId: me.username }));
  }, [navigate]);

  // 2️⃣ Load existing post data
  useEffect(() => {
    axios
      .get(`${BASE}/api/posts/${id}`, { withCredentials: true })
      .then(res => {
        const p = res.data;
        setForm({
          userId: p.userId,
          skillName: p.skillName,
          description: p.description,
        });
        setExistingMedia(p.mediaUrls || []);
      })
      .catch(() => {
        alert('Failed to load post for editing.');
        navigate('/');
      });
  }, [BASE, id, navigate]);

  // 3️⃣ Field changes
  const handleChange = e =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  // 4️⃣ Remove one of the already‐uploaded URLs
  const removeExisting = url =>
    setExistingMedia(m => m.filter(u => u !== url));

  // 5️⃣ Pick new files (up to 3 total)
  const handleFileChange = e => {
    const picked = Array.from(e.target.files);
    // allow at most 3 minus how many existing you kept
    const slots = Math.max(0, 3 - existingMedia.length);
    setNewFiles(picked.slice(0, slots));
  };

  // 6️⃣ Submit update
  const handleSubmit = e => {
    e.preventDefault();
    setMessage('');

    // if we added any new files → multipart PUT
    const useMultipart = newFiles.length > 0;

    if (useMultipart) {
      const fd = new FormData();
      // embed JSON payload including kept mediaUrls
      const payload = {
        userId: form.userId,
        skillName: form.skillName,
        description: form.description,
        mediaUrls: existingMedia,
      };
      fd.append(
        'post',
        new Blob([JSON.stringify(payload)], { type: 'application/json' })
      );
      newFiles.forEach(f => fd.append('files', f));

      // use XHR to track uploadProgress
      const xhr = new XMLHttpRequest();
      xhr.open('PUT', `${BASE}/api/posts/${id}`, true);
      xhr.setRequestHeader(
        'Authorization',
        `Bearer ${sessionStorage.getItem('authToken')}`
      );
      xhr.upload.onprogress = ev => {
        if (ev.lengthComputable) {
          setUploadProgress(Math.round((ev.loaded / ev.total) * 100));
        }
      };
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          // ← redirect back to home after successful edit
          navigate('/');
        } else {
          console.error(xhr.statusText);
          setMessage('Upload failed.');
        }
      };
      xhr.onerror = () => setMessage('Network error.');
      xhr.send(fd);
    } else {
      // JSON-only PUT
      axios
        .put(
          `${BASE}/api/posts/${id}`,
          {
            skillName: form.skillName,
            description: form.description,
            mediaUrls: existingMedia, // server will replace with these
          },
          {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem(
                'authToken'
              )}`,
              'Content-Type': 'application/json',
            },
            withCredentials: true,
          }
        )
        .then(() => {
          // ← redirect back to home after successful edit
          navigate('/');
        })
        .catch(err => {
          console.error(err);
          setMessage('Update failed.');
        });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Edit Post</h2>

      {message && <div className="mb-4 text-red-600">{message}</div>}

      {/* Username (read-only) */}
      <div className="mb-4">
        <label className="block font-medium">Username</label>
        <input
          type="text"
          name="userId"
          value={form.userId}
          disabled
          className="w-full border px-3 py-2 rounded bg-gray-100"
        />
      </div>

      {/* Skill Name */}
      <div className="mb-4">
        <label className="block font-medium">Skill Name</label>
        <input
          type="text"
          name="skillName"
          value={form.skillName}
          onChange={handleChange}
          required
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      {/* Description */}
      <div className="mb-4">
        <label className="block font-medium">Description</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          required
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      {/* Existing Media */}
      {existingMedia.length > 0 && (
        <div className="mb-4">
          <label className="block font-medium mb-2">Existing Media</label>
          <div className="grid grid-cols-3 gap-2">
            {existingMedia.map(url => (
              <div key={url} className="relative">
                {url.endsWith('.mp4') ? (
                  <video src={`${BASE}${url}`} controls className="w-full h-24 rounded" />
                ) : (
                  <img src={`${BASE}${url}`} alt="" className="w-full h-24 rounded object-cover" />
                )}
                <button
                  type="button"
                  onClick={() => removeExisting(url)}
                  className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add New Media (only up to 3 total) */}
      <div className="mb-4">
        <label className="block font-medium">Add / Replace Media (max 3)</label>
        <input
          type="file"
          multiple
          accept="image/*,video/*"
          onChange={handleFileChange}
          className="mt-2"
        />
        <p className="text-xs text-gray-500">
          {existingMedia.length + newFiles.length} / 3 selected
        </p>
      </div>

      {/* Upload Progress */}
      {uploadProgress != null && (
        <div className="mb-4">
          <div className="w-full h-2 bg-gray-200 rounded">
            <div className="h-2 bg-green-500 rounded" style={{ width: `${uploadProgress}%` }} />
          </div>
          <p className="text-sm text-gray-600">{uploadProgress}% uploaded</p>
        </div>
      )}

      <button type="submit" className="w-full py-2 bg-blue-600 text-white rounded hover:opacity-90">
        Update Post
      </button>
    </form>
  );
}
