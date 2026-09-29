import { useEffect, useState } from 'react';
import { NavLink } from 'react-router';
import { useSelector } from 'react-redux';
import axiosClient from '../utils/axiosClient';

export default function UserDashboard() {
  const { user }   = useSelector((s) => s.auth);
  const { problems: solvedProblems, ids: solvedIds, total: totalSolved } = useSelector((s) => s.solved);

  const [allProblems,  setAllProblems]  = useState([]);
  const [submissions,  setSubmissions]  = useState([]);
  const [loadingSubs,  setLoadingSubs]  = useState(true);

  useEffect(() => {
    axiosClient.get('/problem/getAllProblem')
      .then((r) => setAllProblems(Array.isArray(r.data) ? r.data.filter(Boolean) : []))
      .catch((err) => {
        console.error(err);
        setAllProblems([]);
      });

    // Fetch recent submissions across all problems
    // We'll derive activity from solvedProblems for now
    setLoadingSubs(false);
  }, []);

  // Derived stats
  const safeProblems = Array.isArray(allProblems) ? allProblems : [];
  const safeSolvedProblems = Array.isArray(solvedProblems) ? solvedProblems.filter(Boolean) : [];
  const safeSolvedIds = Array.isArray(solvedIds) ? solvedIds : [];
  const total    = safeProblems.length;
  const accuracy = total ? Math.round(((totalSolved || 0) / total) * 100) : 0;

  const diffStats = ['easy', 'medium', 'hard'].map((d) => {
    const t = safeProblems.filter((p) => p && p.difficulty === d).length;
    const s = safeProblems.filter((p) => p && p.difficulty === d && safeSolvedIds.includes(String(p._id))).length;
    return { d, total: t, solved: s, pct: t ? Math.round((s / t) * 100) : 0 };
  });

  const tagStats = ['array', 'linkedList', 'graph', 'dp'].map((tag) => {
    const t = safeProblems.filter((p) => p && p.tags === tag).length;
    const s = safeProblems.filter((p) => p && p.tags === tag && safeSolvedIds.includes(String(p._id))).length;
    return { tag, total: t, solved: s };
  });

  const joinDate = user?.createdAt && !isNaN(new Date(user.createdAt).getTime())
    ? new Date(user.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
    : 'Active Member';

  return (
    <div style={{ minHeight: '100vh', background: '#0a0b0f', color: '#e2e4ed', fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Playfair+Display:wght@700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        /* ── Scrollbar ── */
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: #2a2d3a; border-radius: 4px; }

        /* ── Nav ── */
        .ud-nav {
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 28px; height: 52px;
          background: rgba(10,11,15,0.9); border-bottom: 1px solid #1e2130;
          backdrop-filter: blur(12px);
          position: sticky; top: 0; z-index: 50;
        }
        .ud-nav-left { display: flex; align-items: center; gap: 14px; }
        .ud-back {
          display: flex; align-items: center; gap: 6px;
          padding: 5px 12px; border-radius: 7px;
          font-size: 12px; font-weight: 500; color: #5a5f78;
          border: 1px solid #1e2130; background: transparent;
          text-decoration: none; transition: all .15s;
        }
        .ud-back:hover { color: #e2e4ed; border-color: #2e3245; background: #131520; }
        .ud-nav-title { font-size: 13px; font-weight: 600; color: #5a5f78; letter-spacing: .2px; }

        /* ── Layout ── */
        .ud-page { max-width: 1000px; margin: 0 auto; padding: 36px 24px 60px; }

        /* ── Hero card ── */
        .ud-hero {
          position: relative; border-radius: 20px; overflow: hidden;
          border: 1px solid #1e2130; margin-bottom: 24px;
          background: linear-gradient(135deg, #0f1018 0%, #131825 100%);
          padding: 36px 36px 32px;
          animation: ud-fadein .4s ease both;
        }
        @keyframes ud-fadein { from { opacity:0; transform:translateY(10px) } to { opacity:1; transform:none } }

        .ud-hero-bg {
          position: absolute; inset: 0; pointer-events: none;
          background:
            radial-gradient(ellipse 60% 80% at 5% 50%, rgba(108,142,247,0.07) 0%, transparent 60%),
            radial-gradient(ellipse 40% 60% at 95% 10%, rgba(167,139,250,0.05) 0%, transparent 50%);
        }
        .ud-hero-grid {
          position: absolute; inset: 0; pointer-events: none; opacity: .03;
          background-image: linear-gradient(#6c8ef7 1px, transparent 1px), linear-gradient(90deg, #6c8ef7 1px, transparent 1px);
          background-size: 40px 40px;
        }

        .ud-hero-inner { position: relative; z-index: 1; display: flex; align-items: flex-start; gap: 28px; flex-wrap: wrap; }

        /* Avatar */
        .ud-avatar-wrap { position: relative; flex-shrink: 0; }
        .ud-avatar {
          width: 80px; height: 80px; border-radius: 18px;
          background: linear-gradient(135deg, #6c8ef7, #a78bfa);
          display: flex; align-items: center; justify-content: center;
          font-size: 32px; font-weight: 800; color: #fff;
          font-family: 'Playfair Display', serif;
          box-shadow: 0 0 0 3px rgba(108,142,247,.2), 0 12px 32px rgba(108,142,247,.15);
        }
        .ud-avatar-ring {
          position: absolute; inset: -4px; border-radius: 22px;
          border: 1px solid rgba(108,142,247,.3);
          animation: ud-ring 3s ease-in-out infinite;
        }
        @keyframes ud-ring { 0%,100%{opacity:.3} 50%{opacity:.8} }

        /* Info */
        .ud-hero-info { flex: 1; min-width: 200px; }
        .ud-name {
          font-family: 'Playfair Display', serif;
          font-size: 26px; font-weight: 800; color: #e8eaf0;
          letter-spacing: -.5px; line-height: 1.2;
        }
        .ud-role {
          display: inline-flex; align-items: center; gap: 5px;
          margin-top: 6px; padding: 2px 9px; border-radius: 20px;
          font-size: 10px; font-weight: 600; font-family: 'JetBrains Mono', monospace;
          letter-spacing: .5px; text-transform: uppercase;
        }
        .ud-role-user  { color: #6c8ef7; background: rgba(108,142,247,.12); border: 1px solid rgba(108,142,247,.25); }
        .ud-role-admin { color: #f59e0b; background: rgba(245,158,11,.12);  border: 1px solid rgba(245,158,11,.25); }

        .ud-meta { display: flex; flex-wrap: wrap; gap: 14px; margin-top: 14px; }
        .ud-meta-item {
          display: flex; align-items: center; gap: 6px;
          font-size: 12px; color: #5a5f78; font-family: 'JetBrains Mono', monospace;
        }
        .ud-meta-item svg { opacity: .5; }

        /* Hero stats */
        .ud-hero-stats { display: flex; gap: 12px; flex-wrap: wrap; align-self: flex-start; }
        .ud-hstat {
          padding: 12px 18px; border-radius: 12px;
          border: 1px solid #1e2130; background: rgba(255,255,255,.02);
          text-align: center; min-width: 76px;
          transition: border-color .15s, background .15s;
        }
        .ud-hstat:hover { border-color: #2e3245; background: rgba(255,255,255,.04); }
        .ud-hstat-val   { font-size: 24px; font-weight: 700; font-family: 'JetBrains Mono', monospace; line-height: 1; }
        .ud-hstat-label { font-size: 9px; color: #3a3f58; text-transform: uppercase; letter-spacing: .8px; margin-top: 4px; }

        /* ── Grid ── */
        .ud-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        @media (max-width: 640px) { .ud-grid { grid-template-columns: 1fr; } }

        /* ── Card ── */
        .ud-card {
          border-radius: 16px; border: 1px solid #1e2130; background: #0f1018;
          padding: 22px 24px; animation: ud-fadein .4s ease both;
        }
        .ud-card:nth-child(1) { animation-delay: .05s; }
        .ud-card:nth-child(2) { animation-delay: .10s; }
        .ud-card:nth-child(3) { animation-delay: .15s; }
        .ud-card:nth-child(4) { animation-delay: .20s; }
        .ud-card-full { grid-column: 1 / -1; }

        .ud-card-title {
          font-size: 10px; font-weight: 600; font-family: 'JetBrains Mono', monospace;
          color: #3a3f58; text-transform: uppercase; letter-spacing: 1px;
          margin-bottom: 18px; display: flex; align-items: center; gap: 8px;
        }
        .ud-card-title::after { content: ''; flex: 1; height: 1px; background: #1e2130; }

        /* ── Personal info ── */
        .ud-info-rows { display: grid; gap: 12px; }
        .ud-info-row {
          display: flex; align-items: flex-start; justify-content: space-between;
          padding: 10px 12px; border-radius: 9px; background: #131520;
          border: 1px solid #1a1d2a;
        }
        .ud-info-key { font-size: 11px; color: #3a3f58; font-family: 'JetBrains Mono', monospace; text-transform: uppercase; letter-spacing: .5px; }
        .ud-info-val { font-size: 12px; font-weight: 500; color: #c4c8e0; text-align: right; font-family: 'JetBrains Mono', monospace; }

        /* ── Difficulty progress ── */
        .ud-diff-rows { display: grid; gap: 14px; }
        .ud-diff-row  { display: grid; gap: 6px; }
        .ud-diff-top  { display: flex; justify-content: space-between; align-items: center; }
        .ud-diff-name { font-size: 11px; font-weight: 600; font-family: 'JetBrains Mono', monospace; text-transform: uppercase; letter-spacing: .5px; }
        .ud-diff-num  { font-size: 11px; font-family: 'JetBrains Mono', monospace; color: #3a3f58; }
        .ud-diff-bar  { height: 5px; border-radius: 99px; background: #1a1d2a; overflow: hidden; }
        .ud-diff-fill { height: 100%; border-radius: 99px; transition: width .8s cubic-bezier(.4,0,.2,1); }

        /* ── Tag breakdown ── */
        .ud-tag-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        .ud-tag-card {
          padding: 12px 14px; border-radius: 10px;
          background: #131520; border: 1px solid #1a1d2a;
        }
        .ud-tag-name  { font-size: 10px; font-weight: 600; font-family: 'JetBrains Mono', monospace; color: #5a5f78; text-transform: uppercase; letter-spacing: .5px; margin-bottom: 6px; }
        .ud-tag-count { font-size: 20px; font-weight: 700; font-family: 'JetBrains Mono', monospace; color: #6c8ef7; }
        .ud-tag-total { font-size: 10px; color: #3a3f58; font-family: 'JetBrains Mono', monospace; }

        /* ── Solved list ── */
        .ud-solved-list { display: grid; gap: 8px; max-height: 340px; overflow-y: auto; padding-right: 4px; }
        .ud-solved-item {
          display: flex; align-items: center; justify-content: space-between;
          padding: 10px 13px; border-radius: 9px;
          background: #131520; border: 1px solid #1a1d2a;
          transition: border-color .12s, background .12s;
          text-decoration: none;
        }
        .ud-solved-item:hover { border-color: #2e3245; background: #161824; }
        .ud-solved-item-left { display: flex; align-items: center; gap: 10px; min-width: 0; }
        .ud-check { width: 16px; height: 16px; border-radius: 50%; background: rgba(34,197,94,.12); border: 1px solid rgba(34,197,94,.3); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .ud-check svg { width: 8px; height: 8px; }
        .ud-solved-title { font-size: 12px; font-weight: 500; color: #c4c8e0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .ud-solved-badge {
          font-size: 9px; font-weight: 600; font-family: 'JetBrains Mono', monospace;
          padding: 2px 7px; border-radius: 99px; border: 1px solid;
          text-transform: uppercase; letter-spacing: .4px; flex-shrink: 0;
        }
        .ud-easy   { color: #22c55e; background: rgba(34,197,94,.08);  border-color: rgba(34,197,94,.2); }
        .ud-medium { color: #f59e0b; background: rgba(245,158,11,.08); border-color: rgba(245,158,11,.2); }
        .ud-hard   { color: #ef4444; background: rgba(239,68,68,.08);  border-color: rgba(239,68,68,.2); }

        /* ── Overall ring ── */
        .ud-ring-wrap { display: flex; align-items: center; justify-content: center; gap: 28px; flex-wrap: wrap; }
        .ud-ring-svg  { flex-shrink: 0; }
        .ud-ring-legend { display: grid; gap: 10px; }
        .ud-legend-row  { display: flex; align-items: center; gap: 10px; font-size: 12px; }
        .ud-legend-dot  { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
        .ud-legend-label { color: #5a5f78; font-family: 'JetBrains Mono', monospace; font-size: 11px; }
        .ud-legend-val   { margin-left: auto; font-weight: 600; font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #c4c8e0; }

        .ud-empty { text-align: center; padding: 28px; color: #3a3f58; font-size: 11px; font-family: 'JetBrains Mono', monospace; }
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
  html {
  font-size: 110%; /* increases overall font size */
}
      `}</style>

      {/* ── Nav ── */}
      <nav className="ud-nav">
        <div className="ud-nav-left">
          <div className="ps-brand">
            <NavLink to="/" className="ps-brand">
           <span className="ps-logo">CB</span>
          </NavLink>
           </div>
          <NavLink to="/" className="ud-back">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M8 2L4 6l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            Back
          </NavLink>
          <span className="ud-nav-title">Profile</span>
        </div>
      </nav>

      <div className="ud-page">

        {/* ── Hero ── */}
        <div className="ud-hero">
          <div className="ud-hero-bg" />
          <div className="ud-hero-grid" />
          <div className="ud-hero-inner">

            {/* Avatar */}
            <div className="ud-avatar-wrap">
              <div className="ud-avatar">{user?.firstName?.charAt(0).toUpperCase() ?? '?'}</div>
              <div className="ud-avatar-ring" />
            </div>

            {/* Name + meta */}
            <div className="ud-hero-info">
              <div className="ud-name">{user?.firstName} {user?.lastName}</div>
              <span className={`ud-role ${user?.role === 'admin' ? 'ud-role-admin' : 'ud-role-user'}`}>
                {user?.role === 'admin' ? '⚙ Admin' : '◉ Member'}
              </span>
              <div className="ud-meta">
                <span className="ud-meta-item">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M1 3h10M1 3a1 1 0 011-1h8a1 1 0 011 1M1 3v7a1 1 0 001 1h8a1 1 0 001-1V3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
                  {user?.emailId}
                </span>
                <span className="ud-meta-item">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><rect x="1" y="2" width="10" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.2"/><path d="M4 1v2M8 1v2M1 5h10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
                  Joined {joinDate}
                </span>
              </div>
            </div>

            {/* Stats */}
            <div className="ud-hero-stats">
              <div className="ud-hstat">
                <div className="ud-hstat-val" style={{ color: '#22c55e' }}>{totalSolved}</div>
                <div className="ud-hstat-label">Solved</div>
              </div>
              <div className="ud-hstat">
                <div className="ud-hstat-val" style={{ color: '#e2e4ed' }}>{total}</div>
                <div className="ud-hstat-label">Total</div>
              </div>
              <div className="ud-hstat">
                <div className="ud-hstat-val" style={{ color: '#6c8ef7' }}>{accuracy}%</div>
                <div className="ud-hstat-label">Rate</div>
              </div>
            </div>

          </div>
        </div>

        {/* ── Grid ── */}
        <div className="ud-grid">

          {/* ── Personal Info ── */}
          <div className="ud-card">
            <div className="ud-card-title">Personal Info</div>
            <div className="ud-info-rows">
              {[
                ['First Name',  user?.firstName  ?? '—'],
                ['Last Name',   user?.lastName   ?? '—'],
                ['Email',       user?.emailId    ?? '—'],
                ['Role',        user?.role       ?? '—'],
                ['User ID',     user?._id ? String(user._id).slice(-8) + '...' : '—'],
              ].map(([k, v]) => (
                <div key={k} className="ud-info-row">
                  <span className="ud-info-key">{k}</span>
                  <span className="ud-info-val">{v}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Difficulty Breakdown ── */}
          <div className="ud-card">
            <div className="ud-card-title">Difficulty Breakdown</div>

            {/* SVG donut */}
            <div className="ud-ring-wrap" style={{ marginBottom: 20 }}>
              <DonutRing easy={diffStats[0]} medium={diffStats[1]} hard={diffStats[2]} total={totalSolved} />
              <div className="ud-ring-legend">
                {[
                  { label: 'Easy',   val: `${diffStats[0].solved}/${diffStats[0].total}`, color: '#22c55e' },
                  { label: 'Medium', val: `${diffStats[1].solved}/${diffStats[1].total}`, color: '#f59e0b' },
                  { label: 'Hard',   val: `${diffStats[2].solved}/${diffStats[2].total}`, color: '#ef4444' },
                ].map(({ label, val, color }) => (
                  <div key={label} className="ud-legend-row">
                    <span className="ud-legend-dot" style={{ background: color }} />
                    <span className="ud-legend-label">{label}</span>
                    <span className="ud-legend-val">{val}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="ud-diff-rows">
              {diffStats.map(({ d, total: t, solved: s, pct }) => {
                const color = d === 'easy' ? '#22c55e' : d === 'medium' ? '#f59e0b' : '#ef4444';
                return (
                  <div key={d} className="ud-diff-row">
                    <div className="ud-diff-top">
                      <span className="ud-diff-name" style={{ color }}>{d}</span>
                      <span className="ud-diff-num">{s}/{t} · {pct}%</span>
                    </div>
                    <div className="ud-diff-bar">
                      <div className="ud-diff-fill" style={{ width: `${pct}%`, background: color }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Tag Breakdown ── */}
          <div className="ud-card">
            <div className="ud-card-title">By Topic</div>
            <div className="ud-tag-grid">
              {tagStats.map(({ tag, total: t, solved: s }) => (
                <div key={tag} className="ud-tag-card">
                  <div className="ud-tag-name">{tag}</div>
                  <div className="ud-tag-count">{s}</div>
                  <div className="ud-tag-total">of {t} solved</div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Solved Problems ── */}
          <div className="ud-card">
            <div className="ud-card-title">Solved Problems ({totalSolved})</div>
            {solvedProblems.length === 0 ? (
              <div className="ud-empty">No problems solved yet.<br/>Start solving!</div>
            ) : (
              <div className="ud-solved-list">
                {safeSolvedProblems.map((p) => (
                  <NavLink key={p._id} to={`/problem/${p._id}`} className="ud-solved-item">
                    <div className="ud-solved-item-left">
                      <span className="ud-check">
                        <svg viewBox="0 0 8 8" fill="none">
                          <path d="M1.5 4l2 2 3-3" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                      </span>
                      <span className="ud-solved-title">{p.title}</span>
                    </div>
                    <span className={`ud-solved-badge ud-${p.difficulty}`}>{p.difficulty}</span>
                  </NavLink>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

/* ── SVG Donut Ring ─────────────────────────────────────────────────────── */
function DonutRing({ easy, medium, hard, total }) {
  const r  = 42;
  const cx = 56;
  const cy = 56;
  const circumference = 2 * Math.PI * r;

  const segments = [
    { val: easy.solved,   color: '#22c55e' },
    { val: medium.solved, color: '#f59e0b' },
    { val: hard.solved,   color: '#ef4444' },
  ];

  const sum = segments.reduce((a, s) => a + s.val, 0) || 1;
  let offset = 0;

  return (
    <svg className="ud-ring-svg" width="112" height="112" viewBox="0 0 112 112">
      {/* Track */}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#1a1d2a" strokeWidth="10" />

      {segments.map((seg, i) => {
        const dash   = (seg.val / sum) * circumference;
        const gap    = circumference - dash;
        const rotate = (offset / sum) * 360 - 90;
        offset += seg.val;
        return (
          <circle
            key={i}
            cx={cx} cy={cy} r={r}
            fill="none"
            stroke={seg.color}
            strokeWidth="10"
            strokeDasharray={`${dash} ${gap}`}
            strokeDashoffset={0}
            strokeLinecap="round"
            transform={`rotate(${rotate} ${cx} ${cy})`}
            style={{ transition: 'stroke-dasharray .8s cubic-bezier(.4,0,.2,1)' }}
          />
        );
      })}

      {/* Center label */}
      <text x={cx} y={cy - 6} textAnchor="middle" fill="#e2e4ed" fontSize="18" fontWeight="700" fontFamily="JetBrains Mono, monospace">{total}</text>
      <text x={cx} y={cy + 10} textAnchor="middle" fill="#3a3f58" fontSize="9" fontFamily="JetBrains Mono, monospace" letterSpacing="1">SOLVED</text>
    </svg>
  );
}
