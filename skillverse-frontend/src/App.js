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
import UserProfileRegisterForm from './components/UserRegisterForm';   // User Registration Form
import EditProgressUpdateForm from './components/EditProgressUpdateForm';
import AllProgessUpdates from './components/AllProgressUpdates'; // All Progress Updates
import ProgressUpdateFeed from './components/ProgressUpdateFeed'; // All Progress Updates
import PublicUserProfile from './components/PublicUserProfile'; // Public User Profile
import ResumeGenerator from './components/ResumeGenerator';

import AdminDashboard from './admin/AdminDashboard';
import AdminPosts from './admin/AdminPosts';
import AdminPlans from './admin/AdminPlans';
import AdminUsers from './admin/AdminUsers';
import './index.css'; // Tailwind CSS styles

// src/App.jsx
import EditPostForm from './components/EditPostForm';







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
<Route path="/posts/:id/edit" element={<EditPostForm />} />

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
            <Route path="/user-profiles/register" element={<UserProfileRegisterForm />} />
            <Route path="/public-profile/:id" element={<PublicUserProfile />} />
            <Route path="/resume" element={<ResumeGenerator />} />

            {/* Progress Updates */}
            <Route path="/progress-update" element={<ProgressUpdatePage />} />
            <Route path="/progress-update/edit/:id" element={<EditProgressUpdateForm />} />
            <Route path="/all-progress-updates" element={<AllProgessUpdates />} />
            <Route path="/progress-feed" element={<ProgressUpdateFeed />} />
            
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/posts" element={<AdminPosts />} />
            <Route path="/admin/learning-plans" element={<AdminPlans />} />
            <Route path="/admin/users" element={<AdminUsers />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
