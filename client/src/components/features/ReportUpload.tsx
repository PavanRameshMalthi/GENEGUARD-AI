import React, { useCallback, useState } from 'react';
import { UploadCloud, File as FileIcon, X, Loader2 } from 'lucide-react';

interface ReportUploadProps {
  onUpload: (file: File) => void;
  uploading?: boolean;
}

const ReportUpload: React.FC<ReportUploadProps> = ({ onUpload, uploading }) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      onUpload(selectedFile);
    }
  };

  return (
    <div className="w-full">
      {!selectedFile ? (
        <div
          className={`relative flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-2xl transition-all duration-300 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm ${
            dragActive 
              ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/10' 
              : 'border-gray-300 dark:border-gray-600 hover:border-primary-400'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleChange}
            disabled={uploading}
          />
          <UploadCloud className={`w-12 h-12 mb-4 ${dragActive ? 'text-primary-500' : 'text-gray-400'}`} />
          <p className="mb-2 text-sm text-gray-700 dark:text-gray-300 font-medium">
            Drag & drop a file here, or click to select
          </p>
          <p className="text-xs text-gray-500">
            Supports PDF, JPG, PNG up to 10MB
          </p>
        </div>
      ) : (
        <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border border-white/20 dark:border-gray-700/30 p-4 rounded-2xl flex items-center justify-between shadow-xl shadow-black/5 dark:shadow-black/20">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="p-2 bg-primary-100 dark:bg-primary-900/30 text-primary-600 rounded-lg shrink-0">
              <FileIcon size={20} />
            </div>
            <div className="truncate">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {selectedFile.name}
              </p>
              <p className="text-xs text-gray-500">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {!uploading && (
              <button 
                onClick={() => setSelectedFile(null)}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
              >
                <X size={18} />
              </button>
            )}
            <button
              onClick={handleUpload}
              disabled={uploading}
              className="flex items-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium rounded-xl transition-all disabled:opacity-70"
            >
              {uploading ? (
                <><Loader2 size={16} className="animate-spin" /> Uploading...</>
              ) : (
                'Upload'
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportUpload;
