import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function AdminPlans() {
  const [plans, setPlans] = useState([]);

  const fetchPlans = async () => {
    try {
      const res = await axios.get('http://localhost:8081/api/learning-plans');
      setPlans(res.data);
    } catch (err) {
      console.error('Error fetching plans:', err);
    }
  };

  const deletePlan = async (id) => {
    if (!window.confirm('Delete this learning plan?')) return;
    try {
      await axios.delete(`http://localhost:8081/api/learning-plans/${id}`);
      fetchPlans();
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Manage Learning Plans</h2>
      <table className="min-w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">Title</th>
            <th className="p-2 border">Skill Type</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {plans.map(plan => (
            <tr key={plan.id}>
              <td className="p-2 border">{plan.title}</td>
              <td className="p-2 border">{plan.skillType}</td>
              <td className="p-2 border">
                <button
                  onClick={() => deletePlan(plan.id)}
                  className="text-red-600 hover:underline"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
