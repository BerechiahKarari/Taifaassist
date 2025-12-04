import { useState } from 'react';
import { Upload, File, X, CheckCircle } from 'lucide-react';

export function FileUpload({ userId, onUploadComplete, language }) {
  const [uploading, setUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert(language === 'sw' ? 'Faili kubwa mno! Ukubwa wa juu ni 5MB' : 'File too large! Maximum size is 5MB');
      return;
    }

    setUploading(true);

    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const fileData = event.target.result;

        const response = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId,
            fileName: file.name,
            fileType: file.type,
            fileData
          })
        });

        const data = await response.json();
        
        if (data.success) {
          setUploadedFiles(prev => [...prev, { ...data.upload, name: file.name }]);
          if (onUploadComplete) onUploadComplete(data.upload);
        }
      };

      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Upload error:', error);
      alert(language === 'sw' ? 'Imeshindwa kupakia faili' : 'Failed to upload file');
    } finally {
      setUploading(false);
    }
  };

  const removeFile = (index) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
      <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
        <Upload className="w-5 h-5" />
        {language === 'sw' ? 'Pakia Hati' : 'Upload Documents'}
      </h3>
      
      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <Upload className="w-8 h-8 text-gray-400 mb-2" />
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {uploading 
              ? (language === 'sw' ? 'Inapakia...' : 'Uploading...') 
              : (language === 'sw' ? 'Bonyeza kupakia au buruta faili hapa' : 'Click to upload or drag and drop')}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
            PDF, PNG, JPG (max 5MB)
          </p>
        </div>
        <input 
          type="file" 
          className="hidden" 
          onChange={handleFileSelect}
          accept=".pdf,.png,.jpg,.jpeg"
          disabled={uploading}
        />
      </label>

      {uploadedFiles.length > 0 && (
        <div className="mt-4 space-y-2">
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            {language === 'sw' ? 'Faili Zilizopakiwa:' : 'Uploaded Files:'}
          </p>
          {uploadedFiles.map((file, index) => (
            <div key={index} className="flex items-center justify-between p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="flex items-center gap-2">
                <File className="w-4 h-4 text-green-600" />
                <span className="text-sm text-gray-700 dark:text-gray-300">{file.name}</span>
                <CheckCircle className="w-4 h-4 text-green-600" />
              </div>
              <button
                onClick={() => removeFile(index)}
                className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded"
              >
                <X className="w-4 h-4 text-red-600" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
