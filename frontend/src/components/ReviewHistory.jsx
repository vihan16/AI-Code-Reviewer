import React from "react";

export default function ReviewHistory({ history, onSelect, selectedReviewId }) {
  if (!history || history.length === 0) {
    return (
      <div className="text-center py-12 px-4">
        <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gray-800 flex items-center justify-center border border-gray-700">
          <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </div>
        <p className="text-sm text-gray-400 font-medium">No reviews yet</p>
        <p className="text-xs text-gray-600 mt-1">Submit code to start tracking history</p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-3">
      <div className="flex items-center justify-between mb-2 px-2">
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
          Recent Reviews
        </h3>
        <span className="text-xs text-gray-600 bg-gray-800 px-2 py-0.5 rounded-full border border-gray-700">
          {history.length}
        </span>
      </div>

      <div className="space-y-2">
        {history.map((review) => {
          const isSelected = (review.id || review._id) === selectedReviewId;
          return (
            <div
              key={review.id || review._id}
              onClick={() => onSelect(review)}
              className={`group cursor-pointer p-3 rounded-lg border transition-all duration-200 ${
                isSelected
                  ? "bg-[#1f242c] border-blue-500/50 shadow-lg shadow-blue-900/10"
                  : "bg-[#0d1117] border-gray-800 hover:border-gray-600 hover:bg-[#161b22]"
              }`}
            >
              {/* Code preview */}
              <div className="mb-2">
                <div className="flex items-start gap-2">
                  <svg className={`w-4 h-4 mt-0.5 flex-shrink-0 ${isSelected ? "text-blue-400" : "text-gray-600 group-hover:text-gray-400"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                  <p className={`font-mono text-xs line-clamp-2 leading-relaxed ${isSelected ? "text-gray-200" : "text-gray-400 group-hover:text-gray-300"}`}>
                    {review.original.substring(0, 80).replace(/\n/g, " ") || "Empty code"}
                  </p>
                </div>
              </div>

              {/* Metadata */}
              <div className="flex items-center justify-between text-[10px] pl-6">
                <div className={`flex items-center gap-1.5 ${isSelected ? "text-blue-300/70" : "text-gray-600 group-hover:text-gray-500"}`}>
                  <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                  <span>•</span>
                  <span>{new Date(review.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
