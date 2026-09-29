import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
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
  .dq-login :where(h1, h2, h3, p) { margin: 0; }

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
  @keyframes dq-bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-3px); } }

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
  .dq-login-head p { color: var(--muted); font-size: 14.5px; line-height: 1.65; max-width: 36ch; margin: 0 auto; }
  .dq-login-body { padding: 12px 32px 32px; }

  .dq-verify { text-align: center; padding: 8px 0 12px; }
  .dq-verify-spinner {
    width: 48px;
    height: 48px;
    margin: 0 auto 18px;
    border-radius: 50%;
    border: 4.5px solid #DBEAFE;
    border-top-color: var(--secondary);
    animation: dq-spin .8s linear infinite;
  }
  .dq-verify h3 { margin: 0 0 6px; color: var(--primary); font-size: 18px; font-weight: 800; }
  .dq-verify p { margin: 0; color: var(--muted); font-size: 14px; line-height: 1.6; }

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
    background: linear-gradient(135deg, #EFF6FF, #DBEAFE);
    border: 1px solid #BFDBFE;
    border-left: 4px solid var(--secondary);
    color: #1E3A8A;
    font-size: 13px;
    line-height: 1.55;
    box-shadow: 0 2px 8px rgba(37, 99, 235, .06);
  }
  .dq-hint svg { flex-shrink: 0; margin-top: 1px; }

  .dq-field { position: relative; margin-bottom: 22px; }
  .dq-field.has-meter { margin-bottom: 10px; }

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
  .dq-input.has-toggle { padding-right: 54px; }
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

  .dq-toggle {
    position: absolute;
    top: 8px;
    right: 8px;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    border-radius: 10px;
    background: transparent;
    color: var(--muted);
    cursor: pointer;
    transition: background .15s ease, color .15s ease;
  }
  .dq-toggle:hover:not(:disabled) { background: #F1F5F9; color: var(--primary); }
  .dq-toggle:focus-visible { outline: 3px solid rgba(37, 99, 235, .4); outline-offset: 1px; }
  .dq-toggle:disabled { cursor: not-allowed; opacity: .5; }

  .dq-meter { margin-bottom: 22px; }
  .dq-meter-bar {
    display: flex;
    gap: 6px;
    margin-bottom: 8px;
  }
  .dq-meter-seg {
    flex: 1;
    height: 6px;
    border-radius: 999px;
    background: var(--border);
    transition: background .2s ease, transform .2s ease;
  }
  .dq-meter-seg.on-weak { background: var(--error); }
  .dq-meter-seg.on-fair { background: var(--accent); }
  .dq-meter-seg.on-good { background: var(--secondary); }
  .dq-meter-seg.on-strong { background: var(--success); }
  .dq-meter-text { font-size: 12.5px; color: var(--muted); margin-bottom: 10px; }
  .dq-meter-text strong { color: var(--text); font-weight: 700; }

  .dq-rules {
    list-style: none;
    margin: 0;
    padding: 10px 12px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px 12px;
    background: #F8FAFC;
    border-radius: 10px;
    border: 1px solid var(--border);
  }
  .dq-rule {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12.5px;
    color: var(--muted);
    transition: color .15s ease;
  }
  .dq-rule.ok { color: var(--success); font-weight: 600; }
  .dq-rule-dot {
    width: 16px;
    height: 16px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    border: 1.5px solid var(--input-border);
    color: transparent;
    transition: background .15s ease, border-color .15s ease, color .15s ease;
  }
  .dq-rule.ok .dq-rule-dot { background: var(--success); border-color: var(--success); color: #fff; }

  .dq-match { margin: -12px 0 20px; font-size: 12.5px; padding-left: 2px; font-weight: 600; }
  .dq-match.ok { color: var(--success); }
  .dq-match.bad { color: var(--error); }

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
    cursor: pointer;
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

  @media (max-width: 480px) {
    .dq-login { padding: 20px 14px; align-items: flex-start; }
    .dq-login-wrap { margin-top: 10px; }
    .dq-login-card { border-radius: 20px; }
    .dq-login-head { padding: 30px 22px 16px; }
    .dq-login-logo { width: 64px; height: 64px; font-size: 26px; }
    .dq-login-body { padding: 8px 22px 26px; }
    .dq-login-head h2 { font-size: 24px; }
    .dq-rules { grid-template-columns: 1fr; }
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

const ShieldIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
)

const EyeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
)

const EyeOffIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M17.94 17.94A10.5 10.5 0 0 1 12 19c-6.5 0-10-7-10-7a17.6 17.6 0 0 1 4.06-5.06" />
    <path d="M9.9 5.24A9.7 9.7 0 0 1 12 5c6.5 0 10 7 10 7a17.7 17.7 0 0 1-2.16 3.19" />
    <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
    <path d="m2 2 20 20" />
  </svg>
)

const TickIcon = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="m5 12 5 5 9-10" />
  </svg>
)

const ArrowLeftIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M19 12H5M12 19l-7-7 7-7" />
  </svg>
)

function ResetPassword() {
  const navigate = useNavigate()

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [checkingSession, setCheckingSession] = useState(true)
  const [sessionInvalid, setSessionInvalid] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [logoFailed, setLogoFailed] = useState(false)

  useEffect(() => {
    const checkResetSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (!session) {
          setSessionInvalid(true)
          setError(
            'This password reset link is invalid or has expired. Please request a new reset link.'
          )
        }
      } catch (err) {
        console.error('Reset session error:', err)
        setSessionInvalid(true)
        setError('Unable to verify the password reset session.')
      } finally {
        setCheckingSession(false)
      }
    }

    checkResetSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY' && session) {
        setSessionInvalid(false)
        setError('')
        setCheckingSession(false)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const handleResetPassword = async (e) => {
    e.preventDefault()

    setError('')
    setMessage('')

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)

    try {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession()

      if (sessionError || !session) {
        setSessionInvalid(true)
        throw new Error(
          'Your password reset session is invalid or has expired. Please request a new reset link.'
        )
      }

      const { error: updateError } = await supabase.auth.updateUser({
        password,
      })

      if (updateError) {
        throw updateError
      }

      setMessage(
        'Your password has been reset successfully. Redirecting you to login...'
      )

      setPassword('')
      setConfirmPassword('')

      await supabase.auth.signOut()

      setTimeout(() => {
        navigate('/login', {
          replace: true,
          state: {
            successMessage:
              'Password reset successful. You can now log in with your new password.',
          },
        })
      }, 1500)
    } catch (err) {
      console.error('Reset password error:', err)
      setError(err.message || 'Failed to reset password. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const rules = [
    { label: '6+ characters', ok: password.length >= 6 },
    { label: '8+ characters', ok: password.length >= 8 },
    { label: 'Uppercase letter', ok: /[A-Z]/.test(password) },
    { label: 'Number', ok: /[0-9]/.test(password) },
  ]

  const getStrength = () => {
    if (!password) return { level: 0, label: '', tone: '' }
    if (password.length < 6) return { level: 1, label: 'Too short', tone: 'weak' }
    if (password.length < 8) return { level: 2, label: 'Fair', tone: 'fair' }
    if (/[A-Z]/.test(password) && /[0-9]/.test(password))
      return { level: 4, label: 'Strong', tone: 'strong' }
    return { level: 3, label: 'Good', tone: 'good' }
  }

  const strength = getStrength()
  const showMismatch = confirmPassword.length > 0
  const passwordsMatch = password === confirmPassword

  const Header = ({ title, text }) => (
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
      <h2>{title}</h2>
      <p>{text}</p>
    </div>
  )

  if (checkingSession) {
    return (
      <div className="dq-login">
        <style>{css}</style>
        <div className="dq-login-blob dq-login-blob-1" />
        <div className="dq-login-blob dq-login-blob-2" />

        <div className="dq-login-wrap">
          <div className="dq-login-card">
            <div className="dq-login-top" />
            <div className="dq-login-body" style={{ padding: '48px 32px' }}>
              <div className="dq-verify" role="status">
                <div className="dq-verify-spinner" />
                <h3>Verifying your request</h3>
                <p>Please wait while we check your password reset link...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="dq-login">
      <style>{css}</style>

      <div className="dq-login-blob dq-login-blob-1" />
      <div className="dq-login-blob dq-login-blob-2" />

      <div className="dq-login-wrap">
        <div className="dq-login-card">
          <div className="dq-login-top" />

          <Header
            title="Set New Password"
            text="Choose a new password for your account. Make it different from your previous ones."
          />

          <div className="dq-login-body">
            {message && (
              <div className="dq-alert dq-alert-success" role="alert">
                <span className="dq-alert-icon"><CheckCircleIcon /></span>
                <div>
                  <strong>Password Updated</strong>
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

            {!message && !sessionInvalid && (
              <>
                <div className="dq-hint">
                  <ShieldIcon />
                  <span>You'll be signed out and asked to log in with your new password after this.</span>
                </div>

                <form onSubmit={handleResetPassword} noValidate>
                  <div className={`dq-field${password ? ' has-meter' : ''}`}>
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      className="dq-input has-toggle"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder=" "
                      autoComplete="new-password"
                      minLength={6}
                      required
                      disabled={loading}
                    />
                    <label htmlFor="password" className="dq-label">
                      New Password
                    </label>
                    <button
                      type="button"
                      className="dq-toggle"
                      onClick={() => setShowPassword((prev) => !prev)}
                      disabled={loading}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                    </button>
                  </div>

                  {password && (
                    <div className="dq-meter" aria-live="polite">
                      <div className="dq-meter-bar">
                        {[1, 2, 3, 4].map((n) => (
                          <span
                            key={n}
                            className={`dq-meter-seg${
                              n <= strength.level ? ` on-${strength.tone}` : ''
                            }`}
                          />
                        ))}
                      </div>
                      <p className="dq-meter-text">
                        Password strength: <strong>{strength.label}</strong>
                      </p>
                      <ul className="dq-rules">
                        {rules.map((rule) => (
                          <li key={rule.label} className={`dq-rule${rule.ok ? ' ok' : ''}`}>
                            <span className="dq-rule-dot"><TickIcon /></span>
                            {rule.label}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="dq-field">
                    <input
                      id="confirmPassword"
                      type={showPassword ? 'text' : 'password'}
                      className={`dq-input${
                        showMismatch && !passwordsMatch ? ' is-invalid' : ''
                      }`}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder=" "
                      autoComplete="new-password"
                      minLength={6}
                      required
                      disabled={loading}
                      aria-invalid={showMismatch && !passwordsMatch ? 'true' : 'false'}
                    />
                    <label htmlFor="confirmPassword" className="dq-label">
                      Confirm New Password
                    </label>
                  </div>

                  {showMismatch && (
                    <p
                      className={`dq-match ${passwordsMatch ? 'ok' : 'bad'}`}
                      aria-live="polite"
                    >
                      {passwordsMatch ? '\u2713 Passwords match.' : '\u2717 Passwords do not match yet.'}
                    </p>
                  )}

                  <button type="submit" className="dq-submit" disabled={loading}>
                    {loading && <span className="dq-spinner" />}
                    {loading ? 'Updating Password...' : 'Reset Password'}
                  </button>
                </form>
              </>
            )}

            {sessionInvalid && !message && (
              <button
                type="button"
                className="dq-back-btn"
                onClick={() => navigate('/forgot-password')}
              >
                <span className="dq-back-icon">
                  <ArrowLeftIcon />
                </span>
                Request New Reset Link
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResetPassword
