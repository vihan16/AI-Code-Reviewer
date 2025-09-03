import React from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  materialDark,
  materialLight,
} from "react-syntax-highlighter/dist/esm/styles/prism";
import Markdown from "react-markdown";

export default function ReviewOutput({ review }) {
  const theme = document.documentElement.classList.contains("dark")
    ? materialDark
    : materialLight;

  return (
    <div className="h-155 overflow-hidden  flex flex-col rounded-2xl shadow-md bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
      {/* Header */}
      {/* <div className="flex justify-between items-center px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-t-2xl">
        <h2 className="font-semibold text-lg">AI Review</h2>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {new Date(review.createdAt).toLocaleString()}
        </span>
      </div> */}

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        <div className="prose prose-sm dark:prose-invert max-w-none">
          <Markdown
            components={{
              code({ inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || "");
                return !inline && match ? (
                  <SyntaxHighlighter
                    style={theme}
                    language={match[1]}
                    PreTag="div"
                    wrapLongLines={true}
                    showLineNumbers={true}
                    className="!rounded-lg !p-3 shadow-sm"
                  >
                    {String(children).replace(/\n$/, "")}
                  </SyntaxHighlighter>
                ) : (
                  <code
                    className="px-1 py-0.5 rounded bg-gray-200 dark:bg-gray-700 text-pink-600 dark:text-pink-400 text-sm"
                    {...props}
                  >
                    {children}
                  </code>
                );
              },
            }}
          >
            {review.reviewed}
          </Markdown>
        </div>
      </div>
    </div>
  );
}
