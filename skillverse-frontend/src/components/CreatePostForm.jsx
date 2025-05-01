import React, { useState } from "react";

const CreatePostForm = ({ onPostCreated }) => {
  const [form, setForm] = useState({
    userId: "",
    skillName: "",
    description: "",
    mediaUrls: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...form,
      mediaUrls: form.mediaUrls.split(",").map((url) => url.trim()),
    };

    const res = await fetch("http://localhost:8081/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    // ✅ Safely call if it exists
    if (typeof onPostCreated === "function") {
      onPostCreated(data);
    }

    // Optionally reset form
    setForm({
      userId: "",
      skillName: "",
      description: "",
      mediaUrls: "",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 shadow mb-6 rounded">
      <h2 className="text-lg font-semibold mb-2">Share a Skill</h2>
      <input
        type="text"
        placeholder="User ID"
        className="w-full border p-2 mb-2 rounded"
        value={form.userId}
        onChange={(e) => setForm({ ...form, userId: e.target.value })}
        required
      />
      <input
        type="text"
        placeholder="Skill Name"
        className="w-full border p-2 mb-2 rounded"
        value={form.skillName}
        onChange={(e) => setForm({ ...form, skillName: e.target.value })}
        required
      />
      <textarea
        placeholder="Description"
        className="w-full border p-2 mb-2 rounded"
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
        required
      />
      <input
        type="text"
        placeholder="Media URLs (comma-separated)"
        className="w-full border p-2 mb-2 rounded"
        value={form.mediaUrls}
        onChange={(e) => setForm({ ...form, mediaUrls: e.target.value })}
      />
      <button className="bg-green-600 text-white px-4 py-2 rounded">Post</button>
    </form>
  );
};

export default CreatePostForm;
