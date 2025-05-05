import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

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
    try {
      const response = await axios.post("http://localhost:8081/api/auth/login", credentials);
      if (response.status === 200) {
        navigate('/user-profile');
      }
    } catch (error) {
      setMessage("Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="max-w-sm mx-auto p-6 bg-white rounded-lg shadow-lg mt-10">
      <h2 className="text-3xl font-bold text-center">Login</h2>
      {message && <div className="mt-4 text-center text-red-600">{message}</div>}
      <form onSubmit={handleSubmit} className="mt-6">
        <div>
          <label className="block font-medium">Username</label>
          <input
            type="text"
            name="username"
            value={credentials.username}
            onChange={handleChange}
            className="w-full p-3 mt-2 border rounded-lg"
            required
          />
        </div>

        <div className="mt-4">
          <label className="block font-medium">Password</label>
          <input
            type="password"
            name="password"
            value={credentials.password}
            onChange={handleChange}
            className="w-full p-3 mt-2 border rounded-lg"
            required
          />
        </div>

        <div className="mt-6 text-center">
          <button
            type="submit"
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Login
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
