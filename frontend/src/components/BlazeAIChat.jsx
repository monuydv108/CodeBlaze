import { useState, useRef, useEffect } from 'react';
import axiosClient from '../utils/axiosClient';

 const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&family=Syne:wght@400;600;700;800&display=swap');

  .blaze-chat {
    display: flex; flex-direction: column; height: 100%;
    font-family: 'Syne', sans-serif; overflow: hidden;
  }

  /* ── Header ── */
  .blaze-header {
    display: flex; align-items: center; gap: 12px;
    padding: 12px 14px; flex-shrink: 0;
    background: rgba(167,139,250,0.07);
    border: 1px solid rgba(167,139,250,0.2);
    border-radius: 12px; margin-bottom: 14px;
  }
  .blaze-logo {
    width: 36px; height: 36px; border-radius: 9px; flex-shrink: 0;
    background: rgba(167,139,250,0.18);
    border: 1px solid rgba(167,139,250,0.35);
    display: flex; align-items: center; justify-content: center;
    font-size: 16px;
  }
  .blaze-header-title { font-size: 13px; font-weight: 800; color: #a78bfa; }
  .blaze-header-sub {
    font-size: 10px; color: #4a4d60;
    font-family: 'JetBrains Mono', monospace; margin-top: 2px;
  }
  .blaze-header-badge {
    margin-left: auto; padding: 2px 8px; border-radius: 20px;
    font-size: 9px; font-weight: 700; font-family: 'JetBrains Mono', monospace;
    text-transform: uppercase; letter-spacing: .5px;
    background: rgba(167,139,250,0.12);
    border: 1px solid rgba(167,139,250,0.25);
    color: #a78bfa; flex-shrink: 0;
  }

  /* ── Messages ── */
  .blaze-messages {
    flex: 1; overflow-y: auto; display: flex; flex-direction: column;
    gap: 12px; padding-right: 2px;
    scrollbar-width: thin; scrollbar-color: #2a2d3a transparent;
  }
  .blaze-messages::-webkit-scrollbar { width: 4px; }
  .blaze-messages::-webkit-scrollbar-thumb { background: #2a2d3a; border-radius: 4px; }

  .blaze-msg { display: flex; flex-direction: column; gap: 3px; max-width: 88%; }
  .blaze-msg.model { align-self: flex-start; }
  .blaze-msg.user  { align-self: flex-end; }

  .blaze-msg-label {
    font-size: 10px; font-weight: 700; font-family: 'JetBrains Mono', monospace;
    text-transform: uppercase; letter-spacing: .5px; padding: 0 3px;
  }
  .blaze-msg.model .blaze-msg-label { color: #a78bfa; }
  .blaze-msg.user  .blaze-msg-label { color: #6c8ef7; text-align: right; }

  .blaze-msg-bubble {
    font-size: 12.5px; line-height: 1.7; border-radius: 11px;
    padding: 9px 13px; white-space: pre-wrap; word-break: break-word;
    color: #c4c7d8;
  }
  .blaze-msg.model .blaze-msg-bubble {
    background: rgba(167,139,250,0.1);
    border: 1px solid rgba(167,139,250,0.2);
    border-top-left-radius: 3px;
  }
  .blaze-msg.user .blaze-msg-bubble {
    background: rgba(108,142,247,0.12);
    border: 1px solid rgba(108,142,247,0.2);
    border-top-right-radius: 3px;
  }
  .blaze-msg.error .blaze-msg-bubble {
    background: rgba(239,68,68,0.08);
    border: 1px solid rgba(239,68,68,0.25);
    color: #ef4444;
    font-family: 'JetBrains Mono', monospace; font-size: 11px;
  }

  /* ── Typing indicator ── */
  .blaze-typing-wrap {
    display: flex; flex-direction: column; gap: 3px; align-self: flex-start;
  }
  .blaze-typing {
    display: flex; align-items: center; gap: 5px;
    padding: 10px 14px; border-radius: 11px; border-top-left-radius: 3px;
    background: rgba(167,139,250,0.1); border: 1px solid rgba(167,139,250,0.2);
    width: fit-content;
  }
  .blaze-typing-dot {
    width: 5px; height: 5px; border-radius: 50%; background: #a78bfa;
    animation: blaze-bounce .9s ease-in-out infinite;
  }
  .blaze-typing-dot:nth-child(2) { animation-delay: .15s; }
  .blaze-typing-dot:nth-child(3) { animation-delay: .30s; }
  @keyframes blaze-bounce {
    0%,60%,100%{transform:translateY(0);opacity:.35}
    30%{transform:translateY(-4px);opacity:1}
  }

  /* ── Suggestion chips ── */
  .blaze-suggestions {
    display: flex; flex-wrap: wrap; gap: 6px;
    margin: 8px 0 4px;
  }
  .blaze-chip {
    padding: 5px 11px; border-radius: 20px; cursor: pointer;
    font-size: 11px; font-family: 'JetBrains Mono', monospace;
    background: rgba(167,139,250,0.08);
    border: 1px solid rgba(167,139,250,0.2);
    color: #8b8fa8; transition: all .15s;
    white-space: nowrap;
  }
  .blaze-chip:hover { background: rgba(167,139,250,0.18); color: #a78bfa; border-color: rgba(167,139,250,0.4); }

  /* ── Input area ── */
  .blaze-input-area {
    margin-top: 12px; flex-shrink: 0;
    border-top: 1px solid #1e2130; padding-top: 12px;
  }
  .blaze-input-row { display: flex; gap: 8px; align-items: flex-end; }

  .blaze-input {
    flex: 1; padding: 10px 13px; border-radius: 10px;
    border: 1px solid #2a2d3a; background: #161820;
    color: #e8eaf0; font-size: 13px; font-family: 'Syne', sans-serif;
    outline: none; transition: border-color .15s, box-shadow .15s;
    resize: none; min-height: 42px; max-height: 120px;
    line-height: 1.5; overflow-y: auto;
  }
  .blaze-input:focus { border-color: #a78bfa; box-shadow: 0 0 0 3px rgba(167,139,250,0.1); }
  .blaze-input::placeholder { color: #4a4d60; }
  .blaze-input:disabled { opacity: .5; cursor: not-allowed; }

  .blaze-send {
    width: 42px; height: 42px; border-radius: 10px; flex-shrink: 0;
    border: 1px solid rgba(167,139,250,0.35);
    background: rgba(167,139,250,0.12);
    color: #a78bfa; cursor: pointer; transition: all .15s;
    display: flex; align-items: center; justify-content: center;
  }
  .blaze-send:hover:not(:disabled) {
    background: rgba(167,139,250,0.22);
    border-color: #a78bfa;
    box-shadow: 0 0 12px rgba(167,139,250,0.25);
  }
  .blaze-send:disabled { opacity: .35; cursor: not-allowed; }

  .blaze-hint {
    font-size: 10px; font-family: 'JetBrains Mono', monospace;
    color: #2a2d3a; margin-top: 6px; text-align: right;
  }
`;

const SUGGESTIONS = [
  'Explain the approach',
  'What data structure to use?',
  'Help me debug my code',
  'Time & space complexity?',
];

export default function BlazeAIChat({ problem, code, language }) {
  const [messages, setMessages] = useState([
    {
      role: 'model',
      parts: [{ text: `Hey! I'm BlazeAI ⚡\n\nI can help you with:\n• Approaching "${problem?.title ?? 'this problem'}"\n• Explaining DSA concepts\n• Debugging your code\n• Time & space complexity\n\nWhat do you need help with?` }],
    },
  ]);
  const [input,   setInput]   = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef  = useRef(null);
  const textareaRef = useRef(null);

  // Auto scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Auto-resize textarea
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = 'auto';
    ta.style.height = Math.min(ta.scrollHeight, 120) + 'px';
  }, [input]);

  /* ── Send message ── */
  const sendMessage = async (overrideText) => {
    const text = (overrideText ?? input).trim();
    if (!text || loading) return;

    setInput('');

    // Build user message
    const userMsg = { role: 'user', parts: [{ text }] };

    // Include code context in the sent text if available
    const textWithCode = code?.trim()
      ? `${text}\n\n[My current ${language} code]\n\`\`\`${language}\n${code}\n\`\`\``
      : text;

    const msgWithCode = { role: 'user', parts: [{ text: textWithCode }] };

    // Update UI immediately
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      // Send full history + new message to backend
      const historyToSend = [
        ...messages,
        msgWithCode, // last message includes code context
      ];

      const { data } = await axiosClient.post('/ai/chat', {
        messages:    historyToSend,
        title:       problem?.title,
        description: problem?.description,
        testCases:   problem?.visibleTestCases,
        startCode:   problem?.startCode,
      });

      setMessages(prev => [...prev, {
        role: 'model',
        parts: [{ text: data.message }],
      }]);

    } catch (err) {
      const errMsg = err.response?.data?.message || err.message || 'Failed to reach BlazeAI';
      console.error('[BlazeAI] Error:', errMsg);
      setMessages(prev => [...prev, {
        role: 'error',
        parts: [{ text: `⚠ ${errMsg}` }],
      }]);
    } finally {
      setLoading(false);
    }
  };

  // Enter to send, Shift+Enter for newline
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const showSuggestions = messages.length === 1 && !loading;

  return (
    <>
      <style>{STYLES}</style>
      <div className="blaze-chat">

        {/* Header */}
        <div className="blaze-header">
          <div className="blaze-logo">⚡</div>
          <div>
            <div className="blaze-header-title">BlazeAI</div>
            <div className="blaze-header-sub">// DSA co-pilot · Gemini</div>
          </div>
          <span className="blaze-header-badge">AI</span>
        </div>

        {/* Messages */}
        <div className="blaze-messages">
          {messages.map((msg, i) => (
            <div key={i} className={`blaze-msg ${msg.role}`}>
              <span className="blaze-msg-label">
                {msg.role === 'user' ? 'You' : msg.role === 'error' ? '⚠ Error' : 'BlazeAI'}
              </span>
              <div className="blaze-msg-bubble">{msg.parts[0].text}</div>
            </div>
          ))}

          {/* Typing indicator */}
          {loading && (
            <div className="blaze-typing-wrap">
              <span className="blaze-msg-label" style={{ color: '#a78bfa', fontSize: 10, fontFamily: 'JetBrains Mono, monospace', textTransform: 'uppercase', letterSpacing: '.5px' }}>
                BlazeAI
              </span>
              <div className="blaze-typing">
                <div className="blaze-typing-dot" />
                <div className="blaze-typing-dot" />
                <div className="blaze-typing-dot" />
              </div>
            </div>
          )}

          {/* Suggestion chips */}
          {showSuggestions && (
            <div className="blaze-suggestions">
              {SUGGESTIONS.map((s) => (
                <button key={s} className="blaze-chip" onClick={() => sendMessage(s)}>
                  {s}
                </button>
              ))}
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="blaze-input-area">
          <div className="blaze-input-row">
            <textarea
              ref={textareaRef}
              className="blaze-input"
              placeholder="Ask about this problem, algorithms, complexity... (Enter to send)"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
              rows={1}
            />
            <button
              className="blaze-send"
              onClick={() => sendMessage()}
              disabled={loading || !input.trim()}
              title="Send (Enter)"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M2 8h12M10 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
          <div className="blaze-hint">Enter ↵ to send · Shift+Enter for newline</div>
        </div>

      </div>
    </>
  );
}
