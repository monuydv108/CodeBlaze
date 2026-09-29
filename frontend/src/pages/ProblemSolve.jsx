import { useEffect, useState, useRef, useCallback } from 'react';
import { NavLink, useParams, useNavigate } from 'react-router';
import { useSelector } from 'react-redux';
import axiosClient from '../utils/axiosClient';
import CodeEditor, { STARTER_CODE, CODE_STORAGE } from '../components/CodeEditor';
import SubmissionHistory from '../components/SubmissionHistory';
import BlazeAIChat from '../components/BlazeAIChat';

/* ─── Constants ─────────────────────────────────────────────────────────── */

const LANGUAGES = [
  { label: 'JavaScript', value: 'javascript' },
  { label: 'Java',       value: 'java'       },
  { label: 'C++',        value: 'cpp'        },
];

const LANG_SEND  = { javascript: 'javascript', java: 'java', cpp: 'cpp' };
const LANG_LABEL = { javascript: 'JavaScript', java: 'Java', cpp: 'C++' };

const normalizeDbLang = (lang) => {
  if (!lang) return '';
  const l = lang.toLowerCase().trim();
  if (l === 'c++' || l === 'cpp') return 'cpp';
  if (l === 'javascript' || l === 'js') return 'javascript';
  if (l === 'java') return 'java';
  return l;
};

const getDifficultyStyle = (d) => {
  switch (d?.toLowerCase()) {
    case 'easy':   return 'difficulty-easy';
    case 'medium': return 'difficulty-medium';
    case 'hard':   return 'difficulty-hard';
    default:       return 'difficulty-neutral';
  }
};

/* ─── Styles ─────────────────────────────────────────────────────────────── */

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg-0: #0d0e11; --bg-1: #111318; --bg-2: #161820; --bg-3: #1c1f28; --bg-4: #232735;
    --border: #2a2d3a; --border-hover: #3d4155;
    --text-primary: #e8eaf0; --text-secondary: #8b8fa8; --text-muted: #4a4d60;
    --accent: #6c8ef7; --accent-dim: rgba(108,142,247,0.12); --accent-glow: rgba(108,142,247,0.25);
    --success: #22c55e; --success-dim: rgba(34,197,94,0.12);
    --error: #ef4444; --error-dim: rgba(239,68,68,0.12);
    --warning: #f59e0b; --warning-dim: rgba(245,158,11,0.12);
    --ai: #a78bfa; --ai-dim: rgba(167,139,250,0.12); --ai-glow: rgba(167,139,250,0.25);
    --font-mono: 'JetBrains Mono', monospace; --font-display: 'Syne', sans-serif;
  }

  .ps-root {
    font-family: var(--font-display); background: var(--bg-0); color: var(--text-primary);
    height: 100vh; display: flex; flex-direction: column; overflow: hidden;
    background-image: radial-gradient(ellipse 80% 60% at 50% -20%, rgba(108,142,247,0.06) 0%, transparent 70%);
  }

  .ps-nav {
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 14px; height: 48px; flex-shrink: 0;
    background: var(--bg-1); border-bottom: 1px solid var(--border); gap: 10px;
  }
  .ps-nav-left   { display: flex; align-items: center; gap: 10px; min-width: 0; flex: 1; }
  .ps-nav-center { display: flex; align-items: center; gap: 7px; flex-shrink: 0; }
  .ps-nav-right  { display: flex; align-items: center; gap: 10px; flex-shrink: 0; }

  .ps-back-btn {
    display: flex; align-items: center; gap: 5px; padding: 5px 10px; border-radius: 6px;
    font-size: 12px; font-weight: 600; font-family: var(--font-display);
    color: var(--text-secondary); background: transparent;
    border: 1px solid var(--border); cursor: pointer;
    transition: all .15s; text-decoration: none; white-space: nowrap; flex-shrink: 0;
  }
  .ps-back-btn:hover { color: var(--text-primary); border-color: var(--border-hover); background: var(--bg-3); }

  .ps-divider { width: 1px; height: 20px; background: var(--border); flex-shrink: 0; }

  .ps-problem-title {
    font-size: 13px; font-weight: 700; color: var(--text-primary);
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis; min-width: 0;
  }

  .ps-solved-badge {
    display: flex; align-items: center; gap: 4px; padding: 2px 8px; border-radius: 20px; flex-shrink: 0;
    font-size: 10px; font-weight: 700; font-family: var(--font-mono);
    color: var(--success); background: var(--success-dim); border: 1px solid rgba(34,197,94,0.3);
    letter-spacing: .5px; text-transform: uppercase;
  }

  .ps-user-pill {
    font-size: 11px; font-weight: 600; font-family: var(--font-mono);
    color: var(--text-muted); padding: 3px 8px;
    background: var(--bg-3); border-radius: 6px; border: 1px solid var(--border);
  }

  /* saved indicator */
  .ps-saved-pill {
    font-size: 10px; font-family: var(--font-mono);
    color: #22c55e; opacity: 0;
    transition: opacity .3s ease;
    white-space: nowrap;
  }
  .ps-saved-pill.visible { opacity: 1; }

  .ps-lang-select {
    padding: 4px 8px; border-radius: 5px;
    font-size: 11px; font-weight: 600; font-family: var(--font-mono);
    border: 1px solid var(--border); cursor: pointer;
    background: var(--bg-2); color: var(--text-secondary); outline: none; transition: all .15s;
  }
  .ps-lang-select:focus { border-color: var(--accent); color: var(--text-primary); }

  .ps-run-btn, .ps-submit-btn, .ps-ai-btn {
    display: flex; align-items: center; gap: 5px; padding: 5px 13px; border-radius: 6px;
    font-size: 12px; font-weight: 700; font-family: var(--font-display);
    cursor: pointer; transition: all .15s; border: 1px solid; white-space: nowrap;
  }
  .ps-run-btn { color: var(--accent); background: var(--accent-dim); border-color: rgba(108,142,247,.35); }
  .ps-run-btn:hover:not(:disabled) { background: rgba(108,142,247,.22); border-color: var(--accent); box-shadow: 0 0 12px var(--accent-glow); }
  .ps-submit-btn { color: #fff; background: var(--accent); border-color: var(--accent); }
  .ps-submit-btn:hover:not(:disabled) { background: #7c9cf8; box-shadow: 0 0 16px var(--accent-glow); }
  .ps-ai-btn { color: var(--ai); background: var(--ai-dim); border-color: rgba(167,139,250,.35); }
  .ps-ai-btn:hover:not(:disabled) { background: rgba(167,139,250,.22); border-color: var(--ai); box-shadow: 0 0 12px var(--ai-glow); }
  .ps-run-btn:disabled, .ps-submit-btn:disabled, .ps-ai-btn:disabled { opacity: .45; cursor: not-allowed; }

  /* reset button */
  .ps-reset-btn {
    display: flex; align-items: center; gap: 4px; padding: 4px 9px; border-radius: 5px;
    font-size: 10px; font-weight: 600; font-family: var(--font-mono);
    color: var(--text-muted); background: transparent; border: 1px solid var(--border);
    cursor: pointer; transition: all .15s;
  }
  .ps-reset-btn:hover { color: var(--error); border-color: rgba(239,68,68,.4); background: var(--error-dim); }

  .ps-workspace { display: flex; flex: 1; overflow: hidden; }

  .ps-left {
    width: 42%; min-width: 320px; display: flex; flex-direction: column;
    border-right: 1px solid var(--border); overflow: hidden; background: var(--bg-1);
  }

  .ps-tabs {
    display: flex; align-items: center; gap: 2px; padding: 0 10px; height: 40px; flex-shrink: 0;
    background: var(--bg-0); border-bottom: 1px solid var(--border); overflow-x: auto;
  }
  .ps-tabs::-webkit-scrollbar { display: none; }

  .ps-tab {
    position: relative; padding: 6px 11px; font-size: 11px; font-weight: 600; font-family: var(--font-display);
    color: var(--text-muted); background: transparent; border: none; border-radius: 5px; cursor: pointer;
    white-space: nowrap; transition: all .15s; letter-spacing: .3px; text-transform: uppercase;
    display: flex; align-items: center; gap: 5px;
  }
  .ps-tab:hover { color: var(--text-secondary); background: var(--bg-3); }
  .ps-tab.active { color: var(--accent); background: var(--accent-dim); }
  .ps-tab.active::after { content: ''; position: absolute; bottom: -1px; left: 0; right: 0; height: 2px; background: var(--accent); border-radius: 2px 2px 0 0; }
  .ps-tab.ai-tab:hover { color: var(--ai); background: var(--ai-dim); }
  .ps-tab.ai-tab.active { color: var(--ai); background: var(--ai-dim); }
  .ps-tab.ai-tab.active::after { background: var(--ai); }
  .ps-tab-dot { display: inline-block; width: 5px; height: 5px; border-radius: 50%; flex-shrink: 0; }

  .ps-content {
    flex: 1; overflow-y: auto; padding: 20px;
    scrollbar-width: thin; scrollbar-color: var(--border) transparent;
  }
  .ps-content::-webkit-scrollbar { width: 4px; }
  .ps-content::-webkit-scrollbar-thumb { background: var(--border); border-radius: 4px; }

  .ps-title { font-size: 18px; font-weight: 800; margin: 0 0 12px; letter-spacing: -.3px; }
  .ps-meta  { display: flex; flex-wrap: wrap; gap: 7px; margin-bottom: 16px; }

  .difficulty-easy    { color: #22c55e; background: rgba(34,197,94,.1);  border: 1px solid rgba(34,197,94,.25); }
  .difficulty-medium  { color: #f59e0b; background: rgba(245,158,11,.1); border: 1px solid rgba(245,158,11,.25); }
  .difficulty-hard    { color: #ef4444; background: rgba(239,68,68,.1);  border: 1px solid rgba(239,68,68,.25); }
  .difficulty-neutral { color: var(--text-muted); background: var(--bg-3); border: 1px solid var(--border); }

  .ps-badge { padding: 2px 9px; border-radius: 20px; font-size: 10px; font-weight: 700; font-family: var(--font-mono); letter-spacing: .4px; text-transform: uppercase; }
  .ps-badge-tag { color: var(--accent); background: var(--accent-dim); border: 1px solid rgba(108,142,247,.25); }

  .ps-description { font-size: 13px; line-height: 1.75; color: var(--text-secondary); margin-bottom: 20px; white-space: pre-wrap; }
  .ps-section-title { font-size: 11px; font-weight: 700; font-family: var(--font-mono); color: var(--text-muted); letter-spacing: 1px; text-transform: uppercase; margin: 0 0 10px; }

  .ps-example { background: var(--bg-2); border: 1px solid var(--border); border-radius: 10px; padding: 14px; margin-bottom: 10px; }
  .ps-example-num { font-size: 10px; font-weight: 700; font-family: var(--font-mono); color: var(--text-muted); letter-spacing: .8px; text-transform: uppercase; margin-bottom: 8px; }
  .ps-example-row { display: flex; gap: 8px; align-items: flex-start; margin-bottom: 5px; font-size: 12px; }
  .ps-example-label { color: var(--text-muted); width: 80px; flex-shrink: 0; font-family: var(--font-mono); }
  .ps-example-code { font-family: var(--font-mono); font-size: 11px; background: var(--bg-3); color: var(--text-primary); padding: 2px 7px; border-radius: 4px; }
  .ps-example-explain { color: var(--text-secondary); font-size: 12px; }

  .ps-solution-card { border: 1px solid var(--border); border-radius: 10px; overflow: hidden; margin-bottom: 16px; }
  .ps-solution-header { padding: 10px 14px; background: var(--bg-2); border-bottom: 1px solid var(--border); font-size: 12px; font-weight: 600; color: var(--text-secondary); display: flex; align-items: center; gap: 8px; }
  .ps-solution-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--accent); }
  .ps-code-block { background: var(--bg-0); padding: 14px; font-family: var(--font-mono); font-size: 11px; line-height: 1.7; color: var(--text-secondary); overflow-x: auto; }

  .ps-submit-banner { display: flex; align-items: center; justify-content: space-between; padding: 10px 14px; border-radius: 10px; margin-bottom: 16px; border: 1px solid; animation: ps-fadein .3s ease; }
  .ps-submit-banner.accepted { background: var(--success-dim); border-color: rgba(34,197,94,.3); }
  .ps-submit-banner.rejected { background: var(--error-dim);   border-color: rgba(239,68,68,.3); }
  .ps-submit-banner-label { font-size: 13px; font-weight: 800; }
  .ps-submit-banner.accepted .ps-submit-banner-label { color: var(--success); }
  .ps-submit-banner.rejected .ps-submit-banner-label { color: var(--error); }
  .ps-submit-banner-sub { font-size: 11px; font-family: var(--font-mono); color: var(--text-muted); margin-top: 3px; }
  .ps-submit-banner-stats { display: flex; gap: 12px; font-size: 11px; font-family: var(--font-mono); color: var(--text-muted); }

  .ps-right { flex: 1; display: flex; flex-direction: column; overflow: hidden; background: var(--bg-0); }
  .ps-editor-area { flex: 1; overflow: hidden; display: flex; flex-direction: column; }

  .ps-results-drawer { border-top: 1px solid var(--border); background: var(--bg-1); display: flex; flex-direction: column; flex-shrink: 0; transition: height .2s ease; }
  .ps-results-drawer.collapsed { height: 36px; }
  .ps-results-drawer.expanded  { height: 220px; }

  .ps-drawer-header { display: flex; align-items: center; gap: 8px; padding: 0 14px; height: 36px; flex-shrink: 0; cursor: pointer; border-bottom: 1px solid transparent; user-select: none; transition: background .15s; }
  .ps-drawer-header:hover { background: var(--bg-2); }
  .ps-results-drawer.expanded .ps-drawer-header { border-bottom-color: var(--border); }
  .ps-drawer-title { font-size: 11px; font-weight: 700; font-family: var(--font-mono); text-transform: uppercase; letter-spacing: .6px; }
  .ps-drawer-body { flex: 1; overflow-y: auto; padding: 12px 14px; scrollbar-width: thin; scrollbar-color: var(--border) transparent; }
  .ps-drawer-body::-webkit-scrollbar { width: 4px; }
  .ps-drawer-body::-webkit-scrollbar-thumb { background: var(--border); border-radius: 4px; }

  .ps-verdict { display: flex; align-items: center; justify-content: space-between; padding: 10px 14px; border-radius: 8px; margin-bottom: 10px; border: 1px solid; }
  .ps-verdict.accepted { background: var(--success-dim); border-color: rgba(34,197,94,.3); }
  .ps-verdict.rejected { background: var(--error-dim);   border-color: rgba(239,68,68,.3); }
  .ps-verdict-label { font-size: 13px; font-weight: 800; font-family: var(--font-display); }
  .ps-verdict.accepted .ps-verdict-label { color: var(--success); }
  .ps-verdict.rejected .ps-verdict-label { color: var(--error); }
  .ps-verdict-stats { display: flex; gap: 14px; font-size: 11px; font-family: var(--font-mono); color: var(--text-muted); }

  .ps-test-case { border: 1px solid var(--border); border-radius: 7px; margin-bottom: 6px; overflow: hidden; }
  .ps-test-case.passed { border-color: rgba(34,197,94,.25); }
  .ps-test-case.failed { border-color: rgba(239,68,68,.25); }
  .ps-test-case-header { display: flex; align-items: center; justify-content: space-between; padding: 7px 11px; cursor: pointer; background: var(--bg-2); font-size: 11px; font-weight: 600; font-family: var(--font-mono); user-select: none; }
  .ps-test-case-header.passed { color: var(--success); }
  .ps-test-case-header.failed { color: var(--error); }
  .ps-test-case-body { padding: 9px 11px; background: var(--bg-1); display: grid; gap: 5px; }
  .ps-tc-row { display: flex; gap: 8px; align-items: flex-start; }
  .ps-tc-label { color: var(--text-muted); width: 65px; flex-shrink: 0; font-family: var(--font-mono); font-size: 11px; }
  .ps-tc-val { font-family: var(--font-mono); font-size: 11px; background: var(--bg-3); padding: 2px 7px; border-radius: 4px; color: var(--text-secondary); }
  .ps-tc-val.wrong { color: var(--error); }

  .ps-error-box { display: flex; align-items: flex-start; gap: 10px; padding: 12px; border-radius: 8px; background: var(--error-dim); border: 1px solid rgba(239,68,68,.3); font-family: var(--font-mono); font-size: 11px; color: var(--error); }
  .ps-running-inline { display: flex; align-items: center; gap: 10px; font-family: var(--font-mono); font-size: 12px; color: var(--text-muted); padding: 8px 0; }
  .ps-running-spinner { width: 14px; height: 14px; border-radius: 50%; border: 2px solid var(--border); border-top-color: var(--accent); animation: ps-spin .7s linear infinite; flex-shrink: 0; }
  @keyframes ps-spin { to { transform: rotate(360deg); } }
  .ps-drawer-idle { display: flex; align-items: center; gap: 8px; font-family: var(--font-mono); font-size: 11px; color: var(--text-muted); padding: 8px 0; }

  .ps-statusbar { display: flex; align-items: center; gap: 10px; padding: 0 14px; height: 26px; background: var(--bg-1); border-top: 1px solid var(--border); flex-shrink: 0; font-family: var(--font-mono); font-size: 10px; color: var(--text-muted); letter-spacing: .5px; }
  .ps-status-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
  .status-idle    { background: var(--text-muted); }
  .status-running { background: var(--warning); box-shadow: 0 0 6px var(--warning); animation: ps-pulse 1s ease infinite; }
  .status-success { background: var(--success); box-shadow: 0 0 6px var(--success); }
  .status-error   { background: var(--error);   box-shadow: 0 0 6px var(--error); }
  @keyframes ps-pulse { 0%,100%{opacity:1} 50%{opacity:.4} }
  .ps-statusbar-right { margin-left: auto; display: flex; gap: 12px; }

  .ps-loader { position: fixed; inset: 0; background: var(--bg-0); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 14px; }
  .ps-loader-ring { width: 40px; height: 40px; border-radius: 50%; border: 2px solid var(--border); border-top-color: var(--accent); animation: ps-spin .7s linear infinite; }
  .ps-loader p { font-family: var(--font-mono); font-size: 12px; color: var(--text-muted); }

  .ps-chevron { transition: transform .2s; }
  .ps-chevron.open { transform: rotate(180deg); }
  .ps-empty { text-align: center; padding: 40px 20px; color: var(--text-muted); font-size: 12px; font-family: var(--font-mono); }
  @keyframes ps-fadein { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:none} }
  .ps-brand {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-right: 6px;
}

.ps-logo {
  width: 26px;
  height: 26px;
  background: linear-gradient(135deg, #6c8ef7, #4f6cf7);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 700;
  color: white;
  font-family: 'JetBrains Mono', monospace;
}

.ps-brand-text {
  font-size: 13px;
  font-weight: 600;
  color: #cfd3ff;
  letter-spacing: 0.3px;
}
`;

/* ─── Test Case Card ─────────────────────────────────────────────────────── */
function TestCaseCard({ tc, index }) {
  const passed = tc.status_id === 3;
  const [open, setOpen] = useState(!passed);
  return (
    <div className={`ps-test-case ${passed ? 'passed' : 'failed'}`}>
      <div className={`ps-test-case-header ${passed ? 'passed' : 'failed'}`} onClick={() => setOpen(o => !o)}>
        <span>{passed ? '✓' : '✗'} Case {index + 1} — {passed ? 'Passed' : 'Failed'}</span>
        <svg className={`ps-chevron ${open ? 'open' : ''}`} width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
        </svg>
      </div>
      {open && (
        <div className="ps-test-case-body">
          {[['Input', tc.stdin], ['Expected', tc.expected_output], ['Output', tc.stdout]].map(([label, val]) => (
            <div key={label} className="ps-tc-row">
              <span className="ps-tc-label">{label}:</span>
              <code className={`ps-tc-val ${label === 'Output' && !passed ? 'wrong' : ''}`}>{val ?? '—'}</code>
            </div>
          ))}
          {tc.stderr && <div className="ps-tc-row"><span className="ps-tc-label">Stderr:</span><code className="ps-tc-val wrong">{tc.stderr}</code></div>}
          {tc.compile_output && <div className="ps-tc-row"><span className="ps-tc-label">Compile:</span><code className="ps-tc-val wrong">{tc.compile_output}</code></div>}
        </div>
      )}
    </div>
  );
}

/* ─── Main Component ─────────────────────────────────────────────────────── */
export default function ProblemSolve() {
  const params = useParams();
  const resolvedId = params.problemId || params.id;
  const navigate   = useNavigate();
  const { user }   = useSelector((s) => s.auth);

  const [problem,       setProblem]      = useState(null);
  const [codeMap,       setCodeMap]      = useState({});  // DB starter code per lang
  const [language,      setLanguage]     = useState('javascript');
  const [code,          setCode]         = useState('');
  const [activeTab,     setActiveTab]    = useState('description');
  const [runStatus,     setRunStatus]    = useState('idle');
  const [runResult,     setRunResult]    = useState(null);
  const [submitResult,  setSubmitResult] = useState(null);
  const [isSolved,      setIsSolved]     = useState(false);
  const [drawerOpen,    setDrawerOpen]   = useState(false);
  const [drawerMode,    setDrawerMode]   = useState('run');
  const [savedVisible,  setSavedVisible] = useState(false);

  // Debounce timer ref for auto-save
  const saveTimerRef = useRef(null);

  /* ── Fetch problem ── */
  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const { data } = await axiosClient.get(`/problem/problemById/${resolvedId}`);
        setProblem(data);

        // Build codeMap from DB starter code
        const map = {};
        (data.startCode ?? []).forEach(sc => {
          const key = normalizeDbLang(sc.language);
          map[key] = sc.initialCode;
        });
        setCodeMap(map);

        // ── KEY FIX: Load saved code from localStorage first ──
        // Priority: localStorage > DB starter code > generic STARTER_CODE
        const savedCode = CODE_STORAGE.load(resolvedId, 'javascript');
        setCode(savedCode ?? map['javascript'] ?? STARTER_CODE['javascript'] ?? '');

      } catch (err) {
        console.error('[ProblemSolve] fetchProblem error:', err);
        navigate('/');
      }
    };

    const checkIfSolved = async () => {
      try {
        const { data } = await axiosClient.get('/problem/problemSolvedByUser');
        setIsSolved(data.some((p) => String(p._id) === String(resolvedId)));
      } catch (err) {
        console.error('[ProblemSolve] checkIfSolved error:', err);
      }
    };

    if (resolvedId) {
      fetchProblem();
      if (user) checkIfSolved();
    }
  }, [resolvedId, user]);

  /* ── Code change handler — auto-save to localStorage with debounce ── */
  const handleCodeChange = useCallback((newCode) => {
    setCode(newCode || '');

    // Debounce: save 800ms after user stops typing
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      CODE_STORAGE.save(resolvedId, language, newCode || '');
      // Show "Saved" indicator briefly
      setSavedVisible(true);
      setTimeout(() => setSavedVisible(false), 1500);
    }, 800);
  }, [resolvedId, language]);

  // Cleanup timer on unmount
  useEffect(() => () => { if (saveTimerRef.current) clearTimeout(saveTimerRef.current); }, []);

  /* ── Language switch — load saved code for the new language ── */
  const handleLanguageChange = (lang) => {
    // Save current code before switching
    CODE_STORAGE.save(resolvedId, language, code);

    setLanguage(lang);

    // Load saved code for new language, fall back to DB starter or generic
    const savedCode = CODE_STORAGE.load(resolvedId, lang);
    setCode(savedCode ?? codeMap[lang] ?? STARTER_CODE[lang] ?? '');

    setRunResult(null);
    setSubmitResult(null);
    setRunStatus('idle');
  };

  /* ── Reset code to DB starter (with confirmation) ── */
  const handleResetCode = () => {
    const starter = codeMap[language] ?? STARTER_CODE[language] ?? '';
    if (code === starter) return; // already at starter
    if (!window.confirm('Reset code to starter template? Your current code will be lost.')) return;
    CODE_STORAGE.clear(resolvedId, language);
    setCode(starter);
  };

  /* ── Run ── */
  const handleRun = async () => {
    if (!code.trim()) {
      setRunResult({ success: false, error: 'Write some code first.' });
      setRunStatus('error'); setDrawerMode('run'); setDrawerOpen(true); return;
    }
    // Save before running
    CODE_STORAGE.save(resolvedId, language, code);
    setRunStatus('running'); setRunResult(null); setDrawerMode('run'); setDrawerOpen(true);
    try {
      const { data } = await axiosClient.post(`/submission/run/${resolvedId}`, { code, language: LANG_SEND[language] });
      setRunResult(data);
      setRunStatus(data.success ? 'success' : 'error');
    } catch (err) {
      setRunResult({ success: false, error: err.response?.data || err.message || 'Internal server error' });
      setRunStatus('error');
    }
  };

  /* ── Submit ── */
  const handleSubmit = async () => {
    if (!code.trim()) {
      setSubmitResult({ accepted: false, error: 'Write some code first.' });
      setRunStatus('error'); setDrawerMode('submit'); setDrawerOpen(true); return;
    }
    // Save before submitting
    CODE_STORAGE.save(resolvedId, language, code);
    setRunStatus('running'); setSubmitResult(null); setDrawerMode('submit'); setDrawerOpen(true);
    try {
      const { data } = await axiosClient.post(`/submission/submit/${resolvedId}`, { code, language: LANG_SEND[language] });
      setSubmitResult(data);
      setRunStatus(data.accepted ? 'success' : 'error');
      if (data.accepted) {
        setIsSolved(true);
        // Optional: clear saved code on acceptance so next visit starts fresh
        // CODE_STORAGE.clear(resolvedId, language);
      }
    } catch (err) {
      setSubmitResult({ accepted: false, error: err.response?.data || err.message || 'Internal server error' });
      setRunStatus('error');
    }
  };

  /* ── Drawer content ── */
  const renderDrawerContent = () => {
    if (runStatus === 'running') {
      return (
        <div className="ps-running-inline">
          <div className="ps-running-spinner" />
          {drawerMode === 'run' ? 'Running test cases...' : 'Evaluating submission...'}
        </div>
      );
    }
    if (drawerMode === 'run' && runResult) {
      if (runResult.error) return <div className="ps-error-box">{runResult.error}</div>;
      return (
        <>
          <div className={`ps-verdict ${runResult.success ? 'accepted' : 'rejected'}`}>
            <span className="ps-verdict-label">{runResult.success ? '✓ All Tests Passed' : '✗ Some Tests Failed'}</span>
            {runResult.success && (
              <div className="ps-verdict-stats">
                {runResult.runtime != null && <span>⚡ {runResult.runtime}s</span>}
                {runResult.memory  != null && <span>◈ {runResult.memory} KB</span>}
              </div>
            )}
          </div>
          {(runResult.testCases ?? []).map((tc, i) => <TestCaseCard key={i} tc={tc} index={i} />)}
        </>
      );
    }
    if (drawerMode === 'submit' && submitResult) {
      return (
        <div className={`ps-verdict ${submitResult.accepted ? 'accepted' : 'rejected'}`}>
          <div>
            <span className="ps-verdict-label">
              {submitResult.accepted ? '🎉 Accepted' : `✗ ${submitResult.error || 'Wrong Answer'}`}
            </span>
            {submitResult.passedTestCases != null && (
              <div style={{ marginTop: 4, fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                {submitResult.passedTestCases}/{submitResult.totalTestCases} test cases passed
              </div>
            )}
          </div>
          {submitResult.accepted && (
            <div className="ps-verdict-stats">
              {submitResult.runtime != null && <span>⚡ {submitResult.runtime}s</span>}
              {submitResult.memory  != null && <span>◈ {submitResult.memory} KB</span>}
            </div>
          )}
        </div>
      );
    }
    return (
      <div className="ps-drawer-idle">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ opacity: .5 }}>
          <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.2"/>
          <path d="M5 5l4 2-4 2V5z" fill="currentColor"/>
        </svg>
        Press Run or Submit to see results here
      </div>
    );
  };

  const drawerStatusColor =
    runStatus === 'success' ? 'var(--success)' :
    runStatus === 'error'   ? 'var(--error)'   :
    runStatus === 'running' ? 'var(--warning)' : 'var(--text-muted)';

  const drawerLabel =
    runStatus === 'running' ? (drawerMode === 'run' ? 'Running...' : 'Evaluating...') :
    runStatus === 'success' ? (drawerMode === 'submit' && submitResult?.accepted ? 'Accepted' : 'Tests Passed') :
    runStatus === 'error'   ? 'Failed' : 'Output';

  /* ── Loading ── */
  if (!problem) {
    return (
      <>
        <style>{STYLES}</style>
        <div className="ps-loader"><div className="ps-loader-ring" /><p>Loading problem...</p></div>
      </>
    );
  }

  return (
    <>
      <style>{STYLES}</style>
      <div className="ps-root">

        {/* ── Navbar ── */}
        <nav className="ps-nav">
          <div className="ps-nav-left">

  {/* 🔥 BRAND */}
  <div className="ps-brand">
    <NavLink to="/" className="ps-brand">
  <span className="ps-logo">CB</span>
</NavLink>
  </div>

  <div className="ps-divider" />

  <NavLink to="/" className="ps-back-btn">
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M8 2L4 6l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
    Back
  </NavLink>

  <div className="ps-divider" />

  <span className="ps-problem-title">{problem.title}</span>

  {isSolved && (
    <span className="ps-solved-badge">
      <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
        <path d="M1 4l2 2 4-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
      Solved
    </span>
  )}
</div>

          <div className="ps-nav-center">
            <select className="ps-lang-select" value={language} onChange={e => handleLanguageChange(e.target.value)}>
              {LANGUAGES.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
            </select>

            {/* Auto-save indicator */}
            <span className={`ps-saved-pill ${savedVisible ? 'visible' : ''}`}>✓ saved</span>

            {/* Reset to starter */}
            <button className="ps-reset-btn" onClick={handleResetCode} title="Reset to starter template">
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M1 5a4 4 0 104-4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                <path d="M1 2v3h3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Reset
            </button>

            <div className="ps-divider" />

            <button className="ps-ai-btn" onClick={() => setActiveTab('blazeai')}>
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                <path d="M6.5 1L8 5h4l-3.5 2.5L10 12 6.5 9.5 3 12l1.5-4.5L1 5h4z" fill="currentColor" opacity=".85"/>
              </svg>
              BlazeAI
            </button>
            <button className="ps-run-btn" onClick={handleRun} disabled={runStatus === 'running'}>
              {runStatus === 'running' && drawerMode === 'run'
                ? <span style={{ width:10, height:10, border:'1.5px solid var(--accent)', borderTopColor:'transparent', borderRadius:'50%', animation:'ps-spin .6s linear infinite', display:'inline-block' }} />
                : <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor"><path d="M2 1.5l7 3.5-7 3.5V1.5z"/></svg>
              }
              Run
            </button>
            <button className="ps-submit-btn" onClick={handleSubmit} disabled={runStatus === 'running'}>
              Submit
            </button>
          </div>

          <div className="ps-nav-right">
            {user?.firstName && <span className="ps-user-pill">{user.firstName}</span>}
          </div>
        </nav>

        {/* ── Workspace ── */}
        <div className="ps-workspace">

          {/* ── LEFT PANE ── */}
          <div className="ps-left">
            <div className="ps-tabs">
              {[
                { key: 'description', label: 'Description' },
                { key: 'editorial',   label: 'Editorial'   },
                { key: 'solutions',   label: 'Solutions'   },
                { key: 'submissions', label: 'Submissions' },
                { key: 'blazeai',     label: 'BlazeAI', ai: true },
              ].map(({ key, label, ai }) => (
                <button
                  key={key}
                  className={`ps-tab${activeTab === key ? ' active' : ''}${ai ? ' ai-tab' : ''}`}
                  onClick={() => setActiveTab(key)}
                >
                  {ai && (
                    <svg width="11" height="11" viewBox="0 0 13 13" fill="currentColor" style={{ opacity: .9 }}>
                      <path d="M6.5 1L8 5h4l-3.5 2.5L10 12 6.5 9.5 3 12l1.5-4.5L1 5h4z"/>
                    </svg>
                  )}
                  {label}
                  {key === 'description' && submitResult && (
                    <span className="ps-tab-dot" style={{ background: submitResult.accepted ? 'var(--success)' : 'var(--error)' }} />
                  )}
                </button>
              ))}
            </div>

            <div className="ps-content">

              {activeTab === 'description' && (
                <div>
                  {submitResult && (
                    <div className={`ps-submit-banner ${submitResult.accepted ? 'accepted' : 'rejected'}`}>
                      <div>
                        <div className="ps-submit-banner-label">
                          {submitResult.accepted ? '🎉 Accepted' : `✗ ${submitResult.error || 'Wrong Answer'}`}
                        </div>
                        {submitResult.passedTestCases != null && (
                          <div className="ps-submit-banner-sub">
                            {submitResult.passedTestCases}/{submitResult.totalTestCases} test cases passed
                          </div>
                        )}
                      </div>
                      {submitResult.accepted && (
                        <div className="ps-submit-banner-stats">
                          {submitResult.runtime != null && <span>⚡ {submitResult.runtime}s</span>}
                          {submitResult.memory  != null && <span>◈ {submitResult.memory} KB</span>}
                        </div>
                      )}
                    </div>
                  )}
                  <h1 className="ps-title">{problem.title}</h1>
                  <div className="ps-meta">
                    <span className={`ps-badge ${getDifficultyStyle(problem.difficulty)}`}>{problem.difficulty}</span>
                    {problem.tags && <span className="ps-badge ps-badge-tag">{problem.tags}</span>}
                  </div>
                  <p className="ps-description">{problem.description}</p>
                  {problem.visibleTestCases?.length > 0 && (
                    <>
                      <p className="ps-section-title">Examples</p>
                      {problem.visibleTestCases.map((ex, i) => (
                        <div key={i} className="ps-example">
                          <p className="ps-example-num">Example {i + 1}</p>
                          <div className="ps-example-row"><span className="ps-example-label">Input:</span><code className="ps-example-code">{ex.input}</code></div>
                          <div className="ps-example-row"><span className="ps-example-label">Output:</span><code className="ps-example-code">{ex.output}</code></div>
                          {ex.explanation && <div className="ps-example-row"><span className="ps-example-label">Explain:</span><span className="ps-example-explain">{ex.explanation}</span></div>}
                        </div>
                      ))}
                    </>
                  )}
                </div>
              )}

              {activeTab === 'editorial' && (
                <div>
                  <h2 className="ps-title" style={{ fontSize: 15 }}>Editorial</h2>
                  {problem.editorial?.content
                    ? <p className="ps-description">{problem.editorial.content}</p>
                    : <p className="ps-empty">No editorial available yet.</p>}
                </div>
              )}

              {activeTab === 'solutions' && (
                <div>
                  <h2 className="ps-title" style={{ fontSize: 15 }}>Solutions</h2>
                  {problem.referenceSolution?.length > 0 ? (
                    problem.referenceSolution.map((sol, i) => (
                      <div key={i} className="ps-solution-card">
                        <div className="ps-solution-header">
                          <span className="ps-solution-dot" />
                          {problem.title} — {LANG_LABEL[normalizeDbLang(sol.language)] ?? sol.language}
                        </div>
                        <pre className="ps-code-block"><code>{sol.completeCode}</code></pre>
                      </div>
                    ))
                  ) : (
                    <p className="ps-empty">Solutions unlock after you solve the problem.</p>
                  )}
                </div>
              )}

              {activeTab === 'submissions' && <SubmissionHistory problemId={resolvedId} />}

              {activeTab === 'blazeai' && (
                <BlazeAIChat problem={problem} code={code} language={language} />
              )}

            </div>
          </div>

          {/* ── RIGHT PANE ── */}
          <div className="ps-right">
            <div className="ps-editor-area">
              {/* Pass handleCodeChange instead of setCode — triggers auto-save */}
              <CodeEditor language={language} value={code} onChange={handleCodeChange} />
            </div>

            {/* Results drawer */}
            <div className={`ps-results-drawer ${drawerOpen ? 'expanded' : 'collapsed'}`}>
              <div className="ps-drawer-header" onClick={() => setDrawerOpen(o => !o)}>
                <span className="ps-status-dot" style={{
                  background: drawerStatusColor,
                  boxShadow: runStatus !== 'idle' ? `0 0 6px ${drawerStatusColor}` : 'none',
                  animation: runStatus === 'running' ? 'ps-pulse 1s ease infinite' : 'none',
                }} />
                <span className="ps-drawer-title" style={{ color: drawerStatusColor }}>{drawerLabel}</span>
                {runResult && drawerMode === 'run' && runStatus !== 'running' && (
                  <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)', marginLeft: 8, color: runResult.success ? 'var(--success)' : 'var(--error)' }}>
                    {runResult.testCases ? `${runResult.testCases.filter(t => t.status_id === 3).length}/${runResult.testCases.length} passed` : ''}
                  </span>
                )}
                <svg className={`ps-chevron ${drawerOpen ? 'open' : ''}`} style={{ marginLeft: 'auto', color: 'var(--text-muted)' }} width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M2 8l4-4 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </div>
              {drawerOpen && <div className="ps-drawer-body">{renderDrawerContent()}</div>}
            </div>

            {/* Status bar */}
            <div className="ps-statusbar">
              <span className={`ps-status-dot status-${runStatus}`} />
              <span style={{ color: runStatus === 'success' ? 'var(--success)' : runStatus === 'error' ? 'var(--error)' : runStatus === 'running' ? 'var(--warning)' : undefined }}>
                {runStatus === 'idle' ? 'Ready' : runStatus === 'running' ? 'Running...' : runStatus === 'success' ? (submitResult?.accepted ? 'Accepted' : 'Tests Passed') : 'Failed'}
              </span>
              <div className="ps-statusbar-right">
                <span>UTF-8</span>
                <span>{LANG_LABEL[language]}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
