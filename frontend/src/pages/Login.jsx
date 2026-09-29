import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, NavLink } from 'react-router';
import { loginUser } from '../authSlice';

const loginSchema = z.object({
  emailId: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap');
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

.auth-root {
  min-height: 100vh; background: #0d0e11;
  display: flex; font-family: 'Syne', sans-serif;
  color: #e8eaf0; position: relative; overflow: hidden;
}

.auth-bg {
  position: fixed; inset: 0; pointer-events: none; z-index: 0;
  background-image:
    linear-gradient(rgba(108,142,247,0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(108,142,247,0.03) 1px, transparent 1px);
  background-size: 48px 48px;
}
.auth-bg-glow {
  position: fixed; pointer-events: none; z-index: 0;
  width: 600px; height: 600px; border-radius: 50%;
  background: radial-gradient(circle, rgba(108,142,247,0.08) 0%, transparent 70%);
  top: -100px; left: -100px;
  animation: auth-drift 12s ease-in-out infinite alternate;
}
.auth-bg-glow2 {
  position: fixed; pointer-events: none; z-index: 0;
  width: 400px; height: 400px; border-radius: 50%;
  background: radial-gradient(circle, rgba(167,139,250,0.06) 0%, transparent 70%);
  bottom: -80px; right: -80px;
  animation: auth-drift 15s ease-in-out infinite alternate-reverse;
}
@keyframes auth-drift { from{transform:translate(0,0)} to{transform:translate(40px,40px)} }

.auth-left {
  flex: 1; display: flex; flex-direction: column; justify-content: center;
  padding: 60px 64px; position: relative; z-index: 1;
  border-right: 1px solid #1e2130;
}
@media (max-width: 768px) { .auth-left { display: none; } }

.auth-brand { font-size: 22px; font-weight: 800; letter-spacing: -.4px; color: #e8eaf0; margin-bottom: 56px; }
.auth-brand span { color: #6c8ef7; }

.auth-tagline { font-size: 36px; font-weight: 800; line-height: 1.2; letter-spacing: -.8px; margin-bottom: 20px; }
.auth-tagline span { color: #6c8ef7; }
.auth-desc { font-size: 14px; color: #4a4d60; line-height: 1.7; max-width: 380px; margin-bottom: 48px; }

.auth-features { display: grid; gap: 14px; }
.auth-feature {
  display: flex; align-items: center; gap: 12px;
  padding: 12px 16px; border-radius: 10px;
  border: 1px solid #1e2130; background: rgba(255,255,255,.02);
}
.auth-feature-icon {
  width: 32px; height: 32px; border-radius: 8px;
  background: rgba(108,142,247,.12); border: 1px solid rgba(108,142,247,.2);
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  font-size: 14px;
}
.auth-feature-text  { font-size: 12px; color: #8b8fa8; }
.auth-feature-title { font-size: 13px; font-weight: 600; color: #e8eaf0; margin-bottom: 2px; }

.auth-right {
  width: 480px; flex-shrink: 0;
  display: flex; flex-direction: column; justify-content: center;
  padding: 48px 48px; position: relative; z-index: 1;
  background: #0d0e11;
}
@media (max-width: 768px) { .auth-right { width: 100%; padding: 32px 24px; } }

.auth-card {
  background: #111318; border: 1px solid #2a2d3a;
  border-radius: 20px; padding: 36px 32px;
  box-shadow: 0 24px 64px rgba(0,0,0,.4);
  animation: auth-fadein .35s ease both;
}
@keyframes auth-fadein { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:none} }

.auth-card-header { margin-bottom: 28px; }
.auth-card-logo { font-size: 15px; font-weight: 800; color: #e8eaf0; margin-bottom: 16px; }
.auth-card-logo span { color: #6c8ef7; }
.auth-card-title { font-size: 22px; font-weight: 800; letter-spacing: -.4px; margin-bottom: 6px; }
.auth-card-sub { font-size: 12px; color: #4a4d60; font-family: 'JetBrains Mono', monospace; }

.auth-field { display: grid; gap: 6px; margin-bottom: 16px; }
.auth-label {
  font-size: 10px; font-weight: 700; font-family: 'JetBrains Mono', monospace;
  color: #4a4d60; text-transform: uppercase; letter-spacing: .7px;
}
.auth-input-wrap { position: relative; }
.auth-input {
  width: 100%; padding: 11px 14px; border-radius: 9px;
  border: 1px solid #2a2d3a; background: #0d0e11;
  color: #e8eaf0; font-size: 13px; font-family: 'Syne', sans-serif;
  outline: none; transition: border-color .15s, box-shadow .15s;
}
.auth-input:focus { border-color: #6c8ef7; box-shadow: 0 0 0 3px rgba(108,142,247,.12); }
.auth-input.err { border-color: #ef4444; }
.auth-input.err:focus { box-shadow: 0 0 0 3px rgba(239,68,68,.12); }
.auth-input-icon {
  position: absolute; left: 12px; top: 50%; transform: translateY(-50%);
  color: #4a4d60; pointer-events: none;
}
.auth-input.has-icon { padding-left: 36px; }
.auth-eye {
  position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
  background: none; border: none; cursor: pointer; color: #4a4d60;
  padding: 2px; transition: color .12s; line-height: 0;
}
.auth-eye:hover { color: #8b8fa8; }
.auth-input.has-eye { padding-right: 36px; }
.auth-err { font-size: 10px; color: #ef4444; font-family: 'JetBrains Mono', monospace; }

.auth-server-err {
  display: flex; align-items: center; gap: 8px;
  padding: 10px 14px; border-radius: 9px; margin-bottom: 16px;
  background: rgba(239,68,68,.08); border: 1px solid rgba(239,68,68,.25);
  font-size: 12px; color: #ef4444; font-family: 'JetBrains Mono', monospace;
  animation: auth-fadein .2s ease;
}

.auth-submit {
  width: 100%; padding: 12px; border-radius: 10px; margin-top: 8px;
  font-size: 13px; font-weight: 700; font-family: 'Syne', sans-serif;
  color: #fff; background: #6c8ef7; border: 1px solid #6c8ef7;
  cursor: pointer; transition: all .15s;
  display: flex; align-items: center; justify-content: center; gap: 8px;
}
.auth-submit:hover:not(:disabled) { background: #7c9cf8; box-shadow: 0 0 20px rgba(108,142,247,.3); }
.auth-submit:disabled { opacity: .55; cursor: not-allowed; }

.auth-spinner {
  width: 14px; height: 14px; border-radius: 50%;
  border: 2px solid rgba(255,255,255,.3); border-top-color: #fff;
  animation: auth-spin .6s linear infinite;
}
@keyframes auth-spin { to { transform: rotate(360deg); } }

.auth-footer { text-align: center; margin-top: 20px; font-size: 12px; color: #4a4d60; }
.auth-footer a { color: #6c8ef7; text-decoration: none; font-weight: 600; transition: color .12s; }
.auth-footer a:hover { color: #7c9cf8; }

.auth-meta { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
.auth-remember { display: flex; align-items: center; gap: 7px; font-size: 11px; color: #8b8fa8; cursor: pointer; }
.auth-checkbox {
  width: 14px; height: 14px; border-radius: 3px;
  border: 1px solid #2a2d3a; background: #0d0e11;
  accent-color: #6c8ef7; cursor: pointer;
}
.auth-forgot { font-size: 11px; color: #6c8ef7; text-decoration: none; transition: color .12s; }
.auth-forgot:hover { color: #7c9cf8; }

/* ── Toast ── */
.auth-toast {
  position: fixed; bottom: 28px; left: 50%; transform: translateX(-50%) translateY(0);
  z-index: 9999; display: flex; align-items: center; gap: 10px;
  padding: 12px 20px; border-radius: 12px; font-size: 13px; font-weight: 600;
  font-family: 'Syne', sans-serif; white-space: nowrap;
  box-shadow: 0 8px 32px rgba(0,0,0,.4);
  animation: toast-in .3s cubic-bezier(.34,1.56,.64,1) both;
}
.auth-toast.success { background: #111318; border: 1px solid rgba(34,197,94,.3); color: #22c55e; }
.auth-toast.error   { background: #111318; border: 1px solid rgba(239,68,68,.3);  color: #ef4444; }
.auth-toast.hide    { animation: toast-out .25s ease forwards; }
@keyframes toast-in  { from{opacity:0;transform:translateX(-50%) translateY(16px)} to{opacity:1;transform:translateX(-50%) translateY(0)} }
@keyframes toast-out { from{opacity:1;transform:translateX(-50%) translateY(0)} to{opacity:0;transform:translateX(-50%) translateY(16px)} }
`;

function Toast({ message, type, hide }) {
  return (
    <div className={`auth-toast ${type}${hide ? ' hide' : ''}`}>
      {type === 'success' ? (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.3"/>
          <path d="M5 8l2.5 2.5L11 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.3"/>
          <path d="M8 5v3.5M8 10.5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      )}
      {message}
    </div>
  );
}

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [toast,        setToast]        = useState(null);
  const [toastHide,    setToastHide]    = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((s) => s.auth);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const showToast = (message, type = 'success') => {
    setToastHide(false);
    setToast({ message, type });
    setTimeout(() => setToastHide(true), 2700);
    setTimeout(() => setToast(null), 3000);
  };

  const onSubmit = async (data) => {
    try {
      await dispatch(loginUser(data)).unwrap();
      showToast('Welcome back! Redirecting...', 'success');
      setTimeout(() => navigate('/'), 1200);
    } catch (err) {
      const msg = typeof err === 'string' ? err : err?.message || 'Invalid email or password.';
      showToast(msg, 'error');
    }
  };

  return (
    <>
      <style>{STYLES}</style>
      {toast && <Toast message={toast.message} type={toast.type} hide={toastHide} />}
      <div className="auth-root">
        <div className="auth-bg" />
        <div className="auth-bg-glow" />
        <div className="auth-bg-glow2" />

        {/* ── Left panel ── */}
        <div className="auth-left">
          <div className="auth-brand">Code<span>Blaze</span></div>
          <div className="auth-tagline">
            Back to the<br />
            <span>grind.</span> Let's go.
          </div>
          <p className="auth-desc">
            Your problems aren't going anywhere — but your skills are.
            Pick up where you left off and keep the streak alive.
          </p>
          <div className="auth-features">
            {[
              { icon: '⚡', title: 'Instant Code Execution',  text: 'Submit solutions and get test results in milliseconds.' },
              { icon: '📊', title: 'Visual Progress Tracking', text: 'See your solved count, accuracy, and difficulty spread.' },
              { icon: '🧠', title: 'Curated Problem Sets',     text: 'From two-pointers to dynamic programming — all organized.' },
            ].map(({ icon, title, text }) => (
              <div key={title} className="auth-feature">
                <div className="auth-feature-icon">{icon}</div>
                <div>
                  <div className="auth-feature-title">{title}</div>
                  <div className="auth-feature-text">{text}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right panel ── */}
        <div className="auth-right">
          <div className="auth-card">
            <div className="auth-card-header">
              <div className="auth-card-logo">Code<span>Blaze</span></div>
              <div className="auth-card-title">Welcome back</div>
              <div className="auth-card-sub">// pick up where you left off</div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
              {/* Email */}
              <div className="auth-field">
                <label className="auth-label">Email</label>
                <div className="auth-input-wrap">
                  <span className="auth-input-icon">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <rect x="1" y="3" width="12" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.2"/>
                      <path d="M1 4.5l6 4 6-4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                    </svg>
                  </span>
                  <input
                    {...register('emailId')}
                    type="email"
                    placeholder="you@example.com"
                    className={`auth-input has-icon ${errors.emailId ? 'err' : ''}`}
                  />
                </div>
                {errors.emailId && <span className="auth-err">{errors.emailId.message}</span>}
              </div>

              {/* Password */}
              <div className="auth-field">
                <label className="auth-label">Password</label>
                <div className="auth-input-wrap">
                  <span className="auth-input-icon">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <rect x="3" y="6" width="8" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.2"/>
                      <path d="M5 6V4.5a2 2 0 014 0V6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                    </svg>
                  </span>
                  <input
                    {...register('password')}
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    className={`auth-input has-icon has-eye ${errors.password ? 'err' : ''}`}
                  />
                  <button type="button" className="auth-eye" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword
                      ? <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 2l12 12M6.5 6.6A2 2 0 0010 10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/><path d="M4.2 4.3C2.8 5.2 1.8 6.5 1.5 8c.8 3 3.6 5 6.5 5 1.3 0 2.5-.4 3.5-1M7.5 3c.2 0 .3 0 .5 0 2.9 0 5.7 2 6.5 5-.3 1-.8 1.9-1.5 2.6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
                      : <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M1.5 8C2.3 5 5.1 3 8 3s5.7 2 6.5 5c-.8 3-3.6 5-6.5 5S2.3 11 1.5 8z" stroke="currentColor" strokeWidth="1.3"/><circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.3"/></svg>
                    }
                  </button>
                </div>
                {errors.password && <span className="auth-err">{errors.password.message}</span>}
              </div>

              {/* Remember + forgot */}
              <div className="auth-meta">
                <label className="auth-remember">
                  <input type="checkbox" className="auth-checkbox" />
                  Remember me
                </label>
                <a href="#" className="auth-forgot">Forgot password?</a>
              </div>

              <button type="submit" className="auth-submit" disabled={loading}>
                {loading
                  ? <><span className="auth-spinner" /> Signing in...</>
                  : 'Sign In →'
                }
              </button>
            </form>

            <div className="auth-footer">
              Don't have an account?{' '}
              <NavLink to="/signup">Create one free</NavLink>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
