import React, { useState, useRef, useEffect } from "react";

export default function CodeInput({ code, setCode, submitCode }) {
  const [loading, setLoading] = useState(false);
  const [lineCount, setLineCount] = useState(1);
  const textareaRef = useRef(null);

  // Update line count when code changes
  useEffect(() => {
    const lines = code.split('\n').length;
    setLineCount(lines);
  }, [code]);

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

  // Handle tab key for indentation
  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;
      const newValue = code.substring(0, start) + '  ' + code.substring(end);
      setCode(newValue);
      
      setTimeout(() => {
        e.target.selectionStart = e.target.selectionEnd = start + 2;
      }, 0);
    }
  };

  // Generate line numbers
  const lineNumbers = Array.from({ length: Math.max(lineCount, 15) }, (_, i) => i + 1);

  return (
    <div className="absolute inset-0 flex flex-col bg-[#0d1117]">
      {/* Code editor area */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Line numbers */}
        <div className="flex flex-col bg-[#0d1117] border-r border-gray-800 py-4 select-none min-w-[50px] text-right overflow-hidden">
          <div className="font-mono text-xs text-gray-600 leading-6 pr-3">
            {lineNumbers.map((num) => (
              <div key={num} className={num <= lineCount ? "text-gray-500" : "text-gray-800"}>
                {num}
              </div>
            ))}
          </div>
        </div>

        {/* Code textarea */}
        <textarea
          ref={textareaRef}
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 w-full p-4 bg-[#0d1117] text-gray-300 font-mono text-sm resize-none focus:outline-none leading-6 placeholder-gray-700 border-none"
          placeholder="// Paste your code here..."
          disabled={loading}
          spellCheck={false}
          style={{
            tabSize: 2,
            MozTabSize: 2,
          }}
        />
        
        {/* Submit Button Overlay (Floating) */}
        <div className="absolute bottom-6 right-6 flex gap-3">
          {code.trim() && (
            <button
              onClick={handleReset}
              disabled={loading}
              className="px-4 py-2 bg-[#161b22] text-gray-400 hover:text-white border border-gray-700 rounded-lg text-xs font-medium transition-colors shadow-lg hover:border-gray-500"
            >
              Clear
            </button>
          )}
          
          <button
            onClick={handleSubmit}
            disabled={!code.trim() || loading}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium shadow-lg shadow-blue-900/20 transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Reviewing...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Run Review
              </>
            )}
          </button>
        </div>
      </div>

      {/* Status Bar */}
      <div className="h-8 bg-[#161b22] border-t border-gray-800 flex items-center px-4 justify-between text-[10px] text-gray-500 select-none">
        <div className="flex gap-4">
          <span>Ln {lineCount}, Col {code.length}</span>
          <span>UTF-8</span>
          <span>JavaScript</span>
        </div>
        <div className="flex gap-2">
          <span>Ready</span>
        </div>
      </div>
    </div>
  );
}
