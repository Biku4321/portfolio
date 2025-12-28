import React, { useState } from 'react';
import axiosInstance from '../utils/axiosInstance';

export default function FileUploader({ onUploaded }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    const fd = new FormData();
    fd.append('image', file);
    try {
      const res = await axiosInstance.post('/upload', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      onUploaded?.(res.data.url);
    } catch (err) {
      console.error('Upload failed', err);
      alert('Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <input type="file" accept="image/*" onChange={handleFile} />
      {preview && (
        <img
          src={preview}
          alt="preview"
          className="w-40 h-40 object-cover rounded-lg shadow"
        />
      )}
      <div>
        <button
          onClick={handleUpload}
          disabled={loading}
          className="bg-indigo-600 text-white px-4 py-2 rounded"
        >
          {loading ? 'Uploading…' : 'Upload'}
        </button>
      </div>
    </div>
  );
}
