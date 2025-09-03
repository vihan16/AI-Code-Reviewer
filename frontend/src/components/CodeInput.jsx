import React from "react";

export default function CodeInput({ code, setCode, submitCode }) {
  const handleReset = () => {
    setCode("");
    localStorage.removeItem("codeInput");
    localStorage.removeItem("selectedReviewId");
  };

  return (
    <div className="h-full flex flex-col">
      {/* Code editor */}
      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        className="flex-1 w-full rounded-md border border-gray-400 p-3 bg-white dark:bg-gray-800 dark:text-gray-100 font-mono resize-none"
        placeholder="// Paste your code here"
      />

      {/* Action buttons */}
      <div className="mt-4 flex justify-end gap-3">
        <button
          onClick={() => submitCode(code)}
          disabled={!(code || "").trim()}
          className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
        >
          🚀 Review
        </button>

        <button
          onClick={handleReset}
          className="px-5 py-2 bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-600 transition"
        >
          🔄 Reset
        </button>
      </div>
    </div>
  );
}

