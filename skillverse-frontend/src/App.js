// src/App.jsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import HomePage from './components/HomePage';
import CreatePostForm from './components/CreatePostForm';

import LearningPlanList from './components/LearningPlanList';
import CreateLearningPlanForm from './components/CreateLearningPlanForm';
import PlanDetailPage from './components/PlanDetailPage';

import UserProfilePage from './components/UserProfile';              // User Profile Page
import LoginPage from './components/LoginPage';                     // Login Page
import ProgressUpdatePage from './components/ProgressUpdatePage';   // Progress Update Page
import UserProfileUpdateForm from './components/UserProfileUpdateForm'; // Profile Edit Form

import './App.css';

function App() {
  return (
    <Router>
      <div className="bg-gray-100 min-h-screen">
        <Navbar />
        <div className="p-6 max-w-3xl mx-auto">
          <Routes>
            {/* Home & Posts */}
            <Route path="/" element={<HomePage />} />
            <Route path="/create" element={<CreatePostForm />} />

            {/* Learning Plans CRUD */}
            <Route path="/plans" element={<LearningPlanList />} />
            <Route path="/plans/create" element={<CreateLearningPlanForm />} />
            <Route path="/plans/:id" element={<PlanDetailPage />} />
            <Route
              path="/plans/:id/edit"
              element={<CreateLearningPlanForm editMode />}
            />

            {/* User Profile & Authentication */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/user-profiles/:id" element={<UserProfilePage />} />
            <Route path="/user-profiles/edit/:id" element={<UserProfileUpdateForm />} />

            {/* Progress Updates */}
            <Route path="/progress-update" element={<ProgressUpdatePage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
