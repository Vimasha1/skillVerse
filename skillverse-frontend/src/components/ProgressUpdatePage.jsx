// src/components/ProgressUpdatePage.jsx

import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ProgressUpdatePage = () => {
  const navigate = useNavigate();

  // grab user profile from session (set during login)
  const storedProfile = sessionStorage.getItem("userProfile");
  const userProfile = storedProfile ? JSON.parse(storedProfile) : null;
  const userId = userProfile?.id;

  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [customUpdate, setCustomUpdate] = useState("");
  const [updateType, setUpdateType] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");  // "success" or "error"

  useEffect(() => {
    if (!userId) {
      // not logged in → send to login
      navigate("/login");
      return;
    }

    // Fetch the progress templates
    axios
      .get("http://localhost:8081/api/progress-templates")
      .then((res) => setTemplates(res.data))
      .catch((err) => {
        console.error("Error fetching templates:", err);
        setMessage("Failed to load templates.");
        setMessageType("error");
      });
  }, [userId, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // pick whichever text user provided
    const updateText = customUpdate.trim() || selectedTemplate;
    if (!updateText) {
      setMessage("Please choose or type an update.");
      setMessageType("error");
      return;
    }
    if (!updateType) {
      setMessage("Please select an update type.");
      setMessageType("error");
      return;
    }

    const payload = {
      userId,
      updateText,
      updateType,
    };

    try {
      await axios.post(
        "http://localhost:8081/api/progress-updates",
        payload
      );
      setMessage("Progress update added successfully!");
      setMessageType("success");
      // redirect back to profile after 2s
      setTimeout(() => navigate(`/user-profiles/${userId}`), 2000);
    } catch (err) {
      console.error("Error submitting progress update:", err);
      setMessage("There was an error. Please try again.");
      setMessageType("error");
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-xl mt-10 mb-10">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
        Add Your Progress Update
      </h2>

      {message && (
        <div
          className={`p-4 mb-4 text-white rounded-md ${
            messageType === "success" ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Template Picker */}
        <section className="space-y-2">
          <h3 className="text-2xl font-semibold text-gray-700">
            Choose a Template
          </h3>
          <select
            value={selectedTemplate}
            onChange={(e) => setSelectedTemplate(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">-- Select Template --</option>
            {templates.map((tpl) => (
              <option key={tpl.id} value={tpl.templateText}>
                {tpl.templateText}
              </option>
            ))}
          </select>
        </section>

        {/* Custom Update */}
        <section className="space-y-2">
          <h3 className="text-2xl font-semibold text-gray-700">
            Or Write Your Own
          </h3>
          <textarea
            rows={4}
            value={customUpdate}
            onChange={(e) => setCustomUpdate(e.target.value)}
            placeholder="Type a custom progress update…"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </section>

        {/* Update Type */}
        <section className="space-y-2">
          <h3 className="text-2xl font-semibold text-gray-700">
            Update Type
          </h3>
          <select
            value={updateType}
            onChange={(e) => setUpdateType(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">-- Select Type --</option>
            <option value="Achievement">Achievement</option>
            <option value="Goal">Goal</option>
            <option value="Milestone">Milestone</option>
          </select>
        </section>

        <button
          type="submit"
          className="w-full py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Submit Progress Update
        </button>
      </form>
    </div>
  );
};

export default ProgressUpdatePage;
