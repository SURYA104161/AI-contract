import MainLayout from "../../components/layout/MainLayout";
import UploadDropZone from "../../components/upload/UploadDropZone";

const Upload = () => {
  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold">Upload Contract</h1>

        <p className="text-slate-400 mt-2 mb-8">
          Upload your legal document for AI-powered analysis.
        </p>

        <UploadDropZone />
      </div>
    </MainLayout>
  );
};

export default Upload;
