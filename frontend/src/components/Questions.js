import React from 'react';

function Questions({ questions }) {
  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        ❓ Questions to Ask Before Signing
      </h2>
      <div className="space-y-3">
        {questions.map((q, i) => (
          <div
            key={i}
            className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100"
          >
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-medium">
              {i + 1}
            </span>
            <div>
              <p className="text-sm text-gray-800 font-medium">{q.question}</p>
              {q.context && (
                <p className="text-xs text-gray-500 mt-1">{q.context}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Questions;
