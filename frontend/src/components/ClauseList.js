import React, { useState } from 'react';

function ClauseList({ clauses }) {
  const [expanded, setExpanded] = useState(null);

  const toggleExpanded = (i) => {
    setExpanded(expanded === i ? null : i);
  };

  const riskStyles = {
    High: { bg: 'bg-red-50 border-red-200', badge: 'bg-red-100 text-red-700', icon: '🔴' },
    Medium: { bg: 'bg-orange-50 border-orange-200', badge: 'bg-orange-100 text-orange-700', icon: '🟡' },
    Low: { bg: 'bg-green-50 border-green-200', badge: 'bg-green-100 text-green-700', icon: '🟢' },
  };

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Detected Clauses ({clauses.length})
      </h2>
      <div className="space-y-3">
        {clauses.map((clause, i) => {
          const style = riskStyles[clause.risk_level] || riskStyles.Low;
          return (
            <div
              key={i}
              className={`border rounded-lg overflow-hidden ${style.bg}`}
            >
              <button
                onClick={() => toggleExpanded(i)}
                className="w-full flex items-center justify-between p-3 text-left"
              >
                <div className="flex items-center gap-2">
                  <span>{style.icon}</span>
                  <span className="font-medium text-gray-900">{clause.title}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${style.badge}`}>
                    {clause.risk_level}
                  </span>
                  <span className="text-gray-400 text-sm">
                    {expanded === i ? '▲' : '▼'}
                  </span>
                </div>
              </button>
              {expanded === i && (
                <div className="px-4 pb-4 space-y-2">
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Plain English Explanation</p>
                    <p className="text-sm text-gray-700">{clause.simple_explanation}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Risk Reason</p>
                    <p className="text-sm text-gray-700">{clause.risk_reason}</p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ClauseList;
