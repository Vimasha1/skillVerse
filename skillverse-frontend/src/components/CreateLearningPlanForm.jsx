import React, { useEffect, useState } from 'react';
import { useNavigate, useParams }             from 'react-router-dom';
import { createPlan, updatePlan, getPlanById } from '../api/learningPlans';

const emptyMilestone = () => ({ name: '', dueDate: '', completed: false });

export default function CreateLearningPlanForm({ editMode = false }) {
  const { id }     = useParams();
  const navigate   = useNavigate();

  const [form, setForm]       = useState({
    title: '',
    topics: '',
    resources: '',
    deadline: '',
    milestones: [emptyMilestone()],
    visibility: 'private',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  // Load existing plan when editing
  useEffect(() => {
    if (editMode && id) {
      setLoading(true);
      getPlanById(id)
        .then(res => setForm({
          ...res.data,
          milestones: res.data.milestones.length 
            ? res.data.milestones 
            : [emptyMilestone()],
        }))
        .catch(err => setError(err.message))
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
      return { ...f, milestones: m.length ? m : [emptyMilestone()] };
    });

  const onSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (editMode && id) await updatePlan(id, form);
      else                await createPlan(form);
      navigate('/plans');
    } catch (e) {
      setError(e.response?.data?.message || e.message);
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
          className="w-full border rounded px-2 py-1"
          disabled={loading}
        />
      </div>

      {/* Topics */}
      <div>
        <label className="block font-medium">Topics (comma-separated)</label>
        <input
          name="topics"
          value={form.topics}
          onChange={handleChange}
          className="w-full border rounded px-2 py-1"
          disabled={loading}
        />
      </div>

      {/* Resources */}
      <div>
        <label className="block font-medium">Resources (URLs)</label>
        <textarea
          name="resources"
          value={form.resources}
          onChange={handleChange}
          className="w-full border rounded px-2 py-1"
          disabled={loading}
        />
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
