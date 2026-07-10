import React, { useState } from 'react';
import { downloadReport } from '../services/api';

function ReportDownload({ documentId }) {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    setLoading(true);
    try {
      await downloadReport(documentId);
    } catch (err) {
      alert('Failed to download report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={loading}
      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium flex items-center gap-2"
    >
      {loading ? (
        <>
          <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
          Generating...
        </>
      ) : (
        <>
          📄 Download Report (PDF)
        </>
      )}
    </button>
  );
}

export default ReportDownload;
