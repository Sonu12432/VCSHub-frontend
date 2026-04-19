import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../Navbar";
import { BookIcon, RepoIcon } from "@primer/octicons-react";
import HeatMapProfile from "./HeatMap";
import { useAuth } from "../../authContext";
const apiUrl = import.meta.env.VITE_API_URL;

const Profile = () => {
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState({ username: "username" });
  const { setCurrentUser } = useAuth();

  useEffect(() => {
    const fetchUserDetails = async () => {
      const userId = localStorage.getItem("userId");

      if (userId) {
        try {
          const response = await axios.get(
            `${apiUrl}/userProfile/${userId}`
          );
          setUserDetails(response.data);
        } catch (err) {
          console.error("Cannot fetch user details: ", err);
        }
      }
    };
    fetchUserDetails();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Navigation Tabs - Dark theme to match the original inline styles */}
      <div className="bg-gray-900 pt-4 px-4 sm:px-6 lg:px-8 border-b border-gray-700">
        <div className="max-w-7xl mx-auto flex gap-6">
          <button
            className="flex items-center gap-2 pb-3 px-1 border-b-2 border-orange-500 text-white font-medium text-sm hover:underline"
            aria-current="page"
          >
            <BookIcon />
            Overview
          </button>

          <button
            onClick={() => navigate("/repo")}
            className="flex items-center gap-2 pb-3 px-1 border-b-2 border-transparent text-gray-300 font-medium text-sm hover:text-white hover:border-gray-300 hover:underline transition-colors"
          >
            <RepoIcon />
            Starred Repositories
          </button>
        </div>
      </div>

      {/* Floating Logout Button */}
      <button
        onClick={() => {
          localStorage.removeItem("token");
          localStorage.removeItem("userId");
          setCurrentUser(null);
          window.location.href = "/auth";
        }}
        id="logout"
        className="fixed bottom-12 right-12 bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 px-6 rounded-full shadow-lg transition-transform hover:scale-105 z-50 flex items-center gap-2"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
        Logout
      </button>

      {/* Main Profile Content Wrapper */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Left Column: User Profile Section */}
          <div className="w-full md:w-1/4 flex flex-col">
            
            {/* Profile Image Placeholder */}
            <div className="w-64 h-64 rounded-full bg-gray-200 border border-gray-300 mb-4 overflow-hidden flex-shrink-0 shadow-sm relative">
              <svg className="absolute inset-0 w-full h-full text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>

            {/* Name */}
            <div className="mb-4">
              <h3 className="text-2xl font-bold text-gray-900">
                {userDetails.username}
              </h3>
            </div>

            {/* Follow Button */}
            <button className="w-full bg-gray-50 border border-gray-300 text-gray-700 font-semibold py-1.5 rounded-md hover:bg-gray-100 transition-colors mb-4 shadow-sm">
              Follow
            </button>

            {/* Followers / Following */}
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span className="hover:text-blue-600 cursor-pointer">
                <strong className="text-gray-900 font-semibold">10</strong> followers
              </span>
              <span className="hover:text-blue-600 cursor-pointer">
                <strong className="text-gray-900 font-semibold">3</strong> following
              </span>
            </div>
            
          </div>

          {/* Right Column: Heat Map Section */}
          <div className="w-full md:w-3/4">
            <div className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm overflow-x-auto">
              <h4 className="text-sm font-medium text-gray-900 mb-4">Contributions</h4>
              <HeatMapProfile />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Profile;