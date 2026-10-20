import React, { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, X, Link as LinkIcon, Loader2, Check } from 'lucide-react';
import { apiUrl } from '../../config/api';

export default function ImageUploader({
  label = "Upload Image",
  value = "",
  onChange,
  token,
  targetKey = "",
  onFocus,
  onBlur,
  folder = "chandrakanta"
}) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [tempUrl, setTempUrl] = useState('');
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError('');

    const formData = new FormData();
    formData.append('image', file);
    formData.append('folder', folder);

    try {
      const res = await fetch(apiUrl('/api/media/upload'), {
        method: 'POST',
        headers: {
          Authorization: token ? `Bearer ${token}` : ''
        },
        body: formData
      });
      const data = await res.json();
      if (res.ok && data.url) {
        onChange(data.url);
      } else {
        setUploadError(data.error || 'Upload failed');
      }
    } catch (err) {
      setUploadError(err.message || 'Network upload error');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleUrlSubmit = (e) => {
    e.preventDefault();
    if (tempUrl.trim()) {
      onChange(tempUrl.trim());
      setTempUrl('');
      setShowUrlInput(false);
    }
  };

  return (
    <div
      className="cms-uploader-group"
      data-editor-target={targetKey}
      onFocus={onFocus}
      onBlur={onBlur}
    >
      <div className="cms-uploader-header">
        <label className="cms-field-label">
          <ImageIcon size={13} />
          <span>{label}</span>
        </label>
        <button
          type="button"
          className="cms-link-toggle"
          onClick={() => setShowUrlInput(!showUrlInput)}
          title="Paste URL manually"
        >
          <LinkIcon size={12} />
          <span>{showUrlInput ? 'Hide URL' : 'Paste URL'}</span>
        </button>
      </div>

      {showUrlInput && (
        <form onSubmit={handleUrlSubmit} className="cms-url-input-row">
          <input
            type="text"
            placeholder="/images/hero.jpg or https://..."
            value={tempUrl}
            onChange={(e) => setTempUrl(e.target.value)}
            className="cms-input"
          />
          <button type="submit" className="cms-btn-apply" disabled={!tempUrl.trim()}>
            <Check size={13} />
          </button>
        </form>
      )}

      <div className="cms-preview-card">
        {value ? (
          <div className="cms-thumb-box">
            <img src={value} alt="Preview" className="cms-thumb-img" />
            <div className="cms-thumb-actions">
              <button
                type="button"
                className="cms-thumb-change-btn"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
              >
                {isUploading ? <Loader2 size={13} className="spin" /> : <Upload size={13} />}
                <span>{isUploading ? 'Uploading...' : 'Replace'}</span>
              </button>
              <button
                type="button"
                className="cms-thumb-remove-btn"
                onClick={() => onChange('')}
                title="Remove image"
              >
                <X size={13} />
              </button>
            </div>
          </div>
        ) : (
          <div
            className="cms-dropzone"
            onClick={() => fileInputRef.current?.click()}
          >
            {isUploading ? (
              <div className="cms-dropzone-loading">
                <Loader2 size={20} className="spin" />
                <span>Uploading to Cloud...</span>
              </div>
            ) : (
              <div className="cms-dropzone-empty">
                <Upload size={18} />
                <span>Click to Upload Image</span>
                <small>PNG, JPG, WebP up to 15MB</small>
              </div>
            )}
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
      </div>

      {uploadError && <p className="cms-error-msg">{uploadError}</p>}
    </div>
  );
}
