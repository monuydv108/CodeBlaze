import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, NavLink } from 'react-router';
import { registerUser } from '../authSlice';

const signupSchema = z.object({
  firstName: z.string().min(3, 'Minimum 3 characters required'),
  emailId:   z.string().email('Invalid email address'),
  password:  z.string().min(8, 'Password must be at least 8 characters'),
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
  background: radial-gradient(circle, rgba(167,139,250,0.07) 0%, transparent 70%);
  bottom: -100px; right: -100px;
  animation: auth-drift 14s ease-in-out infinite alternate;
}
.auth-bg-glow2 {
  position: fixed; pointer-events: none; z-index: 0;
  width: 400px; height: 400px; border-radius: 50%;
  background: radial-gradient(circle, rgba(108,142,247,0.06) 0%, transparent 70%);
  top: -60px; left: -60px;
  animation: auth-drift 18s ease-in-out infinite alternate-reverse;
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

.auth-tagline { font-size: 34px; font-weight: 800; line-height: 1.2; letter-spacing: -.8px; margin-bottom: 20px; }
.auth-tagline span { color: #6c8ef7; }
.auth-desc { font-size: 14px; color: #4a4d60; line-height: 1.7; max-width: 380px; margin-bottom: 48px; }

.auth-steps { display: grid; gap: 0; }
.auth-step {
  display: flex; align-items: flex-start; gap: 16px;
  padding: 16px 0; position: relative;
}
.auth-step:not(:last-child)::after {
  content: ''; position: absolute; left: 15px; top: 44px;
  width: 1px; height: calc(100% - 28px); background: #1e2130;
}
.auth-step-num {
  width: 30px; height: 30px; border-radius: 50%; flex-shrink: 0;
  background: rgba(108,142,247,.12); border: 1px solid rgba(108,142,247,.25);
  color: #6c8ef7; font-size: 11px; font-weight: 800; font-family: 'JetBrains Mono', monospace;
  display: flex; align-items: center; justify-content: center;
}
.auth-step-title { font-size: 13px; font-weight: 600; color: #e8eaf0; margin-bottom: 3px; }
.auth-step-text  { font-size: 12px; color: #4a4d60; line-height: 1.5; }

.auth-right {
  width: 480px; flex-shrink: 0; display: flex; flex-direction: column;
  justify-content: center; padding: 48px 48px; position: relative; z-index: 1;
  background: #0d0e11;
}
@media (max-width: 768px) { .auth-right { width: 100%; padding: 32px 24px; } }

.auth-card {
  background: #111318; border: 1px solid #2a2d3a; border-radius: 20px; padding: 36px 32px;
  box-shadow: 0 24px 64px rgba(0,0,0,.4);
  animation: auth-fadein .35s ease both;
}
@keyframes auth-fadein { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:none} }

.auth-card-header { margin-bottom: 24px; }
.auth-card-logo { font-size: 15px; font-weight: 800; color: #e8eaf0; margin-bottom: 14px; }
.auth-card-logo span { color: #6c8ef7; }
.auth-card-title { font-size: 22px; font-weight: 800; letter-spacing: -.4px; margin-bottom: 6px; }
.auth-card-sub { font-size: 12px; color: #4a4d60; font-family: 'JetBrains Mono', monospace; }

.auth-field { display: grid; gap: 6px; margin-bottom: 14px; }
.auth-label { font-size: 10px; font-weight: 700; font-family: 'JetBrains Mono', monospace; color: #4a4d60; text-transform: uppercase; letter-spacing: .7px; }
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
.auth-input-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: #4a4d60; pointer-events: none; }
.auth-input.has-icon { padding-left: 36px; }
.auth-eye {
  position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
  background: none; border: none; cursor: pointer; color: #4a4d60;
  padding: 2px; transition: color .12s; line-height: 0;
}
.auth-eye:hover { color: #8b8fa8; }
.auth-input.has-eye { padding-right: 36px; }
.auth-err { font-size: 10px; color: #ef4444; font-family: 'JetBrains Mono', monospace; }

.auth-strength-bars { display: flex; gap: 4px; margin-top: 8px; }
.auth-strength-bar { height: 3px; flex: 1; border-radius: 99px; background: #1e2130; transition: background .3s; }
.auth-strength-row { display: flex; align-items: center; justify-content: space-between; margin-top: 4px; }
.auth-strength-hint { font-size: 9px; font-family: 'JetBrains Mono', monospace; }

.auth-terms { display: flex; align-items: flex-start; gap: 8px; margin: 14px 0; font-size: 11px; color: #4a4d60; }
.auth-checkbox { width: 14px; height: 14px; border-radius: 3px; border: 1px solid #2a2d3a; background: #0d0e11; accent-color: #6c8ef7; cursor: pointer; margin-top: 1px; flex-shrink: 0; }
.auth-terms a { color: #6c8ef7; text-decoration: none; }

.auth-server-err {
  display: flex; align-items: center; gap: 8px;
  padding: 10px 14px; border-radius: 9px; margin-bottom: 14px;
  background: rgba(239,68,68,.08); border: 1px solid rgba(239,68,68,.25);
  font-size: 12px; color: #ef4444; font-family: 'JetBrains Mono', monospace;
  animation: auth-fadein .2s ease;
}

.auth-submit {
  width: 100%; padding: 12px; border-radius: 10px;
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

function getStrength(pw) {
  if (!pw) return { score: 0, label: '', color: '' };
  let score = 0;
  if (pw.length >= 8)  score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if (score <= 1) return { score: 1, label: 'Weak',   color: '#ef4444' };
  if (score <= 2) return { score: 2, label: 'Fair',   color: '#f59e0b' };
  if (score <= 3) return { score: 3, label: 'Good',   color: '#6c8ef7' };
  return              { score: 4, label: 'Strong', color: '#22c55e' };
}

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

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [pwValue,      setPwValue]      = useState('');
  const [toast,        setToast]        = useState(null);
  const [toastHide,    setToastHide]    = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((s) => s.auth);

  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    resolver: zodResolver(signupSchema),
  });

  const watchedPw = watch('password', '');
  useEffect(() => { setPwValue(watchedPw || ''); }, [watchedPw]);

  const showToast = (message, type = 'success') => {
    setToastHide(false);
    setToast({ message, type });
    setTimeout(() => setToastHide(true), 2700);
    setTimeout(() => setToast(null), 3000);
  };

  const onSubmit = async (data) => {
    try {
      await dispatch(registerUser(data)).unwrap();
      showToast('Account created! Welcome to CodeBlaze 🚀', 'success');
      setTimeout(() => navigate('/'), 1200);
    } catch (err) {
      const msg = typeof err === 'string' ? err : err?.message || 'Something went wrong. Please try again.';
      showToast(msg, 'error');
    }
  };

  const strength = getStrength(pwValue);
  const bars     = [1, 2, 3, 4];

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
            Your DSA grind<br />
            starts <span>here.</span>
          </div>
          <p className="auth-desc">
            Join thousands of developers sharpening their problem-solving skills.
            Solve real interview problems, get instant feedback, and level up — one challenge at a time.
          </p>
          <div className="auth-steps">
            {[
              { n: '01', title: 'Create your free account',  text: 'No credit card. No friction. Just code.' },
              { n: '02', title: 'Pick a problem to crack',   text: 'Filter by topic, tag, or difficulty — arrays to graphs.' },
              { n: '03', title: 'Write, run, and iterate',   text: 'Instant feedback on your solution with test results.' },
              { n: '04', title: 'Watch your streak grow',    text: 'Daily targets, solved counts, and accuracy at a glance.' },
            ].map(({ n, title, text }) => (
              <div key={n} className="auth-step">
                <div className="auth-step-num">{n}</div>
                <div>
                  <div className="auth-step-title">{title}</div>
                  <div className="auth-step-text">{text}</div>
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
              <div className="auth-card-title">Create account</div>
              <div className="auth-card-sub">// ready to blaze through problems?</div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
              {/* First Name */}
              <div className="auth-field">
                <label className="auth-label">First Name</label>
                <div className="auth-input-wrap">
                  <span className="auth-input-icon">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <circle cx="7" cy="4.5" r="2.5" stroke="currentColor" strokeWidth="1.2"/>
                      <path d="M2 12c0-2.8 2.2-4.5 5-4.5s5 1.7 5 4.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                    </svg>
                  </span>
                  <input
                    {...register('firstName')}
                    type="text"
                    placeholder="John"
                    className={`auth-input has-icon ${errors.firstName ? 'err' : ''}`}
                  />
                </div>
                {errors.firstName && <span className="auth-err">{errors.firstName.message}</span>}
              </div>

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

              {/* Password + strength meter */}
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
                    placeholder="Min. 8 characters"
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

                {pwValue.length > 0 && (
                  <>
                    <div className="auth-strength-bars">
                      {bars.map((b) => (
                        <div
                          key={b}
                          className="auth-strength-bar"
                          style={{ background: b <= strength.score ? strength.color : '#1e2130' }}
                        />
                      ))}
                    </div>
                    <div className="auth-strength-row">
                      <span className="auth-strength-hint" style={{ color: '#4a4d60' }}>
                        Mix uppercase, numbers & symbols
                      </span>
                      <span className="auth-strength-hint" style={{ color: strength.color, fontWeight: 700 }}>
                        {strength.label}
                      </span>
                    </div>
                  </>
                )}
              </div>

              {/* Terms */}
              <label className="auth-terms">
                <input type="checkbox" className="auth-checkbox" required />
                I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>
              </label>

              <button type="submit" className="auth-submit" disabled={loading}>
                {loading
                  ? <><span className="auth-spinner" /> Creating account...</>
                  : 'Create Account →'
                }
              </button>
            </form>

            <div className="auth-footer">
              Already have an account?{' '}
              <NavLink to="/login">Sign in</NavLink>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
