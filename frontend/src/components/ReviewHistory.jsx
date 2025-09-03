import React from "react";

export default function ReviewHistory({ history, onSelect, selectedReviewId }) {
  return (
    <div className="flex flex-col h-150">
      <h2 className="text-xl font-semibold mb-4">Review History</h2>

      {history.length === 0 && <p className="text-gray-500">No reviews yet.</p>}

      <div className="flex-1 overflow-y-clip  space-y-2">
        {history.map((review) => (
          <div
            key={review._id}
            onClick={() => onSelect(review)}
            className={`cursor-pointer p-3 rounded-md border hover:bg-gray-100 dark:hover:bg-gray-800
              ${selectedReviewId === review._id ? "border-blue-500 bg-blue-50 dark:bg-blue-900" : "border-gray-300 dark:border-gray-700"}`}
          >
            <p className="text-sm line-clamp-2 font-mono whitespace-pre-wrap">
              {review.original}
            </p>
            <small className="text-gray-300 pt-1 justify-end-safe align-bottom flex">
              {new Date(review.createdAt).toLocaleString()}
            </small>
          </div>
        ))}
      </div>
    </div>
  );
}
