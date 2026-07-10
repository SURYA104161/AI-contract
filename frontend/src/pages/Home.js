import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FileUpload from '../components/FileUpload';
import { uploadDocument, analyzeDocument } from '../services/api';

function Home() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState('');

  const handleFileSelect = async (file) => {
    setLoading(true);
    setError('');
    setProgress('Uploading document...');
    try {
      const uploadResult = await uploadDocument(file);
      setProgress('Analyzing document...');
      const analysisResult = await analyzeDocument(uploadResult.document_id);
      navigate(`/dashboard/${uploadResult.document_id}`, {
        state: { analysis: analysisResult },
      });
    } catch (err) {
      const msg = err.response?.data?.detail || err.message || 'Something went wrong';
      setError(msg);
    } finally {
      setLoading(false);
      setProgress('');
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Understand Any Legal Document
        </h1>
        <p className="text-lg text-gray-600">
          Upload your contract or agreement. AI will explain every clause,
          highlight risks, and suggest questions to ask before signing.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { icon: '🏠', label: 'Rental Agreement' },
            { icon: '💼', label: 'Employment Contract' },
            { icon: '📄', label: 'Insurance Policy' },
            { icon: '💰', label: 'Loan Agreement' },
          ].map((item) => (
            <div
              key={item.label}
              className="bg-blue-50 rounded-lg p-3 text-center text-sm font-medium text-blue-700"
            >
              <div className="text-2xl mb-1">{item.icon}</div>
              {item.label}
            </div>
          ))}
        </div>

        <FileUpload onFileSelect={handleFileSelect} loading={loading} />

        {progress && (
          <div className="mt-4 text-center text-blue-600 font-medium">
            <div className="animate-spin inline-block w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full mr-2" />
            {progress}
          </div>
        )}

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}
      </div>

      <div className="mt-12 grid md:grid-cols-3 gap-6">
        {[
          { icon: '🔍', title: 'Clause Detection', desc: 'Automatically identifies all key clauses in your document.' },
          { icon: '⚠️', title: 'Risk Analysis', desc: 'Highlights risky clauses with clear explanations.' },
          { icon: '❓', title: 'Smart Questions', desc: 'Generates questions to ask before signing.' },
        ].map((f) => (
          <div key={f.title} className="bg-white rounded-lg p-6 shadow text-center">
            <div className="text-3xl mb-3">{f.icon}</div>
            <h3 className="font-semibold text-gray-900 mb-2">{f.title}</h3>
            <p className="text-sm text-gray-600">{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
