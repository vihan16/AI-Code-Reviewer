import React, { useState, useEffect } from "react";
import CodeInput from "./components/CodeInput";
import ReviewOutput from "./components/ReviewOutput";
import ReviewHistory from "./components/ReviewHistory";

// --- unify both API shapes into one shape the UI expects
const normalizeReview = (r) => ({
  id: r.id || r._id,                                    // prefer id, fallback _id
  _id: r._id || r.id,                                    // keep _id for convenience
  original: r.original ?? r.code ?? "",                  // POST uses original, GET uses code
  reviewed: r.reviewed ?? r.reviewResult ?? "",          // POST uses reviewed, GET uses reviewResult
  createdAt: r.createdAt ? new Date(r.createdAt).toISOString() : new Date().toISOString(),
});

function App() {
  const [code, setCode] = useState("");
  const [history, setHistory] = useState([]);
  const [selectedReview, setSelectedReview] = useState(null);
  const [theme, setTheme] = useState("dark"); // default dark to match your screenshots

  // theme
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  // restore last selected review id + code from localStorage (optional but nice)
  useEffect(() => {
    const savedCode = localStorage.getItem("codeInput");
    if (savedCode) setCode(savedCode);
  }, []);
  useEffect(() => {
    localStorage.setItem("codeInput", code);
  }, [code]);

  // Fetch reviews on load and select last-used (or latest) review
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/reviews");
        // be robust to empty body
        const text = await res.text();
        const raw = text ? JSON.parse(text) : [];
        const data = Array.isArray(raw) ? raw.map(normalizeReview) : [];

        setHistory(data);

        const savedId = localStorage.getItem("selectedReviewId");
        const bySaved = savedId ? data.find((d) => (d.id || d._id) === savedId) : null;

        const initial = bySaved || data[0] || null;
        if (initial) {
          setSelectedReview(initial);
          setCode(initial.original);
        }
      } catch (err) {
        console.error("Failed to fetch reviews:", err);
        setHistory([]);
        setSelectedReview(null);
      }
    };
    fetchReviews();
  }, []);

  // Submit new code
  const submitCode = async (codeToReview) => {
    try {
      const res = await fetch("http://localhost:5000/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: codeToReview }),
      });

      const text = await res.text(); // avoid "Unexpected end of JSON input"
      const raw = text ? JSON.parse(text) : null;
      if (!res.ok) {
        const msg = raw?.error || "Failed to get review";
        return alert(msg);
      }

      const newReview = normalizeReview(raw);
      setHistory((prev) => [newReview, ...prev]);
      setSelectedReview(newReview);
      setCode(newReview.original);
      localStorage.setItem("selectedReviewId", newReview.id || newReview._id);
    } catch (err) {
      alert("Network error: " + err.message);
    }
  };

  // When user clicks a card in the sidebar
  const handleSelect = (review) => {
    const n = normalizeReview(review); // normalize just in case
    setSelectedReview(n);
    setCode(n.original);
    localStorage.setItem("selectedReviewId", n.id || n._id);
  };

  return (
    <div className="min-h-screen flex  bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
    {/* Sidebar */}
    <aside className="w-60 border-r border-gray-300 dark:border-gray-700 p-4 flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-extrabold tracking-wide">Code Reviewer</h1>
        <button
          className="px-2 py-1 rounded-md bg-gray-200 dark:bg-gray-700 text-sm hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          aria-label="Toggle theme"
          title="Toggle theme"
        >
          {theme === "dark" ? "☀️" : "🌙"}
        </button>
      </div>

      {/* Review History */}
      <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar">
        <ReviewHistory
          history={history}
          onSelect={handleSelect}
          selectedReviewId={selectedReview?.id || selectedReview?._id}
        />
      </div>
    </aside>

    {/* Main content */}
    <main className="flex-1 grid grid-cols-2 gap-4 p-6 ">
      {/* Left: Code input */}
      <div className="flex flex-col border border-gray-300 dark:border-gray-700 rounded-xl  p-4 shadow-sm bg-white dark:bg-gray-800 h-161">
        <h2 className="font-semibold text-lg mb-3 border-b pb-2 dark:border-gray-600">
          💻 Your Code
        </h2>
        <div className="flex-1 overflow-auto custom-scrollbar">
          <CodeInput code={code} setCode={setCode} submitCode={submitCode} />
        </div>
      </div>

      {/* Right: Review output */}
      <div className="flex flex-col border border-gray-300 dark:border-gray-700 rounded-xl p-4 shadow-sm bg-white dark:bg-gray-800 h-161 ">
        <h2 className="font-semibold text-lg mb-3 border-b pb-2 dark:border-gray-600">
          ✅ Review Output
        </h2>

        <div className="flex-1 overflow-hidden custom-scrollbar">
          {selectedReview ? (
            <ReviewOutput review={selectedReview} />
          ) : (
            <p className="text-gray-500 text-center mt-6">
              Submit your code or select a review from the sidebar.
            </p>
          )}
        </div>
      </div>
    </main>
  </div>
  );
}

export default App;
