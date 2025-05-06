// src/components/CreateLearningPlanForm.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams }             from 'react-router-dom';
import { createPlan, updatePlan, getPlanById } from '../api/learningPlans';

const emptyMilestone = () => ({ name: '', dueDate: '', completed: false });
const emptyResource  = () => ({ type: 'VIDEO', url: '' });

export default function CreateLearningPlanForm({ editMode = false }) {
  const { id }       = useParams();
  const navigate     = useNavigate();

  // — DIY chip input for topics —
  const [topics, setTopics]         = useState([]);
  const [topicInput, setTopicInput] = useState('');

  // — rest of the form state —
  const [form, setForm] = useState({
    title: '',
    skillType: '',
    resources: [ emptyResource() ],
    deadline: '',
    milestones: [ emptyMilestone() ],
    visibility: 'private',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  // Load existing plan when editing
  useEffect(() => {
    if (editMode && id) {
      setLoading(true);
      getPlanById(id)
        .then(res => {
          const data = res.data;
          setForm({
            title:     data.title || '',
            skillType: data.skillType || '',
            resources: data.resources?.length
              ? data.resources
              : [ emptyResource() ],
            deadline:  data.deadline || '',
            milestones: data.milestones?.length
              ? data.milestones
              : [ emptyMilestone() ],
            visibility: data.visibility || 'private',
          });
          setTopics(data.topics || []);
        })
        .catch(err => {
          console.error('Load error:', err.response?.data || err);
          setError('Could not load plan');
        })
        .finally(() => setLoading(false));
    }
  }, [editMode, id]);

  // Generic field change
  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  // — Topic chip handlers —
  const handleTopicKeyDown = e => {
    if (e.key === 'Enter' && topicInput.trim()) {
      e.preventDefault();
      setTopics(ts => [...ts, topicInput.trim()]);
      setTopicInput('');
    }
  };
  const addTopic = () => {
    if (!topicInput.trim()) return;
    setTopics(ts => [...ts, topicInput.trim()]);
    setTopicInput('');
  };
  const removeTopic = idx =>
    setTopics(ts => ts.filter((_, i) => i !== idx));

  // — Milestone handlers —
  const handleMilestoneChange = (idx, field, value) => {
    setForm(f => {
      const m = [...f.milestones];
      m[idx] = { ...m[idx], [field]: value };
      return { ...f, milestones: m };
    });
  };
  const addMilestone = () =>
    setForm(f => ({ ...f, milestones: [...f.milestones, emptyMilestone()] }));
  const removeMilestone = idx =>
    setForm(f => {
      const m = f.milestones.filter((_, i) => i !== idx);
      return { ...f, milestones: m.length ? m : [emptyMilestone()] };
    });

  // — Resource handlers —
  const addResource = () =>
    setForm(f => ({ ...f, resources: [...f.resources, emptyResource()] }));
  const removeResource = idx =>
    setForm(f => {
      const r = f.resources.filter((_, i) => i !== idx);
      return { ...f, resources: r.length ? r : [emptyResource()] };
    });
  const updateResource = (idx, field, value) =>
    setForm(f => {
      const r = [...f.resources];
      r[idx] = { ...r[idx], [field]: value };
      return { ...f, resources: r };
    });

  // — Submit form —
  const onSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Build payload
    const payload = {
      title:     form.title,
      skillType: form.skillType,
      topics,  // 🚀 array of strings
      resources: form.resources.map(r => ({
        type: r.type,
        url: r.url.trim(),
      })),
      deadline: form.deadline,
      milestones: form.milestones.map(ms => ({
        name:     ms.name,
        dueDate:  ms.dueDate,
        completed: ms.completed,
      })),
      visibility: form.visibility,
    };

    try {
      if (editMode && id) await updatePlan(id, payload);
      else                await createPlan(payload);
      navigate('/plans');
    } catch (e) {
      console.error('Submit error:', e.response?.data || e);
      setError(
        e.response?.data?.message ||
        JSON.stringify(e.response?.data) ||
        e.message
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6 bg-white p-6 rounded shadow">
      <h2 className="text-2xl">
        {editMode ? 'Edit Learning Plan' : 'Create New Learning Plan'}
      </h2>

      {error && (
        <div className="bg-red-100 text-red-800 p-2 rounded">{error}</div>
      )}

      {/* Title */}
      <div>
        <label className="block font-medium">Title</label>
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          required
          disabled={loading}
          className="w-full border rounded px-2 py-1"
        />
      </div>

      {/* DIY Topics Chip Input */}
      <div>
        <label className="block font-medium mb-1">Topics</label>
        {/* Chips */}
        <div className="flex flex-wrap gap-2 mb-2">
          {topics.map((t, i) => (
            <span
              key={i}
              className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full flex items-center"
            >
              {t}
              <button
                type="button"
                onClick={() => removeTopic(i)}
                className="ml-1 text-indigo-600 font-bold"
              >
                &times;
              </button>
            </span>
          ))}
        </div>
        {/* Input + Add */}
        <div className="flex gap-2">
          <input
            value={topicInput}
            onChange={e => setTopicInput(e.target.value)}
            onKeyDown={handleTopicKeyDown}
            placeholder="Add a topic and press Enter"
            disabled={loading}
            className="flex-1 border rounded px-2 py-1"
          />
          <button
            type="button"
            onClick={addTopic}
            disabled={!topicInput.trim() || loading}
            className="px-4 bg-green-500 text-white rounded"
          >
            Add
          </button>
        </div>
      </div>

      {/* Skill Type */}
      <div>
        <label className="block font-medium">Skill Type</label>
        <input
          name="skillType"
          value={form.skillType}
          onChange={handleChange}
          placeholder="e.g. Machine Learning, React, Docker"
          required
          disabled={loading}
          className="w-full border rounded px-2 py-1"
        />
      </div>

      {/* Resources */}
      <div>
        <label className="block font-medium mb-1">Resources</label>
        {form.resources.map((res, i) => (
          <div key={i} className="flex gap-2 mb-2">
            <select
              value={res.type}
              onChange={e => updateResource(i, 'type', e.target.value)}
              disabled={loading}
              className="border rounded px-2 py-1"
            >
              <option value="VIDEO">Video</option>
              <option value="WEBSITE">Website</option>
              <option value="PDF">PDF</option>
            </select>
            <input
              type="url"
              placeholder={
                res.type === 'VIDEO'
                  ? 'https://youtu.be/...'
                  : res.type === 'PDF'
                    ? 'https://example.com/file.pdf'
                    : 'https://example.com'
              }
              value={res.url}
              onChange={e => updateResource(i, 'url', e.target.value)}
              required
              disabled={loading}
              className="flex-1 border rounded px-2 py-1"
            />
            <button
              type="button"
              onClick={() => removeResource(i)}
              disabled={loading}
              className="text-red-600"
            >
              ✕
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addResource}
          disabled={loading}
          className="text-indigo-600"
        >
          + Add Resource
        </button>
      </div>

      {/* Deadline */}
      <div>
        <label className="block font-medium">Deadline</label>
        <input
          type="date"
          name="deadline"
          value={form.deadline}
          onChange={handleChange}
          className="border rounded px-2 py-1"
          disabled={loading}
          required
        />
      </div>

      {/* Milestones */}
      <div>
        <label className="block font-medium mb-1">Milestones</label>
        {form.milestones.map((ms, i) => (
          <div key={i} className="flex gap-2 mb-2">
            <input
              placeholder="Name"
              value={ms.name}
              onChange={e => handleMilestoneChange(i, 'name', e.target.value)}
              className="flex-1 border rounded px-2 py-1"
              disabled={loading}
            />
            <input
              type="date"
              value={ms.dueDate}
              onChange={e => handleMilestoneChange(i, 'dueDate', e.target.value)}
              className="border rounded px-2 py-1"
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => removeMilestone(i)}
              disabled={loading}
              className="text-red-600"
            >
              ✕
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addMilestone}
          disabled={loading}
          className="text-indigo-600"
        >
          + Add Milestone
        </button>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="px-4 py-2 bg-indigo-600 text-white rounded"
      >
        {loading
          ? editMode
            ? 'Updating…'
            : 'Creating…'
          : editMode
            ? 'Update Plan'
            : 'Create Plan'}
      </button>
    </form>
  );
}
