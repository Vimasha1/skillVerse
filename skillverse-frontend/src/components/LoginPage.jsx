// src/components/LoginPage.jsx

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { FaGoogle, FaLinkedin } from 'react-icons/fa';

const LoginPage = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      // 1) Authenticate
      const loginRes = await axios.post(
        'http://localhost:8081/api/auth/login',
        credentials,
        { withCredentials: true }
      );
      const { token, userId } = loginRes.data;

      // 2) Store token & set default header
      sessionStorage.setItem('authToken', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      // 3) (Optional) pre-fetch & store profile
      const profileRes = await axios.get(
        `http://localhost:8081/api/user-profiles/${userId}`
      );
      sessionStorage.setItem('userProfile', JSON.stringify(profileRes.data));

      // 4) Redirect to the main user-profiles page
      navigate('/user-profiles');
    } catch (error) {
      console.error('Login error:', error);
      let msg = 'Invalid credentials. Please try again.';
      if (error.response && error.response.data) {
        const data = error.response.data;
        msg = typeof data === 'object'
          ? (data.message || JSON.stringify(data))
          : data;
      }
      setMessage(msg);
    }
  };

  const handleGoogleLogin = () => {
    // Replace with your backend’s Google OAuth endpoint
    window.location.href = 'http://localhost:8081/api/auth/google';
  };

  const handleLinkedInLogin = () => {
    // Replace with your backend’s LinkedIn OAuth endpoint
    window.location.href = 'http://localhost:8081/api/auth/linkedin';
  };

  return (
    <div className="max-w-sm mx-auto p-6 bg-white rounded-lg shadow-lg mt-10">
      <h2 className="text-3xl font-bold text-center">Login</h2>
      {message && (
        <div className="mt-4 text-center text-red-600">{message}</div>
      )}
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label className="block font-medium">Username</label>
          <input
            type="text"
            name="username"
            value={credentials.username}
            onChange={handleChange}
            className="w-full p-3 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block font-medium">Password</label>
          <input
            type="password"
            name="password"
            value={credentials.password}
            onChange={handleChange}
            className="w-full p-3 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="mt-6 text-center">
          <button
            type="submit"
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Login
          </button>
        </div>
      </form>

      {/* OAuth Buttons */}
      <div className="mt-6 space-y-3">
        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center px-4 py-2 border rounded-lg hover:bg-gray-100 transition"
        >
          <FaGoogle className="mr-2 text-red-500" /> Login with Google
        </button>
        <button
          onClick={handleLinkedInLogin}
          className="w-full flex items-center justify-center px-4 py-2 border rounded-lg hover:bg-gray-100 transition"
        >
          <FaLinkedin className="mr-2 text-blue-700" /> Login with LinkedIn
        </button>
      </div>

      {/* Links */}
      <div className="mt-4 flex justify-between text-sm">
        <Link
          to="/forgot-password"
          className="text-blue-500 hover:underline"
        >
          Forgot password?
        </Link>
        <Link
          to="/user-profiles/register"
          className="text-blue-500 hover:underline"
        >
          Don’t have an account? Register
        </Link>
      </div>
    </div>
  );
};

export default LoginPage;
