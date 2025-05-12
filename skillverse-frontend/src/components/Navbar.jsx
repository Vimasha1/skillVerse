// src/components/Navbar.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const stored = sessionStorage.getItem('userProfile');
  const user = stored ? JSON.parse(stored) : null;

  const handleLogout = () => {
    sessionStorage.clear();
    navigate('/login');
  };

  return (
    <nav className="bg-gray-800 text-white px-6 py-4 flex items-center justify-between shadow-md">
      {/* LEFT: Brand and main nav */}
      <div className="flex items-center space-x-6">
        <Link to="/" className="text-xl font-bold hover:text-green-400">
          SkillVerse
        </Link>
        <Link to="/" className="hover:text-green-400">
          Home
        </Link>
        <Link to="/create" className="hover:text-green-400">
          Create Post
        </Link>
        <Link to="/plans" className="hover:text-green-400">
          Learning Plans
        </Link>
      </div>

      {/* RIGHT: Auth / Profile */}
      <div className="flex items-center space-x-4">
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
            <Link to="/login" className="hover:text-blue-300">
              Login
            </Link>
            <Link to="/user-profiles/register" className="hover:text-blue-300">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
