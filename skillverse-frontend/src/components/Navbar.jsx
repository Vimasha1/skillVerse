// src/components/Navbar.jsx

import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="bg-gray-800 text-white px-6 py-4 flex items-center justify-between shadow-md">
      {/* Left side links */}
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

      {/* Right side auth & profile */}
      <div className="flex items-center space-x-4">
        <Link to="/login" className="hover:text-blue-300">
          Login
        </Link>
        <Link to="/user-profiles/register" className="hover:text-blue-300">
          Register
        </Link>
        <Link to="/user-profiles/:id">
          <img
            src="https://via.placeholder.com/30"
            alt="Profile"
            className="rounded-full w-8 h-8 border-2 border-white cursor-pointer"
          />
        </Link>
      </div>
    </nav>
  );
}
