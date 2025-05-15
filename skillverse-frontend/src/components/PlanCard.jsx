import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function PlanCard({ plan, userProfile, onShare }) {
  const pct = Math.round(plan.progress * 100);
  const [creatorProfile, setCreatorProfile] = useState(null);

  useEffect(() => {
    if (!plan.createdBy) return;

    axios
      .get(`http://localhost:8081/api/user-profiles/by-username/${encodeURIComponent(plan.createdBy)}`)
      .then(res => setCreatorProfile(res.data))
      .catch(() => setCreatorProfile(null));
  }, [plan.createdBy]);

  return (
    <div className="p-4 border rounded shadow-sm bg-white">
      <h2 className="text-xl font-semibold">{plan.title}</h2>

      <div className="flex items-center mt-1 mb-2 space-x-2">
        <img
          src={creatorProfile?.profilePicture || 'https://via.placeholder.com/32'}
          alt="Creator"
          className="w-8 h-8 rounded-full object-cover border"
        />
        <p className="text-sm text-gray-600">By {plan.createdBy}</p>
      </div>

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

      {/* ✅ Share button for non-creators */}
      {userProfile?.username !== plan.createdBy && (
        <button
          onClick={onShare}
          className="ml-3 mt-2 px-3 py-1 bg-indigo-600 text-white text-sm rounded"
        >
          Share
        </button>
      )}
    </div>
  );
}
