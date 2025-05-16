// src/components/PostForm.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

export default function PostForm() {
  const { id } = useParams();
  const editMode = Boolean(id);
  const navigate = useNavigate();
  const BASE = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8081';

  const [user, setUser] = useState(null);
  const [form, setForm] = useState({
    userId: '',
    skillName: '',
    description: '',
  });
  const [mediaFiles, setMediaFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(null);
  const [message, setMessage] = useState('');

  // 1) ensure logged in
  useEffect(() => {
    const stored = sessionStorage.getItem('userProfile');
    if (!stored) {
      navigate('/login');
      return;
    }
    const me = JSON.parse(stored);
    setUser(me);
    setForm(f => ({ ...f, userId: me.username }));
  }, [navigate]);

  // 2) if editing, load existing post
  useEffect(() => {
    if (!editMode) return;
    axios
      .get(`${BASE}/api/posts/${id}`)
      .then(res => {
        const p = res.data;
        setForm({
          userId: p.userId,
          skillName: p.skillName,
          description: p.description,
        });
      })
      .catch(() => {
        alert('Failed to load post for editing.');
        navigate('/');
      });
  }, [editMode, id, navigate, BASE]);

  // 3) handle field changes
  const handleChange = e =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  // 4) submit
  const handleSubmit = async e => {
    e.preventDefault();
    setMessage('');

    if (editMode) {
      // JSON-only PUT
      try {
        await axios.put(
          `${BASE}/api/posts/${id}`,
          {
            skillName: form.skillName,
            description: form.description,
            // existing mediaUrls left untouched server-side
          },
          {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem('authToken')}`,
              'Content-Type': 'application/json',
            },
          }
        );
        // always redirect to home
        navigate('/');
      } catch (err) {
        console.error(err);
        setMessage('Failed to update post.');
      }
    } else {
      // POST multipart
      const fd = new FormData();
      fd.append(
        'post',
        new Blob([JSON.stringify(form)], {
          type: 'application/json',
        })
      );
      mediaFiles.slice(0, 3).forEach(f => fd.append('files', f));

      const xhr = new XMLHttpRequest();
      xhr.open('POST', `${BASE}/api/posts`, true);
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
          // created successfully → always go home
          navigate('/');
        } else {
          console.error(xhr.statusText);
          setMessage('Upload failed.');
        }
      };
      xhr.onerror = () => setMessage('Upload error.');
      xhr.send(fd);
    }
  };

  if (!user) return null;

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-lg mx-auto bg-white p-6 rounded shadow"
    >
      <h2 className="text-2xl font-bold mb-4">
        {editMode ? 'Edit Post' : 'Create New Post'}
      </h2>

      {message && <div className="mb-4 text-red-600">{message}</div>}

      {/* userId (read only) */}
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

      {/* skillName */}
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

      {/* description */}
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

      {/* only on create: file input */}
      {!editMode && (
        <div className="mb-4">
          <label className="block font-medium">
            Upload up to 3 images/videos
          </label>
          <input
            type="file"
            multiple
            accept="image/*,video/*"
            onChange={e => setMediaFiles(Array.from(e.target.files))}
            className="mt-2"
          />
        </div>
      )}

      {/* upload progress */}
      {!editMode && uploadProgress != null && (
        <div className="mb-4">
          <div className="w-full h-2 bg-gray-200 rounded">
            <div
              className="h-2 bg-green-500 rounded"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
          <p className="text-sm text-gray-600">{uploadProgress}% uploaded</p>
        </div>
      )}

      <button
        type="submit"
        className={`w-full py-2 rounded text-white ${
          editMode ? 'bg-blue-600' : 'bg-green-600'
        } hover:opacity-90`}
      >
        {editMode ? 'Update Post' : 'Publish Post'}
      </button>
    </form>
  );
}
