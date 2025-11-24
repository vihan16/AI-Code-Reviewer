import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import CodeInput from "./components/CodeInput";
import ReviewOutput from "./components/ReviewOutput";
import ReviewHistory from "./components/ReviewHistory";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { AuthProvider, useAuth } from "./context/AuthContext";

// --- unify both API shapes into one shape the UI expects
const normalizeReview = (r) => ({
  id: r.id || r._id,
  _id: r._id || r.id,
  original: r.original ?? r.code ?? "",
  reviewed: r.reviewed ?? r.reviewResult ?? "",
  createdAt: r.createdAt ? new Date(r.createdAt).toISOString() : new Date().toISOString(),
});

function Dashboard() {
  const [code, setCode] = useState("");
  const [history, setHistory] = useState([]);
  const [selectedReview, setSelectedReview] = useState(null);
  const [theme, setTheme] = useState("dark");
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // theme
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  // Save code to localStorage as user types (but don't restore on load for fresh start)
  useEffect(() => {
    localStorage.setItem("codeInput", code);
  }, [code]);

  // Fetch reviews on load but DON'T auto-select any review (always start fresh)
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const res = await fetch("http://127.0.0.1:5000/api/reviews", { headers });
        const text = await res.text();
        const raw = text ? JSON.parse(text) : [];
        const data = Array.isArray(raw) ? raw.map(normalizeReview) : [];

        setHistory(data);
        setSelectedReview(null);
      } catch (err) {
        console.error("Failed to fetch reviews:", err);
        setHistory([]);
        setSelectedReview(null);
      }
    };
    fetchReviews();
  }, [user]); // Re-fetch when user changes

  // Submit new code
  const submitCode = async (codeToReview) => {
    try {
      const token = localStorage.getItem('token');
      const headers = { "Content-Type": "application/json" };
      if (token) headers.Authorization = `Bearer ${token}`;

      const res = await fetch("http://127.0.0.1:5000/api/reviews", {
        method: "POST",
        headers,
        body: JSON.stringify({ code: codeToReview }),
      });

      const text = await res.text();
      const raw = text ? JSON.parse(text) : null;
      if (!res.ok) {
        const msg = raw?.error || "Failed to get review";
        return alert(msg);
      }

      const newReview = normalizeReview(raw);
      // Only add to history if user is logged in (backend saves it)
      if (user) {
        setHistory((prev) => [newReview, ...prev]);
      }
      setSelectedReview(newReview);
      setCode(newReview.original);
      localStorage.setItem("selectedReviewId", newReview.id || newReview._id);
    } catch (err) {
      alert("Network error: " + err.message);
    }
  };

  // When user clicks a card in the sidebar
  const handleSelect = (review) => {
    const n = normalizeReview(review);
    setSelectedReview(n);
    setCode(n.original);
    localStorage.setItem("selectedReviewId", n.id || n._id);
  };

  // Handle new review (reset)
  const handleNewReview = () => {
    setSelectedReview(null);
    setCode("");
    localStorage.removeItem("selectedReviewId");
    localStorage.removeItem("codeInput");
  };

  return (
    <div className="h-screen w-screen overflow-hidden flex bg-[#0f1117] text-gray-100 selection:bg-blue-500/30">
      {/* Sidebar */}
      <aside className="w-80 bg-[#161b22] border-r border-gray-800 flex flex-col shadow-2xl z-20">
        {/* Header */}
        <div className="p-3 border-b border-gray-800 bg-[#161b22]">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-xl font-bold text-white flex items-center gap-2 tracking-tight">
                <div className="p-1.5 bg-blue-600 rounded-lg">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                </div>
                CodeReviewer
              </h1>
            </div>
            {/* <button
              className="p-2 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white transition-all duration-200"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              aria-label="Toggle theme"
              title="Toggle theme"
            >
              {theme === "dark" ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button> */}
          </div>


        </div>

        {/* New Review Button */}
        <div className="p-3 border-b border-gray-800 bg-[#161b22]">
          <button
            onClick={handleNewReview}
            className="w-full py-2 px-3 bg-blue-500 hover:bg-blue-400 text-black rounded-lg text-sm font-medium shadow-lg shadow-blue-900/20 transition-all flex items-center justify-center gap-2 group"
          >
            <svg className="w-4 h-4 transition-transform group-hover:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Review
          </button>
        </div>

        {/* Review History */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <ReviewHistory
            history={history}
            onSelect={handleSelect}
            selectedReviewId={selectedReview?.id || selectedReview?._id}
          />
        </div>

        {/* User Profile / Login */}
        {user ? (
          <div className="flex items-center m-2 mx-4 justify-between bg-[#0d1117] p-2 rounded-lg border border-gray-800">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold">
                {user.username.charAt(0).toUpperCase()}
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-medium text-gray-200">{user.username}</span>
                <span className="text-[10px] text-gray-500">Free Plan</span>
              </div>
            </div>
            <button
              onClick={logout}
              className="text-xs text-gray-500 hover:text-red-400 transition-colors"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="flex gap-2 m-2 mx-4">
            <button
              onClick={() => navigate('/login')}
              className="flex-1 py-2 bg-[#0d1117] hover:bg-gray-800 border border-gray-700 rounded-lg text-xs font-medium text-gray-300 transition-all"
            >
              Login
            </button>
            <button
              onClick={() => navigate('/signup')}
              className="flex-1 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-xs font-medium text-white transition-all"
            >
              Sign Up
            </button>
          </div>
        )}


      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#0d1117]">
        <div className="flex-1 flex overflow-hidden">
          {/* Left: Code input */}
          <div className="flex-1 flex flex-col border-r border-gray-800 min-w-0">
            <div className="h-14 px-6 flex items-center justify-between bg-[#161b22] border-b border-gray-800">
              <h2 className="font-semibold text-sm flex items-center gap-2 text-gray-200">
                <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
                Input Code
              </h2>
            </div>
            <div className="flex-1 relative">
              <CodeInput code={code} setCode={setCode} submitCode={submitCode} />
            </div>
          </div>

          {/* Right: Review output */}
          <div className="flex-1 flex flex-col min-w-0 bg-[#0d1117]">
            <div className="h-14 px-6 flex items-center justify-between bg-[#161b22] border-b border-gray-800">
              <h2 className="font-semibold text-sm flex items-center gap-2 text-gray-200">
                <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Review Results
              </h2>
            </div>
            <div className="flex-1 overflow-hidden relative">
              {selectedReview ? (
                <ReviewOutput review={selectedReview} />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 opacity-50">
                  <div className="w-20 h-20 mb-4 rounded-2xl bg-gray-800 flex items-center justify-center">
                    <svg className="w-10 h-10 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-300">No Review Selected</h3>
                  <p className="text-sm text-gray-500 mt-2 max-w-xs">Submit your code or select a review from the sidebar to see the analysis.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <AuthProvider>
      <Toaster position="top-right" toastOptions={{
        style: {
          background: '#161b22',
          color: '#fff',
          border: '1px solid #30363d',
        },
      }} />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<Dashboard />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
