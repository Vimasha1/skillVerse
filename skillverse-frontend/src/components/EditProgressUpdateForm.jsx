// src/components/EditProgressUpdateForm.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const EditProgressUpdateForm = () => {
  const { id } = useParams();               // the progress update ID
  const navigate = useNavigate();

  // load userId from session (set at login)
  const stored = sessionStorage.getItem('userProfile');
  const userProfile = stored ? JSON.parse(stored) : null;
  const userId = userProfile?.id;

  // state
  const [templates, setTemplates] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState('');
  const [customUpdate, setCustomUpdate] = useState('');
  const [updateType, setUpdateType] = useState('');
  const [fieldValues, setFieldValues] = useState({});
  const [message, setMessage] = useState('');

  // for beautifying the template picker cards
  const updateTypes = [
    { value: 'Achievement', label: '🎉 Achievement' },
    { value: 'Goal',        label: '🎯 Goal' },
    { value: 'Milestone',   label: '🏆 Milestone' },
  ];

  // 1) on mount, load templates, categories, and the existing update
  useEffect(() => {
    if (!userId) {
      navigate('/login');
      return;
    }

    // fetch categories (with their fields metadata)
    axios.get('http://localhost:8081/api/template-categories')
      .then(res => setCategories(res.data))
      .catch(() => setMessage('Failed to load categories.'));

    // fetch templates
    axios.get('http://localhost:8081/api/progress-templates')
      .then(res => setTemplates(res.data))
      .catch(() => setMessage('Failed to load templates.'));

    // fetch the existing progress-update
    axios.get(`http://localhost:8081/api/progress-updates/${id}`)
      .then(res => {
        const upd = res.data;
        setSelectedTemplateId(upd.categoryId
          ? templates.find(t => t.categoryId === upd.categoryId)?.id || ''
          : '');
        setCustomUpdate(upd.updateText || '');
        setUpdateType(upd.updateType || '');
        setFieldValues(upd.extraFields || {});
      })
      .catch(() => setMessage('Failed to load update.'));
  // we intentionally do NOT include `templates` in deps, so we only pick
  // the templateId -> categoryId once, after all have loaded.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, userId, navigate]);

  // helper to look up the category
  const selectedTemplate = templates.find(t => t.id === selectedTemplateId);
  const category = categories.find(c => c.id === selectedTemplate?.categoryId);

  const handleTemplateSelect = tplId => {
    setSelectedTemplateId(tplId);
    setCustomUpdate('');
    setFieldValues({});
  };

  const handleFieldChange = (name, val) => {
    setFieldValues(prev => ({ ...prev, [name]: val }));
  };

  const handleSubmit = async e => {
    e.preventDefault();

    // decide what the “prompt” should be
    const template = templates.find(t => t.id === selectedTemplateId);
    const updateText = template
      ? template.templateText
      : customUpdate.trim();

    if (!updateText) return setMessage('Please pick a template or write your own.');
    if (!updateType)  return setMessage('Please select an update type.');

    const payload = {
      userId,
      categoryId: template?.categoryId,
      templateText: template?.templateText,
      updateText,
      updateType,
      extraFields: fieldValues,
    };

    try {
      await axios.put(
        `http://localhost:8081/api/progress-updates/${id}`,
        payload
      );
      setMessage('Update saved! Redirecting…');
      setTimeout(() => navigate(`/user-profiles/${userId}`), 1500);
    } catch {
      setMessage('Error saving update—please try again.');
    }
  };

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
        {/* Template picker as cards */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Pick a Template
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {templates.map(tpl => {
              const cat = categories.find(c => c.id === tpl.categoryId) || {};
              const isSel = tpl.id === selectedTemplateId;
              return (
                <div
                  key={tpl.id}
                  onClick={() => handleTemplateSelect(tpl.id)}
                  className={`
                    p-4 border rounded-lg cursor-pointer hover:shadow-lg transition
                    ${isSel ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200 bg-white'}
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

        {/* Dynamic category fields */}
        {category && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-700">
              {category.icon} {category.name} Details
            </h3>
            {category.fields.map(f => (
              <div key={f.key}>
                <label className="block text-gray-700 mb-1">{f.label}</label>
                <input
                  type={f.type || 'text'}
                  value={fieldValues[f.key] || ''}
                  onChange={e => handleFieldChange(f.key, e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  placeholder={f.placeholder}
                  required={f.required}
                />
              </div>
            ))}
          </div>
        )}

        {/* free-form textarea if no template chosen */}
        {!selectedTemplate && (
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Or write your own progress…
            </label>
            <textarea
              rows={4}
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
              value={customUpdate}
              onChange={e => setCustomUpdate(e.target.value)}
            />
          </div>
        )}

        {/* Update type dropdown */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Update Type
          </label>
          <select
            value={updateType}
            onChange={e => setUpdateType(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
            required
          >
            <option value="">— select type —</option>
            {updateTypes.map(t => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

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
