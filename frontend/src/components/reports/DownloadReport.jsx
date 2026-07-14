import { Download } from "lucide-react";

const DownloadReport = () => {
  return (
    <div className="flex justify-end">
      <button className="flex items-center gap-3 rounded-xl bg-blue-600 px-6 py-4 text-white font-semibold hover:bg-blue-700 transition">
        <Download size={20} />
        Download PDF Report
      </button>
    </div>
  );
};

export default DownloadReport;
