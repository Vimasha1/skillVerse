// src/components/UserProfileUpdateForm.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const UserProfileUpdateForm = () => {
  const { id } = useParams();            // URL param
  const navigate = useNavigate();

  // Form state
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // "success" or "error"

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [education, setEducation] = useState('');
  const [jobPosition, setJobPosition] = useState('');
  const [company, setCompany] = useState('');

  // Load existing values
  useEffect(() => {
    axios
      .get(`http://localhost:8081/api/user-profiles/${id}`)
      .then(res => {
        const u = res.data;
        setFirstName(u.firstName);
        setLastName(u.lastName);
        setEmail(u.email);
        setPhone(u.phone);
        setAddress(u.address);
        setEducation(u.education);
        setJobPosition(u.jobPosition);
        setCompany(u.company);
      })
      .catch(err => {
        console.error('Error loading profile:', err);
        setMessage('Failed to load profile.');
        setMessageType('error');
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    // Password check
    if (newPassword || confirmPassword) {
      if (newPassword !== confirmPassword) {
        setMessage('Passwords do not match.');
        setMessageType('error');
        return;
      }
    }

    if (!window.confirm('Save these changes?')) return;

    // Build payload
    const payload = {
      ...(newPassword ? { password: newPassword } : {}),
      firstName, lastName,
      email, phone, address,
      education, jobPosition, company
    };

    try {
      const res = await axios.put(
        `http://localhost:8081/api/user-profiles/update/${id}`,
        payload
      );
      console.log('✔️ Update response:', res.status, res.data);
      setMessage('Profile updated successfully!');
      setMessageType('success');

      // Redirect back to profile page
      navigate(`/user-profiles/${id}`);
    } catch (error) {
      // Detailed logging
      console.error('❌ Error saving profile:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      const errMsg =
        error.response?.data?.message ||
        `Status ${error.response?.status}: ${error.message}`;
      setMessage(errMsg);
      setMessageType('error');
    }
  };

  if (loading) return <div className="p-6 text-center">Loading…</div>;

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-xl mt-10 mb-10">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Edit Profile</h2>

      {message && (
        <div className={`p-4 mb-4 text-white rounded-md ${
          messageType === 'success' ? 'bg-green-500' : 'bg-red-500'
        }`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal */}
        <div className="space-y-4">
          <h3 className="text-2xl font-semibold text-gray-700">Personal Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* First */}
            <div>
              <label className="block text-sm font-medium text-gray-700">First Name</label>
              <input
                type="text"
                className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500"
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
                required
              />
            </div>
            {/* Last */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Last Name</label>
              <input
                type="text"
                className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500"
                value={lastName}
                onChange={e => setLastName(e.target.value)}
                required
              />
            </div>
            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700">New Password</label>
              <input
                type="password"
                className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                placeholder="Leave blank to keep"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
              <input
                type="password"
                className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
              />
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="space-y-4">
          <h3 className="text-2xl font-semibold text-gray-700">Contact Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone</label>
              <input
                type="text"
                className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500"
                value={phone}
                onChange={e => setPhone(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Address</label>
            <textarea
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500"
              value={address}
              onChange={e => setAddress(e.target.value)}
            />
          </div>
        </div>

        {/* Background */}
        <div className="space-y-4">
          <h3 className="text-2xl font-semibold text-gray-700">Background Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Education</label>
              <input
                type="text"
                className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500"
                value={education}
                onChange={e => setEducation(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Job Position</label>
              <input
                type="text"
                className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500"
                value={jobPosition}
                onChange={e => setJobPosition(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Company</label>
            <input
              type="text"
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500"
              value={company}
              onChange={e => setCompany(e.target.value)}
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:ring-2 focus:ring-blue-500"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default UserProfileUpdateForm;
