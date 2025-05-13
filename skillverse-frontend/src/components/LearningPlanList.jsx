import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getPlans } from '../api/learningPlans';
import axios from 'axios';
import PlanCard from './PlanCard'; // Optional: comment/remove if not using PlanCard

export default function LearningPlanList() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userProfile, setUserProfile] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const stored = JSON.parse(sessionStorage.getItem('userProfile'));
    if (!stored) return navigate('/login');
    setUserProfile(stored);

    getPlans()
      .then(res => setPlans(res.data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [navigate]);

  const handleShare = async (planId) => {
    try {
      await axios.post(
        `http://localhost:8081/api/learning-plans/${planId}/share-with/${userProfile.username}`
      );
      alert("Plan shared successfully!");
      navigate(`/user-profiles/${userProfile.id}`);
    } catch (err) {
      console.error(err);
      alert("Failed to share the plan.");
    }
  };

  if (loading) return <p>Loading learning plans…</p>;
  if (error) return <p className="text-red-600">Error: {error}</p>;

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Link
          to="/plans/create"
          className="px-4 py-2 bg-green-500 text-white rounded"
        >
          + Create New Plan
        </Link>
      </div>

      {plans.length === 0 ? (
        <p>No plans yet. Start by creating one!</p>
      ) : (
        <div className="grid gap-4">
          {plans.map(plan =>
            PlanCard ? (
              <PlanCard
                key={plan.id}
                plan={plan}
                userProfile={userProfile}
                onShare={() => handleShare(plan.id)}
              />
            ) : (
              <div key={plan.id} className="p-4 border rounded shadow-sm bg-white">
                <h2 className="text-xl font-semibold">{plan.title}</h2>
                <p className="text-sm text-gray-600">By {plan.createdBy}</p>
                <p className="text-sm">Deadline: {plan.deadline}</p>
                <Link
                  to={`/plans/${plan.id}`}
                  className="inline-block mt-2 text-indigo-600 hover:underline"
                >
                  View Details
                </Link>
                {userProfile?.username !== plan.createdBy && (
                  <button
                    onClick={() => handleShare(plan.id)}
                    className="ml-3 mt-2 px-3 py-1 bg-indigo-600 text-white text-sm rounded"
                  >
                    Share
                  </button>
                )}
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}
