import { useState } from 'react'
import {
  useLocation,
  useNavigate,
  Link,
} from 'react-router-dom'
import { supabase } from '../lib/supabase'

// Logo in the public folder (public/cc.png)
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
    --secondary: #2563EB;
    --accent: #F4B400;
    --bg: #F8FAFC;
    --text: #1E293B;
    --muted: #64748B;
    --border: #E2E8F0;
    --input-border: #94A3B8;
    --error: #DC2626;

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

  /* Soft background glow */
  .dq-login-blob {
    position: absolute;
    border-radius: 50%;
    filter: blur(80px);
    opacity: .35;
    pointer-events: none;
  }
  .dq-login-blob-1 { width: 320px; height: 320px; background: #93C5FD; top: -80px; left: -80px; }
  .dq-login-blob-2 { width: 280px; height: 280px; background: #FEF08A; bottom: -60px; right: -60px; }

  .dq-login-wrap {
    position: relative;
    z-index: 1;
    width: 100%;
    max-width: 440px;
  }

  /* ---------- CARD ---------- */
  .dq-login-card {
    background: #fff;
    border-radius: 24px;
    border: 1px solid var(--border);
    box-shadow: 0 24px 60px rgba(0, 4, 53, .12);
    overflow: hidden;
  }
  .dq-login-top {
    height: 6px;
    background: linear-gradient(90deg, var(--primary), var(--secondary), var(--accent));
  }
  .dq-login-head { text-align: center; padding: 34px 32px 18px; }
  .dq-login-logo {
    width: 68px;
    height: 68px;
    margin: 0 auto 16px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--primary);
    color: var(--accent);
    font-size: 28px;
    font-weight: 800;
    overflow: hidden;
    border: 3px solid #fff;
    box-shadow: 0 6px 18px rgba(0, 4, 53, .25);
  }
  .dq-login-logo img { width: 100%; height: 100%; object-fit: cover; background: #fff; }
  .dq-login-head h2 {
    color: var(--primary);
    font-size: 26px;
    font-weight: 800;
    letter-spacing: -.5px;
    margin-bottom: 6px;
  }
  .dq-login-head p { color: var(--muted); font-size: 14.5px; }
  .dq-login-body { padding: 10px 32px 32px; }

  /* ---------- ALERTS ---------- */
  .dq-alert {
    margin-bottom: 20px;
    padding: 12px 14px;
    border-radius: 12px;
    font-size: 14px;
    line-height: 1.5;
  }
  .dq-alert-success { background: #DCFCE7; border: 1px solid #BBF7D0; color: #166534; }
  .dq-alert-error { background: #FEF2F2; border: 1px solid #FECACA; color: #991B1B; }
  .dq-alert strong { display: block; margin-bottom: 2px; }

  /* ---------- GMAIL-STYLE FLOATING INPUT ---------- */
  .dq-field { position: relative; margin-bottom: 20px; }

  .dq-input {
    width: 100%;
    height: 56px;
    padding: 0 14px;
    border: 1px solid var(--input-border);
    border-radius: 8px;
    background: #fff;
    color: var(--text);
    font-size: 16px;
    font-family: inherit;
    outline: none;
    transition: border-color .15s ease, box-shadow .15s ease;
  }
  .dq-input:hover:not(:disabled) { border-color: var(--text); }
  .dq-input:focus {
    border-color: var(--secondary);
    box-shadow: 0 0 0 1px var(--secondary);
  }
  .dq-input:disabled { background: #F1F5F9; cursor: not-allowed; }
  .dq-input.has-toggle { padding-right: 50px; }

  .dq-label {
    position: absolute;
    left: 10px;
    top: 28px;
    padding: 0 5px;
    transform: translateY(-50%);
    background: #fff;
    color: var(--muted);
    font-size: 16px;
    line-height: 1;
    pointer-events: none;
    transition: top .15s ease, font-size .15s ease, color .15s ease;
  }

  /* Float the label up when focused or filled */
  .dq-input:focus + .dq-label,
  .dq-input:not(:placeholder-shown) + .dq-label,
  .dq-input:-webkit-autofill + .dq-label {
    top: 0;
    font-size: 12px;
  }
  .dq-input:focus + .dq-label { color: var(--secondary); }

  /* Error state */
  .dq-input.is-invalid { border-color: var(--error); }
  .dq-input.is-invalid:focus { box-shadow: 0 0 0 1px var(--error); }
  .dq-input.is-invalid + .dq-label { color: var(--error); }

  /* Show / hide password button */
  .dq-toggle {
    position: absolute;
    top: 50%;
    right: 8px;
    transform: translateY(-50%);
    width: 38px;
    height: 38px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    border-radius: 50%;
    background: transparent;
    color: var(--muted);
    cursor: pointer;
    transition: background .15s ease, color .15s ease;
  }
  .dq-toggle:hover { background: #F1F5F9; color: var(--text); }
  .dq-toggle:focus-visible { outline: 3px solid rgba(37, 99, 235, .4); }

  /* ---------- FORGOT + BUTTON ---------- */
  .dq-forgot { text-align: right; margin: -6px 0 22px; }
  .dq-forgot a {
    color: var(--secondary);
    font-size: 13.5px;
    font-weight: 600;
    text-decoration: none;
  }
  .dq-forgot a:hover { text-decoration: underline; }

  .dq-submit {
    width: 100%;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    border: none;
    border-radius: 10px;
    background: var(--primary);
    color: #fff;
    font-size: 15px;
    font-weight: 700;
    font-family: inherit;
    cursor: pointer;
    box-shadow: 0 8px 20px rgba(0, 4, 53, .22);
    transition: transform .15s ease, background .15s ease, box-shadow .15s ease;
  }
  .dq-submit:hover:not(:disabled) { background: #0a1050; transform: translateY(-1px); }
  .dq-submit:focus-visible { outline: 3px solid rgba(37, 99, 235, .4); outline-offset: 2px; }
  .dq-submit:disabled { background: #94A3B8; box-shadow: none; cursor: not-allowed; }

  .dq-spinner {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    border: 2px solid rgba(255, 255, 255, .4);
    border-top-color: #fff;
    animation: dq-spin .7s linear infinite;
  }
  @keyframes dq-spin { to { transform: rotate(360deg); } }

  /* ---------- FOOTER LINKS ---------- */
  .dq-register {
    margin-top: 24px;
    padding-top: 20px;
    border-top: 1px solid var(--border);
    text-align: center;
    color: var(--muted);
    font-size: 14px;
  }
  .dq-register a { color: var(--secondary); font-weight: 700; text-decoration: none; }
  .dq-register a:hover { text-decoration: underline; }

  .dq-back {
    display: block;
    margin-top: 16px;
    text-align: center;
    color: var(--muted);
    font-size: 13.5px;
    font-weight: 600;
    text-decoration: none;
  }
  .dq-back:hover { color: var(--primary); }

  .dq-brand-foot {
    margin-top: 18px;
    text-align: center;
    color: #94A3B8;
    font-size: 12px;
    line-height: 1.6;
  }

  /* ---------- RESPONSIVE ---------- */
  @media (max-width: 480px) {
    .dq-login { padding: 20px 14px; align-items: flex-start; }
    .dq-login-wrap { margin-top: 10px; }
    .dq-login-card { border-radius: 20px; }
    .dq-login-head { padding: 28px 22px 14px; }
    .dq-login-body { padding: 8px 22px 26px; }
    .dq-login-head h2 { font-size: 23px; }
  }

  @media (prefers-reduced-motion: reduce) {
    .dq-login * { transition: none !important; animation: none !important; }
  }
`

const EyeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
)

const EyeOffIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 19c-6.5 0-10-7-10-7a18.5 18.5 0 0 1 5.06-5.94" />
    <path d="M9.9 4.24A9.1 9.1 0 0 1 12 4c6.5 0 10 7 10 7a18.5 18.5 0 0 1-2.16 3.19" />
    <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
    <path d="m1 1 22 22" />
  </svg>
)

function Login() {
  const navigate = useNavigate()
  const location = useLocation()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [logoFailed, setLogoFailed] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const successMessage =
    location.state?.successMessage || ''

  const handleLogin = async (e) => {
    e.preventDefault()

    setError('')
    setLoading(true)

    try {
      const cleanEmail = email
        .trim()
        .toLowerCase()

      if (!cleanEmail || !password) {
        throw new Error(
          'Please enter your email and password.'
        )
      }

      // Sign in using Supabase Auth
      const {
        data,
        error: loginError,
      } =
        await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password,
        })

      if (loginError) {
        const message =
          loginError.message?.toLowerCase() || ''

        if (
          loginError.code === 'user_banned' ||
          message.includes('banned') ||
          message.includes('suspended')
        ) {
          throw new Error(
            'Your account has been suspended. Please contact the Registrar\'s Office or a Super Admin for assistance.'
          )
        }

        if (
          loginError.code ===
          'email_not_confirmed'
        ) {
          throw new Error(
            'Your account cannot be logged in because Supabase Email Confirmation is still enabled. Please turn off "Confirm email" in Supabase Authentication settings.'
          )
        }

        throw new Error(
          'Invalid email or password. Please check your credentials and try again.'
        )
      }

      const user = data.user

      if (!user) {
        throw new Error(
          'Unable to retrieve user account.'
        )
      }

      const {
        data: profile,
        error: profileError,
      } = await supabase
        .from('profiles')
        .select(
          `
            role,
            suspended,
            first_name,
            middle_initial,
            last_name,
            email,
            email_verified
          `
        )
        .eq('id', user.id)
        .single()

      if (profileError) {
        console.error(
          'Profile loading error:',
          profileError
        )

        throw new Error(
          'Your account was logged in, but your profile information could not be loaded. Please contact the administrator.'
        )
      }

      if (!profile) {
        throw new Error(
          'User profile not found. Please contact the administrator.'
        )
      }

      if (profile.suspended === true) {
        await supabase.auth.signOut()

        throw new Error(
          'Your account has been suspended. Please contact the Registrar\'s Office or a Super Admin for assistance.'
        )
      }

      if (
        profile.role === 'admin' ||
        profile.role === 'super_admin'
      ) {
        navigate('/admin', {
          replace: true,
        })

        return
      }

      navigate('/dashboard', {
        replace: true,
      })
    } catch (err) {
      console.error(
        'Login error:',
        err
      )

      setError(
        err.message ||
          'Login failed. Please try again.'
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
        {/* LOGIN CARD */}
        <div className="dq-login-card">
          <div className="dq-login-top" />

          {/* CARD HEADER */}
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

            <h2>Welcome Back</h2>
            <p>Sign in to your DocQuest account</p>
          </div>

          {/* CARD BODY */}
          <div className="dq-login-body">
            {/* Registration success message */}
            {successMessage && (
              <div className="dq-alert dq-alert-success" role="alert">
                {successMessage}
              </div>
            )}

            {/* Login error */}
            {error && (
              <div className="dq-alert dq-alert-error" role="alert">
                <strong>Login Failed</strong>
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} noValidate>
              {/* EMAIL */}
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
                  Email
                </label>
              </div>

              {/* PASSWORD */}
              <div className="dq-field">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  className={`dq-input has-toggle${error ? ' is-invalid' : ''}`}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder=" "
                  autoComplete="current-password"
                  required
                  disabled={loading}
                  aria-invalid={error ? 'true' : 'false'}
                />
                <label htmlFor="password" className="dq-label">
                  Password
                </label>

                <button
                  type="button"
                  className="dq-toggle"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  tabIndex={0}
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>

              {/* FORGOT PASSWORD */}
              <div className="dq-forgot">
                <Link to="/forgot-password">Forgot Password?</Link>
              </div>

              {/* LOGIN BUTTON */}
              <button type="submit" className="dq-submit" disabled={loading}>
                {loading && <span className="dq-spinner" />}
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            {/* REGISTER LINK */}
            <div className="dq-register">
              Don't have an account?{' '}
              <Link to="/register">Register</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login