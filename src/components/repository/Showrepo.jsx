import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../Navbar"; // Adjust this path if necessary
const apiUrl = import.meta.env.VITE_API_URL;

const ShowRepo = () => {
  const { id } = useParams();
  const [commits, setCommits] = useState([]);
  const [selectedCommit, setSelectedCommit] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // NEW: Starred Repositories State
  const [isStarred, setIsStarred] = useState(false);
  const [starCount, setStarCount] = useState(0);

  // NEW: Fetch Repo Metadata (Stars)
  useEffect(() => {
    const fetchRepoData = async () => {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId"); // Ensuring that, this is saved during login!

      if (!userId || userId === "null") {
        return;
      }

      try {
        const repoRes = await axios.get(`${apiUrl}/repo/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const repoData = repoRes.data;
        setStarCount(repoData.stars?.length || 0);

        if (repoData.stars && repoData.stars.includes(userId)) {
          setIsStarred(true);
        }
      } catch (err) {
        console.error("Failed to fetch repo metadata", err);
      }
    };

    fetchRepoData();
  }, [id]);

  // Existing: Fetch Repo Code Contents
  useEffect(() => {
    const fetchRepoContents = async () => {
      const token = localStorage.getItem("token");

      try {
        const response = await axios.get(`${apiUrl}/repo/${id}/pull`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const allCommits = response.data.commits;

        if (!allCommits || allCommits.length === 0) {
          setLoading(false);
          return;
        }

        const commitsMap = new Map();

        allCommits.forEach((item) => {
          if (!commitsMap.has(item.commitId)) {
            commitsMap.set(item.commitId, {
              commitId: item.commitId,
              files: [],
            });
          }
          commitsMap.get(item.commitId).files.push(item);
        });

        const groupedCommits = Array.from(commitsMap.values());
        setCommits(groupedCommits);

        if (groupedCommits.length > 0) {
          setSelectedCommit(groupedCommits[0].commitId);
          setSelectedFile(groupedCommits[0].files[0]);
        }

        setLoading(false);
      } catch (err) {
        console.error("Error fetching repository contents:", err);
        setError("Failed to load repository files. Please try again.");
        setLoading(false);
      }
    };

    fetchRepoContents();
  }, [id]);

  // Handle Toggle Star Button Click
  const handleToggleStar = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.post(
        `${apiUrl}/repo/${id}/star`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      setStarCount(response.data.totalStars);
      setIsStarred(!isStarred);
    } catch (err) {
      console.error("Error toggling star", err);
    }
  };

  const currentFiles =
    commits.find((c) => c.commitId === selectedCommit)?.files || [];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <div className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with Flexbox to align the Star button to the right */}
        <div className="mb-6 flex justify-between items-start md:items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <svg
                className="w-8 h-8 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                />
              </svg>
              Repository Explorer
            </h1>
            <p className="text-sm text-gray-500 mt-1">ID: {id}</p>
          </div>

          {/* The Star Button UI */}
          <button
            onClick={handleToggleStar}
            className={`mt-4 md:mt-0 flex items-center gap-2 px-4 py-2 rounded-md border font-medium text-sm transition-colors shadow-sm ${
              isStarred
                ? "bg-yellow-50 hover:bg-yellow-100 text-yellow-700 border-yellow-300"
                : "bg-white hover:bg-gray-50 text-gray-700 border-gray-300"
            }`}
          >
            <svg
              className={`w-4 h-4 ${isStarred ? "text-yellow-500 fill-yellow-500" : "text-gray-500"}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
              />
            </svg>
            {isStarred ? "Starred" : "Star"}
            <span className="bg-gray-100 border border-gray-200 text-gray-700 px-2 py-0.5 rounded-full text-xs font-semibold ml-1">
              {starCount}
            </span>
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md mb-6">
            {error}
          </div>
        )}

        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
          </div>
        )}

        {!loading && !error && commits.length === 0 && (
          <div className="bg-white border border-gray-200 rounded-lg py-20 text-center shadow-sm">
            <h3 className="text-lg font-medium text-gray-900">
              No commits found
            </h3>
            <p className="mt-1 text-gray-500">
              Use your CLI to push some code to this repository!
            </p>
          </div>
        )}

        {/* Code Explorer Layout */}
        {!loading && commits.length > 0 && (
          <div className="flex flex-col md:flex-row gap-6 h-[calc(100vh-250px)]">
            {/* Left Sidebar: Commit Selector & File List */}
            <div className="w-full md:w-1/4 bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden flex flex-col">
              <div className="bg-gray-100 border-b border-gray-200 px-4 py-3">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                  Snapshot (Commit)
                </label>
                <select
                  className="w-full bg-white border border-gray-300 text-gray-700 rounded-md text-sm p-2 focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer"
                  value={selectedCommit}
                  onChange={(e) => {
                    const newCommitId = e.target.value;
                    setSelectedCommit(newCommitId);

                    const newCommitObj = commits.find(
                      (c) => c.commitId === newCommitId,
                    );
                    if (newCommitObj && newCommitObj.files.length > 0) {
                      setSelectedFile(newCommitObj.files[0]);
                    } else {
                      setSelectedFile(null);
                    }
                  }}
                >
                  {commits.map((c) => (
                    <option key={c.commitId} value={c.commitId}>
                      {c.commitId.substring(0, 8)}
                    </option>
                  ))}
                </select>
              </div>

              <ul className="overflow-y-auto flex-grow">
                {currentFiles.map((file, index) => (
                  <li key={index}>
                    <button
                      onClick={() => setSelectedFile(file)}
                      className={`w-full text-left px-4 py-3 text-sm flex items-center gap-3 transition-colors ${
                        selectedFile?.fileName === file.fileName &&
                        selectedFile?.commitId === file.commitId
                          ? "bg-blue-50 text-blue-700 border-l-4 border-blue-600 font-medium"
                          : "text-gray-600 hover:bg-gray-50 border-l-4 border-transparent"
                      }`}
                    >
                      <svg
                        className="w-4 h-4 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                        />
                      </svg>
                      {file.fileName}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right Side: Code Viewer */}
            <div className="w-full md:w-3/4 bg-[#1e1e1e] border border-gray-200 rounded-lg shadow-sm flex flex-col overflow-hidden">
              <div className="bg-[#2d2d2d] border-b border-[#404040] px-4 py-3 flex justify-between items-center text-gray-300 text-sm">
                <div className="font-mono flex items-center gap-2">
                  <span className="text-gray-400">Viewing:</span>{" "}
                  {selectedFile?.fileName}
                </div>
                <div className="text-xs font-mono bg-[#404040] px-2 py-1 rounded text-gray-300">
                  Commit: {selectedFile?.commitId.substring(0, 8)}
                </div>
              </div>

              <div className="p-4 overflow-auto flex-grow">
                <pre className="text-sm text-gray-100 font-mono whitespace-pre-wrap">
                  <code>{selectedFile?.fileContent}</code>
                </pre>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShowRepo;
