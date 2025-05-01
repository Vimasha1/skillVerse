import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './components/HomePage';
import CreatePostForm from './components/CreatePostForm';
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
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
