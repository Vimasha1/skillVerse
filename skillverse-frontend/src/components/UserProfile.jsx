import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const UserProfilePage = () => {
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState({
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    education: '',
    jobPosition: '',
    company: '',
    profilePicture: ''
  });
  const [progressUpdates, setProgressUpdates] = useState([]);
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const userId = '123'; // Assuming user ID is available in your context

  // Fetch user profile and progress updates data when the page loads
  useEffect(() => {
    axios.get(`http://localhost:8081/api/user-profiles/${userId}`)
      .then(response => setUserProfile(response.data))
      .catch(error => console.error("Error fetching user profile:", error));

    axios.get(`http://localhost:8081/api/progress/${userId}`)
      .then(response => setProgressUpdates(response.data))
      .catch(error => console.error("Error fetching progress updates:", error));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserProfile(prevState => ({ ...prevState, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpdateProfile = async () => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      await axios.put(`http://localhost:8081/api/user-profiles/update/${userId}`, userProfile);
      if (file) {
        await axios.post(`http://localhost:8081/api/user-profiles/upload/${userId}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      }
      setMessage("Profile updated successfully!");
    } catch (error) {
      setMessage("Error updating profile. Please try again.");
    }
  };

  const handleDeleteProfile = async () => {
    try {
      await axios.delete(`http://localhost:8081/api/user-profiles/delete/${userId}`);
      navigate('/login');
    } catch (error) {
      setMessage("Error deleting profile. Please try again.");
    }
  };

  const handleGoToProgressUpdates = () => {
    navigate('/progress-update');
  };

  const handleEditProgress = (id) => {
    // Navigate to the progress update edit page, passing the ID
    navigate(`/progress-update/edit/${id}`);
  };

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white rounded-lg shadow-lg mt-10">
      <h2 className="text-3xl font-bold text-center">User Profile</h2>
      {message && <div className="mt-4 text-center text-red-600">{message}</div>}
      <div className="mt-8 space-y-6">
        <div className="flex items-center justify-center">
          <input
            type="file"
            onChange={handleFileChange}
            className="hidden"
            id="profilePic"
          />
          <label htmlFor="profilePic" className="cursor-pointer">
            <img
              src={userProfile.profilePicture || 'https://via.placeholder.com/150'}
              alt="Profile"
              className="w-32 h-32 rounded-full border-2 border-gray-300"
            />
            <p className="mt-2 text-center text-sm text-blue-500">Change Picture</p>
          </label>
        </div>

        <div>
          <label className="block font-medium">Username</label>
          <input
            type="text"
            name="username"
            value={userProfile.username}
            onChange={handleChange}
            className="w-full p-3 mt-2 border rounded-lg"
            disabled
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-medium">First Name</label>
            <input
              type="text"
              name="firstName"
              value={userProfile.firstName}
              onChange={handleChange}
              className="w-full p-3 mt-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block font-medium">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={userProfile.lastName}
              onChange={handleChange}
              className="w-full p-3 mt-2 border rounded-lg"
            />
          </div>
        </div>

        <div>
          <label className="block font-medium">Email</label>
          <input
            type="email"
            name="email"
            value={userProfile.email}
            onChange={handleChange}
            className="w-full p-3 mt-2 border rounded-lg"
          />
        </div>

        <div>
          <label className="block font-medium">Phone</label>
          <input
            type="text"
            name="phone"
            value={userProfile.phone}
            onChange={handleChange}
            className="w-full p-3 mt-2 border rounded-lg"
          />
        </div>

        <div>
          <label className="block font-medium">Address</label>
          <input
            type="text"
            name="address"
            value={userProfile.address}
            onChange={handleChange}
            className="w-full p-3 mt-2 border rounded-lg"
          />
        </div>

        <div>
          <label className="block font-medium">Education</label>
          <input
            type="text"
            name="education"
            value={userProfile.education}
            onChange={handleChange}
            className="w-full p-3 mt-2 border rounded-lg"
          />
        </div>

        <div>
          <label className="block font-medium">Job Position</label>
          <input
            type="text"
            name="jobPosition"
            value={userProfile.jobPosition}
            onChange={handleChange}
            className="w-full p-3 mt-2 border rounded-lg"
          />
        </div>

        <div>
          <label className="block font-medium">Company</label>
          <input
            type="text"
            name="company"
            value={userProfile.company}
            onChange={handleChange}
            className="w-full p-3 mt-2 border rounded-lg"
          />
        </div>

        <div className="flex justify-between mt-6">
          <button
            onClick={handleUpdateProfile}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Update Profile
          </button>
          <button
            onClick={handleDeleteProfile}
            className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            Delete Profile
          </button>
        </div>


        {/* Progress Updates Section */}
        <div className="mt-8">
          <h3 className="text-2xl font-semibold">Progress Updates</h3>
          <div className="mt-4">
            {progressUpdates.map((update) => (
              <div key={update.id} className="mb-4 p-4 bg-gray-100 rounded-lg">
                <h4 className="text-xl font-bold">{update.updateType}</h4>
                <p className="mt-2">{update.updateText}</p>
                <div className="flex justify-between mt-4">
                  <button
                    onClick={() => handleEditProgress(update.id)}
                    className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 text-center">
          <button
            onClick={handleGoToProgressUpdates}
            className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            Add Progress Updates
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
