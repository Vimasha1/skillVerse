// src/components/ProgressUpdatePage.jsx

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ProgressUpdatePage = () => {
  const navigate = useNavigate();

  // pull current user from session (set on login)
  const stored = sessionStorage.getItem("userProfile");
  const userProfile = stored ? JSON.parse(stored) : null;
  const userId = userProfile?.id;

  const [templates, setTemplates] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState("");
  const [showTemplates, setShowTemplates] = useState(false);
  const [customUpdate, setCustomUpdate] = useState("");
  const [updateType, setUpdateType] = useState("");
  const [fieldValues, setFieldValues] = useState({});  // dynamic fields
  const [message, setMessage] = useState("");

  // Update types
  const updateTypes = [
    { value: "Achievement", label: "🎉 Achievement" },
    { value: "Goal",        label: "🎯 Goal" },
    { value: "Milestone",   label: "🏆 Milestone" },
  ];

  useEffect(() => {
    if (!userId) {
      navigate("/login");
      return;
    }
    // fetch progress templates
    axios.get("http://localhost:8081/api/progress-templates")
      .then(res => setTemplates(res.data))
      .catch(err => {
        console.error("Error loading templates", err);
        setMessage("Failed to load templates.");
      });
    // fetch template categories (with fields metadata)
    axios.get("http://localhost:8081/api/template-categories")
      .then(res => setCategories(res.data))
      .catch(err => {
        console.error("Error loading categories", err);
        setMessage("Failed to load categories.");
      });
  }, [userId, navigate]);

  const handleTemplateChange = (tplId) => {
    setSelectedTemplateId(tplId);
    setCustomUpdate("");
    setFieldValues({});
  };

  const handleFieldChange = (key, value) => {
    setFieldValues(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const template = templates.find(t => t.id === selectedTemplateId);
    const updateText = template
      ? template.templateText
      : customUpdate.trim();

    if (!updateText) {
      setMessage("Please choose a template or write your own update.");
      return;
    }
    if (!updateType) {
      setMessage("Please select an update type.");
      return;
    }

    const payload = {
      userId,
      updateText,
      updateType,
      details: selectedTemplateId ? fieldValues : {},
    };

    try {
      await axios.post("http://localhost:8081/api/progress-updates", payload);
      setMessage("Progress update added!");
      setTimeout(() => navigate(`/user-profiles/${userId}`), 1500);
    } catch (err) {
      console.error("Submit error", err);
      setMessage("Error submitting—please try again.");
    }
  };

  // Lookup the selected template & category
  const selectedTemplate = templates.find(t => t.id === selectedTemplateId);
  const category = categories.find(c => c.id === selectedTemplate?.categoryId);

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white rounded-xl shadow-lg mt-12">
      <h1 className="text-2xl font-bold text-center text-indigo-600 mb-6">
        Share Your Progress
      </h1>

      {message && (
        <div className="mb-4 p-3 text-center text-sm font-medium text-white bg-red-500 rounded">
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* 0) Button to reveal template picker */}
        {!showTemplates && (
          <div className="text-center">
            <button
              type="button"
              onClick={() => setShowTemplates(true)}
              className="px-6 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 transition"
            >
              Use Template
            </button>
          </div>
        )}

        {/* 1) Template selector as cards */}
        {showTemplates && (
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Pick a Template
            </label>
            {/* Scroll container */}
            <div className="max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {templates.map((tpl) => {
                  const cat = categories.find(c => c.id === tpl.categoryId) || {};
                  const isSelected = tpl.id === selectedTemplateId;
                  return (
                    <div
                      key={tpl.id}
                      onClick={() => handleTemplateChange(tpl.id)}
                      className={`
                        p-4 border rounded-lg cursor-pointer
                        hover:shadow-lg transition
                        ${isSelected
                          ? "border-indigo-600 bg-indigo-50"
                          : "border-gray-200 bg-white"
                        }
                      `}
                    >
                      <div className="flex items-center mb-2">
                        <span className="text-2xl mr-2">{cat.icon}</span>
                        <h4 className="font-semibold">{cat.name}</h4>
                      </div>
                      <p className="text-gray-700 text-sm">{tpl.templateText}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* 2) Dynamic fields from category */}
        {category && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-700">
              {category.icon} {category.name} Details
            </h3>
            {category.fields.map((field) => (
              <div key={field.key}>
                <label className="block text-gray-700 mb-1">
                  {field.label}
                </label>
                <input
                  name={field.key}
                  type={field.type || "text"}
                  value={fieldValues[field.key] || ""}
                  onChange={e => handleFieldChange(field.key, e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  placeholder={field.placeholder || ""}
                  required={field.required}
                />
              </div>
            ))}
          </div>
        )}

        {/* 3) Custom update textarea (only if no template) */}
        {!selectedTemplate && (
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Or Write Your Own
            </label>
            <textarea
              rows={4}
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="Type your update…"
              value={customUpdate}
              onChange={e => setCustomUpdate(e.target.value)}
            />
          </div>
        )}

        {/* 4) Update type */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Update Type
          </label>
          <select
            value={updateType}
            onChange={e => setUpdateType(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            <option value="">— select type —</option>
            {updateTypes.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        {/* 5) Submit */}
        <button
          type="submit"
          className="w-full py-3 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
        >
          Submit Progress
        </button>
      </form>
    </div>
  );
};

export default ProgressUpdatePage;
