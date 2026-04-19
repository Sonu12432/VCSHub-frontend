import React from "react";
import { Link } from "react-router-dom";
import vcsLogo from "../assets/VCSHubLogo.svg";

const Navbar = () => {
  return (
    <nav className="bg-gray-900 text-white shadow-md">
      {/* max-w-7xl keeps it perfectly aligned with the Dashboard */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Left Side: Logo and Brand Name */}
          <Link 
            to="/" 
            className="flex items-center gap-3 hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-gray-400 rounded-md"
          >
            <img
              src={vcsLogo}
              alt="VCSHub Logo"
              // Added a white background and slight padding so the black logo pops against the dark navbar
              className="h-9 w-9 bg-white rounded-full object-cover scale-110 shadow-sm p-0.5" 
            />
            <h3 className="text-xl font-bold tracking-tight">VCSHub</h3>
          </Link>

          {/* Right Side: Navigation Links */}
          <div className="flex items-center gap-6">
            <Link 
              to="/repo/create"
              className="text-sm font-medium text-gray-200 hover:text-white hover:bg-gray-800 px-3 py-2 rounded-md transition-colors"
            >
              Create a Repository
            </Link>
            
            <Link 
              to="/profile"
              className="text-sm font-medium text-gray-200 hover:text-white hover:bg-gray-800 px-3 py-2 rounded-md transition-colors flex items-center gap-2"
            >
              Profile
            </Link>
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;