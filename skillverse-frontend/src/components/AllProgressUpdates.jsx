// src/components/AllProgressUpdatesAnalytics.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import { Bar } from 'react-chartjs-2';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import { subMonths, format, parseISO } from 'date-fns';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
);

const AllProgressUpdatesAnalytics = () => {
  const navigate = useNavigate();
  const stored = sessionStorage.getItem('userProfile');
  const userProfile = stored ? JSON.parse(stored) : null;
  const userId = userProfile?.id;

  const [updates, setUpdates] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!userId) return navigate('/login');
    axios
      .get(`http://localhost:8081/api/progress-updates?userId=${userId}`)
      .then(res => setUpdates(res.data))
      .catch(() => setMessage('Failed to load progress updates.'));
  }, [userId, navigate]);

  // --- Bar chart data (last 6 months) ---
  const last6Months = Array.from({ length: 6 })
    .map((_, i) => subMonths(new Date(), 5 - i))
    .map(d => format(d, 'yyyy-MM'));

  const barData = {
    labels: last6Months.map(m => format(parseISO(m + '-01'), 'MMM yy')),
    datasets: [{
      label: 'Updates',
      data: last6Months.map(month =>
        updates.filter(u => u.progressDate.startsWith(month)).length
      ),
      backgroundColor: 'rgba(59, 130, 246, 0.6)',
    }]
  };

  // --- Heatmap data (last 3 months) ---
  const today = new Date();
  const heatmapValues = updates.map(u => ({
    date: format(parseISO(u.progressDate), 'yyyy-MM-dd'),
    count: 1
  }));
  const heatmapMap = heatmapValues.reduce((acc, { date, count }) => {
    acc[date] = (acc[date] || 0) + count;
    return acc;
  }, {});
  const heatmapData = Object.entries(heatmapMap).map(([date, count]) => ({ date, count }));

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-center text-indigo-600">
          Your Progress Analytics
        </h1>

        {message && (
          <p className="text-center text-red-600">{message}</p>
        )}

        {/* GRID: charts on left, list on right */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left column: Bar + Heatmap */}
          <div className="space-y-6">
            {/* Bar chart */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="font-semibold mb-4">Updates Last 6 Months</h2>
              <div className="relative h-64">
                <Bar
                  data={barData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: { y: { beginAtZero: true } }
                  }}
                />
              </div>
            </div>

            {/* Heatmap */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="font-semibold mb-4">Activity Heatmap</h2>
              <div className="h-48 overflow-auto">
                <CalendarHeatmap
                  startDate={subMonths(today, 3)}
                  endDate={today}
                  values={heatmapData}
                  classForValue={(value) => {
                    if (!value) return 'color-empty';
                    if (value.count >= 5) return 'color-scale-4';
                    if (value.count >= 3) return 'color-scale-3';
                    if (value.count >= 1) return 'color-scale-2';
                    return 'color-scale-1';
                  }}
                />
              </div>
              <div className="mt-2 text-sm text-gray-600">
                Darker squares = more updates
              </div>
            </div>
          </div>

          {/* Right column: Full list */}
          <section className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold">All Progress Updates</h2>
            </div>

            {updates.length === 0 ? (
              <p className="text-gray-600">No updates yet.</p>
            ) : (
              <ul className="space-y-4">
                {updates.map(u => (
                  <li key={u.id} className="border-l-4 border-indigo-500 pl-4">
                    <div className="flex justify-between">
                      <span className="font-medium">{u.updateType}</span>
                      <span className="text-sm text-gray-500">
                        {new Date(u.progressDate).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="mt-1">{u.updateText}</p>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>

      {/* Heatmap color styles */}
      <style>{`
        .color-empty { fill: #ebedf0; }
        .color-scale-1 { fill: #c6e48b; }
        .color-scale-2 { fill: #7bc96f; }
        .color-scale-3 { fill: #239a3b; }
        .color-scale-4 { fill: #196127; }
      `}</style>
    </div>
  );
};

export default AllProgressUpdatesAnalytics;
