import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../config/api';

const FileUpload = ({ 
  onUpload, 
  onRemove, 
  multiple = false, 
  accept = 'image/*', 
  maxSize = 50 * 1024 * 1024, // 50MB
  maxFiles = 10,
  folder = 'general',
  className = '',
  disabled = false,
  showPreview = true
}) => {
  const [uploading, setUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const onDrop = useCallback(async (acceptedFiles) => {
    if (disabled) return;

    setUploading(true);
    const newFiles = [];

    try {
      for (const file of acceptedFiles) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', folder);

        const response = await api.upload('/upload/single', formData);

        if (!response.ok) {
          throw new Error(`Failed to upload ${file.name}`);
        }

        const result = await response.json();
        
        if (result.success) {
          const fileData = {
            ...result.data,
            localFile: file
          };
          
          newFiles.push(fileData);
          setUploadedFiles(prev => [...prev, fileData]);
          
          if (onUpload) {
            onUpload(fileData);
          }
          
          toast.success(`${file.name} uploaded successfully!`);
        } else {
          throw new Error(result.error || 'Upload failed');
        }
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(`Upload failed: ${error.message}`);
    } finally {
      setUploading(false);
    }
  }, [onUpload, folder, disabled]);

  const removeFile = async (fileData) => {
    try {
      if (fileData.fileName) {
        // Delete from S3
        const response = await api.delete(`/upload/${fileData.fileName}`);

        if (!response.ok) {
          console.warn('Failed to delete file from S3');
        }
      }

      setUploadedFiles(prev => prev.filter(f => f.fileName !== fileData.fileName));
      
      if (onRemove) {
        onRemove(fileData);
      }
      
      toast.success('File removed successfully!');
    } catch (error) {
      console.error('Remove error:', error);
      toast.error('Failed to remove file');
    }
  };

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: accept === 'image/*' ? {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    } : accept === 'video/*' ? {
      'video/*': ['.mp4', '.mov', '.avi', '.webm']
    } : accept,
    maxSize,
    maxFiles,
    multiple,
    disabled: disabled || uploading
  });

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
          ${isDragActive 
            ? 'border-primary-500 bg-primary-50' 
            : isDragReject 
              ? 'border-red-500 bg-red-50' 
              : 'border-gray-300 hover:border-gray-400'
          }
          ${disabled || uploading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input {...getInputProps()} />
        
        {uploading ? (
          <div className="flex items-center justify-center space-x-2">
            <Loader className="w-6 h-6 animate-spin text-primary-600" />
            <span className="text-gray-600">Uploading...</span>
          </div>
        ) : (
          <div className="space-y-2">
            <Upload className="w-8 h-8 mx-auto text-gray-400" />
            <div className="text-sm text-gray-600">
              {isDragActive ? (
                <p>Drop the files here...</p>
              ) : isDragReject ? (
                <p className="text-red-600">File type not supported!</p>
              ) : (
                <div>
                  <p className="font-medium">Drag & drop files here, or click to select</p>
                  <p className="text-xs mt-1">
                    {accept === 'image/*' && 'Images (JPG, PNG, GIF, WebP)'}
                    {accept === 'video/*' && 'Videos (MP4, MOV, AVI, WebM)'}
                    {accept !== 'image/*' && accept !== 'video/*' && 'All file types'}
                    {' • Max ' + (maxSize / (1024 * 1024)) + 'MB'}
                    {multiple && ` • Up to ${maxFiles} files`}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Uploaded Files Preview */}
      {showPreview && uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Uploaded Files:</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {uploadedFiles.map((fileData, index) => (
              <div key={index} className="relative group">
                <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 border">
                  {fileData.mimetype?.startsWith('image/') ? (
                    <img
                      src={fileData.fileUrl}
                      alt={fileData.originalName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-8 h-8 mx-auto mb-2 bg-gray-200 rounded flex items-center justify-center">
                          <span className="text-xs font-medium">VID</span>
                        </div>
                        <p className="text-xs text-gray-500 truncate px-2">
                          {fileData.originalName}
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {/* Remove button */}
                  <button
                    onClick={() => removeFile(fileData)}
                    className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Remove file"
                  >
                    <X className="w-3 h-3" />
                  </button>
                  
                  {/* Success indicator */}
                  <div className="absolute bottom-1 left-1 w-5 h-5 bg-green-500 text-white rounded-full flex items-center justify-center">
                    <CheckCircle className="w-3 h-3" />
                  </div>
                </div>
                
                <p className="text-xs text-gray-500 mt-1 truncate">
                  {fileData.originalName}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Error Display */}
      {isDragReject && (
        <div className="flex items-center space-x-2 text-red-600 text-sm">
          <AlertCircle className="w-4 h-4" />
          <span>File type not supported. Please select a valid file.</span>
        </div>
      )}
    </div>
  );
};

export default FileUpload; 