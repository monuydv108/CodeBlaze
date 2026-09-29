import { useEffect, useState } from 'react';
import axiosClient from '../utils/axiosClient';
import { NavLink } from 'react-router';

/* ─── Styles (matching AdminPanel's dark theme) ──────────────────────────── */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;600&display=swap');

  .av-root { min-height: 100vh; background: #0d0e11; color: #e8eaf0; font-family: 'Syne', sans-serif; }

  /* Nav */
  .av-nav {
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 24px; height: 48px; background: #111318;
    border-bottom: 1px solid #2a2d3a; position: sticky; top: 0; z-index: 50;
  }
  .av-nav-left { display: flex; align-items: center; gap: 12px; }
  .av-back {
    display: flex; align-items: center; gap: 6px; padding: 5px 12px;
    border-radius: 7px; font-size: 12px; font-weight: 600;
    color: #5a5f78; border: 1px solid #2a2d3a; background: transparent;
    text-decoration: none; transition: all .15s;
  }
  .av-back:hover { color: #e8eaf0; border-color: #3d4155; background: #1c1f28; }
  .av-nav-title { font-size: 13px; font-weight: 700; color: #e8eaf0; }
  .av-nav-badge {
    font-size: 9px; font-weight: 700; font-family: 'JetBrains Mono', monospace;
    padding: 2px 8px; border-radius: 99px; text-transform: uppercase; letter-spacing: .5px;
    color: #f59e0b; background: rgba(245,158,11,.12); border: 1px solid rgba(245,158,11,.25);
  }

  /* Page */
  .av-page { max-width: 1100px; margin: 0 auto; padding: 28px 24px 60px; }

  /* Header */
  .av-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; }
  .av-header-left h1 { font-size: 20px; font-weight: 800; letter-spacing: -.3px; }
  .av-header-left p  { font-size: 11px; color: #4a4d60; font-family: 'JetBrains Mono', monospace; margin-top: 4px; }

  /* Toast */
  .av-toast {
    position: fixed; top: 20px; left: 50%; transform: translateX(-50%);
    z-index: 9999; padding: 10px 20px; border-radius: 10px;
    font-size: 12px; font-weight: 600; font-family: 'JetBrains Mono', monospace;
    display: flex; align-items: center; gap: 8px;
    animation: av-slide-in .25s ease;
    box-shadow: 0 8px 24px rgba(0,0,0,.4);
  }
  @keyframes av-slide-in { from { opacity:0; transform:translateX(-50%) translateY(-10px); } to { opacity:1; transform:translateX(-50%) translateY(0); } }
  .av-toast.success { background: rgba(34,197,94,.15); border: 1px solid rgba(34,197,94,.3); color: #22c55e; }
  .av-toast.error   { background: rgba(239,68,68,.15);  border: 1px solid rgba(239,68,68,.3);  color: #ef4444; }

  /* Modal */
  .av-modal-overlay {
    position: fixed; inset: 0; background: rgba(0,0,0,.7); backdrop-filter: blur(4px);
    z-index: 100; display: flex; align-items: center; justify-content: center; padding: 20px;
  }
  .av-modal {
    background: #111318; border: 1px solid #2a2d3a; border-radius: 16px;
    padding: 28px; width: 100%; max-width: 420px;
    box-shadow: 0 24px 64px rgba(0,0,0,.6);
    animation: av-slide-in .2s ease;
  }
  .av-modal-title { font-size: 16px; font-weight: 800; margin-bottom: 10px; }
  .av-modal-body  { font-size: 13px; color: #8b8fa8; line-height: 1.6; margin-bottom: 24px; }
  .av-modal-body strong { color: #e8eaf0; }
  .av-modal-actions { display: flex; gap: 10px; justify-content: flex-end; }

  /* Buttons */
  .av-btn {
    display: flex; align-items: center; gap: 7px;
    padding: 8px 16px; border-radius: 8px; border: 1px solid;
    font-size: 12px; font-weight: 700; font-family: 'Syne', sans-serif;
    cursor: pointer; transition: all .15s; white-space: nowrap; text-decoration: none;
  }
  .av-btn-ghost  { color: #8b8fa8; background: transparent; border-color: #2a2d3a; }
  .av-btn-ghost:hover  { color: #e8eaf0; border-color: #3d4155; background: #1c1f28; }
  .av-btn-primary { color: #fff; background: #6c8ef7; border-color: #6c8ef7; }
  .av-btn-primary:hover { background: #7c9cf8; box-shadow: 0 0 16px rgba(108,142,247,.3); }
  .av-btn-danger  { color: #ef4444; background: rgba(239,68,68,.08); border-color: rgba(239,68,68,.25); }
  .av-btn-danger:hover  { background: rgba(239,68,68,.15); border-color: rgba(239,68,68,.4); }
  .av-btn:disabled { opacity: .45; cursor: not-allowed; }
  .av-btn-sm { padding: 5px 10px; font-size: 11px; border-radius: 6px; }

  /* Table */
  .av-table-wrap {
    border: 1px solid #2a2d3a; border-radius: 14px; overflow: hidden;
    background: #111318;
  }
  .av-table { width: 100%; border-collapse: collapse; }
  .av-table thead tr { background: #161820; border-bottom: 1px solid #2a2d3a; }
  .av-table th {
    padding: 11px 16px; text-align: left;
    font-size: 9px; font-weight: 700; font-family: 'JetBrains Mono', monospace;
    color: #4a4d60; text-transform: uppercase; letter-spacing: .8px;
  }
  .av-table tbody tr { border-bottom: 1px solid #1c1f28; transition: background .12s; }
  .av-table tbody tr:last-child { border-bottom: none; }
  .av-table tbody tr:hover { background: #13151d; }
  .av-table td { padding: 12px 16px; font-size: 13px; vertical-align: middle; }

  .av-problem-title { font-weight: 600; color: #e8eaf0; }

  .av-diff-badge {
    font-size: 9px; font-weight: 700; font-family: 'JetBrains Mono', monospace;
    padding: 2px 8px; border-radius: 99px; border: 1px solid; text-transform: uppercase; letter-spacing: .4px;
  }
  .av-easy   { color: #22c55e; background: rgba(34,197,94,.08);  border-color: rgba(34,197,94,.25); }
  .av-medium { color: #f59e0b; background: rgba(245,158,11,.08); border-color: rgba(245,158,11,.25); }
  .av-hard   { color: #ef4444; background: rgba(239,68,68,.08);  border-color: rgba(239,68,68,.25); }

  .av-tag-badge {
    font-size: 9px; font-weight: 700; font-family: 'JetBrains Mono', monospace;
    padding: 2px 8px; border-radius: 99px;
    color: #6c8ef7; background: rgba(108,142,247,.08); border: 1px solid rgba(108,142,247,.25);
    text-transform: uppercase; letter-spacing: .4px;
  }

  .av-video-badge {
    font-size: 9px; font-weight: 700; font-family: 'JetBrains Mono', monospace;
    padding: 2px 8px; border-radius: 99px; border: 1px solid; text-transform: uppercase; letter-spacing: .4px;
  }
  .av-has-video   { color: #22c55e; background: rgba(34,197,94,.08);  border-color: rgba(34,197,94,.25); }
  .av-no-video    { color: #4a4d60; background: transparent;           border-color: #2a2d3a; }

  .av-row-actions { display: flex; gap: 6px; align-items: center; }

  /* Empty & Loader */
  .av-empty {
    padding: 64px 20px; text-align: center;
    color: #4a4d60; font-family: 'JetBrains Mono', monospace; font-size: 12px;
  }
  .av-loader {
    display: flex; align-items: center; justify-content: center; padding: 80px;
    gap: 12px; font-size: 12px; font-family: 'JetBrains Mono', monospace; color: #4a4d60;
  }
  .av-spinner {
    width: 20px; height: 20px; border-radius: 50%;
    border: 2px solid #2a2d3a; border-top-color: #6c8ef7;
    animation: av-spin .7s linear infinite; flex-shrink: 0;
  }
  @keyframes av-spin { to { transform: rotate(360deg); } }
`;

/* ─── Component ──────────────────────────────────────────────────────────── */
export default function AdminVideo() {
  const [problems,     setProblems]     = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [toast,        setToast]        = useState(null);
  const [deleteModal,  setDeleteModal]  = useState(null); // problem obj to delete
  const [deleting,     setDeleting]     = useState(false);

  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => { fetchProblems(); }, []);

  const fetchProblems = async () => {
    try {
      setLoading(true);
      const { data } = await axiosClient.get('/problem/getAllProblem');
      setProblems(data);
    } catch (err) {
      showToast('error', err?.response?.data?.error || 'Failed to fetch problems');
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteModal) return;
    setDeleting(true);
    try {
      await axiosClient.delete(`/video/delete/${deleteModal._id}`);
      showToast('success', `Video for "${deleteModal.title}" deleted`);
      // Mark problem as having no video in local state (or refetch if you track video status)
      setProblems(prev =>
        prev.map(p => p._id === deleteModal._id ? { ...p, hasVideo: false } : p)
      );
    } catch (err) {
      showToast('error', err?.response?.data?.error || 'Failed to delete video');
    } finally {
      setDeleting(false);
      setDeleteModal(null);
    }
  };

  return (
    <>
      <style>{STYLES}</style>
      <div className="av-root">

        {/* ── Toast ── */}
        {toast && (
          <div className={`av-toast ${toast.type}`}>
            {toast.type === 'success' ? '✓' : '✕'} {toast.msg}
          </div>
        )}

        {/* ── Delete Confirmation Modal ── */}
        {deleteModal && (
          <div className="av-modal-overlay" onClick={() => setDeleteModal(null)}>
            <div className="av-modal" onClick={e => e.stopPropagation()}>
              <div className="av-modal-title" style={{ color: '#ef4444' }}>Delete Video</div>
              <div className="av-modal-body">
                Are you sure you want to delete the solution video for{' '}
                <strong>"{deleteModal.title}"</strong>?
                This action cannot be undone.
              </div>
              <div className="av-modal-actions">
                <button className="av-btn av-btn-ghost" onClick={() => setDeleteModal(null)}>
                  Cancel
                </button>
                <button
                  className="av-btn av-btn-danger"
                  onClick={confirmDelete}
                  disabled={deleting}
                >
                  {deleting ? 'Deleting…' : 'Delete Video'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Navbar ── */}
        <nav className="av-nav">
          <div className="av-nav-left">
            <NavLink to="/admin" className="av-back">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M8 2L4 6l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              Back
            </NavLink>
            <span className="av-nav-title">Video Management</span>
            <span className="av-nav-badge">⚙ Admin</span>
          </div>
        </nav>

        {/* ── Page ── */}
        <div className="av-page">
          <div className="av-header">
            <div className="av-header-left">
              <h1>Solution Videos</h1>
              <p>Upload or delete solution videos per problem</p>
            </div>
          </div>

          {loading ? (
            <div className="av-loader">
              <div className="av-spinner" />
              Loading problems…
            </div>
          ) : problems.length === 0 ? (
            <div className="av-table-wrap">
              <div className="av-empty">No problems found</div>
            </div>
          ) : (
            <div className="av-table-wrap">
              <table className="av-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Title</th>
                    <th>Difficulty</th>
                    <th>Tag</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {problems.map((problem, index) => (
                    <tr key={problem._id}>
                      <td style={{ color: '#2a2d3a', fontSize: 11, fontFamily: 'JetBrains Mono, monospace' }}>
                        {index + 1}
                      </td>
                      <td>
                        <span className="av-problem-title">{problem.title}</span>
                      </td>
                      <td>
                        <span className={`av-diff-badge av-${problem.difficulty?.toLowerCase()}`}>
                          {problem.difficulty}
                        </span>
                      </td>
                      <td>
                        <span className="av-tag-badge">{problem.tags}</span>
                      </td>
                      <td>
                        <div className="av-row-actions" style={{ justifyContent: 'flex-end' }}>
                          {/* Upload — navigates to AdminUpload page */}
                          <NavLink
                            to={`/admin/upload/${problem._id}`}
                            className="av-btn av-btn-primary av-btn-sm"
                          >
                            <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                              <path d="M5.5 7.5V1.5M2.5 4l3-3 3 3M1.5 9.5h8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            Upload
                          </NavLink>

                          {/* Delete video for this problem */}
                          <button
                            className="av-btn av-btn-danger av-btn-sm"
                            onClick={() => setDeleteModal(problem)}
                            disabled={deleting}
                          >
                            <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                              <path d="M1.5 3h8M4 3V2h3v1M4.5 5v3.5M6.5 5v3.5M2 3l.7 6.5h5.6L9 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            Delete Video
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
