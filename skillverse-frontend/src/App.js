import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './components/HomePage';
import CreatePostForm from './components/CreatePostForm';

import UserProfilePage from './components/UserProfile'; // Import User Profile Page
import LoginPage from './components/LoginPage'; // Import Login page
import ProgressUpdatePage from './components/ProgressUpdatePage'; // Import ProgressUpdate page
import UserProfileUpdateForm from './components/UserProfileUpdateForm';

import './App.css';

function App() {
  return (
    <Router>
      <div className="bg-gray-100 min-h-screen">
        <Navbar />
        <div className="p-6 max-w-3xl mx-auto">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/create" element={<CreatePostForm />} />
            <Route path="/user-profiles/:id" element={<UserProfilePage />} /> {/* User Profile Page */}
            <Route path="/login" element={<LoginPage />} /> {/* Login Page */}
            <Route path="/progress-update" element={<ProgressUpdatePage />} /> {/* Progress Update Page */}
            <Route path="/user-profiles/edit/:id" element={<UserProfileUpdateForm />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
