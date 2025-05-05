import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const UserRegisterForm = () => {
  const navigate = useNavigate();  // useNavigate for programmatic navigation
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [education, setEducation] = useState("");
  const [jobPosition, setJobPosition] = useState("");
  const [company, setCompany] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");  // "success" or "error"

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userData = {
      username,
      password,
      firstName,
      lastName,
      email,
      phone,
      address,
      education,
      jobPosition,
      company,
    };

    try {
      // Post data to backend
      const response = await axios.post("http://localhost:8081/api/user-profiles", userData);

      // Log the response data for debugging
      console.log(response.data);

      // Set success message and display it
      setMessage("Registration successful! Please log in.");
      setMessageType("success");

      // Redirect to login page after 2 seconds
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      // If an error occurs, log it and display an error message
      console.error("There was an error creating the user profile!", error);
      setMessage("There was an error. Please try again.");
      setMessageType("error");
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-xl mt-10 mb-10">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Create Your Account</h2>

      {message && (
        <div
          className={`p-4 mb-4 text-white rounded-md ${messageType === "success" ? "bg-green-500" : "bg-red-500"}`}
        >
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Information Section */}
        <div className="space-y-4">
          <h3 className="text-2xl font-semibold text-gray-700 mb-2">Personal Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
              <input
                type="text"
                id="username"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                id="password"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name</label>
              <input
                type="text"
                id="firstName"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name</label>
              <input
                type="text"
                id="lastName"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
          </div>
        </div>

        {/* Contact Information Section */}
        <div className="space-y-4">
          <h3 className="text-2xl font-semibold text-gray-700 mb-2">Contact Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                id="email"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
              <input
                type="text"
                id="phone"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="mb-4">
            <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
            <textarea
              id="address"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            ></textarea>
          </div>
        </div>

        {/* Background Information Section */}
        <div className="space-y-4">
          <h3 className="text-2xl font-semibold text-gray-700 mb-2">Background Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="education" className="block text-sm font-medium text-gray-700">Education</label>
              <input
                type="text"
                id="education"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={education}
                onChange={(e) => setEducation(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="jobPosition" className="block text-sm font-medium text-gray-700">Job Position</label>
              <input
                type="text"
                id="jobPosition"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={jobPosition}
                onChange={(e) => setJobPosition(e.target.value)}
              />
            </div>
          </div>
          <div className="mb-4">
            <label htmlFor="company" className="block text-sm font-medium text-gray-700">Company</label>
            <input
              type="text"
              id="company"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default UserRegisterForm;
