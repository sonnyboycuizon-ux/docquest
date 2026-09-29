import { useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const logoImage = '/cc.png'

const css = `
  html, body, #root {
    width: 100% !important;
    max-width: 100% !important;
    margin: 0 !important;
    padding: 0 !important;
  }

  .dq-login {
    --primary: #000435;
    --primary-2: #0a1050;
    --secondary: #2563EB;
    --secondary-2: #1D4ED8;
    --accent: #F4B400;
    --accent-2: #FFC61A;
    --bg: #F8FAFC;
    --text: #1E293B;
    --muted: #64748B;
    --border: #E2E8F0;
    --input-border: #94A3B8;
    --error: #DC2626;
    --success: #16A34A;
    --ease: cubic-bezier(.22, 1, .36, 1);

    position: relative;
    width: 100%;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 32px 20px;
    background: var(--bg);
    font-family: 'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
    color: var(--text);
    overflow: hidden;
  }
  .dq-login *, .dq-login *::before, .dq-login *::after { box-sizing: border-box; }
  .dq-login :where(h1, h2, p) { margin: 0; }

  .dq-login-blob {
    position: absolute;
    border-radius: 50%;
    filter: blur(80px);
    opacity: .38;
    pointer-events: none;
    animation: dq-drift 22s ease-in-out infinite;
  }
  .dq-login-blob-1 { width: 360px; height: 360px; background: #93C5FD; top: -100px; left: -100px; }
  .dq-login-blob-2 { width: 320px; height: 320px; background: #FEF08A; bottom: -80px; right: -80px; animation-direction: reverse; animation-duration: 26s; }

  @keyframes dq-drift {
    0%, 100% { transform: translate(0, 0) scale(1); }
    33%      { transform: translate(40px, 25px) scale(1.08); }
    66%      { transform: translate(-25px, 40px) scale(.95); }
  }
  @keyframes dq-sweep { from { transform: translateX(-120%) skewX(-20deg); } to { transform: translateX(320%) skewX(-20deg); } }
  @keyframes dq-pop { from { opacity: 0; transform: scale(.94) translateY(10px); } to { opacity: 1; transform: none; } }
  @keyframes dq-spin { to { transform: rotate(360deg); } }
  @keyframes dq-flow { 0% { background-position: 0% 50%; } 100% { background-position: 200% 50%; } }
  @keyframes dq-ring { 0% { box-shadow: 0 0 0 0 rgba(244, 180, 0, .55); } 100% { box-shadow: 0 0 0 14px rgba(244, 180, 0, 0); } }

  .dq-login-wrap {
    position: relative;
    z-index: 1;
    width: 100%;
    max-width: 440px;
    animation: dq-pop .55s var(--ease);
  }

  .dq-login-card {
    background: #fff;
    border-radius: 24px;
    border: 1px solid rgba(255, 255, 255, .7);
    box-shadow: 0 30px 70px rgba(0, 4, 53, .15), 0 10px 25px rgba(0, 4, 53, .08);
    overflow: hidden;
  }
  .dq-login-top {
    height: 6px;
    background: linear-gradient(90deg, var(--primary), var(--secondary), var(--accent), var(--secondary), var(--primary));
    background-size: 200% 100%;
    animation: dq-flow 8s linear infinite;
  }
  .dq-login-head { text-align: center; padding: 36px 32px 20px; }
  .dq-login-logo {
    width: 72px;
    height: 72px;
    margin: 0 auto 18px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, var(--primary), var(--primary-2));
    color: var(--accent);
    font-size: 30px;
    font-weight: 800;
    overflow: hidden;
    border: 4px solid #fff;
    box-shadow: 0 10px 30px rgba(0, 4, 53, .28);
    animation: dq-ring 2.5s ease-out infinite;
  }
  .dq-login-logo img { width: 100%; height: 100%; object-fit: cover; background: #fff; }
  .dq-login-head h2 {
    color: var(--primary);
    font-size: 27px;
    font-weight: 800;
    letter-spacing: -.5px;
    margin-bottom: 8px;
  }
  .dq-login-head p { color: var(--muted); font-size: 14.5px; line-height: 1.65; max-width: 34ch; margin: 0 auto; }
  .dq-login-body { padding: 12px 32px 32px; }

  .dq-alert {
    display: flex;
    gap: 12px;
    align-items: flex-start;
    margin-bottom: 20px;
    padding: 14px;
    border-radius: 12px;
    font-size: 14px;
    line-height: 1.5;
  }
  .dq-alert-icon { flex-shrink: 0; margin-top: 1px; }
  .dq-alert strong { display: block; margin-bottom: 3px; font-weight: 700; }
  .dq-alert-success { background: #DCFCE7; border: 1px solid #BBF7D0; color: #166534; }
  .dq-alert-error { background: #FEF2F2; border: 1px solid #FECACA; color: #991B1B; word-break: break-word; }

  .dq-hint {
    display: flex;
    gap: 10px;
    align-items: flex-start;
    margin-bottom: 22px;
    padding: 13px 15px;
    border-radius: 12px;
    background: linear-gradient(135deg, #FFFBEB, #FEF9C3);
    border: 1px solid #FDE68A;
    border-left: 4px solid var(--accent);
    color: #78560B;
    font-size: 13px;
    line-height: 1.55;
    box-shadow: 0 2px 8px rgba(244, 180, 0, .08);
  }
  .dq-hint svg { flex-shrink: 0; margin-top: 1px; }

  .dq-field { position: relative; margin-bottom: 22px; }

  .dq-input {
    width: 100%;
    height: 56px;
    padding: 0 14px;
    border: 1.5px solid var(--input-border);
    border-radius: 10px;
    background: #fff;
    color: var(--text);
    font-size: 16px;
    font-family: inherit;
    outline: none;
    transition: border-color .15s ease, box-shadow .15s ease, background .15s ease;
  }
  .dq-input:hover:not(:disabled) { border-color: var(--text); }
  .dq-input:focus {
    border-color: var(--secondary);
    box-shadow: 0 0 0 3px rgba(37, 99, 235, .12);
    background: #FAFBFF;
  }
  .dq-input:disabled { background: #F1F5F9; cursor: not-allowed; }

  .dq-label {
    position: absolute;
    left: 12px;
    top: 28px;
    padding: 0 6px;
    transform: translateY(-50%);
    background: #fff;
    color: var(--muted);
    font-size: 16px;
    line-height: 1;
    pointer-events: none;
    transition: top .15s ease, font-size .15s ease, color .15s ease;
  }

  .dq-input:focus + .dq-label,
  .dq-input:not(:placeholder-shown) + .dq-label,
  .dq-input:-webkit-autofill + .dq-label {
    top: 0;
    font-size: 12px;
    font-weight: 600;
  }
  .dq-input:focus + .dq-label { color: var(--secondary); }

  .dq-input.is-invalid { border-color: var(--error); }
  .dq-input.is-invalid:focus { box-shadow: 0 0 0 3px rgba(220, 38, 38, .12); background: #FFFBFB; }
  .dq-input.is-invalid + .dq-label { color: var(--error); }

  .dq-submit {
    width: 100%;
    height: 52px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    border: none;
    border-radius: 12px;
    background: linear-gradient(135deg, var(--primary), var(--primary-2));
    color: #fff;
    font-size: 15px;
    font-weight: 700;
    font-family: inherit;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    box-shadow: 0 10px 25px rgba(0, 4, 53, .28);
    transition: transform .15s ease, box-shadow .15s ease;
  }
  .dq-submit:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 14px 32px rgba(0, 4, 53, .35);
  }
  .dq-submit:active:not(:disabled) { transform: translateY(0); }
  .dq-submit:focus-visible { outline: 3px solid rgba(37, 99, 235, .45); outline-offset: 3px; }
  .dq-submit:disabled { background: #94A3B8; box-shadow: none; cursor: not-allowed; transform: none; }
  .dq-submit::after {
    content: ''; position: absolute; top: 0; left: 0; width: 40%; height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, .18), transparent);
    animation: dq-sweep 3.5s ease-in-out 1.2s infinite;
  }

  .dq-spinner {
    width: 18px;
    height: 18px;
    border-radius: 50%;
    border: 2.5px solid rgba(255, 255, 255, .4);
    border-top-color: #fff;
    animation: dq-spin .7s linear infinite;
  }

  .dq-divider {
    display: flex;
    align-items: center;
    gap: 12px;
    margin: 26px 0 18px;
    color: #94A3B8;
    font-size: 12.5px;
    font-weight: 500;
  }
  .dq-divider::before,
  .dq-divider::after {
    content: '';
    flex: 1;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--border), transparent);
  }

  .dq-back-btn {
    width: 100%;
    height: 52px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    border: 1.5px solid var(--border);
    border-radius: 12px;
    background: #fff;
    color: var(--primary);
    font-size: 15px;
    font-weight: 700;
    font-family: inherit;
    text-decoration: none;
    transition: background .15s ease, border-color .15s ease, transform .15s ease, box-shadow .15s ease;
  }
  .dq-back-btn:hover {
    background: #F8FAFC;
    border-color: var(--primary);
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(0, 4, 53, .08);
  }
  .dq-back-btn:active { transform: translateY(0); }
  .dq-back-btn:focus-visible { outline: 3px solid rgba(37, 99, 235, .45); outline-offset: 3px; }

  .dq-back-icon {
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--primary), var(--primary-2));
    color: var(--accent);
    flex-shrink: 0;
    transition: transform .15s ease;
  }
  .dq-back-btn:hover .dq-back-icon { transform: translateX(-3px); }

  .dq-brand-foot {
    margin-top: 22px;
    text-align: center;
    color: #94A3B8;
    font-size: 12px;
    line-height: 1.65;
  }
  .dq-brand-foot strong { color: var(--primary); font-weight: 700; }

  @media (max-width: 480px) {
    .dq-login { padding: 20px 14px; align-items: flex-start; }
    .dq-login-wrap { margin-top: 10px; }
    .dq-login-card { border-radius: 20px; }
    .dq-login-head { padding: 30px 22px 16px; }
    .dq-login-logo { width: 64px; height: 64px; font-size: 26px; }
    .dq-login-body { padding: 8px 22px 26px; }
    .dq-login-head h2 { font-size: 24px; }
  }

  @media (prefers-reduced-motion: reduce) {
    .dq-login *, .dq-login *::before, .dq-login *::after { transition: none !important; animation: none !important; }
  }
`

const CheckCircleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="10" />
    <path d="m8 12 3 3 5-6" />
  </svg>
)

const AlertIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 8v4M12 16h.01" />
  </svg>
)

const InfoIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M22 13V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    <path d="m16 19 2 2 4-4" />
  </svg>
)

const ArrowLeftIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M19 12H5M12 19l-7-7 7-7" />
  </svg>
)

function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [logoFailed, setLogoFailed] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    setMessage('')
    setError('')

    const cleanEmail = email.trim().toLowerCase()

    if (!cleanEmail) {
      setError('Please enter your email address.')
      return
    }

    setLoading(true)

    try {
      console.log(
        'Sending password reset email to:',
        cleanEmail
      )

      const { data, error: resetError } =
        await supabase.auth.resetPasswordForEmail(
          cleanEmail,
          {
            redirectTo: `${window.location.origin}/reset-password`,
          }
        )

      console.log(
        'Password reset response:',
        data
      )

      console.log(
        'Password reset error:',
        resetError
      )

      if (resetError) {
        console.error(
          'Supabase password reset error:',
          resetError
        )

        const errorMessage =
          resetError.message ||
          resetError.error_description ||
          resetError.msg ||
          JSON.stringify(resetError)

        throw new Error(
          errorMessage ||
            'Supabase failed to send the password reset email.'
        )
      }

      setMessage(
        'Password reset link sent successfully. Please check your Gmail inbox and spam folder.'
      )

      setEmail('')
    } catch (err) {
      console.error(
        'Forgot password error:',
        err
      )

      let errorMessage =
        err?.message

      if (
        !errorMessage &&
        typeof err === 'object'
      ) {
        errorMessage = JSON.stringify(
          err,
          Object.getOwnPropertyNames(err)
        )
      }

      setError(
        errorMessage ||
          'Unable to send password reset email. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="dq-login">
      <style>{css}</style>

      <div className="dq-login-blob dq-login-blob-1" />
      <div className="dq-login-blob dq-login-blob-2" />

      <div className="dq-login-wrap">
        <div className="dq-login-card">
          <div className="dq-login-top" />

          <div className="dq-login-head">
            <div className="dq-login-logo">
              {logoFailed ? (
                'D'
              ) : (
                <img
                  src={logoImage}
                  alt="Consolatrix College Logo"
                  onError={() => setLogoFailed(true)}
                />
              )}
            </div>

            <h2>Reset Password</h2>
            <p>
              Enter your registered email address and we'll
              send you a password reset link.
            </p>
          </div>

          <div className="dq-login-body">
            {message && (
              <div className="dq-alert dq-alert-success" role="alert">
                <span className="dq-alert-icon"><CheckCircleIcon /></span>
                <div>
                  <strong>Email Sent</strong>
                  {message}
                </div>
              </div>
            )}

            {error && (
              <div className="dq-alert dq-alert-error" role="alert">
                <span className="dq-alert-icon"><AlertIcon /></span>
                <div>
                  <strong>Reset Failed</strong>
                  {error}
                </div>
              </div>
            )}

            <div className="dq-hint">
              <InfoIcon />
              <span>Use the same Gmail address you registered with. Check your spam folder if you don't see the email.</span>
            </div>

            <form onSubmit={handleSubmit} noValidate>
              <div className="dq-field">
                <input
                  id="email"
                  type="email"
                  className={`dq-input${error ? ' is-invalid' : ''}`}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder=" "
                  autoComplete="email"
                  required
                  disabled={loading}
                  aria-invalid={error ? 'true' : 'false'}
                />
                <label htmlFor="email" className="dq-label">
                  Email Address
                </label>
              </div>

              <button type="submit" className="dq-submit" disabled={loading}>
                {loading && <span className="dq-spinner" />}
                {loading ? 'Sending Reset Link...' : 'Send Reset Link'}
              </button>
            </form>

            <div className="dq-divider">Remember your password?</div>

            <Link to="/login" className="dq-back-btn">
              <span className="dq-back-icon">
                <ArrowLeftIcon />
              </span>
              Back to Login
            </Link>

            <p className="dq-brand-foot">
              <strong>DocQuest</strong><br />
              Registrar's Office Document Tracking Request System
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword
