import React from 'react';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <ul className="space-y-4">
        <li><Link to="/admin/posts" className="text-blue-600 hover:underline">Manage Posts</Link></li>
        <li><Link to="/admin/learning-plans" className="text-blue-600 hover:underline">Manage Learning Plans</Link></li>
        <li><Link to="/admin/users" className="text-blue-600 hover:underline">Manage Users</Link></li>
      </ul>
    </div>
  );
}
