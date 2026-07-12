import MainLayout from "../../components/layout/MainLayout";
import { useState, useEffect } from "react";
import { useAuthContext } from "../../context/AuthContext";
import { getContracts, downloadReport } from "../../services/api";
import { FiFileText, FiDownload, FiTrash2, FiEye } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const Reports = () => {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(null);

  useEffect(() => {
    if (!user) return;
    getContracts()
      .then((data) => setContracts(data.filter((c) => c.status === "completed")))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [user]);

  const handleDownload = async (contractId) => {
    setDownloading(contractId);
    try {
      await downloadReport(contractId);
    } catch (err) {
      console.error("Download failed:", err);
      alert("Failed to download report. Make sure analysis is complete.");
    } finally {
      setDownloading(null);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto py-12">
        <h1 className="text-4xl font-bold text-white">Reports</h1>
        <p className="text-slate-400 mt-3 mb-8">Download PDF analysis reports for your contracts.</p>

        {loading ? (
          <div className="text-center text-slate-400 py-20">Loading reports...</div>
        ) : contracts.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-10 text-center">
            <p className="text-slate-400 text-lg">No completed analyses yet. Upload and analyze a contract first.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {contracts.map((contract) => (
              <div
                key={contract.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex justify-between items-center"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center">
                    <FiFileText size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{contract.original_file_name}</h3>
                    <p className="text-slate-400 text-sm">
                      {contract.document_type || "Document"} - Analyzed
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() =>
                      navigate("/analysis", {
                        state: { contractId: contract.id, filename: contract.original_file_name },
                      })
                    }
                    className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-lg"
                  >
                    <FiEye /> View
                  </button>
                  <button
                    onClick={() => handleDownload(contract.id)}
                    disabled={downloading === contract.id}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg disabled:opacity-50"
                  >
                    <FiDownload />
                    {downloading === contract.id ? "Downloading..." : "Download PDF"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Reports;
