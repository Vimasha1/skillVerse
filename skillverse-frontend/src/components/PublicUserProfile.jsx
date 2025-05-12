// src/components/PublicUserProfile.jsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const PublicUserProfile = () => {
  const { id: userId } = useParams();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [updates, setUpdates] = useState([]);
  const [message, setMessage] = useState('');
  const [isFollowing, setIsFollowing] = useState(false);

  // assume we stored the logged-in user in sessionStorage
  const currentUser = JSON.parse(sessionStorage.getItem('userProfile'));
  const currentUserId = currentUser?.id;

  // 1) load the public profile & their updates
  useEffect(() => {
    if (!userId) {
      navigate('/');
      return;
    }

    axios
      .get(`http://localhost:8081/api/user-profiles/${userId}`)
      .then(res => setProfile(res.data))
      .catch(() => setMessage('Failed to load user profile.'));

    axios
      .get(`http://localhost:8081/api/progress-updates/user/${userId}`)
      .then(res => setUpdates(res.data))
      .catch(() => setMessage('Failed to load user progress updates.'));
  }, [userId, navigate]);

  // 2) check whether *I* (currentUser) am following *them*
  useEffect(() => {
    if (currentUserId && currentUserId !== userId) {
      axios
        .get(`http://localhost:8081/api/user-profiles/${currentUserId}`)
        .then(res => {
          const myFollowing = res.data.following || [];
          setIsFollowing(myFollowing.includes(userId));
        })
        .catch(() => { /* ignore */ });
    }
  }, [currentUserId, userId]);

  // 3) toggle follow/unfollow
  const handleFollow = () => {
    if (!currentUserId) {
      navigate('/login');
      return;
    }

    const action = isFollowing ? 'unfollow' : 'follow';
    axios
      .put(
        `http://localhost:8081/api/user-profiles/${currentUserId}/${action}/${userId}`
      )
      .then(() => {
        setIsFollowing(!isFollowing);
      })
      .catch(() => {
        setMessage('Could not update follow status.');
      });
  };

  const renderTemplate = (templateText, extraFields = {}) => {
    let result = templateText;
    Object.entries(extraFields).forEach(([key, value]) => {
      result = result.replace(new RegExp(`%${key}%`, 'g'), value);
    });
    return result;
  };

  if (!profile) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-10">

        {/* Header */}
        <div className="bg-white rounded-lg shadow p-6 flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <img
              src={profile.profilePicture || 'https://via.placeholder.com/80'}
              alt={profile.username}
              className="w-20 h-20 rounded-full object-cover border-2 border-gray-300"
            />
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                {profile.firstName} {profile.lastName}
              </h1>
              <p className="text-sm text-gray-600">
                {profile.jobPosition} at {profile.company}
              </p>
            </div>
          </div>

          {currentUserId && currentUserId !== userId && (
            <button
              onClick={handleFollow}
              className={`px-4 py-2 rounded-lg text-white transition
                ${isFollowing
                  ? 'bg-indigo-600 hover:bg-indigo-700'
                  : 'bg-blue-600 hover:bg-blue-700'}`}
            >
              {isFollowing ? 'Following' : 'Follow'}
            </button>
          )}
        </div>

        {/* Updates */}
        <section className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4 text-indigo-700">
            Recent Updates
          </h2>

          {message && <p className="text-red-500 text-sm mb-4">{message}</p>}

          {updates.length === 0 ? (
            <p className="text-gray-500">No updates found.</p>
          ) : (
            <ul className="space-y-4">
              {updates
                .sort(
                  (a, b) =>
                    new Date(b.progressDate) - new Date(a.progressDate)
                )
                .map(u => {
                  const text = u.templateText
                    ? renderTemplate(u.templateText, u.extraFields)
                    : u.freeText || '';
                  return (
                    <li
                      key={u.id}
                      className="border-l-4 border-indigo-500 pl-4"
                    >
                      <div className="flex justify-between">
                        <span className="font-medium text-indigo-600">
                          {u.category}
                        </span>
                        <span className="text-sm text-gray-500">
                          {new Date(u.progressDate).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="mt-1 text-gray-700 whitespace-pre-wrap">
                        {text}
                      </p>
                    </li>
                  );
                })}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
};

export default PublicUserProfile;
