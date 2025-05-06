// src/components/UserProfile.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const UserProfilePage = () => {
  const navigate = useNavigate();
  const stored = sessionStorage.getItem('userProfile');
  const initialProfile = stored ? JSON.parse(stored) : null;
  const userId = initialProfile?.id;

  const [userProfile, setUserProfile] = useState(initialProfile);
  const [progressUpdates, setProgressUpdates] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!initialProfile) navigate('/login');
  }, [initialProfile, navigate]);

  useEffect(() => {
    if (!userId) return;
    axios.get(`http://localhost:8081/api/user-profiles/${userId}`)
      .then(res => setUserProfile(res.data))
      .catch(err => console.error(err));
    axios.get(`http://localhost:8081/api/progress/${userId}`)
      .then(res => setProgressUpdates(res.data))
      .catch(err => console.error(err));
  }, [userId]);

  const handleLogout = () => {
    sessionStorage.clear();
    delete axios.defaults.headers.common['Authorization'];
    navigate('/login');
  };

  const handleDeleteProfile = async () => {
    try {
      await axios.delete(`http://localhost:8081/api/user-profiles/delete/${userId}`);
      sessionStorage.clear();
      delete axios.defaults.headers.common['Authorization'];
      navigate('/login');
    } catch {
      setMessage('Error deleting profile.');
    }
  };

  const handleGoToEdit = () => navigate(`/user-profiles/edit/${userId}`);
  const handleGoToAddProgress = () => navigate('/progress-update');
  const handleEditProgress = id => navigate(`/progress-update/edit/${id}`);
  const handleDeleteProgress = async id => {
    try {
      await axios.delete(`http://localhost:8081/api/progress/delete/${id}`);
      setProgressUpdates(prev => prev.filter(u => u.id !== id));
    } catch {
      setMessage('Error deleting update.');
    }
  };

  if (!userProfile) return null;

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white rounded-lg shadow-lg mt-10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Your Profile</h2>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      {message && <div className="mb-4 text-center text-red-600">{message}</div>}

      {/* Profile Info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {[
          'username','firstName','lastName',
          'email','phone','address',
          'education','jobPosition','company'
        ].map(field => (
          <div key={field}>
            <label className="block font-medium">
              {field.charAt(0).toUpperCase() + field.slice(1)}
            </label>
            <input
              type={field === 'email' ? 'email' : 'text'}
              name={field}
              value={userProfile[field]}
              readOnly
              className="w-full p-3 mt-2 border rounded-lg bg-gray-100 cursor-not-allowed"
            />
          </div>
        ))}
      </div>

      <div className="flex justify-between mb-10">
        <button
          onClick={handleGoToEdit}
          className="px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Edit Profile
        </button>
        <button
          onClick={handleDeleteProfile}
          className="px-6 py-3 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Delete Account
        </button>
      </div>

      {/* Progress Updates */}
      <h3 className="text-2xl font-semibold mb-4">Progress Updates</h3>
      {progressUpdates.length === 0 ? (
        <p className="text-gray-600">No updates yet.</p>
      ) : (
        <div className="space-y-4 mb-6">
          {progressUpdates.map(update => (
            <div
              key={update.id}
              className="p-4 bg-gray-100 rounded-lg flex justify-between"
            >
              <div>
                <h4 className="font-bold">{update.updateType}</h4>
                <p className="mt-1">{update.updateText}</p>
                <p className="text-sm text-gray-500">
                  {new Date(update.progressDate).toLocaleString()}
                </p>
              </div>
              <div className="space-x-2">
                <button
                  onClick={() => handleEditProgress(update.id)}
                  className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteProgress(update.id)}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="text-center">
        <button
          onClick={handleGoToAddProgress}
          className="px-6 py-3 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Add New Update
        </button>
      </div>
    </div>
  );
};

export default UserProfilePage;
