// src/components/ProgressUpdatePage.jsx

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ProgressUpdatePage = () => {
  const navigate = useNavigate();
  const stored = sessionStorage.getItem("userProfile");
  const userProfile = stored ? JSON.parse(stored) : null;
  const userId = userProfile?.id;

  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [fieldValues, setFieldValues] = useState({});
  const [category, setCategory] = useState("");
  const [progressDate, setProgressDate] = useState("");
  const [freeText, setFreeText] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!userId) return navigate("/login");
    axios
      .get("http://localhost:8081/api/progress-templates")
      .then((res) => setTemplates(res.data))
      .catch(() => setMessage("Error loading templates."));
  }, [userId, navigate]);

  const handleTemplateSelect = (tpl) => {
    setSelectedTemplate(tpl);
    setFieldValues({});
    setFreeText("");
    setCategory(tpl.category);
  };

  const handleFieldChange = (key, value) => {
    setFieldValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!progressDate) return setMessage("Please select a date.");
    if (!category) return setMessage("Please select a category.");

    const payload = {
      userId,
      templateId: selectedTemplate?.id || null,
      category,
      progressDate: progressDate + "T00:00:00",
      templateText: selectedTemplate?.templateText || null,
      extraFields: selectedTemplate ? fieldValues : {},
      freeText: selectedTemplate ? null : freeText,
    };

    try {
      await axios.post("http://localhost:8081/api/progress-updates/create", payload);
      setMessage("Progress update saved!");
      setTimeout(() => navigate(`/user-profiles/${userId}`), 1200);
    } catch (err) {
      console.error(err);
      setMessage("Failed to submit progress update.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white rounded-xl shadow-lg mt-12">
      <h1 className="text-2xl font-bold text-center text-indigo-600 mb-6">
        Share Progress Update
      </h1>

      {message && (
        <div className="mb-4 p-3 text-center text-sm font-medium text-white bg-red-500 rounded">
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Template Selector */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">Choose a Template</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {templates.map((tpl) => (
              <div
                key={tpl.id}
                className={`p-4 border rounded-lg cursor-pointer hover:shadow-lg transition ${
                  selectedTemplate?.id === tpl.id
                    ? "border-indigo-600 bg-indigo-50"
                    : "border-gray-200 bg-white"
                }`}
                onClick={() => handleTemplateSelect(tpl)}
              >
                <h4 className="font-semibold">{tpl.category}</h4>
                <p className="text-sm text-gray-600">{tpl.templateText}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Dynamic Fields */}
        {selectedTemplate && selectedTemplate.fields.map((field) => (
          <div key={field.name}>
            <label className="block text-gray-700 mb-1">{field.label}</label>
            <input
              type={field.type}
              value={fieldValues[field.name] || ""}
              onChange={(e) => handleFieldChange(field.name, e.target.value)}
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
              required
            />
          </div>
        ))}

        {/* Free text input if no template */}
        {!selectedTemplate && (
          <div>
            <label className="block text-gray-700 font-medium mb-2">Write Your Update</label>
            <textarea
              rows={4}
              value={freeText}
              onChange={(e) => setFreeText(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="Type your progress update..."
              required
            />
          </div>
        )}

        {/* Progress Date */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">Date Completed</label>
          <input
            type="date"
            value={progressDate}
            onChange={(e) => setProgressDate(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
            required
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-3 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default ProgressUpdatePage;