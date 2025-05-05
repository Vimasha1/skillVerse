import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="bg-indigo-900 text-white px-6 py-4 flex items-center space-x-6">
      <Link to="/" className="font-bold text-xl">SkillVerse</Link>
      <Link to="/" className="hover:underline">Home</Link>
      <Link to="/create" className="hover:underline">Create Post</Link>
      <Link to="/plans" className="hover:underline">Learning Plans</Link>
    </nav>
  );
}
