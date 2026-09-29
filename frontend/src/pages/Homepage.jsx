import { useEffect, useState, useRef, useCallback } from 'react';
import { NavLink, useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import axiosClient from '../utils/axiosClient';
import { logoutUser } from '../authSlice';
import { fetchSolvedProblems, clearSolved } from '../solvedSlice';

/* ─── Rank system ────────────────────────────────────────────────────────── */
const getRank = (n) => {
  if (n === 0)   return { label: 'Unranked',  color: '#4a4d60', bg: 'rgba(74,77,96,0.12)',    icon: '○' };
  if (n < 5)     return { label: 'Spark',     color: '#60a5fa', bg: 'rgba(96,165,250,0.12)',  icon: '◈' };
  if (n < 15)    return { label: 'Coder',     color: '#22c55e', bg: 'rgba(34,197,94,0.12)',   icon: '◆' };
  if (n < 30)    return { label: 'Hacker',    color: '#f59e0b', bg: 'rgba(245,158,11,0.12)',  icon: '★' };
  if (n < 60)    return { label: 'Expert',    color: '#a78bfa', bg: 'rgba(167,139,250,0.12)', icon: '⬡' };
  return           { label: 'Blazer',     color: '#f87171', bg: 'rgba(248,113,113,0.12)',  icon: '⚡' };
};

/* ─── Motivational quotes ─────────────────────────────────────────────────── */
const QUOTES = [
  { text: 'Every expert was once a beginner who refused to give up.', author: 'Anonymous' },
  { text: 'The best time to solve a problem was yesterday. The second best time is now.', author: 'Adapted proverb' },
  { text: 'First, solve the problem. Then, write the code.', author: 'John Johnson' },
  { text: 'Debugging is twice as hard as writing the code in the first place.', author: 'Brian Kernighan' },
  { text: 'Programs must be written for people to read, and only incidentally for machines to execute.', author: 'Harold Abelson' },
  { text: 'The only way to learn a new programming language is by writing programs in it.', author: 'Dennis Ritchie' },
  { text: 'Code never lies. Comments sometimes do.', author: 'Ron Jeffries' },
  { text: 'Talk is cheap. Show me the code.', author: 'Linus Torvalds' },
];

/* ─── DSA topic pills ─────────────────────────────────────────────────────── */
const TOPICS = [
  { slug: 'arrays',              label: 'Arrays',       color: '#6c8ef7' },
  { slug: 'linked-list',         label: 'Linked List',  color: '#f59e0b' },
  { slug: 'stack',               label: 'Stack',        color: '#f87171' },
  { slug: 'trees',               label: 'Trees',        color: '#22c55e' },
  { slug: 'dynamic-programming', label: 'DP',           color: '#ec4899' },
  { slug: 'graphs',              label: 'Graphs',       color: '#06b6d4' },
  { slug: 'strings',             label: 'Strings',      color: '#f7b267' },
  { slug: 'binarySearch',        label: 'Binary Search',color: '#60a5fa' },
  { slug: 'hashing',             label: 'Hashing',      color: '#34d399' },
  { slug: 'heap',                label: 'Heap',         color: '#f472b6' },
  { slug: 'recursion',           label: 'Recursion',    color: '#ff6b6b' },
  { slug: 'sorting',             label: 'Sorting',      color: '#a78bfa' },
];

/* ─── Activity heatmap helpers ────────────────────────────────────────────── */
function buildHeatmap(solvedCount) {
  const today = new Date();
  const cells = [];
  for (let i = 51 * 7 - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    // Fake activity: deterministic seeded by date + solved count so it looks real
    const seed = d.getDate() + d.getMonth() * 31 + solvedCount;
    const rand = ((seed * 1103515245 + 12345) & 0x7fffffff) % 100;
    const active = rand < Math.min(40, solvedCount * 3);
    const intensity = active ? (rand < 10 ? 3 : rand < 25 ? 2 : 1) : 0;
    cells.push({ date: d, intensity });
  }
  return cells;
}

/* ─── Streak counter ──────────────────────────────────────────────────────── */
function getStreak(solvedCount) {
  return Math.min(Math.floor(solvedCount * 1.3), 99);
}

/* ─── CSS ─────────────────────────────────────────────────────────────────── */
const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}

html {
  font-size: 110%; /* increases overall font size */
}
:root {
  --bg0:#0a0b0e; --bg1:#0f1115; --bg2:#13151d; --bg3:#181b24; --bg4:#1e2230;
  --border:#232736; --border2:#2e3347;
  --text1:#eceef5; --text2:#9295a8; --text3:#555870;
  --accent:#6c8ef7; --accent-dim:rgba(108,142,247,0.1); --accent-glow:rgba(108,142,247,0.25);
  --green:#22c55e; --amber:#f59e0b; --red:#ef4444;
  --font-display:'Syne',sans-serif; --font-mono:'JetBrains Mono',monospace;
}

/* scrollbar */
::-webkit-scrollbar{width:4px;height:4px;}
::-webkit-scrollbar-track{background:transparent;}
::-webkit-scrollbar-thumb{background:var(--border2);border-radius:4px;}

/* ── Nav ── */
.hp-nav{
  display:flex;align-items:center;justify-content:space-between;
  padding:0 20px;height:52px;
  background:rgba(15,17,21,0.92);border-bottom:1px solid var(--border);
  position:sticky;top:0;z-index:100;backdrop-filter:blur(12px);
}
.hp-logo{font-size:15px;font-weight:800;color:var(--text1);text-decoration:none;letter-spacing:-.3px;font-family:var(--font-display);}
.hp-logo span{color:var(--accent);}
.hp-nav-center{display:flex;align-items:center;gap:6px;}
.hp-nav-pill{
  padding:5px 12px;border-radius:7px;font-size:11px;font-weight:700;
  font-family:var(--font-mono);color:var(--text3);
  background:transparent;border:1px solid var(--border);
  text-decoration:none;transition:all .15s;cursor:pointer;
}
.hp-nav-pill:hover{color:var(--text1);border-color:var(--border2);background:var(--bg3);}
.hp-nav-pill.active{color:var(--accent);background:var(--accent-dim);border-color:rgba(108,142,247,.3);}

/* search trigger */
.hp-search-trigger{
  display:flex;align-items:center;gap:8px;padding:5px 12px;
  border-radius:7px;border:1px solid var(--border);background:var(--bg2);
  font-size:11px;color:var(--text3);cursor:pointer;transition:all .15s;
  font-family:var(--font-mono);
}
.hp-search-trigger:hover{border-color:var(--border2);color:var(--text2);}
.hp-kbd{padding:1px 5px;border-radius:4px;background:var(--bg4);border:1px solid var(--border2);font-size:9px;color:var(--text3);}

/* search modal */
.hp-search-overlay{position:fixed;inset:0;background:rgba(0,0,0,.6);z-index:200;display:flex;align-items:flex-start;justify-content:center;padding-top:80px;backdrop-filter:blur(4px);animation:fadeIn .15s ease;}
.hp-search-modal{width:560px;max-width:94vw;background:var(--bg2);border:1px solid var(--border2);border-radius:14px;overflow:hidden;box-shadow:0 24px 64px rgba(0,0,0,.6);}
.hp-search-input-row{display:flex;align-items:center;gap:10px;padding:14px 16px;border-bottom:1px solid var(--border);}
.hp-search-input{flex:1;background:transparent;border:none;outline:none;font-size:14px;color:var(--text1);font-family:var(--font-display);}
.hp-search-input::placeholder{color:var(--text3);}
.hp-search-results{max-height:320px;overflow-y:auto;}
.hp-search-item{display:flex;align-items:center;justify-content:space-between;padding:10px 16px;cursor:pointer;transition:background .12s;border-bottom:1px solid var(--border);}
.hp-search-item:hover{background:var(--bg3);}
.hp-search-empty{padding:28px;text-align:center;font-size:12px;color:var(--text3);font-family:var(--font-mono);}

/* avatar */
.hp-avatar-btn{display:flex;align-items:center;gap:8px;padding:4px 10px;border-radius:8px;border:1px solid var(--border);background:var(--bg2);font-size:12px;color:var(--text2);cursor:pointer;font-family:var(--font-display);}
.hp-avatar{width:26px;height:26px;border-radius:7px;background:linear-gradient(135deg,#6c8ef7,#a78bfa);color:#fff;font-size:11px;font-weight:800;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
.hp-dropdown{position:absolute;right:0;top:calc(100% + 6px);width:230px;background:var(--bg2);border:1px solid var(--border2);border-radius:14px;overflow:hidden;box-shadow:0 16px 40px rgba(0,0,0,.7);animation:fadeIn .15s ease;}
.hp-user-card{padding:14px 16px;border-bottom:1px solid var(--border);background:var(--bg3);}
.hp-user-name{font-size:13px;font-weight:700;color:var(--text1);font-family:var(--font-display);}
.hp-user-email{font-size:10px;color:var(--text3);font-family:var(--font-mono);margin-top:2px;}
.hp-dropdown a,.hp-dropdown button{display:block;width:100%;text-align:left;padding:9px 16px;font-size:12px;background:none;border:none;cursor:pointer;transition:background .12s;text-decoration:none;color:inherit;font-family:var(--font-display);}
.hp-dropdown a:hover,.hp-dropdown button:hover{background:var(--bg3);}

/* ── Main layout ── */
.hp-main{max-width:960px;margin:0 auto;padding:24px 20px 80px;}

/* ── Quote bar ── */
.hp-quote-bar{
  border-radius:10px;border:1px solid var(--border);
  padding:12px 18px;margin-bottom:20px;
  background:var(--bg2);display:flex;align-items:center;gap:12px;
  animation:fadeIn .4s ease;
}
.hp-quote-mark{font-size:24px;color:var(--accent);font-family:Georgia,serif;line-height:1;flex-shrink:0;opacity:.6;}
.hp-quote-text{font-size:12px;color:var(--text2);font-style:italic;line-height:1.6;font-family:var(--font-display);}
.hp-quote-author{font-size:10px;color:var(--text3);font-family:var(--font-mono);margin-top:3px;}

/* ── Hero ── */
.hp-hero{
  border-radius:16px;border:1px solid var(--border);background:var(--bg1);
  padding:24px 28px;margin-bottom:20px;position:relative;overflow:hidden;
}
.hp-hero::before{content:'';position:absolute;inset:0;pointer-events:none;
  background:radial-gradient(ellipse 60% 70% at 100% -10%, rgba(108,142,247,0.08) 0%, transparent 65%);}
.hp-hero::after{content:'';position:absolute;top:-1px;left:0;right:0;height:2px;
  background:linear-gradient(90deg,transparent,rgba(108,142,247,0.5),transparent);}
.hp-hero-top{display:flex;flex-wrap:wrap;justify-content:space-between;gap:20px;margin-bottom:24px;position:relative;z-index:1;}
.hp-hero-heading{font-size:24px;font-weight:800;letter-spacing:-.5px;line-height:1.25;font-family:var(--font-display);}
.hp-hero-heading span{color:var(--accent);}
.hp-hero-sub{margin-top:6px;font-size:11px;color:var(--text3);font-family:var(--font-mono);}

/* rank badge in hero */
.hp-rank-badge{
  display:inline-flex;align-items:center;gap:5px;margin-top:10px;
  padding:4px 10px;border-radius:20px;font-size:10px;font-weight:700;
  font-family:var(--font-mono);letter-spacing:.5px;border:1px solid;
  transition:all .3s;
}

.hp-stats-row{display:flex;gap:10px;flex-wrap:wrap;}
.hp-stat{padding:10px 18px;border-radius:10px;border:1px solid var(--border);background:var(--bg3);min-width:80px;text-align:center;}
.hp-stat-label{font-size:9px;color:var(--text3);text-transform:uppercase;letter-spacing:.8px;font-family:var(--font-mono);}
.hp-stat-value{font-size:22px;font-weight:800;margin-top:2px;font-family:var(--font-display);}

/* progress */
.hp-progress{position:relative;z-index:1;}
.hp-progress-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;}
.hp-progress-label{font-size:10px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:.8px;font-family:var(--font-mono);}
.hp-progress-count{font-size:11px;font-family:var(--font-mono);color:var(--accent);font-weight:700;}
.hp-overall-bar{height:6px;border-radius:99px;background:var(--bg4);margin-bottom:14px;overflow:hidden;}
.hp-overall-fill{height:100%;border-radius:99px;background:linear-gradient(90deg,#6c8ef7,#a78bfa);transition:width .8s cubic-bezier(.4,0,.2,1);}
.hp-diff-bars{display:grid;gap:8px;}
.hp-diff-row{display:flex;align-items:center;gap:10px;}
.hp-diff-name{font-size:10px;font-weight:700;font-family:var(--font-mono);width:52px;flex-shrink:0;text-transform:uppercase;letter-spacing:.4px;}
.hp-diff-bar{flex:1;height:4px;border-radius:99px;background:var(--bg4);overflow:hidden;}
.hp-diff-fill{height:100%;border-radius:99px;transition:width .8s cubic-bezier(.4,0,.2,1);}
.hp-diff-count{font-size:10px;font-family:var(--font-mono);color:var(--text3);width:36px;text-align:right;flex-shrink:0;}

/* ── 3-col widgets row ── */
.hp-widgets{display:grid;grid-template-columns:1fr 1fr 1fr;gap:14px;margin-bottom:20px;}
@media(max-width:700px){.hp-widgets{grid-template-columns:1fr;}}

.hp-widget{border-radius:14px;border:1px solid var(--border);background:var(--bg1);padding:18px 20px;position:relative;overflow:hidden;}
.hp-widget-title{font-size:10px;font-weight:700;font-family:var(--font-mono);color:var(--text3);text-transform:uppercase;letter-spacing:.8px;margin-bottom:14px;}

/* streak */
.hp-streak-num{font-size:42px;font-weight:800;font-family:var(--font-display);line-height:1;letter-spacing:-2px;}
.hp-streak-fire{font-size:28px;margin-left:6px;animation:flicker 1.5s ease-in-out infinite;}
.hp-streak-label{font-size:10px;color:var(--text3);font-family:var(--font-mono);margin-top:6px;}
@keyframes flicker{0%,100%{transform:scale(1) rotate(-3deg);}50%{transform:scale(1.15) rotate(3deg);}}

/* daily challenge */
.hp-daily-title{font-size:13px;font-weight:700;color:var(--text1);margin-bottom:4px;font-family:var(--font-display);line-height:1.4;}
.hp-daily-tag{font-size:9px;font-family:var(--font-mono);margin-bottom:10px;display:flex;gap:6px;}
.hp-daily-btn{
  display:inline-flex;align-items:center;gap:6px;
  padding:7px 14px;border-radius:8px;font-size:11px;font-weight:700;
  font-family:var(--font-display);text-decoration:none;
  background:var(--accent);color:#fff;border:none;cursor:pointer;
  transition:all .15s;
}
.hp-daily-btn:hover{background:#7c9cf8;box-shadow:0 0 16px var(--accent-glow);}

/* heatmap */
.hp-heatmap{display:flex;gap:2px;overflow:hidden;}
.hp-heatmap-col{display:flex;flex-direction:column;gap:2px;}
.hp-heatmap-cell{width:9px;height:9px;border-radius:2px;flex-shrink:0;}
.hp-heatmap-legend{display:flex;align-items:center;gap:4px;margin-top:8px;font-size:9px;font-family:var(--font-mono);color:var(--text3);}

/* ── Topics strip ── */
.hp-topics-strip{margin-bottom:20px;}
.hp-topics-label{font-size:10px;font-weight:700;font-family:var(--font-mono);color:var(--text3);text-transform:uppercase;letter-spacing:.8px;margin-bottom:10px;}
.hp-topics-scroll{display:flex;gap:8px;overflow-x:auto;padding-bottom:4px;scrollbar-width:none;}
.hp-topics-scroll::-webkit-scrollbar{display:none;}
.hp-topic-pill{
  display:flex;align-items:center;gap:6px;padding:7px 14px;
  border-radius:20px;border:1px solid var(--border);background:var(--bg2);
  font-size:11px;font-weight:700;font-family:var(--font-display);
  text-decoration:none;white-space:nowrap;transition:all .15s;flex-shrink:0;
}
.hp-topic-pill:hover{border-color:var(--border2);background:var(--bg3);transform:translateY(-1px);}
.hp-topic-dot{width:7px;height:7px;border-radius:50%;flex-shrink:0;}

/* ── Activity feed ── */
.hp-feed-widget{border-radius:14px;border:1px solid var(--border);background:var(--bg1);padding:18px 20px;margin-bottom:20px;}
.hp-feed-title{font-size:10px;font-weight:700;font-family:var(--font-mono);color:var(--text3);text-transform:uppercase;letter-spacing:.8px;margin-bottom:12px;display:flex;align-items:center;gap:8px;}
.hp-feed-live{width:6px;height:6px;border-radius:50%;background:var(--green);box-shadow:0 0 6px var(--green);animation:pulse 2s infinite;}
@keyframes pulse{0%,100%{opacity:1;}50%{opacity:.4;}}
.hp-feed-list{display:grid;gap:6px;}
.hp-feed-item{display:flex;align-items:center;gap:10px;font-size:11px;padding:6px 0;border-bottom:1px solid var(--border);animation:slideIn .3s ease;}
.hp-feed-item:last-child{border-bottom:none;}
.hp-feed-avatar{width:24px;height:24px;border-radius:6px;background:linear-gradient(135deg,#6c8ef7,#a78bfa);color:#fff;font-size:9px;font-weight:800;display:flex;align-items:center;justify-content:center;flex-shrink:0;font-family:var(--font-display);}
.hp-feed-msg{flex:1;color:var(--text2);font-family:var(--font-display);line-height:1.4;}
.hp-feed-msg strong{color:var(--text1);}
.hp-feed-time{font-size:9px;color:var(--text3);font-family:var(--font-mono);flex-shrink:0;}

/* ── Filter bar ── */
.hp-filters{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:16px;align-items:center;}
.hp-select{
  padding:6px 28px 6px 12px;font-size:11px;font-family:var(--font-mono);
  background:var(--bg2);border:1px solid var(--border);border-radius:7px;
  color:var(--text1);cursor:pointer;appearance:none;
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' fill='none'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%234a4d60' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E");
  background-repeat:no-repeat;background-position:right 10px center;
}
.hp-select:focus{outline:none;border-color:var(--border2);}
.hp-clear-btn{padding:6px 12px;font-size:11px;font-family:var(--font-mono);background:var(--accent-dim);border:1px solid rgba(108,142,247,.25);border-radius:7px;color:var(--accent);cursor:pointer;transition:all .15s;}
.hp-clear-btn:hover{background:rgba(108,142,247,.18);}
.hp-results-count{margin-left:auto;font-size:11px;font-family:var(--font-mono);color:var(--text3);}

/* ── Problem list ── */
.hp-list-header{display:flex;align-items:center;gap:10px;padding:8px 16px;margin-bottom:4px;}
.hp-list-col{font-size:9px;font-weight:700;font-family:var(--font-mono);color:var(--text3);text-transform:uppercase;letter-spacing:.7px;}

.hp-list{display:grid;gap:4px;}
.hp-card{
  padding:11px 16px;border-radius:10px;border:1px solid var(--border);background:var(--bg1);
  display:flex;align-items:center;justify-content:space-between;gap:12px;
  transition:all .18s cubic-bezier(.4,0,.2,1);cursor:pointer;
  animation:fadeInUp .25s ease both;
}
.hp-card:hover{border-color:var(--border2);background:var(--bg2);transform:translateX(2px);}
.hp-card.solved{border-color:rgba(34,197,94,.18);}
.hp-card.solved:hover{border-color:rgba(34,197,94,.4);}
.hp-card.easy-hover:hover{box-shadow:0 0 0 1px rgba(34,197,94,.2);}
.hp-card.medium-hover:hover{box-shadow:0 0 0 1px rgba(245,158,11,.2);}
.hp-card.hard-hover:hover{box-shadow:0 0 0 1px rgba(239,68,68,.2);}

.hp-card-left{display:flex;align-items:center;gap:10px;min-width:0;flex:1;}
.hp-card-right{display:flex;align-items:center;gap:6px;flex-shrink:0;}
.hp-idx{font-size:11px;font-family:var(--font-mono);color:var(--text3);width:24px;text-align:right;flex-shrink:0;}
.hp-check-dot{width:8px;height:8px;border-radius:50%;background:var(--green);box-shadow:0 0 6px var(--green);flex-shrink:0;}
.hp-placeholder{width:8px;flex-shrink:0;}
.hp-title{font-size:13px;font-weight:600;color:var(--text1);text-decoration:none;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;transition:color .12s;font-family:var(--font-display);}
.hp-title:hover{color:var(--accent);}
.hp-badge{font-size:9px;font-weight:700;font-family:var(--font-mono);padding:2px 8px;border-radius:99px;border:1px solid;text-transform:uppercase;letter-spacing:.4px;flex-shrink:0;}
.hp-easy  {color:#22c55e;background:rgba(34,197,94,.08); border-color:rgba(34,197,94,.25);}
.hp-medium{color:#f59e0b;background:rgba(245,158,11,.08);border-color:rgba(245,158,11,.25);}
.hp-hard  {color:#ef4444;background:rgba(239,68,68,.08); border-color:rgba(239,68,68,.25);}
.hp-tag   {color:#6c8ef7;background:rgba(108,142,247,.08);border-color:rgba(108,142,247,.25);}
.hp-solved-pill{font-size:9px;font-weight:700;font-family:var(--font-mono);padding:2px 8px;border-radius:99px;color:#22c55e;background:rgba(34,197,94,.1);border:1px solid rgba(34,197,94,.25);text-transform:uppercase;letter-spacing:.4px;}
.hp-empty{text-align:center;padding:56px 20px;color:var(--text3);font-size:12px;font-family:var(--font-mono);}

/* ── Pagination ── */
.hp-pagination{display:flex;align-items:center;justify-content:center;gap:8px;margin-top:20px;}
.hp-page-btn{width:32px;height:32px;border-radius:7px;border:1px solid var(--border);background:var(--bg2);color:var(--text2);font-size:11px;font-family:var(--font-mono);cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .15s;}
.hp-page-btn:hover{border-color:var(--border2);background:var(--bg3);color:var(--text1);}
.hp-page-btn.active{background:var(--accent-dim);border-color:rgba(108,142,247,.35);color:var(--accent);}
.hp-page-btn:disabled{opacity:.3;cursor:not-allowed;}

@keyframes fadeIn{from{opacity:0;}to{opacity:1;}}
@keyframes fadeInUp{from{opacity:0;transform:translateY(8px);}to{opacity:1;transform:none;}}
@keyframes slideIn{from{opacity:0;transform:translateX(-8px);}to{opacity:1;transform:none;}}
`;

/* ─── Fake activity feed ──────────────────────────────────────────────────── */
const FEED_NAMES = ['Arjun S.','Priya R.','Dev M.','Ananya K.','Rahul T.','Sneha P.','Vikram B.','Isha G.'];
const FEED_PROBLEMS = ['Two Sum','Binary Search','Valid Parentheses','Merge Intervals','LRU Cache','Course Schedule','Maximum Subarray','Number of Islands'];
const FEED_ACTIONS = ['solved','just cracked','completed','submitted ✓'];
function makeFeed() {
  return Array.from({ length: 6 }, (_, i) => ({
    id: i,
    name: FEED_NAMES[Math.floor(Math.random() * FEED_NAMES.length)],
    problem: FEED_PROBLEMS[Math.floor(Math.random() * FEED_PROBLEMS.length)],
    action: FEED_ACTIONS[Math.floor(Math.random() * FEED_ACTIONS.length)],
    mins: Math.floor(Math.random() * 55) + 1,
    initials: '',
  })).map(f => ({ ...f, initials: f.name.slice(0,2).toUpperCase() }));
}

const PAGE_SIZE = 15;

export default function Homepage() {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const { user }  = useSelector((s) => s.auth);
  const { ids: solvedIds, total: totalSolved, loading: solvedLoading } = useSelector((s) => s.solved);

  const [problems,    setProblems]    = useState([]);
  const [filters,     setFilters]     = useState({ difficulty: 'all', tag: 'all', status: 'all' });
  const [open,        setOpen]        = useState(false);
  const [page,        setPage]        = useState(1);
  const [quoteIdx,    setQuoteIdx]    = useState(0);
  const [quoteFade,   setQuoteFade]   = useState(true);
  const [feed,        setFeed]        = useState(() => makeFeed());
  const [searchOpen,  setSearchOpen]  = useState(false);
  const [searchQ,     setSearchQ]     = useState('');
  const searchRef = useRef(null);
  const dropdownRef = useRef(null);

  /* ── Data fetching ── */
  useEffect(() => {
    axiosClient.get('/problem/getAllProblem')
      .then((res) => setProblems(Array.isArray(res.data) ? res.data.filter(Boolean) : []))
      .catch((err) => {
        console.error('[Homepage] problems:', err);
        setProblems([]);
      });
    if (user && totalSolved === 0 && !solvedLoading) dispatch(fetchSolvedProblems());
  }, [user]);

  /* ── Quote rotation ── */
  useEffect(() => {
    const id = setInterval(() => {
      setQuoteFade(false);
      setTimeout(() => { setQuoteIdx(i => (i + 1) % QUOTES.length); setQuoteFade(true); }, 400);
    }, 8000);
    return () => clearInterval(id);
  }, []);

  /* ── Feed rotation ── */
  useEffect(() => {
    const id = setInterval(() => {
      setFeed(prev => {
        const newItem = makeFeed()[0];
        return [newItem, ...prev.slice(0, 5)];
      });
    }, 4500);
    return () => clearInterval(id);
  }, []);

  /* ── Keyboard shortcut Cmd+K ── */
  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); setSearchOpen(true); }
      if (e.key === 'Escape') { setSearchOpen(false); setOpen(false); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  useEffect(() => { if (searchOpen) setTimeout(() => searchRef.current?.focus(), 50); }, [searchOpen]);

  /* ── Outside click ── */
  useEffect(() => {
    const handler = (e) => { if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => { dispatch(logoutUser()); dispatch(clearSolved()); };

  /* ── Derived data ── */
  const rank = getRank(totalSolved || 0);
  const streak = getStreak(totalSolved || 0);
  const accuracy = (problems && problems.length) ? Math.round(((totalSolved || 0) / problems.length) * 100) : 0;
  const heatmapCells = buildHeatmap(totalSolved || 0);
  const heatmapCols = [];
  for (let i = 0; i < heatmapCells.length; i += 7) heatmapCols.push(heatmapCells.slice(i, i + 7));

  const safeSolvedIds = Array.isArray(solvedIds) ? solvedIds : [];

  const difficultyStats = ['easy', 'medium', 'hard'].map((d) => ({
    d,
    total: (problems || []).filter(p => p && p.difficulty === d).length,
    solved: (problems || []).filter(p => p && p.difficulty === d && safeSolvedIds.includes(String(p._id))).length,
  }));

  const filteredProblems = (problems || []).filter((p) => {
    if (!p) return false;
    const isSolved = safeSolvedIds.includes(String(p._id));
    return (filters.difficulty === 'all' || p.difficulty === filters.difficulty)
      && (filters.tag === 'all' || p.tags === filters.tag)
      && (filters.status === 'all' || (filters.status === 'solved' ? isSolved : !isSolved));
  });

  const totalPages = Math.max(1, Math.ceil(filteredProblems.length / PAGE_SIZE));
  const pagedProblems = filteredProblems.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const searchResults = searchQ.trim().length < 2 ? [] :
    (problems || []).filter(p => p && p.title && p.title.toLowerCase().includes(searchQ.toLowerCase())).slice(0, 8);

  /* daily challenge: pick deterministically by day */
  const dailyProblem = (problems && problems.length > 0)
    ? problems[new Date().getDate() % problems.length]
    : null;

  /* heat color */
  const heatColor = (intensity) => {
    if (intensity === 0) return 'var(--bg4)';
    if (intensity === 1) return 'rgba(108,142,247,0.3)';
    if (intensity === 2) return 'rgba(108,142,247,0.6)';
    return '#6c8ef7';
  };

  const tags = [...new Set((problems || []).map(p => p && p.tags).filter(Boolean))];

  return (
    <div style={{ minHeight:'100vh', background:'var(--bg0)', color:'var(--text1)', fontFamily:'var(--font-display)' }}>
      <style>{STYLES}</style>

      {/* ── Search Modal ── */}
      {searchOpen && (
        <div className="hp-search-overlay" onClick={() => setSearchOpen(false)}>
          <div className="hp-search-modal" onClick={e => e.stopPropagation()}>
            <div className="hp-search-input-row">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ color:'var(--text3)', flexShrink:0 }}>
                <circle cx="6.5" cy="6.5" r="5" stroke="currentColor" strokeWidth="1.4"/>
                <path d="M10.5 10.5L14 14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
              </svg>
              <input ref={searchRef} className="hp-search-input" placeholder="Search problems..." value={searchQ} onChange={e => setSearchQ(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && searchResults[0]) { navigate(`/problem/${searchResults[0]._id}`); setSearchOpen(false); } }}
              />
              <span className="hp-kbd">ESC</span>
            </div>
            <div className="hp-search-results">
              {searchQ.trim().length < 2
                ? <div className="hp-search-empty">Type to search {problems.length} problems...</div>
                : searchResults.length === 0
                  ? <div className="hp-search-empty">No results for "{searchQ}"</div>
                  : searchResults.map(p => (
                    <div key={p._id} className="hp-search-item" onClick={() => { navigate(`/problem/${p._id}`); setSearchOpen(false); }}>
                      <span style={{ fontSize:13, fontWeight:600 }}>{p.title}</span>
                      <div style={{ display:'flex', gap:6 }}>
                        <span className={`hp-badge hp-${p.difficulty}`}>{p.difficulty}</span>
                        {p.tags && <span className="hp-badge hp-tag">{p.tags}</span>}
                      </div>
                    </div>
                  ))
              }
            </div>
          </div>
        </div>
      )}

      {/* ── Navbar ── */}
      <nav className="hp-nav">
        <NavLink to="/" className="hp-logo">Code<span>Blaze</span></NavLink>
        <div className="hp-nav-center">
          <NavLink to="/topics" className="hp-nav-pill">DSA Topics</NavLink>
          <button className="hp-search-trigger" onClick={() => setSearchOpen(true)}>
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><circle cx="6.5" cy="6.5" r="5" stroke="currentColor" strokeWidth="1.4"/><path d="M10.5 10.5L14 14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>
            Search problems
            <span className="hp-kbd">⌘K</span>
          </button>
        </div>
        <div style={{ position:'relative' }} ref={dropdownRef}>
          <div className="hp-avatar-btn" onClick={() => setOpen(!open)}>
            <div className="hp-avatar">{user?.firstName?.charAt(0).toUpperCase() ?? '?'}</div>
            <span>{user?.firstName ?? 'Guest'}</span>
            <svg width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 1l4 4 4-4" stroke="#4a4d60" strokeWidth="1.5" strokeLinecap="round"/></svg>
          </div>
          {open && (
            <div className="hp-dropdown">
              <div className="hp-user-card">
                <div className="hp-user-name">{user?.firstName} {user?.lastName}</div>
                <div className="hp-user-email">{user?.emailId}</div>
                <div style={{ marginTop:8, display:'inline-flex', alignItems:'center', gap:5, padding:'3px 8px', borderRadius:20, fontSize:10, fontWeight:700, fontFamily:'var(--font-mono)', background:rank.bg, color:rank.color, border:`1px solid ${rank.color}40` }}>
                  {rank.icon} {rank.label}
                </div>
              </div>
              <NavLink to="/profile" onClick={() => setOpen(false)} style={{ color:'#6c8ef7' }}>👤 My Profile</NavLink>
              {user?.role === 'admin' && <NavLink to="/admin" style={{ color:'#f59e0b' }} onClick={() => setOpen(false)}>⚙ Admin Panel</NavLink>}
              <button style={{ color:'#ef4444' }} onClick={() => { setOpen(false); handleLogout(); }}>↩ Logout</button>
            </div>
          )}
        </div>
      </nav>

      <div className="hp-main">

        {/* ── Quote Bar ── */}
        <div className="hp-quote-bar" style={{ opacity: quoteFade ? 1 : 0, transition:'opacity .4s ease' }}>
          <span className="hp-quote-mark">"</span>
          <div>
            <div className="hp-quote-text">{QUOTES[quoteIdx].text}</div>
            <div className="hp-quote-author">— {QUOTES[quoteIdx].author}</div>
          </div>
        </div>

        {/* ── Hero ── */}
        <div className="hp-hero">
          <div className="hp-hero-top">
            <div>
              <h1 className="hp-hero-heading">
                Sharpen Your<br /><span>DSA Edge</span>
              </h1>
              <p className="hp-hero-sub">// practice · track · improve · dominate</p>
              <div className="hp-rank-badge" style={{ color: rank.color, background: rank.bg, borderColor: rank.color + '40' }}>
                {rank.icon} {rank.label} · {totalSolved} solved
              </div>
            </div>
            <div className="hp-stats-row">
              <div className="hp-stat">
                <div className="hp-stat-label">Total</div>
                <div className="hp-stat-value" style={{ color:'var(--text1)' }}>{problems.length}</div>
              </div>
              <div className="hp-stat">
                <div className="hp-stat-label">Solved</div>
                <div className="hp-stat-value" style={{ color:'var(--green)' }}>{solvedLoading ? '—' : totalSolved}</div>
              </div>
              <div className="hp-stat">
                <div className="hp-stat-label">Accuracy</div>
                <div className="hp-stat-value" style={{ color:'var(--accent)' }}>{accuracy}%</div>
              </div>
              <div className="hp-stat">
                <div className="hp-stat-label">Streak</div>
                <div className="hp-stat-value" style={{ color:'#f59e0b' }}>{streak}d</div>
              </div>
            </div>
          </div>
          <div className="hp-progress">
            <div className="hp-progress-header">
              <span className="hp-progress-label">Overall Progress</span>
              <span className="hp-progress-count">{totalSolved} / {problems.length} solved</span>
            </div>
            <div className="hp-overall-bar"><div className="hp-overall-fill" style={{ width:`${accuracy}%` }}/></div>
            <div className="hp-diff-bars">
              {difficultyStats.map(({ d, total, solved }) => {
                const pct = total ? Math.round((solved / total) * 100) : 0;
                const color = d === 'easy' ? 'var(--green)' : d === 'medium' ? 'var(--amber)' : 'var(--red)';
                return (
                  <div key={d} className="hp-diff-row">
                    <span className="hp-diff-name" style={{ color }}>{d}</span>
                    <div className="hp-diff-bar"><div className="hp-diff-fill" style={{ width:`${pct}%`, background:color }}/></div>
                    <span className="hp-diff-count">{solved}/{total}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── 3 Widgets: Streak · Daily Challenge · Heatmap ── */}
        <div className="hp-widgets">

          {/* Streak */}
          <div className="hp-widget">
            <div className="hp-widget-title">🔥 Current Streak</div>
            <div style={{ display:'flex', alignItems:'baseline' }}>
              <span className="hp-streak-num" style={{ color:'#f59e0b' }}>{streak}</span>
              <span className="hp-streak-fire">🔥</span>
            </div>
            <div className="hp-streak-label">days in a row</div>
            <div style={{ marginTop:12, display:'flex', gap:4 }}>
              {['M','T','W','T','F','S','S'].map((d, i) => {
                const filled = i < (streak % 7 || 7);
                return <div key={i} style={{ flex:1, height:4, borderRadius:2, background: filled ? '#f59e0b' : 'var(--bg4)', transition:'background .3s' }} title={d}/>;
              })}
            </div>
            <div style={{ fontSize:9, fontFamily:'var(--font-mono)', color:'var(--text3)', marginTop:5 }}>this week</div>
          </div>

          {/* Daily Challenge */}
          <div className="hp-widget">
            <div className="hp-widget-title">⚡ Daily Challenge</div>
            {dailyProblem ? (
              <>
                <div style={{ fontSize:9, fontFamily:'var(--font-mono)', color:'var(--text3)', marginBottom:6 }}>
                  {new Date().toLocaleDateString('en-US',{weekday:'long',month:'short',day:'numeric'})}
                </div>
                <div className="hp-daily-title">{dailyProblem.title}</div>
                <div className="hp-daily-tag">
                  <span className={`hp-badge hp-${dailyProblem.difficulty}`}>{dailyProblem.difficulty}</span>
                  {dailyProblem.tags && <span className="hp-badge hp-tag">{dailyProblem.tags}</span>}
                </div>
                <NavLink to={`/problem/${dailyProblem._id}`} className="hp-daily-btn">
                  Solve Now →
                </NavLink>
              </>
            ) : (
              <div style={{ fontSize:11, color:'var(--text3)', fontFamily:'var(--font-mono)' }}>Loading...</div>
            )}
          </div>

          {/* Heatmap */}
          <div className="hp-widget">
            <div className="hp-widget-title">📅 Activity</div>
            <div className="hp-heatmap" style={{ overflowX:'auto' }}>
              {heatmapCols.slice(-20).map((col, ci) => (
                <div key={ci} className="hp-heatmap-col">
                  {col.map((cell, ri) => (
                    <div key={ri} className="hp-heatmap-cell"
                      style={{ background: heatColor(cell.intensity) }}
                      title={cell.date.toLocaleDateString()}
                    />
                  ))}
                </div>
              ))}
            </div>
            <div className="hp-heatmap-legend">
              <span>Less</span>
              {[0,1,2,3].map(i => <div key={i} style={{ width:9, height:9, borderRadius:2, background:heatColor(i) }}/>)}
              <span>More</span>
            </div>
          </div>
        </div>

        {/* ── Topics Strip ── */}
        <div className="hp-topics-strip">
          <div className="hp-topics-label">📚 DSA Topics</div>
          <div className="hp-topics-scroll">
            {TOPICS.map(t => (
              <NavLink key={t.slug} to={`/topics/${t.slug}`} className="hp-topic-pill" style={{ color: t.color, borderColor: t.color + '30' }}>
                <span className="hp-topic-dot" style={{ background: t.color }}/>
                {t.label}
              </NavLink>
            ))}
          </div>
        </div>

        {/* ── Filters ── */}
        <div className="hp-filters">
          <select className="hp-select" value={filters.status} onChange={e => { setFilters({...filters,status:e.target.value}); setPage(1); }}>
            <option value="all">All Problems</option>
            <option value="solved">Solved</option>
            <option value="unsolved">Unsolved</option>
          </select>
          <select className="hp-select" value={filters.difficulty} onChange={e => { setFilters({...filters,difficulty:e.target.value}); setPage(1); }}>
            <option value="all">All Difficulties</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
          <select className="hp-select" value={filters.tag} onChange={e => { setFilters({...filters,tag:e.target.value}); setPage(1); }}>
            <option value="all">All Tags</option>
            {tags.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          {(filters.status !== 'all' || filters.difficulty !== 'all' || filters.tag !== 'all') && (
            <button className="hp-clear-btn" onClick={() => { setFilters({difficulty:'all',tag:'all',status:'all'}); setPage(1); }}>✕ Clear</button>
          )}
          <span className="hp-results-count">{filteredProblems.length} problems</span>
        </div>

        {/* ── Problem List ── */}
        <div className="hp-list">
          {pagedProblems.length === 0
            ? <div className="hp-empty">No problems match your filters.</div>
            : pagedProblems.map((problem, idx) => {
                const isSolved = safeSolvedIds.includes(String(problem._id));
                return (
                  <div key={problem._id} className={`hp-card ${isSolved ? 'solved' : ''} ${problem.difficulty}-hover`}
                    style={{ animationDelay: `${idx * 0.03}s` }}
                    onClick={() => navigate(`/problem/${problem._id}`)}
                  >
                    <div className="hp-card-left">
                      <span className="hp-idx">{(page-1)*PAGE_SIZE + idx + 1}</span>
                      {isSolved ? <span className="hp-check-dot" title="Solved"/> : <span className="hp-placeholder"/>}
                      <span className="hp-title">{problem.title}</span>
                    </div>
                    <div className="hp-card-right">
                      <span className={`hp-badge hp-${problem.difficulty}`}>{problem.difficulty}</span>
                      {problem.tags && <span className="hp-badge hp-tag">{problem.tags}</span>}
                      {isSolved && <span className="hp-solved-pill">✔ Solved</span>}
                    </div>
                  </div>
                );
              })
          }
        </div>

        {/* ── Pagination ── */}
        {totalPages > 1 && (
          <div className="hp-pagination">
            <button className="hp-page-btn" onClick={() => setPage(p => Math.max(1, p-1))} disabled={page === 1}>‹</button>
            {Array.from({ length: Math.min(7, totalPages) }, (_, i) => {
              let p;
              if (totalPages <= 7) p = i + 1;
              else if (page <= 4) p = i + 1;
              else if (page >= totalPages - 3) p = totalPages - 6 + i;
              else p = page - 3 + i;
              return (
                <button key={p} className={`hp-page-btn ${page === p ? 'active' : ''}`} onClick={() => setPage(p)}>{p}</button>
              );
            })}
            <button className="hp-page-btn" onClick={() => setPage(p => Math.min(totalPages, p+1))} disabled={page === totalPages}>›</button>
          </div>
        )}

      </div>
    </div>
  );
}
