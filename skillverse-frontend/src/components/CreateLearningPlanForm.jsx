import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createPlan, updatePlan, getPlanById } from '../api/learningPlans';

const emptyMilestone = () => ({ name: '', dueDate: '', completed: false });
const emptyResource  = () => ({ type: 'VIDEO', url: '' });

export default function CreateLearningPlanForm({ editMode = false }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: '',
    topics: '',
    skillType: '',
    resources: [ emptyResource() ],
    deadline: '',
    milestones: [ emptyMilestone() ],
    visibility: 'private',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (editMode && id) {
      setLoading(true);
      getPlanById(id)
        .then(res => setForm({
          ...res.data,
          skillType: res.data.skillType || '',
          resources: Array.isArray(res.data.resources) && res.data.resources.length
            ? res.data.resources
            : [ emptyResource() ],
          milestones: Array.isArray(res.data.milestones) && res.data.milestones.length
            ? res.data.milestones
            : [ emptyMilestone() ],
        }))
        .catch(err => {
          const data = err.response?.data;
          setError(
            typeof data === 'string'
              ? data
              : data?.message || JSON.stringify(data)
          );
        })
        .finally(() => setLoading(false));
    }
  }, [editMode, id]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

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
      return { ...f, milestones: m.length ? m : [ emptyMilestone() ] };
    });

  const addResource = () =>
    setForm(f => ({ ...f, resources: [...f.resources, emptyResource()] }));

  const removeResource = idx =>
    setForm(f => {
      const r = f.resources.filter((_, i) => i !== idx);
      return { ...f, resources: r.length ? r : [ emptyResource() ] };
    });

  const updateResource = (idx, field, value) =>
    setForm(f => {
      const r = [...f.resources];
      r[idx] = { ...r[idx], [field]: value };
      return { ...f, resources: r };
    });

  const onSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (editMode && id) {
        await updatePlan(id, form);
      } else {
        await createPlan(form);
      }
      navigate('/plans');
    } catch (err) {
      const data = err.response?.data;
      const msg = typeof data === 'string'
        ? data
        : data?.message || JSON.stringify(data) || err.message;
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4 bg-white p-6 rounded shadow">
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

      {/* Topics */}
      <div>
        <label className="block font-medium">Topics (comma-separated)</label>
        <input
          name="topics"
          value={form.topics}
          onChange={handleChange}
          disabled={loading}
          className="w-full border rounded px-2 py-1"
        />
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
                  : res.type === 'WEBSITE'
                    ? 'https://example.com'
                    : 'https://example.com/file.pdf'
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
          required
          disabled={loading}
          className="border rounded px-2 py-1"
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
              disabled={loading}
              className="flex-1 border rounded px-2 py-1"
            />
            <input
              type="date"
              value={ms.dueDate}
              onChange={e => handleMilestoneChange(i, 'dueDate', e.target.value)}
              disabled={loading}
              className="border rounded px-2 py-1"
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
