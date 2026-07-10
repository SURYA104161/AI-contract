import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import RiskScore from '../components/RiskScore';
import ClauseList from '../components/ClauseList';
import Questions from '../components/Questions';
import ReportDownload from '../components/ReportDownload';

const TYPE_COLORS = {
  Employment: 'bg-blue-100 text-blue-700',
  Rental: 'bg-green-100 text-green-700',
  Loan: 'bg-purple-100 text-purple-700',
  Insurance: 'bg-orange-100 text-orange-700',
  Other: 'bg-gray-100 text-gray-700',
};

function Dashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const analysis = location.state?.analysis;

  if (!analysis) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-600 mb-4">No analysis data found.</p>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Upload a Document
        </button>
      </div>
    );
  }

  const typeColor = TYPE_COLORS[analysis.document_type] || TYPE_COLORS.Other;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analysis Results</h1>
          <p className="text-sm text-gray-500 mt-1">{analysis.filename}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${typeColor}`}>
          {analysis.document_type}
        </span>
      </div>

      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Summary</h2>
        <p className="text-gray-700 leading-relaxed">{analysis.summary}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <RiskScore score={analysis.risk_score} factors={analysis.risk_factors} />
        <ClauseList clauses={analysis.clauses} />
      </div>

      <Questions questions={analysis.questions} />

      <div className="flex gap-4 justify-center">
        <ReportDownload documentId={analysis.document_id} />
        <button
          onClick={() => navigate('/')}
          className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium"
        >
          Analyze Another Document
        </button>
      </div>
    </div>
  );
}

export default Dashboard;
