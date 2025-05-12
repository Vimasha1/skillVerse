// src/components/EditProgressUpdateForm.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const EditProgressUpdateForm = () => {
  const { id } = useParams(); // progress update ID
  const navigate = useNavigate();

  const stored = sessionStorage.getItem('userProfile');
  const userProfile = stored ? JSON.parse(stored) : null;
  const userId = userProfile?.id;

  const [update, setUpdate] = useState(null);
  const [template, setTemplate] = useState(null);
  const [fieldValues, setFieldValues] = useState({});
  const [freeText, setFreeText] = useState('');
  const [progressDate, setProgressDate] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!userId) {
      navigate('/login');
      return;
    }

    // Load update
    axios.get(`http://localhost:8081/api/progress-updates/${id}`)
      .then(res => {
        const upd = res.data;
        setUpdate(upd);
        setFieldValues(upd.extraFields || {});
        setFreeText(upd.freeText || '');
        setProgressDate(upd.progressDate?.substring(0, 10) || '');
        if (upd.templateId) {
          axios.get(`http://localhost:8081/api/progress-templates/${upd.templateId}`)
            .then(res => setTemplate(res.data))
            .catch(() => setMessage('Failed to load template'));
        }
      })
      .catch(() => setMessage('Failed to load progress update.'));
  }, [id, navigate, userId]);

  const handleFieldChange = (key, value) => {
    setFieldValues(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();

    const payload = {
      userId,
      templateId: update?.templateId || null,
      category: update?.category,
      progressDate: progressDate + 'T00:00:00',
      templateText: update?.templateText || null,
      freeText: template ? null : freeText,
      extraFields: template ? fieldValues : {},
    };

    try {
      await axios.put(`http://localhost:8081/api/progress-updates/update/${id}`, payload);
      setMessage('Progress update updated!');
      setTimeout(() => navigate(`/user-profiles/${userId}`), 1500);
    } catch {
      setMessage('Error updating progress update.');
    }
  };

  if (!update) return null;

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white rounded-xl shadow-lg mt-12">
      <h1 className="text-2xl font-bold text-center text-indigo-600 mb-6">
        Edit Progress Update
      </h1>

      {message && (
        <div className="mb-4 p-3 text-center text-sm font-medium text-white bg-red-500 rounded">
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Display category (non-editable) */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">Update Category</label>
          <input
            value={update.category}
            disabled
            className="w-full p-3 bg-gray-100 border border-gray-300 rounded text-gray-600"
          />
        </div>

        {/* Display template text if using a template */}
        {template && (
          <div>
            <label className="block text-gray-700 font-medium mb-2">Template Used</label>
            <textarea
              value={template.templateText}
              readOnly
              className="w-full p-3 bg-gray-100 border border-gray-300 rounded text-gray-600"
              rows={3}
            />
          </div>
        )}

        {/* Dynamic fields if template is used */}
        {template && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700">
              Fill Template Fields
            </h3>
            {template.fields.map(field => (
              <div key={field.name}>
                <label className="block text-gray-700 mb-1">{field.label}</label>
                <input
                  type={field.type || 'text'}
                  value={fieldValues[field.name] || ''}
                  onChange={e => handleFieldChange(field.name, e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  placeholder={field.placeholder || ''}
                  required
                />
              </div>
            ))}
          </div>
        )}

        {/* Free-text area if no template */}
        {!template && (
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Update Description
            </label>
            <textarea
              value={freeText}
              onChange={e => setFreeText(e.target.value)}
              rows={4}
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
              required
            />
          </div>
        )}

        {/* Date field */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Progress Date
          </label>
          <input
            type="date"
            value={progressDate}
            onChange={e => setProgressDate(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
            required
          />
        </div>

        {/* Submit button */}
        <button
          type="submit"
          className="w-full py-3 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditProgressUpdateForm;
