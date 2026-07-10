import React from 'react';

function RiskScore({ score, factors }) {
  const getColor = () => {
    if (score >= 70) return { text: 'text-red-600', bg: 'bg-red-100', border: 'border-red-200', label: 'High Risk' };
    if (score >= 40) return { text: 'text-orange-600', bg: 'bg-orange-100', border: 'border-orange-200', label: 'Medium Risk' };
    return { text: 'text-green-600', bg: 'bg-green-100', border: 'border-green-200', label: 'Low Risk' };
  };

  const color = getColor();
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Risk Score</h2>
      <div className="flex flex-col items-center">
        <div className="relative w-40 h-40">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
            <circle
              cx="80" cy="80" r={radius}
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="12"
            />
            <circle
              cx="80" cy="80" r={radius}
              fill="none"
              stroke={score >= 70 ? '#dc2626' : score >= 40 ? '#ea580c' : '#16a34a'}
              strokeWidth="12"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              className="transition-all duration-1000"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`text-3xl font-bold ${color.text}`}>
              {score}
              <span className="text-lg">/100</span>
            </span>
          </div>
        </div>
        <span className={`mt-3 px-4 py-1 rounded-full text-sm font-medium ${color.bg} ${color.text}`}>
          {color.label}
        </span>
      </div>

      {factors.length > 0 && (
        <div className="mt-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Risk Factors</h3>
          <ul className="space-y-1">
            {factors.map((f, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                <span className="text-red-500 mt-0.5">⚠</span>
                {f}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default RiskScore;
