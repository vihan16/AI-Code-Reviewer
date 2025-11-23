import React from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  vscDarkPlus,
} from "react-syntax-highlighter/dist/esm/styles/prism";
import Markdown from "react-markdown";

export default function ReviewOutput({ review }) {
  if (!review) return null;

  return (
    <div className="absolute inset-0 overflow-y-auto custom-scrollbar p-8 bg-[#0d1117]">
      <div className="max-w-3xl mx-auto">
        <div className="prose prose-invert max-w-none">
          <Markdown
            components={{
              // Headings
              h1: ({ children }) => (
                <h1 className="text-2xl font-bold mb-6 pb-2 border-b border-gray-800 text-gray-100 flex items-center gap-3">
                  {children}
                </h1>
              ),
              h2: ({ children }) => (
                <h2 className="text-xl font-semibold mb-4 mt-8 text-gray-200 flex items-center gap-2">
                  <span className="text-blue-500">#</span>
                  {children}
                </h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-lg font-medium mb-3 mt-6 text-gray-300">
                  {children}
                </h3>
              ),
              
              // Paragraphs
              p: ({ children }) => (
                <p className="mb-4 leading-7 text-gray-400 text-[15px]">
                  {children}
                </p>
              ),
              
              // Lists
              ul: ({ children }) => (
                <ul className="mb-4 ml-4 space-y-2 list-none">
                  {children}
                </ul>
              ),
              ol: ({ children }) => (
                <ol className="mb-4 ml-4 space-y-2 list-decimal marker:text-gray-500 text-gray-400">
                  {children}
                </ol>
              ),
              li: ({ children }) => (
                <li className="text-gray-400 leading-relaxed flex items-start gap-2">
                  <span className="text-blue-500 mt-1.5 text-[10px]">●</span>
                  <span className="flex-1">{children}</span>
                </li>
              ),
              
              // Code blocks and inline code
              code({ inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || "");
                return !inline && match ? (
                  <div className="my-6 rounded-lg overflow-hidden border border-gray-800 bg-[#161b22]">
                    <div className="bg-[#161b22] px-4 py-2 border-b border-gray-800 flex items-center justify-between">
                      <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {match[1]}
                      </span>
                    </div>
                    <SyntaxHighlighter
                      style={vscDarkPlus}
                      language={match[1]}
                      PreTag="div"
                      wrapLongLines={true}
                      showLineNumbers={true}
                      className="!m-0 !bg-[#0d1117] !p-4"
                      customStyle={{
                        margin: 0,
                        background: '#0d1117',
                        fontSize: '0.875rem',
                      }}
                    >
                      {String(children).replace(/\n$/, "")}
                    </SyntaxHighlighter>
                  </div>
                ) : (
                  <code
                    className="px-1.5 py-0.5 rounded bg-gray-800 text-gray-300 text-sm font-mono border border-gray-700"
                    {...props}
                  >
                    {children}
                  </code>
                );
              },
              
              // Blockquotes
              blockquote: ({ children }) => (
                <blockquote className="border-l-2 border-blue-500 pl-4 py-1 my-6 text-gray-500 italic">
                  {children}
                </blockquote>
              ),
              
              // Strong/Bold
              strong: ({ children }) => (
                <strong className="font-semibold text-gray-200">
                  {children}
                </strong>
              ),
              
              // Horizontal rule
              hr: () => (
                <hr className="my-8 border-gray-800" />
              ),
              
              // Tables
              table: ({ children }) => (
                <div className="my-6 overflow-x-auto rounded-lg border border-gray-800">
                  <table className="min-w-full text-sm text-left">
                    {children}
                  </table>
                </div>
              ),
              thead: ({ children }) => (
                <thead className="bg-[#161b22] text-gray-400 font-medium">
                  {children}
                </thead>
              ),
              th: ({ children }) => (
                <th className="px-6 py-3 border-b border-gray-800">
                  {children}
                </th>
              ),
              td: ({ children }) => (
                <td className="px-6 py-4 border-b border-gray-800 text-gray-400">
                  {children}
                </td>
              ),
            }}
          >
            {review.reviewed}
          </Markdown>
        </div>
      </div>
    </div>
  );
}
