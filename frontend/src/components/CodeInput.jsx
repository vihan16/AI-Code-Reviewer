import React, { useState } from "react";

export default function CodeInput({ code, setCode, submitCode }) {
  const [loading, setLoading] = useState(false);

  const handleReset = () => {
    setCode("");
    localStorage.removeItem("codeInput");
    localStorage.removeItem("selectedReviewId");
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await submitCode(code);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Code editor */}
      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        className="flex-1 w-full rounded-md border border-gray-400 p-3 bg-white dark:bg-gray-800 dark:text-gray-100 font-mono resize-none"
        placeholder="// Paste your code here"
        disabled={loading}
      />

      {/* Action buttons */}
      <div className="mt-4 flex justify-end gap-3">
        <button
          onClick={handleSubmit}
          disabled={!(code || "").trim() || loading}
          className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition flex items-center gap-2"
        >
          {loading ? (
            <>
              <span className="loader border-2 border-t-2 border-blue-200 rounded-full w-4 h-4 animate-spin"></span>
              Reviewing...
            </>
          ) : (
            <>
              🚀 Review
            </>
          )}
        </button>

        <button
          onClick={handleReset}
          disabled={loading}
          className="px-5 py-2 bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-600 transition"
        >
          🔄 Reset
        </button>
      </div>
      {/* Simple loader style */}
      <style>
        {`
          .loader {
            border-top-color: #2563eb;
            border-right-color: transparent;
            border-bottom-color: #2563eb;
            border-left-color: transparent;
            display: inline-block;
          }
        `}
      </style>
    </div>
  );
}

