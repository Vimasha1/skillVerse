// src/components/ProgressUpdateFeed.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ProgressUpdateFeed = () => {
  const [updates, setUpdates] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [userProfiles, setUserProfiles] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');

  // Utility to fill placeholders
  const renderTemplate = (templateText, extraFields = {}) => {
    let result = templateText;
    Object.entries(extraFields).forEach(([key, value]) => {
      const regex = new RegExp(`%${key}%`, 'g');
      result = result.replace(regex, value);
    });
    return result;
  };

  // Load updates and user profiles
  useEffect(() => {
    axios.get('http://localhost:8081/api/progress-updates')
      .then(({ data }) => {
        setUpdates(data);
        setFiltered(data);

        const ids = Array.from(new Set(data.map(u => u.userId)));
        return Promise.all(
          ids.map(id =>
            axios.get(`http://localhost:8081/api/user-profiles/${id}`)
              .then(res => res.data)
              .catch(() => null)
          )
        );
      })
      .then(profiles => {
        const map = {};
        profiles.forEach(p => {
          if (p && p.id) map[p.id] = p;
        });
        setUserProfiles(map);
      })
      .catch(err => {
        console.error('Error fetching updates or profiles:', err);
      });
  }, []);

  // Filter based on search and type
  useEffect(() => {
    let result = [...updates];

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(u =>
        (u.freeText || '').toLowerCase().includes(term) ||
        (u.templateText || '').toLowerCase().includes(term)
      );
    }

    if (selectedType) {
      result = result.filter(u => u.category === selectedType);
    }

    setFiltered(result);
  }, [searchTerm, selectedType, updates]);

  const updateTypes = Array.from(
    new Set(updates.map(u => u.category).filter(Boolean))
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0">
        <input
          type="text"
          placeholder="🔍 Search updates..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="w-full sm:w-1/2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        <select
          value={selectedType}
          onChange={e => setSelectedType(e.target.value)}
          className="w-full sm:w-1/4 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          <option value="">All Categories</option>
          {updateTypes.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>

      {/* Cards Grid */}
      {filtered.length === 0 ? (
        <p className="text-center text-gray-600">No progress updates found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(update => {
            const author = userProfiles[update.userId] || {};
            const text = update.templateText
              ? renderTemplate(update.templateText, update.extraFields)
              : update.freeText || '';

            return (
              <div
                key={update.id}
                className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition"
              >
                {/* Author */}
                <div className="flex items-center mb-3 space-x-2">
                  <Link to={`/public-profile/${author.id}`}>
                    <img
                      src={author.profilePicture || 'https://via.placeholder.com/24'}
                      alt={author.username}
                      className="w-6 h-6 rounded-full object-cover"
                    />
                  </Link>
                  <Link to={`/public-profile/${author.id}`}>
                    <span className="font-medium text-gray-800 hover:underline">
                      {author.username || 'Unknown'}
                    </span>
                  </Link>
                </div>

                {/* Content */}
                <h3 className="text-indigo-600 font-bold text-lg">
                  {update.category}
                </h3>
                <p className="mt-2 text-gray-700 break-words whitespace-pre-wrap">
                  {text}
                </p>

                {/* Date */}
                <div className="mt-4 text-sm text-gray-500">
                  📅 {new Date(update.progressDate).toLocaleDateString()}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ProgressUpdateFeed;
