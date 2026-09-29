import { useState, useEffect } from 'react';
import axiosClient from '../utils/axiosClient';

const STYLES = `
  .sh-root { font-family: 'JetBrains Mono', monospace; }

  .sh-table-wrap { overflow-x: auto; border-radius: 10px; border: 1px solid var(--border); }
  .sh-table { width: 100%; border-collapse: collapse; font-size: 12px; }
  .sh-table thead tr {
    background: var(--bg-2);
    border-bottom: 1px solid var(--border);
  }
  .sh-table th {
    padding: 10px 14px; text-align: left;
    font-size: 10px; font-weight: 700;
    color: var(--text-muted); letter-spacing: .8px; text-transform: uppercase;
  }
  .sh-table tbody tr {
    border-bottom: 1px solid var(--border);
    transition: background .12s;
  }
  .sh-table tbody tr:last-child { border-bottom: none; }
  .sh-table tbody tr:hover { background: var(--bg-2); }
  .sh-table td { padding: 10px 14px; color: var(--text-secondary); vertical-align: middle; }

  .sh-status {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 2px 8px; border-radius: 20px;
    font-size: 10px; font-weight: 700; letter-spacing: .4px; text-transform: uppercase;
  }
  .sh-status-dot { width: 5px; height: 5px; border-radius: 50%; }
  .sh-accepted { color: var(--success); background: var(--success-dim); border: 1px solid rgba(34,197,94,.25); }
  .sh-wrong    { color: var(--error);   background: var(--error-dim);   border: 1px solid rgba(239,68,68,.25); }
  .sh-error    { color: var(--warning); background: var(--warning-dim); border: 1px solid rgba(245,158,11,.25); }
  .sh-tle      { color: var(--warning); background: var(--warning-dim); border: 1px solid rgba(245,158,11,.25); }
  .sh-pending  { color: var(--accent);  background: var(--accent-dim);  border: 1px solid rgba(108,142,247,.25); }

  .sh-code-btn {
    padding: 3px 10px; border-radius: 5px;
    font-size: 10px; font-weight: 600;
    color: var(--text-muted); background: var(--bg-3);
    border: 1px solid var(--border); cursor: pointer;
    transition: all .12s;
  }
  .sh-code-btn:hover { color: var(--text-primary); border-color: var(--border-hover); }

  .sh-empty {
    text-align: center; padding: 48px 20px;
    color: var(--text-muted); font-size: 12px;
  }
  .sh-empty svg { opacity: .2; margin: 0 auto 12px; display: block; }

  .sh-count { font-size: 11px; color: var(--text-muted); margin-top: 10px; }

  /* Modal */
  .sh-modal-overlay {
    position: fixed; inset: 0; z-index: 100;
    background: rgba(0,0,0,.7); backdrop-filter: blur(4px);
    display: flex; align-items: center; justify-content: center;
    padding: 20px;
  }
  .sh-modal {
    background: var(--bg-1); border: 1px solid var(--border);
    border-radius: 14px; width: 100%; max-width: 860px;
    max-height: 85vh; display: flex; flex-direction: column;
    box-shadow: 0 24px 64px rgba(0,0,0,.5);
  }
  .sh-modal-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 16px 20px; border-bottom: 1px solid var(--border);
  }
  .sh-modal-title { font-size: 13px; font-weight: 700; color: var(--text-primary); }
  .sh-modal-close {
    width: 28px; height: 28px; border-radius: 6px;
    display: flex; align-items: center; justify-content: center;
    background: var(--bg-3); border: 1px solid var(--border);
    color: var(--text-muted); cursor: pointer; font-size: 16px;
    transition: all .12s;
  }
  .sh-modal-close:hover { color: var(--text-primary); border-color: var(--border-hover); }
  .sh-modal-meta {
    display: flex; flex-wrap: wrap; gap: 7px;
    padding: 14px 20px; border-bottom: 1px solid var(--border);
  }
  .sh-meta-pill {
    padding: 2px 9px; border-radius: 20px;
    font-size: 10px; font-weight: 600;
    color: var(--text-muted); background: var(--bg-3);
    border: 1px solid var(--border);
  }
  .sh-modal-error {
    margin: 0 20px 0;
    padding: 10px 14px; border-radius: 8px;
    background: var(--error-dim); border: 1px solid rgba(239,68,68,.25);
    font-size: 11px; color: var(--error);
  }
  .sh-modal-code {
    flex: 1; overflow-y: auto; margin: 14px 20px 20px;
    background: var(--bg-0); border: 1px solid var(--border);
    border-radius: 8px; padding: 16px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 12px; line-height: 1.7;
    color: var(--text-secondary);
    white-space: pre; overflow-x: auto;
    scrollbar-width: thin; scrollbar-color: var(--border) transparent;
  }

  .sh-spinner {
    display: flex; align-items: center; justify-content: center;
    padding: 48px; color: var(--text-muted); gap: 10px; font-size: 12px;
  }
  .sh-spinner-ring {
    width: 20px; height: 20px; border-radius: 50%;
    border: 2px solid var(--border); border-top-color: var(--accent);
    animation: sh-spin .7s linear infinite; flex-shrink: 0;
  }
  @keyframes sh-spin { to { transform: rotate(360deg); } }
`;

const statusClass = (s) => {
  switch (s) {
    case 'accepted': return 'sh-status sh-accepted';
    case 'wrong':    return 'sh-status sh-wrong';
    case 'error':    return 'sh-status sh-error';
    case 'tle':      return 'sh-status sh-tle';
    default:         return 'sh-status sh-pending';
  }
};

const statusDotColor = (s) => {
  switch (s) {
    case 'accepted': return 'var(--success)';
    case 'wrong':    return 'var(--error)';
    case 'error':
    case 'tle':      return 'var(--warning)';
    default:         return 'var(--accent)';
  }
};

const formatMemory = (memory) => {
  if (!memory) return '—';
  if (memory < 1024) return `${memory} KB`;
  return `${(memory / 1024).toFixed(2)} MB`;
};

const formatDate = (d) => {
  if (!d) return '—';
  return new Date(d).toLocaleString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
};

// Normalize language display — DB stores 'js' in old records
const langLabel = (l) => {
  if (!l) return '—';
  if (l === 'javascript' || l === 'js') return 'JavaScript';
  if (l === 'c++' || l === 'cpp')       return 'C++';
  if (l === 'java')                     return 'Java';
  return l;
};

const SubmissionHistory = ({ problemId }) => {
  const [submissions,        setSubmissions]        = useState([]);
  const [loading,            setLoading]            = useState(true);
  const [error,              setError]              = useState(null);
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        setLoading(true);
        // Route: GET /problem/submittedProblem/:pid
        const { data } = await axiosClient.get(`/problem/submittedProblem/${problemId}`);
        // Sort newest first
        const sorted = [...data].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setSubmissions(sorted);
        setError(null);
      } catch (err) {
        setError('Failed to load submission history.');
        console.error('[SubmissionHistory]', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSubmissions();
  }, [problemId]);

  return (
    <>
      <style>{STYLES}</style>
      <div className="sh-root">

        {loading && (
          <div className="sh-spinner">
            <div className="sh-spinner-ring" />
            Loading submissions...
          </div>
        )}

        {!loading && error && (
          <div style={{
            padding: '12px 14px', borderRadius: 8, fontSize: 12,
            background: 'var(--error-dim)', border: '1px solid rgba(239,68,68,.25)',
            color: 'var(--error)'
          }}>
            {error}
          </div>
        )}

        {!loading && !error && submissions.length === 0 && (
          <div className="sh-empty">
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
              <path d="M10 8h16a2 2 0 012 2v16a2 2 0 01-2 2H10a2 2 0 01-2-2V10a2 2 0 012-2z" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M13 14h10M13 18h7M13 22h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            No submissions yet. Hit Submit to get started.
          </div>
        )}

        {!loading && !error && submissions.length > 0 && (
          <>
            <div className="sh-table-wrap">
              <table className="sh-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Status</th>
                    <th>Language</th>
                    <th>Test Cases</th>
                    <th>Runtime</th>
                    <th>Memory</th>
                    <th>Submitted</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {submissions.map((sub, idx) => (
                    <tr key={sub._id}>
                      <td style={{ color: 'var(--text-muted)' }}>{idx + 1}</td>
                      <td>
                        <span className={statusClass(sub.status)}>
                          <span className="sh-status-dot" style={{ background: statusDotColor(sub.status) }} />
                          {sub.status === 'accepted' ? 'Accepted'
                            : sub.status === 'wrong' ? 'Wrong Ans'
                            : sub.status === 'tle'   ? 'TLE'
                            : sub.status === 'error' ? 'Error'
                            : 'Pending'}
                        </span>
                      </td>
                      <td>{langLabel(sub.language)}</td>
                      <td>{sub.testCasesPassed ?? 0}/{sub.testCasesTotal ?? '?'}</td>
                      <td>{sub.runtime != null ? `${sub.runtime}s` : '—'}</td>
                      <td>{formatMemory(sub.memory)}</td>
                      <td style={{ fontSize: 11, color: 'var(--text-muted)' }}>{formatDate(sub.createdAt)}</td>
                      <td>
                        <button className="sh-code-btn" onClick={() => setSelectedSubmission(sub)}>
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="sh-count">{submissions.length} submission{submissions.length !== 1 ? 's' : ''}</p>
          </>
        )}

        {/* Code Modal */}
        {selectedSubmission && (
          <div className="sh-modal-overlay" onClick={() => setSelectedSubmission(null)}>
            <div className="sh-modal" onClick={(e) => e.stopPropagation()}>
              <div className="sh-modal-header">
                <span className="sh-modal-title">Submission — {langLabel(selectedSubmission.language)}</span>
                <button className="sh-modal-close" onClick={() => setSelectedSubmission(null)}>×</button>
              </div>
              <div className="sh-modal-meta">
                <span className={statusClass(selectedSubmission.status)}>
                  <span className="sh-status-dot" style={{ background: statusDotColor(selectedSubmission.status) }} />
                  {selectedSubmission.status}
                </span>
                <span className="sh-meta-pill">
                  {selectedSubmission.testCasesPassed}/{selectedSubmission.testCasesTotal} passed
                </span>
                {selectedSubmission.runtime != null && (
                  <span className="sh-meta-pill">⚡ {selectedSubmission.runtime}s</span>
                )}
                {selectedSubmission.memory != null && (
                  <span className="sh-meta-pill">◈ {formatMemory(selectedSubmission.memory)}</span>
                )}
                <span className="sh-meta-pill">{formatDate(selectedSubmission.createdAt)}</span>
              </div>
              {selectedSubmission.errorMessage && (
                <div className="sh-modal-error">{selectedSubmission.errorMessage}</div>
              )}
              <pre className="sh-modal-code">{selectedSubmission.code}</pre>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default SubmissionHistory;
