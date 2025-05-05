import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getPlanById, updatePlan, deletePlan } from '../api/learningPlans';

export default function PlanDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [plan, setPlan] = useState(null);
  const [milestones, setMilestones] = useState([]);

  useEffect(() => {
    getPlanById(id)
      .then(res => {
        setPlan(res.data);
        setMilestones(res.data.milestones);
      })
      .catch(console.error);
  }, [id]);

  const toggleMilestone = index => {
    const updatedMilestones = milestones.map((ms, i) =>
      i === index ? { ...ms, completed: !ms.completed } : ms
    );
    const updatedPlan = { ...plan, milestones: updatedMilestones };

    updatePlan(id, updatedPlan)
      .then(res => {
        setPlan(res.data);
        setMilestones(res.data.milestones);
      })
      .catch(console.error);
  };

  if (!plan) return <p>Loading…</p>;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">{plan.title}</h1>
      <p><strong>Topics:</strong> {plan.topics}</p>

      {/* ← Fixed Resources rendering */}
      <div>
        <strong>Resources:</strong>
        {plan.resources && plan.resources.length > 0 ? (
          <ul className="list-disc pl-5">
            {plan.resources.map((res, i) => (
              <li key={i}>
                <a
                  href={res.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {res.type.charAt(0) + res.type.slice(1).toLowerCase()}: {res.url}
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600">No resources provided.</p>
        )}
      </div>

      <p><strong>Deadline:</strong> {plan.deadline}</p>

      <p><strong>Progress:</strong> {(plan.progress * 100).toFixed(0)}%</p>
      <div className="w-full bg-gray-200 rounded h-2">
        <div
          className="h-2 bg-green-500 rounded"
          style={{ width: `${plan.progress * 100}%` }}
        />
      </div>

      <h2 className="mt-4 font-semibold">Milestones</h2>
      <ul className="list-disc pl-5">
        {milestones.map((ms, i) => (
          <li key={i}>
            <input
              type="checkbox"
              checked={ms.completed}
              onChange={() => toggleMilestone(i)}
              className="mr-2"
            />
            {ms.name} (due {ms.dueDate})
          </li>
        ))}
      </ul>

      <div className="space-x-2">
        <Link
          to={`/plans/${id}/edit`}
          className="px-4 py-2 bg-yellow-500 text-white rounded"
        >
          Edit
        </Link>
        <button
          onClick={() => {
            if (window.confirm('Delete this plan?')) {
              deletePlan(id).then(() => navigate('/plans'));
            }
          }}
          className="px-4 py-2 bg-red-600 text-white rounded"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
