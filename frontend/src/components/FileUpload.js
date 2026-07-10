import React, { useRef, useState } from 'react';

function FileUpload({ onFileSelect, loading }) {
  const inputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);
  const [fileName, setFileName] = useState('');

  const handleFile = (file) => {
    if (!file) return;
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      alert('Please upload a PDF file');
      return;
    }
    setFileName(file.name);
    onFileSelect(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleChange = (e) => {
    const file = e.target.files[0];
    handleFile(file);
  };

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
      onClick={handleClick}
      className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-colors
        ${dragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'}
        ${loading ? 'pointer-events-none opacity-50' : ''}`}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".pdf"
        onChange={handleChange}
        className="hidden"
        disabled={loading}
      />
      <div className="text-5xl mb-4">
        {fileName ? '📄' : '📤'}
      </div>
      {fileName ? (
        <div>
          <p className="text-lg font-medium text-gray-900">{fileName}</p>
          <p className="text-sm text-blue-600 mt-1">Click or drag to change file</p>
        </div>
      ) : (
        <div>
          <p className="text-lg font-medium text-gray-700">
            Drop your PDF here or click to browse
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Supports: Rental Agreements, Employment Contracts, Insurance Policies, Loan Agreements
          </p>
        </div>
      )}
    </div>
  );
}

export default FileUpload;
