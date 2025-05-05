import React from 'react';
import { Link } from 'react-router-dom';

export default function PlanCard({ plan }) {
  const pct = Math.round(plan.progress * 100);

  return (
    <div className="p-4 border rounded shadow-sm bg-white">
      <h2 className="text-xl font-semibold">{plan.title}</h2>
      <p className="text-sm text-gray-600">By {plan.createdBy}</p>
      <div className="mt-2 h-2 bg-gray-200 rounded overflow-hidden">
        <div className="h-full bg-green-500" style={{ width: `${pct}%` }} />
      </div>
      <p className="mt-1 text-sm">Deadline: {plan.deadline}</p>
      <Link
        to={`/plans/${plan.id}`}
        className="inline-block mt-2 text-indigo-600 hover:underline"
      >
        View Details
      </Link>
    </div>
  );
}
