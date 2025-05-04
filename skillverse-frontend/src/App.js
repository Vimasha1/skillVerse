                                                            import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './components/HomePage';
import CreatePostForm from './components/CreatePostForm';

import UserRegisterForm from './components/UserRegisterForm'; // Import User Register form
//import UserProfileList from './components/UserProfileList'; // Import User Profile List
//import UserProfileUpdate from './components/UserProfileUpdate'; // Import User Profile Update form

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

            {/*<Route path="/user-profiles" element={<UserProfileList />} />  User Profile List */}
            <Route path="/user-profiles/register" element={<UserRegisterForm />} /> {/* User Profile Register */}
            {/*<Route path="/user-profiles/update/:id" element={<UserProfileUpdate />} />  User Profile Update */}
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
