import { useState } from 'react';
import { NavLink } from 'react-router';

/* ─── Topic Data ─────────────────────────────────────────────────────────── */
const TOPICS = [
  {
    slug: 'arrays',
    title: 'Arrays',
    icon: '▦',
    color: '#6c8ef7',
    bg: 'rgba(108,142,247,0.08)',
    border: 'rgba(108,142,247,0.25)',
    difficulty: 'Beginner',
    problems: 120,
    description: 'Contiguous memory blocks. Master traversal, sliding window, two pointers, and prefix sums.',
    tags: ['Traversal', 'Two Pointers', 'Sliding Window', 'Prefix Sum'],
  },
  {
    slug: 'strings',
    title: 'Strings',
    icon: '"A"',
    color: '#34d399',
    bg: 'rgba(52,211,153,0.08)',
    border: 'rgba(52,211,153,0.25)',
    difficulty: 'Beginner',
    problems: 95,
    description: 'Character arrays with pattern matching, anagrams, palindromes and KMP algorithm.',
    tags: ['Pattern Matching', 'KMP', 'Palindrome', 'Anagram'],
  },
  {
    slug: 'linked-list',
    title: 'Linked List',
    icon: '⬡→⬡',
    color: '#f59e0b',
    bg: 'rgba(245,158,11,0.08)',
    border: 'rgba(245,158,11,0.25)',
    difficulty: 'Beginner',
    problems: 75,
    description: 'Dynamic node chains. Covers singly, doubly, circular lists, reversal, and cycle detection.',
    tags: ['Reversal', 'Cycle Detection', 'Merge', 'Floyd\'s Algorithm'],
  },
  {
    slug: 'stack',
    title: 'Stack',
    icon: '⏍',
    color: '#f87171',
    bg: 'rgba(248,113,113,0.08)',
    border: 'rgba(248,113,113,0.25)',
    difficulty: 'Beginner',
    problems: 55,
    description: 'LIFO structure. Solve balanced parentheses, next greater element, and monotonic stack problems.',
    tags: ['LIFO', 'Monotonic Stack', 'Parentheses', 'NGE'],
  },
  {
    slug: 'queue',
    title: 'Queue',
    icon: '▷▷',
    color: '#a78bfa',
    bg: 'rgba(167,139,250,0.08)',
    border: 'rgba(167,139,250,0.25)',
    difficulty: 'Beginner',
    problems: 45,
    description: 'FIFO structure. Deque, circular queue, sliding window maximum, and BFS applications.',
    tags: ['FIFO', 'Deque', 'Circular Queue', 'BFS'],
  },
  {
    slug: 'trees',
    title: 'Trees',
    icon: '🌲',
    color: '#22c55e',
    bg: 'rgba(34,197,94,0.08)',
    border: 'rgba(34,197,94,0.25)',
    difficulty: 'Intermediate',
    problems: 110,
    description: 'Hierarchical structures. BST, AVL, traversals (inorder, preorder, postorder), LCA and diameter.',
    tags: ['BST', 'Traversal', 'LCA', 'Diameter'],
  },
  {
    slug: 'graphs',
    title: 'Graphs',
    icon: '◎',
    color: '#06b6d4',
    bg: 'rgba(6,182,212,0.08)',
    border: 'rgba(6,182,212,0.25)',
    difficulty: 'Advanced',
    problems: 130,
    description: 'Vertices and edges. BFS, DFS, Dijkstra, Bellman-Ford, topological sort, and MST algorithms.',
    tags: ['BFS', 'DFS', 'Dijkstra', 'Topological Sort'],
  },
  {
    slug: 'dynamic-programming',
    title: 'Dynamic Programming',
    icon: '◈',
    color: '#ec4899',
    bg: 'rgba(236,72,153,0.08)',
    border: 'rgba(236,72,153,0.25)',
    difficulty: 'Advanced',
    problems: 150,
    description: 'Optimal substructure + overlapping subproblems. Memoization, tabulation, LCS, knapsack, and more.',
    tags: ['Memoization', 'Tabulation', 'Knapsack', 'LCS'],
  },
  {
    slug: 'recursion',
    title: 'Recursion',
    icon: '↻',
    color: '#fb923c',
    bg: 'rgba(251,146,60,0.08)',
    border: 'rgba(251,146,60,0.25)',
    difficulty: 'Intermediate',
    problems: 60,
    description: 'Functions calling themselves. Base cases, backtracking, divide and conquer patterns.',
    tags: ['Backtracking', 'Divide & Conquer', 'Base Case', 'Call Stack'],
  },
  {
    slug: 'sorting',
    title: 'Sorting',
    icon: '↕',
    color: '#84cc16',
    bg: 'rgba(132,204,22,0.08)',
    border: 'rgba(132,204,22,0.25)',
    difficulty: 'Beginner',
    problems: 40,
    description: 'Bubble, selection, insertion, merge, quick, heap sort. Understand time complexity tradeoffs.',
    tags: ['Merge Sort', 'Quick Sort', 'Heap Sort', 'Counting Sort'],
  },
  {
    slug: 'binary-search',
    title: 'Binary Search',
    icon: '⌗',
    color: '#38bdf8',
    bg: 'rgba(56,189,248,0.08)',
    border: 'rgba(56,189,248,0.25)',
    difficulty: 'Intermediate',
    problems: 65,
    description: 'Divide sorted space in half. Search on answer, rotated arrays, and monotonic functions.',
    tags: ['Search on Answer', 'Rotated Array', 'Lower Bound', 'Upper Bound'],
  },
  {
    slug: 'hashing',
    title: 'Hashing',
    icon: '#',
    color: '#e879f9',
    bg: 'rgba(232,121,249,0.08)',
    border: 'rgba(232,121,249,0.25)',
    difficulty: 'Intermediate',
    problems: 70,
    description: 'Hash maps and sets for O(1) lookup. Frequency counting, two sum, group anagrams.',
    tags: ['HashMap', 'HashSet', 'Frequency Count', 'Collision'],
  },
  {
    slug: 'heap',
    title: 'Heap / Priority Queue',
    icon: '△',
    color: '#f97316',
    bg: 'rgba(249,115,22,0.08)',
    border: 'rgba(249,115,22,0.25)',
    difficulty: 'Intermediate',
    problems: 50,
    description: 'Min/max heap for O(log n) operations. K largest elements, median stream, task scheduling.',
    tags: ['Min Heap', 'Max Heap', 'K-th Largest', 'Median'],
  },
  {
    slug: 'bit-manipulation',
    title: 'Bit Manipulation',
    icon: '01',
    color: '#a3e635',
    bg: 'rgba(163,230,53,0.08)',
    border: 'rgba(163,230,53,0.25)',
    difficulty: 'Intermediate',
    problems: 45,
    description: 'AND, OR, XOR, shifts. Find single number, count set bits, power of two, subsets.',
    tags: ['XOR', 'AND/OR', 'Bit Shifts', 'Bitmask'],
  },
  {
    slug: 'oops',
    title: 'OOP Concepts',
    icon: '{ }',
    color: '#fb7185',
    bg: 'rgba(251,113,133,0.08)',
    border: 'rgba(251,113,133,0.25)',
    difficulty: 'Beginner',
    problems: 30,
    description: 'Encapsulation, inheritance, polymorphism, abstraction. Design patterns and SOLID principles.',
    tags: ['Inheritance', 'Polymorphism', 'Abstraction', 'SOLID'],
  },
  {
    slug: 'trie',
    title: 'Trie',
    icon: 'T',
    color: '#2dd4bf',
    bg: 'rgba(45,212,191,0.08)',
    border: 'rgba(45,212,191,0.25)',
    difficulty: 'Advanced',
    problems: 35,
    description: 'Prefix tree for string search. Autocomplete, word search, longest common prefix.',
    tags: ['Prefix Tree', 'Autocomplete', 'Word Search', 'Insert/Search'],
  },
];

const DIFFICULTY_ORDER = { Beginner: 0, Intermediate: 1, Advanced: 2 };
const DIFFICULTY_COLOR = {
  Beginner:     { color: '#22c55e', bg: 'rgba(34,197,94,0.1)',    border: 'rgba(34,197,94,0.25)'    },
  Intermediate: { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)',   border: 'rgba(245,158,11,0.25)'   },
  Advanced:     { color: '#ef4444', bg: 'rgba(239,68,68,0.1)',    border: 'rgba(239,68,68,0.25)'    },
};

/* ─── Styles ─────────────────────────────────────────────────────────────── */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&family=Syne:wght@400;600;700;800&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  
  .dt-root {
    min-height: 100vh; background: #0d0e11; color: #e8eaf0;
    font-family: 'Syne', sans-serif;
  }

  /* Nav */
  .dt-nav {
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 24px; height: 48px; background: #111318;
    border-bottom: 1px solid #2a2d3a; position: sticky; top: 0; z-index: 50;
  }
  .dt-nav-left { display: flex; align-items: center; gap: 12px; }
  .dt-back {
    display: flex; align-items: center; gap: 6px; padding: 5px 12px;
    border-radius: 7px; font-size: 12px; font-weight: 600;
    color: #5a5f78; border: 1px solid #2a2d3a; background: transparent;
    text-decoration: none; transition: all .15s;
  }
  .dt-back:hover { color: #e8eaf0; border-color: #3d4155; background: #1c1f28; }
  .dt-nav-title { font-size: 13px; font-weight: 700; color: #e8eaf0; }

  /* Hero */
  .dt-hero {
    max-width: 1000px; margin: 0 auto; padding: 48px 24px 32px;
    text-align: center; position: relative;
  }
  .dt-hero-eyebrow {
    font-size: 11px; font-weight: 700; font-family: 'JetBrains Mono', monospace;
    color: #6c8ef7; text-transform: uppercase; letter-spacing: 1.5px;
    margin-bottom: 14px; display: block;
  }
  .dt-hero-title {
    font-size: 38px; font-weight: 800; letter-spacing: -.8px; line-height: 1.15;
    margin-bottom: 16px;
  }
  .dt-hero-title span { color: #6c8ef7; }
  .dt-hero-desc {
    font-size: 14px; color: #4a4d60; line-height: 1.7;
    max-width: 520px; margin: 0 auto 32px;
  }

  /* Stats row */
  .dt-stats {
    display: flex; justify-content: center; gap: 20px; flex-wrap: wrap;
    margin-bottom: 40px;
  }
  .dt-stat {
    padding: 10px 20px; border-radius: 10px;
    border: 1px solid #2a2d3a; background: #111318;
    text-align: center;
  }
  .dt-stat-val { font-size: 20px; font-weight: 800; color: #e8eaf0; }
  .dt-stat-label { font-size: 9px; color: #4a4d60; text-transform: uppercase; letter-spacing: .8px; font-family: 'JetBrains Mono', monospace; margin-top: 2px; }

  /* Filters */
  .dt-filters {
    display: flex; align-items: center; gap: 8px; flex-wrap: wrap;
    max-width: 1000px; margin: 0 auto 28px; padding: 0 24px;
  }
  .dt-filter-btn {
    padding: 6px 14px; border-radius: 20px; cursor: pointer;
    font-size: 11px; font-weight: 600; font-family: 'Syne', sans-serif;
    border: 1px solid #2a2d3a; background: transparent; color: #5a5f78;
    transition: all .15s;
  }
  .dt-filter-btn:hover { color: #e8eaf0; border-color: #3d4155; background: #1c1f28; }
  .dt-filter-btn.active {
    color: #6c8ef7; background: rgba(108,142,247,0.12);
    border-color: rgba(108,142,247,0.35);
  }
  .dt-search {
    margin-left: auto; padding: 6px 12px; border-radius: 8px;
    border: 1px solid #2a2d3a; background: #111318;
    color: #e8eaf0; font-size: 12px; font-family: 'Syne', sans-serif;
    outline: none; width: 180px; transition: border-color .15s;
  }
  .dt-search:focus { border-color: #6c8ef7; }
  .dt-search::placeholder { color: #4a4d60; }

  /* Grid */
  .dt-grid {
    max-width: 1000px; margin: 0 auto; padding: 0 24px 60px;
    display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 16px;
  }

  /* Card */
  .dt-card {
    border-radius: 16px; border: 1px solid #2a2d3a; background: #111318;
    padding: 22px; text-decoration: none; color: inherit;
    transition: all .2s; display: block; position: relative; overflow: hidden;
    animation: dt-fadein .35s ease both;
  }
  @keyframes dt-fadein { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:none} }
  .dt-card:hover { border-color: var(--card-border); background: #13151d; transform: translateY(-2px); box-shadow: 0 8px 32px rgba(0,0,0,.3); }
  .dt-card::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
    background: var(--card-color); opacity: 0; transition: opacity .2s;
    border-radius: 16px 16px 0 0;
  }
  .dt-card:hover::before { opacity: 1; }

  .dt-card-top { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 14px; }

  .dt-card-icon {
    width: 44px; height: 44px; border-radius: 11px; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    font-size: 16px; font-weight: 800; font-family: 'JetBrains Mono', monospace;
    border: 1px solid var(--card-border);
    background: var(--card-bg); color: var(--card-color);
  }

  .dt-card-diff {
    font-size: 9px; font-weight: 700; font-family: 'JetBrains Mono', monospace;
    padding: 2px 8px; border-radius: 20px; border: 1px solid; text-transform: uppercase; letter-spacing: .4px;
  }

  .dt-card-title { font-size: 16px; font-weight: 800; margin-bottom: 8px; letter-spacing: -.3px; }
  .dt-card-desc { font-size: 12px; color: #5a5f78; line-height: 1.6; margin-bottom: 14px; }

  .dt-card-tags { display: flex; flex-wrap: wrap; gap: 5px; margin-bottom: 16px; }
  .dt-card-tag {
    font-size: 10px; font-family: 'JetBrains Mono', monospace;
    padding: 2px 8px; border-radius: 20px;
    background: #161820; border: 1px solid #2a2d3a; color: #4a4d60;
  }

  .dt-card-footer { display: flex; align-items: center; justify-content: space-between; }
  .dt-card-problems { font-size: 11px; font-family: 'JetBrains Mono', monospace; color: #4a4d60; }
  .dt-card-arrow {
    width: 28px; height: 28px; border-radius: 7px;
    border: 1px solid #2a2d3a; background: #161820;
    display: flex; align-items: center; justify-content: center;
    color: #4a4d60; transition: all .15s;
  }
  .dt-card:hover .dt-card-arrow { border-color: var(--card-border); color: var(--card-color); background: var(--card-bg); }

  /* Empty */
  .dt-empty { text-align: center; padding: 60px; color: #4a4d60; font-family: 'JetBrains Mono', monospace; font-size: 12px; grid-column: 1/-1; }
`;

export default function DSATopics() {
  const [filter, setFilter]   = useState('All');
  const [search, setSearch]   = useState('');

  const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced'];

  const filtered = TOPICS.filter(t => {
    const matchDiff   = filter === 'All' || t.difficulty === filter;
    const matchSearch = t.title.toLowerCase().includes(search.toLowerCase()) ||
                        t.description.toLowerCase().includes(search.toLowerCase());
    return matchDiff && matchSearch;
  });

  const totalProblems = TOPICS.reduce((s, t) => s + t.problems, 0);

  return (
    <>
      <style>{STYLES}</style>
      <div className="dt-root">

        {/* Nav */}
        <nav className="dt-nav">
          <div className="dt-nav-left">
            <NavLink to="/" className="dt-back">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M8 2L4 6l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              Back
            </NavLink>
            <span className="dt-nav-title">DSA Topics</span>
          </div>
        </nav>

        {/* Hero */}
        <div className="dt-hero">
          <span className="dt-hero-eyebrow">// learn · visualize · master</span>
          <h1 className="dt-hero-title">Explore <span>DSA Topics</span></h1>
          <p className="dt-hero-desc">
            Every topic explained with interactive visualizations, step-by-step animations,
            and curated examples. Build strong fundamentals from the ground up.
          </p>
          <div className="dt-stats">
            <div className="dt-stat">
              <div className="dt-stat-val">{TOPICS.length}</div>
              <div className="dt-stat-label">Topics</div>
            </div>
            <div className="dt-stat">
              <div className="dt-stat-val">{totalProblems}+</div>
              <div className="dt-stat-label">Problems</div>
            </div>
            <div className="dt-stat">
              <div className="dt-stat-val">{TOPICS.filter(t => t.difficulty === 'Beginner').length}</div>
              <div className="dt-stat-label">Beginner Topics</div>
            </div>
            <div className="dt-stat">
              <div className="dt-stat-val">{TOPICS.filter(t => t.difficulty === 'Advanced').length}</div>
              <div className="dt-stat-label">Advanced Topics</div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="dt-filters">
          {difficulties.map(d => (
            <button
              key={d}
              className={`dt-filter-btn ${filter === d ? 'active' : ''}`}
              onClick={() => setFilter(d)}
            >
              {d}
            </button>
          ))}
          <input
            className="dt-search"
            placeholder="Search topics..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {/* Grid */}
        <div className="dt-grid">
          {filtered.length === 0 ? (
            <div className="dt-empty">No topics match your search.</div>
          ) : (
            filtered.map((topic, i) => {
              const diff = DIFFICULTY_COLOR[topic.difficulty];
              return (
                <NavLink
                  key={topic.slug}
                  to={`/topics/${topic.slug}`}
                  className="dt-card"
                  style={{
                    '--card-color':  topic.color,
                    '--card-bg':     topic.bg,
                    '--card-border': topic.border,
                    animationDelay: `${i * 0.04}s`,
                  }}
                >
                  <div className="dt-card-top">
                    <div className="dt-card-icon">{topic.icon}</div>
                    <span
                      className="dt-card-diff"
                      style={{ color: diff.color, background: diff.bg, borderColor: diff.border }}
                    >
                      {topic.difficulty}
                    </span>
                  </div>

                  <div className="dt-card-title">{topic.title}</div>
                  <div className="dt-card-desc">{topic.description}</div>

                  <div className="dt-card-tags">
                    {topic.tags.map(tag => (
                      <span key={tag} className="dt-card-tag">{tag}</span>
                    ))}
                  </div>

                  <div className="dt-card-footer">
                    <span className="dt-card-problems">
                      {topic.problems}+ problems
                    </span>
                    <div className="dt-card-arrow">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M2.5 6h7M6.5 3l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                    </div>
                  </div>
                </NavLink>
              );
            })
          )}
        </div>

      </div>
    </>
  );
}
