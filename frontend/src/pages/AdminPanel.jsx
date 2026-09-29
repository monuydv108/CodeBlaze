import { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { NavLink } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchAllProblems,
  fetchProblemById,
  createProblem,
  updateProblem,
  deleteProblem,
  clearSelected,
  clearError,
} from '../problemsSlice';

/* ─── Zod Schema ─────────────────────────────────────────────────────────── */
const schema = z.object({
  title:       z.string().min(1, 'Required'),
  description: z.string().min(1, 'Required'),
  difficulty:  z.enum(['easy', 'medium', 'hard']),
  tags:        z.enum(['array', 'linkedList', 'graph', 'dp']),
  visibleTestCases: z.array(z.object({
    input:       z.string().min(1, 'Required'),
    output:      z.string().min(1, 'Required'),
    explanation: z.string().min(1, 'Required'),
  })).min(1, 'Add at least one visible test case'),
  hiddenTestCases: z.array(z.object({
    input:  z.string().min(1, 'Required'),
    output: z.string().min(1, 'Required'),
  })).min(1, 'Add at least one hidden test case'),
  startCode: z.array(z.object({
    language:    z.enum(['C++', 'Java', 'JavaScript']),
    initialCode: z.string().min(1, 'Required'),
  })).length(3),
  referenceSolution: z.array(z.object({
    language:     z.enum(['C++', 'Java', 'JavaScript']),
    completeCode: z.string().min(1, 'Required'),
  })).length(3),
});

const DEFAULT_VALUES = {
  difficulty: 'easy', tags: 'array',
  visibleTestCases: [], hiddenTestCases: [],
  startCode:         [{ language:'C++',initialCode:'' },{ language:'Java',initialCode:'' },{ language:'JavaScript',initialCode:'' }],
  referenceSolution: [{ language:'C++',completeCode:'' },{ language:'Java',completeCode:'' },{ language:'JavaScript',completeCode:'' }],
};

/* ─── Styles ─────────────────────────────────────────────────────────────── */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  ::-webkit-scrollbar { width: 4px; height: 4px; }
  ::-webkit-scrollbar-thumb { background: #2a2d3a; border-radius: 4px; }
  html {
  font-size: 110%; /* increases overall font size */
}
  .ap-root { min-height: 100vh; background: #0d0e11; color: #e8eaf0; font-family: 'Syne', sans-serif; }

  /* Nav */
  .ap-nav {
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 24px; height: 48px; background: #111318;
    border-bottom: 1px solid #2a2d3a; position: sticky; top: 0; z-index: 50;
  }
  .ap-nav-left { display: flex; align-items: center; gap: 12px; }
  .ap-back {
    display: flex; align-items: center; gap: 6px; padding: 5px 12px;
    border-radius: 7px; font-size: 12px; font-weight: 600;
    color: #5a5f78; border: 1px solid #2a2d3a; background: transparent;
    text-decoration: none; transition: all .15s;
  }
  .ap-back:hover { color: #e8eaf0; border-color: #3d4155; background: #1c1f28; }
  .ap-nav-title { font-size: 13px; font-weight: 700; color: #e8eaf0; }
  .ap-nav-badge {
    font-size: 9px; font-weight: 700; font-family: 'JetBrains Mono', monospace;
    padding: 2px 8px; border-radius: 99px; text-transform: uppercase; letter-spacing: .5px;
    color: #f59e0b; background: rgba(245,158,11,.12); border: 1px solid rgba(245,158,11,.25);
  }

  /* Page */
  .ap-page { max-width: 1100px; margin: 0 auto; padding: 28px 24px 60px; }

  /* Toast */
  .ap-toast {
    position: fixed; top: 20px; left: 50%; transform: translateX(-50%);
    z-index: 9999; padding: 10px 20px; border-radius: 10px;
    font-size: 12px; font-weight: 600; font-family: 'JetBrains Mono', monospace;
    display: flex; align-items: center; gap: 8px;
    animation: ap-slide-in .25s ease;
    box-shadow: 0 8px 24px rgba(0,0,0,.4);
  }
  @keyframes ap-slide-in { from { opacity:0; transform:translateX(-50%) translateY(-10px); } to { opacity:1; transform:translateX(-50%) translateY(0); } }
  .ap-toast.success { background: rgba(34,197,94,.15); border: 1px solid rgba(34,197,94,.3); color: #22c55e; }
  .ap-toast.error   { background: rgba(239,68,68,.15);  border: 1px solid rgba(239,68,68,.3);  color: #ef4444; }

  /* Modal */
  .ap-modal-overlay {
    position: fixed; inset: 0; background: rgba(0,0,0,.7); backdrop-filter: blur(4px);
    z-index: 100; display: flex; align-items: center; justify-content: center; padding: 20px;
  }
  .ap-modal {
    background: #111318; border: 1px solid #2a2d3a; border-radius: 16px;
    padding: 28px; width: 100%; max-width: 420px;
    box-shadow: 0 24px 64px rgba(0,0,0,.6);
    animation: ap-slide-in .2s ease;
  }
  .ap-modal-title { font-size: 16px; font-weight: 800; margin-bottom: 10px; }
  .ap-modal-body  { font-size: 13px; color: #8b8fa8; line-height: 1.6; margin-bottom: 24px; }
  .ap-modal-body strong { color: #e8eaf0; }
  .ap-modal-actions { display: flex; gap: 10px; justify-content: flex-end; }

  /* Header row */
  .ap-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; }
  .ap-header-left h1 { font-size: 20px; font-weight: 800; letter-spacing: -.3px; }
  .ap-header-left p  { font-size: 11px; color: #4a4d60; font-family: 'JetBrains Mono', monospace; margin-top: 4px; }

  /* Action buttons */
  .ap-actions { display: flex; gap: 8px; }
  .ap-btn {
    display: flex; align-items: center; gap: 7px;
    padding: 8px 16px; border-radius: 8px; border: 1px solid;
    font-size: 12px; font-weight: 700; font-family: 'Syne', sans-serif;
    cursor: pointer; transition: all .15s; white-space: nowrap;
  }
  .ap-btn-primary {
    color: #fff; background: #6c8ef7; border-color: #6c8ef7;
  }
  .ap-btn-primary:hover { background: #7c9cf8; box-shadow: 0 0 16px rgba(108,142,247,.3); }
  .ap-btn-ghost {
    color: #8b8fa8; background: transparent; border-color: #2a2d3a;
  }
  .ap-btn-ghost:hover { color: #e8eaf0; border-color: #3d4155; background: #1c1f28; }
  .ap-btn-danger {
    color: #ef4444; background: rgba(239,68,68,.08); border-color: rgba(239,68,68,.25);
  }
  .ap-btn-danger:hover { background: rgba(239,68,68,.15); border-color: rgba(239,68,68,.4); }
  .ap-btn-success {
    color: #22c55e; background: rgba(34,197,94,.08); border-color: rgba(34,197,94,.25);
  }
  .ap-btn-success:hover { background: rgba(34,197,94,.15); }
  .ap-btn:disabled { opacity: .45; cursor: not-allowed; }
  .ap-btn-sm { padding: 5px 10px; font-size: 11px; border-radius: 6px; }
  .ap-btn-xs { padding: 3px 8px; font-size: 10px; border-radius: 5px; }

  /* Table */
  .ap-table-wrap {
    border: 1px solid #2a2d3a; border-radius: 14px; overflow: hidden;
    background: #111318;
  }
  .ap-table { width: 100%; border-collapse: collapse; }
  .ap-table thead tr { background: #161820; border-bottom: 1px solid #2a2d3a; }
  .ap-table th {
    padding: 11px 16px; text-align: left;
    font-size: 9px; font-weight: 700; font-family: 'JetBrains Mono', monospace;
    color: #4a4d60; text-transform: uppercase; letter-spacing: .8px;
  }
  .ap-table tbody tr { border-bottom: 1px solid #1c1f28; transition: background .12s; }
  .ap-table tbody tr:last-child { border-bottom: none; }
  .ap-table tbody tr:hover { background: #13151d; }
  .ap-table td { padding: 12px 16px; font-size: 13px; vertical-align: middle; }

  .ap-problem-title { font-weight: 600; color: #e8eaf0; }
  .ap-diff-badge {
    font-size: 9px; font-weight: 700; font-family: 'JetBrains Mono', monospace;
    padding: 2px 8px; border-radius: 99px; border: 1px solid; text-transform: uppercase; letter-spacing: .4px;
  }
  .ap-easy   { color: #22c55e; background: rgba(34,197,94,.08);  border-color: rgba(34,197,94,.25); }
  .ap-medium { color: #f59e0b; background: rgba(245,158,11,.08); border-color: rgba(245,158,11,.25); }
  .ap-hard   { color: #ef4444; background: rgba(239,68,68,.08);  border-color: rgba(239,68,68,.25); }
  .ap-tag-badge {
    font-size: 9px; font-weight: 700; font-family: 'JetBrains Mono', monospace;
    padding: 2px 8px; border-radius: 99px;
    color: #6c8ef7; background: rgba(108,142,247,.08); border: 1px solid rgba(108,142,247,.25);
    text-transform: uppercase; letter-spacing: .4px;
  }
  .ap-tc-count { font-size: 11px; font-family: 'JetBrains Mono', monospace; color: #4a4d60; }
  .ap-row-actions { display: flex; justify-content: flex-end; gap: 6px; }

  /* Empty */
  .ap-empty {
    padding: 64px 20px; text-align: center;
    color: #4a4d60; font-family: 'JetBrains Mono', monospace; font-size: 12px;
  }
  .ap-empty svg { opacity: .2; margin: 0 auto 14px; display: block; }

  /* Loader */
  .ap-loader {
    display: flex; align-items: center; justify-content: center; padding: 80px;
    gap: 12px; font-size: 12px; font-family: 'JetBrains Mono', monospace; color: #4a4d60;
  }
  .ap-spinner {
    width: 20px; height: 20px; border-radius: 50%;
    border: 2px solid #2a2d3a; border-top-color: #6c8ef7;
    animation: ap-spin .7s linear infinite; flex-shrink: 0;
  }
  @keyframes ap-spin { to { transform: rotate(360deg); } }

  /* Form */
  .ap-form-grid { display: grid; gap: 20px; }
  .ap-section {
    border: 1px solid #2a2d3a; border-radius: 14px;
    background: #111318; overflow: hidden;
    animation: ap-fadein .3s ease both;
  }
  @keyframes ap-fadein { from { opacity:0; transform:translateY(8px) } to { opacity:1; transform:none } }
  .ap-section-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 14px 20px; background: #161820;
    border-bottom: 1px solid #2a2d3a;
  }
  .ap-section-title {
    display: flex; align-items: center; gap: 10px;
    font-size: 12px; font-weight: 700; color: #e8eaf0; text-transform: uppercase; letter-spacing: .5px;
  }
  .ap-section-num {
    width: 20px; height: 20px; border-radius: 50%;
    background: #6c8ef7; color: #fff;
    font-size: 10px; font-weight: 800; font-family: 'JetBrains Mono', monospace;
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  }
  .ap-section-body { padding: 20px; }

  /* Form fields */
  .ap-field { display: grid; gap: 6px; }
  .ap-label { font-size: 10px; font-weight: 700; color: #4a4d60; text-transform: uppercase; letter-spacing: .7px; font-family: 'JetBrains Mono', monospace; }
  .ap-input, .ap-textarea, .ap-select {
    width: 100%; padding: 9px 12px; border-radius: 8px;
    border: 1px solid #2a2d3a; background: #0d0e11;
    color: #e8eaf0; font-size: 13px; font-family: 'Syne', sans-serif;
    transition: border-color .15s;
    outline: none;
  }
  .ap-input:focus, .ap-textarea:focus, .ap-select:focus { border-color: #6c8ef7; }
  .ap-input.err, .ap-textarea.err, .ap-select.err { border-color: #ef4444; }
  .ap-textarea { resize: vertical; min-height: 80px; line-height: 1.6; }
  .ap-textarea.mono { font-family: 'JetBrains Mono', monospace; font-size: 11px; min-height: 140px; }
  .ap-err-msg { font-size: 10px; color: #ef4444; font-family: 'JetBrains Mono', monospace; }
  .ap-row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }

  /* Test case card */
  .ap-tc-card {
    background: #0d0e11; border: 1px solid #2a2d3a; border-radius: 10px;
    padding: 14px; margin-bottom: 10px;
  }
  .ap-tc-header {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 12px;
  }
  .ap-tc-label { font-size: 10px; font-weight: 700; font-family: 'JetBrains Mono', monospace; color: #4a4d60; text-transform: uppercase; letter-spacing: .5px; }

  .ap-tc-empty {
    padding: 24px; text-align: center; border: 1px dashed #2a2d3a;
    border-radius: 10px; font-size: 11px; font-family: 'JetBrains Mono', monospace; color: #4a4d60;
  }

  /* Code lang tabs */
  .ap-lang-block { border: 1px solid #2a2d3a; border-radius: 10px; overflow: hidden; margin-bottom: 12px; }
  .ap-lang-header {
    padding: 10px 14px; background: #0d0e11;
    border-bottom: 1px solid #2a2d3a;
    display: flex; align-items: center; gap: 8px;
    font-size: 11px; font-weight: 700; font-family: 'JetBrains Mono', monospace; color: #6c8ef7;
  }
  .ap-lang-dot { width: 6px; height: 6px; border-radius: 50%; background: #6c8ef7; }
  .ap-lang-body { padding: 14px; display: grid; grid-template-columns: 1fr 1fr; gap: 12px; background: #111318; }
  @media (max-width: 640px) { .ap-lang-body { grid-template-columns: 1fr; } }

  /* Form actions */
  .ap-form-actions {
    display: flex; gap: 10px; padding-top: 8px;
  }
  .ap-submit-btn {
    flex: 1; display: flex; align-items: center; justify-content: center; gap: 8px;
    padding: 12px; border-radius: 10px;
    font-size: 13px; font-weight: 700; font-family: 'Syne', sans-serif;
    color: #fff; background: #6c8ef7; border: 1px solid #6c8ef7;
    cursor: pointer; transition: all .15s;
  }
  .ap-submit-btn:hover:not(:disabled) { background: #7c9cf8; box-shadow: 0 0 20px rgba(108,142,247,.3); }
  .ap-submit-btn:disabled { opacity: .45; cursor: not-allowed; }

  /* Back link in form */
  .ap-form-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; }
  .ap-form-title { font-size: 18px; font-weight: 800; letter-spacing: -.3px; }
  .ap-form-subtitle { font-size: 11px; color: #4a4d60; font-family: 'JetBrains Mono', monospace; margin-top: 4px; }
`;

/* ─── Main Component ─────────────────────────────────────────────────────── */
export default function AdminPanel() {
  const dispatch = useDispatch();
  const { list, listLoading, actionLoading, selected, fetched } =
    useSelector((s) => s.problems);

  const [view,        setView]        = useState('list'); // 'list' | 'create' | 'edit'
  const [toast,       setToast]       = useState(null);
  const [deleteModal, setDeleteModal] = useState(null);

  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  };

  // Fetch problems ONCE — Redux tracks if already fetched
  useEffect(() => {
    if (!fetched) dispatch(fetchAllProblems());
  }, []);

  /* ── Form ── */
  const { register, control, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: DEFAULT_VALUES,
  });
  const { fields: visibleFields, append: appendVisible, remove: removeVisible } =
    useFieldArray({ control, name: 'visibleTestCases' });
  const { fields: hiddenFields, append: appendHidden, remove: removeHidden } =
    useFieldArray({ control, name: 'hiddenTestCases' });

  /* ── Open Create ── */
  const openCreate = () => {
    reset(DEFAULT_VALUES);
    dispatch(clearSelected());
    setView('create');
  };

  /* ── Open Edit ── */
  const openEdit = async (problem) => {
    const result = await dispatch(fetchProblemById(problem._id));
    if (fetchProblemById.fulfilled.match(result)) {
      const d = result.payload;
      reset({
        title:             d.title             || '',
        description:       d.description       || '',
        difficulty:        d.difficulty        || 'easy',
        tags:              d.tags              || 'array',
        visibleTestCases:  d.visibleTestCases  || [],
        hiddenTestCases:   d.hiddenTestCases   || [],
        startCode:         d.startCode?.length === 3 ? d.startCode : DEFAULT_VALUES.startCode,
        referenceSolution: d.referenceSolution?.length === 3 ? d.referenceSolution : DEFAULT_VALUES.referenceSolution,
      });
      setView('edit');
    } else {
      showToast('error', 'Failed to load problem');
    }
  };

  /* ── Submit ── */
  const onSubmit = async (data) => {
    if (view === 'create') {
      const result = await dispatch(createProblem(data));
      if (createProblem.fulfilled.match(result)) {
        showToast('success', 'Problem created!');
        // If backend doesn't return new problem, refetch
        if (!result.payload?._id) dispatch(fetchAllProblems());
        setView('list');
      } else {
        showToast('error', result.payload || 'Failed to create');
      }
    } else {
      const result = await dispatch(updateProblem({ id: selected._id, payload: data }));
      if (updateProblem.fulfilled.match(result)) {
        showToast('success', 'Problem updated!');
        // If backend doesn't return updated problem, refetch
        if (!result.payload?.updated?._id) dispatch(fetchAllProblems());
        setView('list');
      } else {
        showToast('error', result.payload || 'Failed to update');
      }
    }
  };

  /* ── Delete ── */
  const confirmDelete = async () => {
    if (!deleteModal) return;
    const result = await dispatch(deleteProblem(deleteModal._id));
    if (deleteProblem.fulfilled.match(result)) {
      showToast('success', `"${deleteModal.title}" deleted`);
    } else {
      showToast('error', result.payload || 'Failed to delete');
    }
    setDeleteModal(null);
  };

  const goList = () => { dispatch(clearSelected()); setView('list'); };

  return (
    <>
      <style>
        <div style={{ minHeight: '100vh', background: '#0d0e11', color: '#e8eaf0', fontFamily: "'Inter', system-ui, sans-serif" }}></div>
        {STYLES}</style>
      <div className="ap-root">

        {/* ── Toast ── */}
        {toast && (
          <div className={`ap-toast ${toast.type}`}>
            {toast.type === 'success' ? '✓' : '✕'} {toast.msg}
          </div>
        )}

        {/* ── Delete Modal ── */}
        {deleteModal && (
          <div className="ap-modal-overlay" onClick={() => setDeleteModal(null)}>
            <div className="ap-modal" onClick={(e) => e.stopPropagation()}>
              <div className="ap-modal-title" style={{ color: '#ef4444' }}>Delete Problem</div>
              <div className="ap-modal-body">
                Are you sure you want to delete{' '}
                <strong>"{deleteModal.title}"</strong>?
                This cannot be undone and will remove all associated submissions.
              </div>
              <div className="ap-modal-actions">
                <button className="ap-btn ap-btn-ghost" onClick={() => setDeleteModal(null)}>Cancel</button>
                <button
                  className="ap-btn ap-btn-danger"
                  onClick={confirmDelete}
                  disabled={actionLoading}
                >
                  {actionLoading ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Navbar ── */}
        <nav className="ap-nav">
          <div className="ap-nav-left">
            <NavLink to="/" className="ap-back">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M8 2L4 6l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              Back
            </NavLink>
            <span className="ap-nav-title">Admin Panel</span>
            <span className="ap-nav-badge">⚙ Admin</span>
          </div>
          {view !== 'list' && (
            <button className="ap-btn ap-btn-ghost ap-btn-sm" onClick={goList}>
              ✕ Cancel
            </button>
          )}
        </nav>

        <div className="ap-page">

          {/* ══════════════════════════════════════════════
              LIST VIEW
          ══════════════════════════════════════════════ */}
          {view === 'list' && (
            <div>
              <div className="ap-header">
                <div className="ap-header-left">
                  <h1>Problems</h1>
                  <p>{list.length} problem{list.length !== 1 ? 's' : ''} · fetched once, updated locally</p>
                </div>
                {/* Three action buttons */}
                <div className="ap-actions">
                  <button className="ap-btn ap-btn-primary" onClick={openCreate}>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                    </svg>
                    Create
                  </button>
                </div>
              </div>

              {listLoading ? (
                <div className="ap-loader">
                  <div className="ap-spinner" />
                  Loading problems...
                </div>
              ) : list.length === 0 ? (
                <div className="ap-table-wrap">
                  <div className="ap-empty">
                    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                      <rect x="8" y="6" width="24" height="28" rx="3" stroke="currentColor" strokeWidth="1.5"/>
                      <path d="M14 14h12M14 19h12M14 24h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                    No problems yet — click Create to add one
                  </div>
                </div>
              ) : (
                <div className="ap-table-wrap">
                  <table className="ap-table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Title</th>
                        <th>Difficulty</th>
                        <th>Tag</th>
                        <th>Test Cases</th>
                        <th style={{ textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {list.map((p, i) => (
                        <tr key={p._id}>
                          <td style={{ color: '#2a2d3a', fontSize: 11, fontFamily: 'JetBrains Mono, monospace' }}>{i + 1}</td>
                          <td><span className="ap-problem-title">{p.title}</span></td>
                          <td><span className={`ap-diff-badge ap-${p.difficulty}`}>{p.difficulty}</span></td>
                          <td><span className="ap-tag-badge">{p.tags}</span></td>
                          <td>
                            <span className="ap-tc-count">
                              {p.visibleTestCases?.length ?? 0}v · {p.hiddenTestCases?.length ?? 0}h
                            </span>
                          </td>
                          <td>
                            <div className="ap-row-actions">
                              {/* Edit button */}
                              <button
                                className="ap-btn ap-btn-ghost ap-btn-sm"
                                onClick={() => openEdit(p)}
                                disabled={actionLoading}
                              >
                                <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                                  <path d="M7.5 1.5l2 2-6 6H1.5v-2l6-6z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                Edit
                              </button>
                              {/* Delete button */}
                              <button
                                className="ap-btn ap-btn-danger ap-btn-sm"
                                onClick={() => setDeleteModal(p)}
                                disabled={actionLoading}
                              >
                                <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                                  <path d="M1.5 3h8M4 3V2h3v1M4.5 5v3.5M6.5 5v3.5M2 3l.7 6.5h5.6L9 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                Delete
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
          )}

          {/* ══════════════════════════════════════════════
              CREATE / EDIT FORM
          ══════════════════════════════════════════════ */}
          {(view === 'create' || view === 'edit') && (
            <div>
              <div className="ap-form-header">
                <div>
                  <div className="ap-form-title">
                    {view === 'create' ? '+ Create Problem' : '✎ Edit Problem'}
                  </div>
                  <div className="ap-form-subtitle">
                    {view === 'create' ? 'Fill all fields to publish a new problem' : `Editing: ${selected?.title ?? '...'}`}
                  </div>
                </div>
                <button className="ap-btn ap-btn-ghost ap-btn-sm" onClick={goList}>
                  ← Back to list
                </button>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="ap-form-grid">

                {/* ── 1. Basic Info ── */}
                <div className="ap-section">
                  <div className="ap-section-header">
                    <div className="ap-section-title">
                      <span className="ap-section-num">1</span>
                      Basic Information
                    </div>
                  </div>
                  <div className="ap-section-body" style={{ display: 'grid', gap: 14 }}>
                    <div className="ap-field">
                      <label className="ap-label">Title</label>
                      <input {...register('title')} placeholder="e.g. Two Sum" className={`ap-input ${errors.title ? 'err' : ''}`} />
                      {errors.title && <span className="ap-err-msg">{errors.title.message}</span>}
                    </div>
                    <div className="ap-field">
                      <label className="ap-label">Description</label>
                      <textarea {...register('description')} placeholder="Describe the problem..." className={`ap-textarea ${errors.description ? 'err' : ''}`} />
                      {errors.description && <span className="ap-err-msg">{errors.description.message}</span>}
                    </div>
                    <div className="ap-row-2">
                      <div className="ap-field">
                        <label className="ap-label">Difficulty</label>
                        <select {...register('difficulty')} className="ap-select">
                          <option value="easy">Easy</option>
                          <option value="medium">Medium</option>
                          <option value="hard">Hard</option>
                        </select>
                      </div>
                      <div className="ap-field">
                        <label className="ap-label">Tag</label>
                        <select {...register('tags')} className="ap-select">
                          <option value="array">Array</option>
                          <option value="linkedList">Linked List</option>
                          <option value="graph">Graph</option>
                          <option value="dp">DP</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ── 2. Visible Test Cases ── */}
                <div className="ap-section">
                  <div className="ap-section-header">
                    <div className="ap-section-title">
                      <span className="ap-section-num">2</span>
                      Visible Test Cases
                      <span style={{ fontSize: 10, color: '#4a4d60', fontFamily: 'JetBrains Mono, monospace' }}>
                        {visibleFields.length} added
                      </span>
                    </div>
                    <button type="button" className="ap-btn ap-btn-ghost ap-btn-xs"
                      onClick={() => appendVisible({ input: '', output: '', explanation: '' })}>
                      + Add Case
                    </button>
                  </div>
                  <div className="ap-section-body">
                    {visibleFields.length === 0 ? (
                      <div className="ap-tc-empty">No visible test cases — click "+ Add Case"</div>
                    ) : visibleFields.map((f, i) => (
                      <div key={f.id} className="ap-tc-card">
                        <div className="ap-tc-header">
                          <span className="ap-tc-label">Case {i + 1}</span>
                          <button type="button" className="ap-btn ap-btn-danger ap-btn-xs" onClick={() => removeVisible(i)}>✕ Remove</button>
                        </div>
                        <div className="ap-row-2" style={{ marginBottom: 10 }}>
                          <div className="ap-field">
                            <label className="ap-label">Input</label>
                            <input {...register(`visibleTestCases.${i}.input`)} placeholder="2 3" className={`ap-input ${errors.visibleTestCases?.[i]?.input ? 'err' : ''}`} />
                            {errors.visibleTestCases?.[i]?.input && <span className="ap-err-msg">{errors.visibleTestCases[i].input.message}</span>}
                          </div>
                          <div className="ap-field">
                            <label className="ap-label">Output</label>
                            <input {...register(`visibleTestCases.${i}.output`)} placeholder="5" className={`ap-input ${errors.visibleTestCases?.[i]?.output ? 'err' : ''}`} />
                            {errors.visibleTestCases?.[i]?.output && <span className="ap-err-msg">{errors.visibleTestCases[i].output.message}</span>}
                          </div>
                        </div>
                        <div className="ap-field">
                          <label className="ap-label">Explanation</label>
                          <textarea {...register(`visibleTestCases.${i}.explanation`)} placeholder="Because 2+3=5..." className={`ap-textarea ${errors.visibleTestCases?.[i]?.explanation ? 'err' : ''}`} style={{ minHeight: 60 }} />
                          {errors.visibleTestCases?.[i]?.explanation && <span className="ap-err-msg">{errors.visibleTestCases[i].explanation.message}</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ── 3. Hidden Test Cases ── */}
                <div className="ap-section">
                  <div className="ap-section-header">
                    <div className="ap-section-title">
                      <span className="ap-section-num">3</span>
                      Hidden Test Cases
                      <span style={{ fontSize: 10, color: '#4a4d60', fontFamily: 'JetBrains Mono, monospace' }}>
                        {hiddenFields.length} added
                      </span>
                    </div>
                    <button type="button" className="ap-btn ap-btn-ghost ap-btn-xs"
                      onClick={() => appendHidden({ input: '', output: '' })}>
                      + Add Case
                    </button>
                  </div>
                  <div className="ap-section-body">
                    {hiddenFields.length === 0 ? (
                      <div className="ap-tc-empty">No hidden test cases — click "+ Add Case"</div>
                    ) : hiddenFields.map((f, i) => (
                      <div key={f.id} className="ap-tc-card">
                        <div className="ap-tc-header">
                          <span className="ap-tc-label">Case {i + 1}</span>
                          <button type="button" className="ap-btn ap-btn-danger ap-btn-xs" onClick={() => removeHidden(i)}>✕ Remove</button>
                        </div>
                        <div className="ap-row-2">
                          <div className="ap-field">
                            <label className="ap-label">Input</label>
                            <input {...register(`hiddenTestCases.${i}.input`)} placeholder="Input" className={`ap-input ${errors.hiddenTestCases?.[i]?.input ? 'err' : ''}`} />
                            {errors.hiddenTestCases?.[i]?.input && <span className="ap-err-msg">{errors.hiddenTestCases[i].input.message}</span>}
                          </div>
                          <div className="ap-field">
                            <label className="ap-label">Output</label>
                            <input {...register(`hiddenTestCases.${i}.output`)} placeholder="Output" className={`ap-input ${errors.hiddenTestCases?.[i]?.output ? 'err' : ''}`} />
                            {errors.hiddenTestCases?.[i]?.output && <span className="ap-err-msg">{errors.hiddenTestCases[i].output.message}</span>}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ── 4. Code Templates ── */}
                <div className="ap-section">
                  <div className="ap-section-header">
                    <div className="ap-section-title">
                      <span className="ap-section-num">4</span>
                      Code Templates
                    </div>
                  </div>
                  <div className="ap-section-body">
                    {[{ i: 0, lang: 'C++' }, { i: 1, lang: 'Java' }, { i: 2, lang: 'JavaScript' }].map(({ i, lang }) => (
                      <div key={lang} className="ap-lang-block">
                        <div className="ap-lang-header">
                          <span className="ap-lang-dot" />
                          {lang}
                        </div>
                        <div className="ap-lang-body">
                          <div className="ap-field">
                            <label className="ap-label">Starter Code (shown to user)</label>
                            <textarea
                              {...register(`startCode.${i}.initialCode`)}
                              placeholder={`// ${lang} starter template`}
                              className={`ap-textarea mono ${errors.startCode?.[i]?.initialCode ? 'err' : ''}`}
                            />
                            {errors.startCode?.[i]?.initialCode && <span className="ap-err-msg">{errors.startCode[i].initialCode.message}</span>}
                          </div>
                          <div className="ap-field">
                            <label className="ap-label">Reference Solution</label>
                            <textarea
                              {...register(`referenceSolution.${i}.completeCode`)}
                              placeholder={`// ${lang} complete solution`}
                              className={`ap-textarea mono ${errors.referenceSolution?.[i]?.completeCode ? 'err' : ''}`}
                            />
                            {errors.referenceSolution?.[i]?.completeCode && <span className="ap-err-msg">{errors.referenceSolution[i].completeCode.message}</span>}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ── Submit ── */}
                <div className="ap-form-actions">
                  <button type="button" className="ap-btn ap-btn-ghost" style={{ flex: 1 }} onClick={goList}>
                    Cancel
                  </button>
                  <button type="submit" className="ap-submit-btn" disabled={actionLoading}>
                    {actionLoading ? (
                      <><span className="ap-spinner" style={{ width: 14, height: 14, borderWidth: 2 }} /> Saving...</>
                    ) : (
                      <>{view === 'create' ? '+ Create Problem' : '✓ Save Changes'}</>
                    )}
                  </button>
                </div>

              </form>
            </div>
          )}

        </div>
      </div>
    </>
  );
}
