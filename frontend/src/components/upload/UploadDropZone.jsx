import { useRef, useState } from "react";
import { FiUploadCloud } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";
import { supabase } from "../../supabase/supabaseClient";
import { uploadContract } from "../../services/contractService";
import { inspectToken } from "../../services/api";
import FilePreview from "./FilePreview";
import UploadProgress from "./UploadProgress";

const UploadDropZone = () => {
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const { user } = useAuthContext();

  const [step, setStep] = useState("idle");
  const [selectedFile, setSelectedFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("");

  const handleBrowse = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (file.type !== "application/pdf") {
      alert("Please upload only PDF files.");
      return;
    }

    setSelectedFile(file);
    setStep("selected");
  };

  const removeFile = () => {
    setSelectedFile(null);
    setStep("idle");
    setProgress(0);
    setStatus("");
    fileInputRef.current.value = "";
  };

  const startUpload = async () => {
    try {
      setStep("uploading");
      setProgress(10);
      setStatus("Verifying session...");

      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        alert("Your session has expired. Please log in again.");
        setStep("selected");
        return;
      }

      // Diagnostic: log token info before upload
      try {
        const info = await inspectToken();
        console.log("Pre-upload token diagnostic:", info);
      } catch (diagErr) {
        console.warn("Inspect endpoint failed:", diagErr.message);
      }

      setProgress(20);
      setStatus("Uploading PDF...");

      const result = await uploadContract(selectedFile, user.id);

      setProgress(60);
      setStatus("Extracting text...");

      await new Promise((r) => setTimeout(r, 500));

      setProgress(100);
      setStatus("Upload completed! Analysis starting...");

      setTimeout(() => {
        navigate("/analysis", {
          state: { contractId: result.contract_id, filename: result.filename },
        });
      }, 700);
    } catch (err) {
      console.error("Upload error:", err);
      const msg = err.response?.data?.detail || err.message || "Upload failed";
      alert(msg);
      setStep("selected");
    }
  };

  return (
    <>
      {step === "idle" && (
        <div className="border-2 border-dashed border-slate-700 rounded-2xl bg-slate-900 p-16 text-center hover:border-blue-500 transition">
          <FiUploadCloud size={70} className="mx-auto text-blue-500" />

          <h2 className="text-2xl font-semibold mt-6">Drag & Drop your PDF</h2>

          <p className="text-slate-400 mt-3">or click below to browse your files</p>

          <button
            onClick={handleBrowse}
            className="mt-8 bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-xl"
          >
            Browse Files
          </button>

          <input ref={fileInputRef} type="file" accept=".pdf" hidden onChange={handleFileChange} />

          <p className="mt-6 text-sm text-slate-500">
            Supported format: PDF - Maximum size: 20 MB
          </p>
        </div>
      )}

      {step === "selected" && (
        <>
          <FilePreview file={selectedFile} onRemove={removeFile} />

          <button
            onClick={startUpload}
            className="mt-5 bg-green-600 hover:bg-green-700 px-6 py-3 rounded-xl"
          >
            Analyze Contract
          </button>
        </>
      )}

      {step === "uploading" && <UploadProgress progress={progress} status={status} />}
    </>
  );
};

export default UploadDropZone;
