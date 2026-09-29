import { useParams } from 'react-router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import axiosClient from '../utils/axiosClient';
import { NavLink } from 'react-router';

/* ─── Styles (matching AdminPanel / AdminVideo dark theme) ───────────────── */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&display=swap');

  .au-root { min-height: 100vh; background: #0d0e11; color: #e8eaf0; font-family: 'Syne', sans-serif; }

  /* Nav */
  .au-nav {
    display: flex; align-items: center; gap: 12px;
    padding: 0 24px; height: 48px; background: #111318;
    border-bottom: 1px solid #2a2d3a; position: sticky; top: 0; z-index: 50;
  }
  .au-back {
    display: flex; align-items: center; gap: 6px; padding: 5px 12px;
    border-radius: 7px; font-size: 12px; font-weight: 600;
    color: #5a5f78; border: 1px solid #2a2d3a; background: transparent;
    text-decoration: none; transition: all .15s;
  }
  .au-back:hover { color: #e8eaf0; border-color: #3d4155; background: #1c1f28; }
  .au-nav-title { font-size: 13px; font-weight: 700; color: #e8eaf0; }
  .au-nav-badge {
    font-size: 9px; font-weight: 700; font-family: 'JetBrains Mono', monospace;
    padding: 2px 8px; border-radius: 99px; text-transform: uppercase; letter-spacing: .5px;
    color: #f59e0b; background: rgba(245,158,11,.12); border: 1px solid rgba(245,158,11,.25);
  }

  /* Page */
  .au-page { max-width: 560px; margin: 0 auto; padding: 36px 24px 60px; }

  /* Header */
  .au-header { margin-bottom: 28px; }
  .au-header h1 { font-size: 20px; font-weight: 800; letter-spacing: -.3px; }
  .au-header p  { font-size: 11px; color: #4a4d60; font-family: 'JetBrains Mono', monospace; margin-top: 4px; }

  /* Toast */
  .au-toast {
    position: fixed; top: 20px; left: 50%; transform: translateX(-50%);
    z-index: 9999; padding: 10px 20px; border-radius: 10px;
    font-size: 12px; font-weight: 600; font-family: 'JetBrains Mono', monospace;
    display: flex; align-items: center; gap: 8px;
    animation: au-slide-in .25s ease; box-shadow: 0 8px 24px rgba(0,0,0,.4);
  }
  @keyframes au-slide-in { from { opacity:0; transform:translateX(-50%) translateY(-10px); } to { opacity:1; transform:translateX(-50%) translateY(0); } }
  .au-toast.success { background: rgba(34,197,94,.15); border: 1px solid rgba(34,197,94,.3); color: #22c55e; }
  .au-toast.error   { background: rgba(239,68,68,.15);  border: 1px solid rgba(239,68,68,.3);  color: #ef4444; }

  /* Card / section */
  .au-card {
    border: 1px solid #2a2d3a; border-radius: 14px;
    background: #111318; overflow: hidden;
  }
  .au-card-header {
    padding: 14px 20px; background: #161820;
    border-bottom: 1px solid #2a2d3a;
    font-size: 12px; font-weight: 700; color: #e8eaf0;
    text-transform: uppercase; letter-spacing: .5px;
    display: flex; align-items: center; gap: 10px;
  }
  .au-card-num {
    width: 20px; height: 20px; border-radius: 50%;
    background: #6c8ef7; color: #fff;
    font-size: 10px; font-weight: 800; font-family: 'JetBrains Mono', monospace;
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  }
  .au-card-body { padding: 20px; display: grid; gap: 16px; }

  /* Drop zone */
  .au-dropzone {
    border: 2px dashed #2a2d3a; border-radius: 10px;
    padding: 32px 20px; text-align: center;
    cursor: pointer; transition: all .2s; position: relative;
    background: #0d0e11;
  }
  .au-dropzone:hover, .au-dropzone.drag-over {
    border-color: #6c8ef7; background: rgba(108,142,247,.05);
  }
  .au-dropzone.err { border-color: #ef4444; }
  .au-dropzone input[type="file"] {
    position: absolute; inset: 0; opacity: 0; cursor: pointer; width: 100%; height: 100%;
  }
  .au-dropzone-icon { margin: 0 auto 12px; color: #2a2d3a; }
  .au-dropzone-text { font-size: 13px; color: #5a5f78; }
  .au-dropzone-text span { color: #6c8ef7; font-weight: 600; }
  .au-dropzone-hint { font-size: 10px; color: #4a4d60; font-family: 'JetBrains Mono', monospace; margin-top: 6px; }
  .au-err-msg { font-size: 10px; color: #ef4444; font-family: 'JetBrains Mono', monospace; }

  /* File info */
  .au-file-info {
    display: flex; align-items: center; gap: 12px;
    padding: 12px 14px; border-radius: 10px;
    background: #0d0e11; border: 1px solid #2a2d3a;
  }
  .au-file-icon {
    width: 36px; height: 36px; border-radius: 8px;
    background: rgba(108,142,247,.12); border: 1px solid rgba(108,142,247,.25);
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
    color: #6c8ef7;
  }
  .au-file-name { font-size: 12px; font-weight: 600; color: #e8eaf0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .au-file-size { font-size: 10px; color: #4a4d60; font-family: 'JetBrains Mono', monospace; margin-top: 2px; }

  /* Progress */
  .au-progress-wrap { display: grid; gap: 8px; }
  .au-progress-top { display: flex; justify-content: space-between; font-size: 11px; font-family: 'JetBrains Mono', monospace; color: #5a5f78; }
  .au-progress-top span:last-child { color: #6c8ef7; font-weight: 600; }
  .au-progress-bar-bg { height: 6px; background: #1c1f28; border-radius: 99px; overflow: hidden; }
  .au-progress-bar    { height: 100%; background: linear-gradient(90deg, #6c8ef7, #a78bfa); border-radius: 99px; transition: width .3s ease; }

  /* Success box */
  .au-success {
    padding: 16px; border-radius: 10px;
    background: rgba(34,197,94,.08); border: 1px solid rgba(34,197,94,.25);
    display: grid; gap: 6px;
  }
  .au-success-title { font-size: 12px; font-weight: 700; color: #22c55e; display: flex; align-items: center; gap: 6px; }
  .au-success-row   { font-size: 11px; color: #5a5f78; font-family: 'JetBrains Mono', monospace; }
  .au-success-row span { color: #e8eaf0; }

  /* Error box */
  .au-error-box {
    padding: 12px 14px; border-radius: 10px;
    background: rgba(239,68,68,.08); border: 1px solid rgba(239,68,68,.25);
    font-size: 12px; color: #ef4444; font-family: 'JetBrains Mono', monospace;
    display: flex; align-items: center; gap: 8px;
  }

  /* Submit */
  .au-submit {
    width: 100%; padding: 12px; border-radius: 10px;
    font-size: 13px; font-weight: 700; font-family: 'Syne', sans-serif;
    color: #fff; background: #6c8ef7; border: 1px solid #6c8ef7;
    cursor: pointer; transition: all .15s;
    display: flex; align-items: center; justify-content: center; gap: 8px;
  }
  .au-submit:hover:not(:disabled) { background: #7c9cf8; box-shadow: 0 0 20px rgba(108,142,247,.3); }
  .au-submit:disabled { opacity: .45; cursor: not-allowed; }

  .au-spinner {
    width: 14px; height: 14px; border-radius: 50%;
    border: 2px solid rgba(255,255,255,.3); border-top-color: #fff;
    animation: au-spin .7s linear infinite; flex-shrink: 0;
  }
  @keyframes au-spin { to { transform: rotate(360deg); } }
`;

/* ─── Helpers ────────────────────────────────────────────────────────────── */
const formatFileSize = (bytes) => {
  if (!bytes) return '0 B';
  const k = 1024, sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const formatDuration = (seconds) => {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
};

/* ─── Component ──────────────────────────────────────────────────────────── */
export default function AdminUpload() {
  const { problemId } = useParams();

  const [uploading,       setUploading]       = useState(false);
  const [uploadProgress,  setUploadProgress]  = useState(0);
  const [uploadedVideo,   setUploadedVideo]   = useState(null);
  const [toast,           setToast]           = useState(null);

  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  };

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
    setError,
    clearErrors,
  } = useForm();

  const selectedFile = watch('videoFile')?.[0];

  const onSubmit = async (data) => {
    const file = data.videoFile[0];
    setUploading(true);
    setUploadProgress(0);
    clearErrors();

    try {
      // Step 1: signature
      const { data: sig } = await axiosClient.get(`/video/create/${problemId}`);
      const { signature, timestamp, public_id, api_key, upload_url } = sig;

      // Step 2: upload to Cloudinary
      const formData = new FormData();
      formData.append('file',       file);
      formData.append('signature',  signature);
      formData.append('timestamp',  timestamp);
      formData.append('public_id',  public_id);
      formData.append('api_key',    api_key);

      const { data: cloudinaryResult } = await axios.post(upload_url, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (e) => setUploadProgress(Math.round((e.loaded * 100) / e.total)),
      });

      // Step 3: save metadata
      const { data: saved } = await axiosClient.post('/video/save', {
        problemId,
        cloudinaryPublicId: cloudinaryResult.public_id,
        secureUrl:          cloudinaryResult.secure_url,
        duration:           cloudinaryResult.duration,
      });

      setUploadedVideo(saved.videoSolution);
      showToast('success', 'Video uploaded successfully!');
      reset();

    } catch (err) {
      const msg = err?.response?.data?.error || err?.response?.data?.message || 'Upload failed. Please try again.';
      setError('root', { type: 'manual', message: msg });
      showToast('error', msg);
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <>
      <style>{STYLES}</style>
      <div className="au-root">

        {/* ── Toast ── */}
        {toast && (
          <div className={`au-toast ${toast.type}`}>
            {toast.type === 'success' ? '✓' : '✕'} {toast.msg}
          </div>
        )}

        {/* ── Nav ── */}
        <nav className="au-nav">
          <NavLink to="/admin/video" className="au-back">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M8 2L4 6l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            Back
          </NavLink>
          <span className="au-nav-title">Upload Solution Video</span>
          <span className="au-nav-badge">⚙ Admin</span>
        </nav>

        <div className="au-page">
          <div className="au-header">
            <h1>Upload Video</h1>
            <p>Upload a solution video for this problem to Cloudinary</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'grid', gap: 16 }}>

            {/* ── File picker ── */}
            <div className="au-card">
              <div className="au-card-header">
                <span className="au-card-num">1</span>
                Select Video File
              </div>
              <div className="au-card-body">
                <div
                  className={`au-dropzone ${errors.videoFile ? 'err' : ''}`}
                  onClick={() => document.getElementById('au-file-input').click()}
                >
                  <input
                    id="au-file-input"
                    type="file"
                    accept="video/*"
                    disabled={uploading}
                    {...register('videoFile', {
                      required: 'Please select a video file',
                      validate: {
                        isVideo: (files) =>
                          files?.[0]?.type.startsWith('video/') || 'Please select a valid video file',
                        fileSize: (files) =>
                          !files?.[0] || files[0].size <= 100 * 1024 * 1024 || 'File size must be less than 100 MB',
                      },
                    })}
                    style={{ display: 'none' }}
                  />
                  <svg className="au-dropzone-icon" width="36" height="36" viewBox="0 0 36 36" fill="none">
                    <rect x="4" y="4" width="28" height="28" rx="6" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M18 23V13M14 17l4-4 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <div className="au-dropzone-text">
                    <span>Click to browse</span> or drag & drop
                  </div>
                  <div className="au-dropzone-hint">MP4, MOV, WEBM — max 100 MB</div>
                </div>

                {errors.videoFile && (
                  <span className="au-err-msg">⚠ {errors.videoFile.message}</span>
                )}

                {/* Selected file preview */}
                {selectedFile && (
                  <div className="au-file-info">
                    <div className="au-file-icon">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M3 2h7l3 3v9H3V2z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
                        <path d="M10 2v3h3" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
                        <path d="M6 9l2-1.5v3L6 9z" fill="currentColor"/>
                      </svg>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="au-file-name">{selectedFile.name}</div>
                      <div className="au-file-size">{formatFileSize(selectedFile.size)}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* ── Upload progress ── */}
            {uploading && (
              <div className="au-card">
                <div className="au-card-header">
                  <span className="au-card-num">2</span>
                  Uploading to Cloudinary
                </div>
                <div className="au-card-body">
                  <div className="au-progress-wrap">
                    <div className="au-progress-top">
                      <span>Uploading…</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="au-progress-bar-bg">
                      <div className="au-progress-bar" style={{ width: `${uploadProgress}%` }} />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── Error ── */}
            {errors.root && (
              <div className="au-error-box">
                ✕ {errors.root.message}
              </div>
            )}

            {/* ── Success ── */}
            {uploadedVideo && (
              <div className="au-success">
                <div className="au-success-title">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.3"/>
                    <path d="M4.5 7l2 2 3-3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Upload Successful
                </div>
                <div className="au-success-row">
                  Duration · <span>{formatDuration(uploadedVideo.duration)}</span>
                </div>
                <div className="au-success-row">
                  Uploaded · <span>{new Date(uploadedVideo.uploadedAt).toLocaleString()}</span>
                </div>
              </div>
            )}

            {/* ── Submit button ── */}
            <button type="submit" className="au-submit" disabled={uploading}>
              {uploading
                ? <><span className="au-spinner" /> Uploading…</>
                : <>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M7 10V3M4 6l3-3 3 3M2 11h10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Upload Video
                  </>
              }
            </button>

          </form>
        </div>
      </div>
    </>
  );
}
