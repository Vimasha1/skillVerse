// src/components/Navbar.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BellIcon } from '@heroicons/react/24/outline';

export default function Navbar() {
  const navigate = useNavigate();
  const stored = sessionStorage.getItem('userProfile');
  const user = stored ? JSON.parse(stored) : null;
  const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8081';

  const [notifications, setNotifications] = useState([]);
  const [showNotif, setShowNotif] = useState(false);
  const dropdownRef = useRef();

  // fetch notifications on mount / username change
  useEffect(() => {
    if (!user) return;
    fetch(`${BASE_URL}/api/notifications/recipient/${encodeURIComponent(user.username)}`)
      .then(r => r.json())
      .then(data => setNotifications(data))
      .catch(err => console.error('Failed loading notifications', err));
  }, [user, BASE_URL]);

  // close dropdown on outside click
  useEffect(() => {
    const handleClick = e => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowNotif(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleLogout = () => {
    sessionStorage.clear();
    navigate('/login');
  };

  const toggleDropdown = () => setShowNotif(v => !v);

  const markAllRead = () => {
    if (!user) return;
    fetch(
      `${BASE_URL}/api/notifications/${encodeURIComponent(user.username)}/mark-read`,
      { method: 'POST' }
    )
      .then(() => {
        // optimistically mark all as read
        setNotifications(ns => ns.map(n => ({ ...n, read: true })));
      })
      .catch(console.error);
  };

  return (
    <nav className="bg-gray-800 text-white px-6 py-4 flex items-center justify-between shadow-md relative">
      {/* LEFT: Brand + links */}
      <div className="flex items-center space-x-6">
        <Link to="/" className="text-xl font-bold hover:text-green-400">SkillVerse</Link>
        <Link to="/" className="hover:text-green-400">Home</Link>
        <Link to="/create" className="hover:text-green-400">Create Post</Link>
        <Link to="/plans" className="hover:text-green-400">Learning Plans</Link>
        <Link to="/progress-feed" className="hover:text-green-400">Progress Updates</Link>
      </div>

      {/* RIGHT: Notifications + Profile */}
      <div className="flex items-center space-x-4">
        {user && (
          <div className="relative" ref={dropdownRef}>
            <button onClick={toggleDropdown} className="relative p-1 hover:text-green-400">
              <BellIcon className="w-6 h-6" />
              {notifications.some(n => !n.read) && (
                <span className="absolute top-0 right-0 inline-block w-2 h-2 bg-red-500 rounded-full" />
              )}
            </button>
            {showNotif && (
              <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto bg-white text-black rounded shadow-lg z-50">
                <div className="flex justify-between items-center px-4 py-2 border-b">
                  <span className="font-semibold">Notifications</span>
                  <button
                    onClick={markAllRead}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Mark all read
                  </button>
                </div>
                {notifications.length === 0 ? (
                  <div className="p-4 text-gray-600">No notifications</div>
                ) : (
                  notifications.map(n => (
                    <div
                      key={n.id}
                      className={`px-4 py-2 border-b ${
                        n.read ? '' : 'bg-gray-100'
                      }`}
                    >
                      <p className="text-sm">
                        <span className="font-semibold">{n.actorUsername}</span>{' '}
                        {n.type.toLowerCase()} your post
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(n.createdAt).toLocaleString()}
                      </p>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}

        {user ? (
          <>
            <Link
              to={`/user-profiles/${user.id}`}
              className="flex items-center space-x-2 hover:text-green-400"
            >
              <img
                src={user.profilePicture || 'https://via.placeholder.com/30'}
                alt="Profile"
                className="w-8 h-8 rounded-full border-2 border-white object-cover"
              />
              <span className="hidden sm:inline">{user.firstName}</span>
            </Link>
            <button
              onClick={handleLogout}
              className="px-3 py-1 bg-red-500 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:text-blue-300">Login</Link>
            <Link to="/user-profiles/register" className="hover:text-blue-300">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
