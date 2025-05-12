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
      .get(`http://localhost:8081/api/progress-updates/user/${userId}`)
      .then(res => setUpdates(res.data))
      .catch(() => setMessage('Failed to load progress updates.'));
  }, [userId, navigate]);

  // Util: Fill template placeholders
  const renderTemplate = (templateText, extraFields = {}) => {
    let result = templateText;
    Object.entries(extraFields).forEach(([key, val]) => {
      result = result.replace(new RegExp(`%${key}%`, 'g'), val);
    });
    return result;
  };

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
      backgroundColor: 'rgba(99, 102, 241, 0.7)', // Indigo
    }]
  };

  // --- Heatmap data (last 3 months) ---
  const today = new Date();
  const heatmapValues = updates.map(u => ({
    date: format(parseISO(u.progressDate), 'yyyy-MM-dd'),
    count: 1
  }));
  const heatmapMap = heatmapValues.reduce((acc, { date }) => {
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});
  const heatmapData = Object.entries(heatmapMap).map(([date, count]) => ({ date, count }));

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-10">
        <h1 className="text-3xl font-bold text-center text-indigo-600">
          Your Progress Analytics
        </h1>

        {message && (
          <p className="text-center text-red-600">{message}</p>
        )}

        {/* GRID: Charts + List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left column: Charts */}
          <div className="space-y-8">
            {/* Bar Chart */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="font-semibold text-lg mb-4">Monthly Updates (Last 6 Months)</h2>
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
              <h2 className="font-semibold text-lg mb-4">Activity Heatmap (Last 3 Months)</h2>
              <div className="h-48 overflow-auto">
                <CalendarHeatmap
                  startDate={subMonths(today, 3)}
                  endDate={today}
                  values={heatmapData}
                  classForValue={value => {
                    if (!value) return 'color-empty';
                    if (value.count >= 5) return 'color-scale-4';
                    if (value.count >= 3) return 'color-scale-3';
                    if (value.count >= 1) return 'color-scale-2';
                    return 'color-scale-1';
                  }}
                />
              </div>
              <div className="mt-2 text-sm text-gray-600">
                Darker squares = more updates on that day
              </div>
            </div>
          </div>

          {/* Right column: Update list */}
          <div className="bg-white p-6 rounded-lg shadow h-fit">
            <h2 className="font-semibold text-lg mb-4">All Progress Updates</h2>

            {updates.length === 0 ? (
              <p className="text-gray-600">No updates yet.</p>
            ) : (
              <ul className="space-y-5 max-h-[700px] overflow-auto pr-2 scrollbar-thin scrollbar-thumb-indigo-400">
                {updates
                  .sort((a, b) => new Date(b.progressDate) - new Date(a.progressDate))
                  .map(u => {
                    const text = u.templateText
                      ? renderTemplate(u.templateText, u.extraFields)
                      : u.freeText || '';
                    return (
                      <li key={u.id} className="border-l-4 border-indigo-500 pl-4 pb-1">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-indigo-700">{u.category}</span>
                          <span className="text-sm text-gray-500">
                            {new Date(u.progressDate).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="mt-1 text-gray-700 whitespace-pre-wrap break-words">
                          {text}
                        </p>
                      </li>
                    );
                  })}
              </ul>
            )}
          </div>
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
