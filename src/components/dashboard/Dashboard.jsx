import React, { useState, useEffect } from "react";
import Navbar from "../Navbar"; // Assuming Navbar has its own Tailwind styling
import { Link } from "react-router-dom";
const apiUrl = import.meta.env.VITE_API_URL;

const Dashboard = () => {
  const [repositories, setRepositories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  
  // 1. REPLACED state for Starred Repositories
  const [starredRepos, setStarredRepos] = useState([]);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token"); // Needed for the protected route

    const fetchRepositories = async () => {
      try {
        const response = await fetch(
          `${apiUrl}/repo/user/${userId}`
        );
        const data = await response.json();
        setRepositories(data.repositories);
      } catch (err) {
        console.error("Error while fetching repositories: ", err);
      }
    };

    // 2. NEW Fetch Logic for Starred Repos
    const fetchStarredRepos = async () => {
      try {
        const response = await fetch(`${apiUrl}/user/starred`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const data = await response.json();
        // Fallback to empty array if data.starred is undefined
        setStarredRepos(data.starred || []); 
      } catch (err) {
        console.error("Error while fetching starred repositories: ", err);
      }
    };

    if (!userId || userId === 'null') {
        return; 
    }

    fetchRepositories();
    fetchStarredRepos();
  }, []);

  useEffect(() => {
    if (searchQuery === "") {
      setSearchResults(repositories);
    } else {
      const filteredRepo = repositories.filter((repo) =>
        repo.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(filteredRepo);
    }
  }, [searchQuery, repositories]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* 3. REPLACED LEFT ASIDE: Starred Repositories */}
          <aside className="lg:col-span-1 space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3 flex items-center gap-2">
              <svg className="w-4 h-4 text-yellow-500 fill-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
              Starred Repos
            </h3>
            
            <div className="space-y-3">
              {starredRepos.map((repo) => (
                <div
                  key={repo._id}
                  className="bg-white border border-gray-200 rounded-md p-4 hover:shadow-sm transition-shadow"
                >
                  <div className="flex justify-between items-start gap-2">
                    <Link
                      to={`/repo/${repo._id}`}
                      className="text-blue-600 font-semibold text-sm hover:underline truncate block"
                    >
                      {repo.name}
                    </Link>
                    <div className="flex items-center gap-1 text-xs text-gray-500 bg-gray-50 px-1.5 py-0.5 rounded border border-gray-100">
                      <svg className="w-3 h-3 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      {repo.stars?.length || 0}
                    </div>
                  </div>
                  <p className="text-gray-500 text-xs mt-1 line-clamp-2">
                    {repo.description || "No description provided."}
                  </p>
                </div>
              ))}
              
              {/* Empty State */}
              {starredRepos.length === 0 && (
                <div className="text-center p-4 bg-white border border-dashed border-gray-300 rounded-md">
                  <p className="text-gray-500 text-xs">
                    You haven't starred any repositories yet.
                  </p>
                </div>
              )}
            </div>
          </aside>

          {/* MAIN CONTENT: Your Repositories */}
          <main className="lg:col-span-2 bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Your Repositories
              </h2>
              <Link
                to={`/repo/create`}
                className="text-blue-600 font-semibold text-sm hover:underline truncate block"
              >
                <button className="bg-green-600 hover:bg-green-700 text-white text-sm font-medium py-1.5 px-3 rounded-md transition-colors">
                  New
                </button>
              </Link>
            </div>

            <div className="mb-6">
              <input
                type="text"
                value={searchQuery}
                placeholder="Find a repository..."
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
              />
            </div>

            <div className="space-y-4">
              {searchResults.length > 0 ? (
                searchResults.map((repo) => (
                  <div
                    key={repo._id}
                    className="border-b border-gray-100 last:border-0 pb-4 last:pb-0"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <Link
                          to={`/repo/${repo._id}`}
                          className="text-blue-600 font-semibold text-lg hover:underline cursor-pointer"
                        >
                          {repo.name}
                        </Link>
                        <p className="text-gray-600 text-sm mt-1">
                          {repo.description || "No description provided."}
                        </p>
                      </div>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
                        {repo.visibility ? "Public" : "Private"}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">
                    No repositories found matching "{searchQuery}"
                  </p>
                </div>
              )}
            </div>
          </main>

          {/* RIGHT ASIDE: Upcoming Events */}
          <aside className="lg:col-span-1 space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">
              Upcoming Events
            </h3>
            <ul className="bg-white border border-gray-200 rounded-md shadow-sm divide-y divide-gray-100">
              <li className="p-3 hover:bg-gray-50 cursor-pointer transition-colors">
                <p className="text-sm font-medium text-gray-900">
                  Tech Conference
                </p>
                <p className="text-xs text-gray-500 mt-0.5">Dec 15</p>
              </li>
              <li className="p-3 hover:bg-gray-50 cursor-pointer transition-colors">
                <p className="text-sm font-medium text-gray-900">
                  Developer Meetup
                </p>
                <p className="text-xs text-gray-500 mt-0.5">Dec 25</p>
              </li>
              <li className="p-3 hover:bg-gray-50 cursor-pointer transition-colors">
                <p className="text-sm font-medium text-gray-900">
                  React Summit
                </p>
                <p className="text-xs text-gray-500 mt-0.5">Jan 5</p>
              </li>
            </ul>
          </aside>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;