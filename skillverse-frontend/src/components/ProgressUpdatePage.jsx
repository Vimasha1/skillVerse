import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ProgressUpdatePage = () => {
  const navigate = useNavigate();
  
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [customUpdate, setCustomUpdate] = useState("");
  const [updateType, setUpdateType] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");  // success or error

  useEffect(() => {
    // Fetch the progress templates from backend
    axios
      .get("http://localhost:8081/api/templates")
      .then((response) => {
        setTemplates(response.data);
      })
      .catch((error) => {
        console.error("Error fetching templates:", error);
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updateData = {
      template: selectedTemplate,
      customUpdate,
      updateType,
    };

    try {
      const response = await axios.post("http://localhost:8081/api/progress", updateData);
      setMessage("Progress update added successfully!");
      setMessageType("success");
      setTimeout(() => navigate("/user-profiles"), 2000); // Redirect after 2 seconds
    } catch (error) {
      console.error("There was an error submitting the progress update!", error);
      setMessage("There was an error. Please try again.");
      setMessageType("error");
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-xl mt-10 mb-10">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Add Your Progress Update</h2>

      {message && (
        <div
          className={`p-4 mb-4 text-white rounded-md ${messageType === "success" ? "bg-green-500" : "bg-red-500"}`}
        >
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Progress Template Section */}
        <div className="space-y-4">
          <h3 className="text-2xl font-semibold text-gray-700 mb-2">Choose a Progress Template</h3>
          <div className="mb-4">
            <label htmlFor="template" className="block text-sm font-medium text-gray-700">Select Template</label>
            <select
              id="template"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedTemplate}
              onChange={(e) => setSelectedTemplate(e.target.value)}
            >
              <option value="">-- Choose Template --</option>
              {templates.map((template) => (
                <option key={template.id} value={template.templateText}>
                  {template.templateText}
                </option>
              ))}
            </select>
          </div>

          {/* Customize Update Section */}
          <div className="mb-4">
            <label htmlFor="customUpdate" className="block text-sm font-medium text-gray-700">Custom Progress Update</label>
            <textarea
              id="customUpdate"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={customUpdate}
              onChange={(e) => setCustomUpdate(e.target.value)}
              placeholder="Enter your custom update here..."
              rows="4"
            ></textarea>
          </div>
        </div>

        {/* Update Type Section */}
        <div className="space-y-4">
          <h3 className="text-2xl font-semibold text-gray-700 mb-2">Select Update Type</h3>
          <div className="mb-4">
            <label htmlFor="updateType" className="block text-sm font-medium text-gray-700">Choose Update Type</label>
            <select
              id="updateType"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={updateType}
              onChange={(e) => setUpdateType(e.target.value)}
            >
              <option value="">-- Choose Update Type --</option>
              <option value="achievement">Achievement</option>
              <option value="goal">Goal</option>
              <option value="milestone">Milestone</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Submit Progress Update
        </button>
      </form>
    </div>
  );
};

export default ProgressUpdatePage;
