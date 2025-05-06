import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const UserRegisterForm = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [education, setEducation] = useState("");
  const [jobPosition, setJobPosition] = useState("");
  const [company, setCompany] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("🔍 Attempting registration with:", {
      username,
      firstName,
      lastName,
      email,
      phone,
      address,
      education,
      jobPosition,
      company,
      password,
      confirmPassword,
    });

    if (password !== confirmPassword) {
      alert("⚠️ Passwords do not match.");
      console.error("Passwords mismatch");
      return;
    }

    if (!window.confirm("Proceed with registration?")) {
      console.log("User cancelled registration");
      return;
    }

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
      console.log("▶️ Sending to backend:", userData);
      const response = await axios.post(
        "http://localhost:8081/api/user-profiles/create",
        userData
      );
      console.log("✅ Server response:", response.status, response.data);

      setMessage("Registration successful! Redirecting to login…");
      setMessageType("success");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      console.error("❌ Registration error:", err);
      if (err.response) {
        console.error("• Status:", err.response.status);
        console.error("• Data:", err.response.data);
        console.error("• Headers:", err.response.headers);
      }
      if (err.request) {
        console.error("• No response received, request was:", err.request);
      }
      console.error("• Error config:", err.config);
      console.error(err.stack);

      alert("There was an error creating the user profile. See console for details.");
      setMessage("Registration failed — check console logs.");
      setMessageType("error");
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-xl mt-10 mb-10">
      <h2 className="text-3xl font-bold text-center mb-6">Create Your Account</h2>
      {message && (
        <div
          className={`p-4 mb-4 text-white rounded-md ${
            messageType === "success" ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {message}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Info */}
        <div className="space-y-4">
          <h3 className="text-2xl font-semibold">Personal Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block">Username</label>
              <input
                className="w-full p-3 border rounded"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block">Password</label>
              <input
                type="password"
                className="w-full p-3 border rounded"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block">Confirm Password</label>
              <input
                type="password"
                className="w-full p-3 border rounded"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block">First Name</label>
              <input
                className="w-full p-3 border rounded"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block">Last Name</label>
              <input
                className="w-full p-3 border rounded"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="space-y-4">
          <h3 className="text-2xl font-semibold">Contact Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block">Email</label>
              <input
                type="email"
                className="w-full p-3 border rounded"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block">Phone</label>
              <input
                className="w-full p-3 border rounded"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
          </div>
          <div>
            <label className="block">Address</label>
            <textarea
              className="w-full p-3 border rounded"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Background Info */}
        <div className="space-y-4">
          <h3 className="text-2xl font-semibold">Background Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block">Education</label>
              <input
                className="w-full p-3 border rounded"
                value={education}
                onChange={(e) => setEducation(e.target.value)}
              />
            </div>
            <div>
              <label className="block">Job Position</label>
              <input
                className="w-full p-3 border rounded"
                value={jobPosition}
                onChange={(e) => setJobPosition(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className="block">Company</label>
            <input
              className="w-full p-3 border rounded"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default UserRegisterForm;
