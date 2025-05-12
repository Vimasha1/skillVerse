import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getPlans } from '../api/learningPlans';
import PlanCard     from './PlanCard';

export default function LearningPlanList() {
  const [plans, setPlans]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  useEffect(() => {
    getPlans()
      .then(res => setPlans(res.data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading learning plans…</p>;
  if (error)   return <p className="text-red-600">Error: {error}</p>;

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

      {plans.length === 0
        ? <p>No plans yet. Start by creating one!</p>
        : <div className="grid gap-4">
            {plans.map(plan => (
              <PlanCard key={plan.id} plan={plan} />
            ))}
          </div>
      }
    </div>
  );
}
