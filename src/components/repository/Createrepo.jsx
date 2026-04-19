import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../authContext";
const apiUrl = import.meta.env.VITE_API_URL;

const CreateRepo = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth(); // Grabbing the logged-in userID

  // UI State
  const [uiState, setUiState] = useState({
    name: "",
    description: "",
    isPublic: true,    // true = Public, false = Private
    addReadme: true,   // Checkbox toggle
  });

  // Network State
  const [status, setStatus] = useState({ 
    loading: false, 
    error: null, 
    success: false 
  });

  // Handle Input Changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Convert radio button string values back to Booleans for Mongoose
    if (name === "isPublic") {
      setUiState({ ...uiState, isPublic: value === "true" });
      return;
    }

    setUiState({
      ...uiState,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Form Submission & Axios Call
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, error: null, success: false });

    // EXACT MAP TO MONGOOSE SCHEMA
    const schemaPayload = {
      name: uiState.name,
      description: uiState.description,
      visibility: uiState.isPublic,
      content: uiState.addReadme ? ["README.md"] : [], // Array of Strings
      issues: [], // Starts empty
      owner: currentUser,
    };

    try {
      // Grabbing the JWT token saved during Login/Signup
      const token = localStorage.getItem("token");

      // Making the Axios POST request to the Express backend
      const res = await axios.post("${apiUrl}/repo/create", schemaPayload, {
        headers: {
          "Authorization": `Bearer ${token}` 
        }
      });

      console.log("Server responded:", res.data);
      setStatus({ loading: false, error: null, success: true });

      setTimeout(() => {
        navigate(`/repo/${res.data.repositoryID}`);
      }, 1000);

    } catch (error) {
      console.error("Failed to create repository:", error);
      
      // Safely grabbing the error message from the Express backend
      const errorMessage = error.response?.data?.message || "Failed to create repository. Please try again.";
      setStatus({ loading: false, error: errorMessage, success: false });
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="border-b border-gray-200 pb-4 mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">Create a new repository</h2>
        <p className="text-gray-500 text-sm mt-1">
          A repository contains all project files, including the revision history.
        </p>
      </div>

      {/* Error Banner */}
      {status.error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 border border-red-200 rounded-md text-sm">
          {status.error}
        </div>
      )}

      {/* Success Banner */}
      {status.success && (
        <div className="mb-4 p-3 bg-green-50 text-green-700 border border-green-200 rounded-md text-sm">
          Repository created successfully! Redirecting...
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Owner and Repository Name */}
        <div className="flex items-end gap-4">
          <div className="w-1/3">
            <label className="block text-sm font-medium text-gray-700 mb-1">Owner *</label>
            <input
              type="text"
              disabled
              value={currentUser}
              className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-50 text-gray-600 cursor-not-allowed focus:outline-none"
            />
          </div>
          <span className="text-2xl text-gray-400 mb-1">/</span>
          <div className="w-2/3">
            <label className="block text-sm font-medium text-gray-700 mb-1">Repository name *</label>
            <input
              type="text"
              name="name"
              required
              value={uiState.name}
              onChange={handleChange}
              disabled={status.loading || status.success}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
              placeholder="e.g., New-repository"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <textarea
            name="description"
            value={uiState.description}
            onChange={handleChange}
            disabled={status.loading || status.success}
            rows="3"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
          ></textarea>
        </div>

        <hr className="border-gray-200" />

        {/* Visibility */}
        <div className="space-y-3">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="radio"
              name="isPublic"
              value="true"
              checked={uiState.isPublic === true}
              onChange={handleChange}
              disabled={status.loading || status.success}
              className="mt-1 h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
            />
            <div>
              <span className="block text-sm font-medium text-gray-900">Public</span>
              <span className="block text-sm text-gray-500">Anyone on the internet can see this repository.</span>
            </div>
          </label>

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="radio"
              name="isPublic"
              value="false"
              checked={uiState.isPublic === false}
              onChange={handleChange}
              disabled={status.loading || status.success}
              className="mt-1 h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
            />
            <div>
              <span className="block text-sm font-medium text-gray-900">Private</span>
              <span className="block text-sm text-gray-500">You choose who can see and commit to this repository.</span>
            </div>
          </label>
        </div>

        <hr className="border-gray-200" />

        {/* Initialization Options */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Initialize this repository with:</h3>
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="addReadme"
                checked={uiState.addReadme}
                onChange={handleChange}
                disabled={status.loading || status.success}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Add a README file</span>
            </label>
          </div>
        </div>

        <hr className="border-gray-200" />

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={status.loading || status.success || !uiState.name.trim()}
            className="bg-green-600 text-white px-6 py-2 rounded-md font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {status.loading ? "Creating..." : "Create repository"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateRepo;