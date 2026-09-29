import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const logoImage = '/cc.png'
const bgImage = '/conso.jpg'

const css = `
  html, body, #root {
    width: 100% !important;
    max-width: 100% !important;
    margin: 0 !important;
    padding: 0 !important;
  }

  .dq-admin-add {
    --primary: #000435;
    --primary-2: #0a1050;
    --primary-3: rgba(0, 4, 53, 0.92);
    --primary-4: rgba(10, 16, 80, 0.95);
    --secondary: #2563EB;
    --secondary-2: #1D4ED8;
    --accent: #F4B400;
    --accent-2: #FFC61A;
    --accent-soft: rgba(244, 180, 0, 0.12);
    --bg: #F1F5F9;
    --surface: #FFFFFF;
    --text: #0F172A;
    --text-soft: #475569;
    --muted: #94A3B8;
    --border: #E2E8F0;
    --border-soft: #F1F5F9;
    --success: #16A34A;
    --success-bg: #DCFCE7;
    --error: #DC2626;
    --error-bg: #FEF2F2;
    --shadow-sm: 0 1px 2px rgba(15, 23, 42, 0.06), 0 1px 3px rgba(15, 23, 42, 0.04);
    --shadow-md: 0 4px 12px rgba(15, 23, 42, 0.08), 0 2px 4px rgba(15, 23, 42, 0.06);
    --shadow-lg: 0 20px 50px rgba(15, 23, 42, 0.12), 0 8px 20px rgba(15, 23, 42, 0.08);
    --ease: cubic-bezier(.22, 1, .36, 1);
    --radius: 20px;
    --radius-sm: 12px;
    font-family: 'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
    color: var(--text);
    position: relative;
    min-height: 100vh;
    width: 100%;
    background: var(--bg);
    overflow: hidden;
  }
  .dq-admin-add *, .dq-admin-add *::before, .dq-admin-add *::after { box-sizing: border-box; }

  .dq-bg {
    position: fixed;
    inset: 0;
    background: url('${bgImage}') center center/cover no-repeat fixed;
    z-index: 0;
  }
  .dq-bg::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, rgba(0,4,53,0.5) 0%, rgba(10,16,80,0.45) 50%, rgba(0,4,53,0.55) 100%);
    backdrop-filter: blur(2px);
  }

  .dq-bg, .dq-orb { pointer-events: none; }

  .dq-orb {
    position: fixed;
    border-radius: 50%;
    filter: blur(90px);
    opacity: 0.22;
    z-index: 0;
    animation: dq-drift 26s ease-in-out infinite;
  }
  .dq-orb-1 { width: 520px; height: 520px; background: var(--secondary); top: -180px; left: -120px; }
  .dq-orb-2 { width: 460px; height: 460px; background: var(--accent); bottom: -140px; right: -100px; animation-delay: -10s; animation-direction: reverse; animation-duration: 32s; }

  @keyframes dq-kenburns {
    0%   { transform: scale(1);    transform-origin: center; }
    100% { transform: scale(1.18); transform-origin: 75% 25%; }
  }
  @keyframes dq-drift {
    0%, 100% { transform: translate(0, 0) scale(1); }
    33%      { transform: translate(50px, 30px) scale(1.08); }
    66%      { transform: translate(-30px, 55px) scale(0.96); }
  }
  @keyframes dq-rise {
    from { opacity: 0; transform: translateY(22px); }
    to   { opacity: 1; transform: none; }
  }
  @keyframes dq-fade {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes dq-spin { to { transform: rotate(360deg); } }
  @keyframes dq-sweep {
    from { transform: translateX(-120%) skewX(-20deg); }
    to   { transform: translateX(320%) skewX(-20deg); }
  }
  @keyframes dq-flow {
    0%   { background-position: 0% 50%; }
    100% { background-position: 200% 50%; }
  }
  @keyframes dq-bob {
    0%, 100% { transform: translateY(0); }
    50%      { transform: translateY(-3px); }
  }

  .dq-admin-add { animation: dq-fade 0.45s ease; }

  .dq-nav {
    position: relative;
    z-index: 2;
    position: sticky;
    top: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    padding: 14px 28px;
    background: rgba(255, 255, 255, 0.94);
    backdrop-filter: blur(16px) saturate(180%);
    -webkit-backdrop-filter: blur(16px) saturate(180%);
    border-bottom: 1px solid rgba(226, 232, 240, 0.7);
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
    box-shadow: 0 2px 10px rgba(15, 23, 42, 0.04);
  }
  .dq-nav::after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, var(--primary), var(--secondary), var(--accent), var(--secondary), var(--primary));
    background-size: 200% 100%;
    animation: dq-flow 10s linear infinite;
  }

  .dq-brand {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-shrink: 0;
    text-decoration: none;
    cursor: pointer;
  }
  .dq-brand-logo {
    width: 44px;
    height: 44px;
    border-radius: 12px;
    background: linear-gradient(135deg, var(--primary), var(--primary-2));
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    box-shadow: var(--shadow-md);
    flex-shrink: 0;
    border: 2px solid var(--surface);
  }
  .dq-brand-logo img { width: 100%; height: 100%; object-fit: cover; background: #fff; }
  .dq-brand-txt { display: flex; flex-direction: column; line-height: 1; }
  .dq-brand-name {
    font-size: 16px;
    font-weight: 800;
    color: var(--primary);
    letter-spacing: -0.3px;
  }
  .dq-brand-sub {
    margin-top: 4px;
    font-size: 11.5px;
    color: var(--muted);
    font-weight: 500;
    letter-spacing: 0.3px;
  }

  .dq-nav-btns {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
    justify-content: flex-end;
  }
  .dq-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    height: 40px;
    padding: 0 16px;
    border: none;
    border-radius: 10px;
    font-family: inherit;
    font-size: 13.5px;
    font-weight: 600;
    cursor: pointer;
    transition: transform 0.15s var(--ease), box-shadow 0.15s var(--ease), background 0.15s var(--ease), border-color 0.15s var(--ease), color 0.15s var(--ease);
    white-space: nowrap;
    position: relative;
    overflow: hidden;
  }
  .dq-btn:focus-visible {
    outline: 3px solid rgba(37, 99, 235, 0.45);
    outline-offset: 2px;
  }
  .dq-btn:active:not(:disabled) { transform: translateY(0); }

  .dq-btn-ghost {
    background: transparent;
    color: var(--text-soft);
    border: 1.5px solid var(--border);
  }
  .dq-btn-ghost:hover:not(:disabled) {
    background: var(--border-soft);
    color: var(--primary);
    border-color: var(--text-soft);
    transform: translateY(-1px);
  }

  .dq-btn-danger {
    background: transparent;
    color: var(--error);
    border: 1.5px solid rgba(220, 38, 38, 0.25);
  }
  .dq-btn-danger:hover:not(:disabled) {
    background: var(--error-bg);
    border-color: var(--error);
    transform: translateY(-1px);
  }

  .dq-nav-user {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 4px 10px 4px 4px;
    border-radius: 999px;
    background: var(--border-soft);
    border: 1px solid var(--border);
  }
  .dq-nav-avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--secondary), var(--primary-2));
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: 800;
    box-shadow: var(--shadow-sm);
    flex-shrink: 0;
  }
  .dq-nav-user-name {
    font-size: 13px;
    font-weight: 600;
    color: var(--text);
    max-width: 120px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .dq-nav-user-role {
    font-size: 10.5px;
    color: var(--secondary);
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.6px;
    margin-top: 1px;
  }

  .dq-body {
    position: relative;
    z-index: 1;
    width: 100%;
    padding: 36px 28px 60px;
    display: flex;
    justify-content: center;
  }
  .dq-inner {
    width: 100%;
    max-width: 760px;
    animation: dq-rise 0.55s var(--ease);
  }

  .dq-welcome {
    padding: 28px 28px;
    border-radius: var(--radius);
    background:
      linear-gradient(135deg, rgba(0, 4, 53, 0.96) 0%, rgba(10, 16, 80, 0.94) 45%, rgba(37, 99, 235, 0.92) 100%);
    color: #fff;
    box-shadow: var(--shadow-lg);
    margin-bottom: 26px;
    position: relative;
    overflow: hidden;
    isolation: isolate;
    animation: dq-rise 0.6s var(--ease);
  }
  .dq-welcome::before {
    content: '';
    position: absolute;
    inset: -40%;
    background:
      radial-gradient(circle at 85% 10%, rgba(244, 180, 0, 0.22) 0%, transparent 45%),
      radial-gradient(circle at 10% 90%, rgba(37, 99, 235, 0.25) 0%, transparent 50%);
    z-index: -1;
  }
  .dq-welcome::after {
    content: '';
    position: absolute;
    left: 0; right: 0; bottom: 0;
    height: 3px;
    background: linear-gradient(90deg, var(--accent), #fff, var(--secondary), var(--accent));
    background-size: 200% 100%;
    animation: dq-flow 8s linear infinite;
  }

  .dq-welcome-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    flex-wrap: wrap;
  }
  .dq-eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 6px 12px;
    border-radius: 999px;
    background: rgba(244, 180, 0, 0.16);
    border: 1px solid rgba(244, 180, 0, 0.32);
    color: var(--accent-2);
    font-size: 11.5px;
    font-weight: 700;
    letter-spacing: 0.4px;
    text-transform: uppercase;
    margin-bottom: 14px;
  }
  .dq-dot {
    width: 8px; height: 8px;
    border-radius: 50%;
    background: var(--accent);
    box-shadow: 0 0 0 4px rgba(244, 180, 0, 0.2);
    animation: dq-bob 2.2s ease-in-out infinite;
  }
  .dq-welcome h1 {
    font-size: clamp(24px, 3vw, 30px);
    font-weight: 800;
    letter-spacing: -0.6px;
    line-height: 1.1;
    margin: 0 0 8px 0;
  }
  .dq-welcome p {
    font-size: 14px;
    line-height: 1.65;
    color: rgba(226, 232, 240, 0.92);
    max-width: 56ch;
    margin: 0;
  }
  .dq-welcome-icon {
    width: 58px;
    height: 58px;
    border-radius: 16px;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(6px);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--accent-2);
    border: 1px solid rgba(255, 255, 255, 0.15);
    flex-shrink: 0;
    box-shadow: var(--shadow-md);
  }

  .dq-panel {
    background: var(--surface);
    border-radius: var(--radius);
    box-shadow: var(--shadow-lg);
    border: 1px solid rgba(226, 232, 240, 0.8);
    padding: 34px 34px 34px;
    animation: dq-rise 0.65s var(--ease);
  }

  .dq-alert {
    display: flex;
    gap: 12px;
    align-items: flex-start;
    padding: 16px 17px;
    border-radius: 14px;
    margin-bottom: 22px;
    font-size: 14px;
    line-height: 1.55;
    border-width: 1px;
    border-style: solid;
    border-left: 4px solid;
    box-shadow: var(--shadow-sm);
    animation: dq-fade 0.3s ease;
  }
  .dq-alert-icon { flex-shrink: 0; margin-top: 1px; }
  .dq-alert strong { display: block; margin-bottom: 3px; font-weight: 700; font-size: 14.5px; }
  .dq-alert-success {
    background: var(--success-bg);
    color: #166534;
    border-color: #86EFAC;
    border-left-color: var(--success);
  }
  .dq-alert-error {
    background: var(--error-bg);
    color: #991B1B;
    border-color: #FECACA;
    border-left-color: var(--error);
    word-break: break-word;
  }

  .dq-panel-info {
    display: flex;
    gap: 12px;
    align-items: flex-start;
    padding: 15px 16px;
    border-radius: 14px;
    margin-bottom: 26px;
    background: linear-gradient(135deg, #EFF6FF, #F0FDFA);
    border: 1px solid #BFDBFE;
    border-left: 4px solid var(--secondary);
    font-size: 13.5px;
    line-height: 1.55;
    color: #1E3A8A;
  }
  .dq-panel-info svg { flex-shrink: 0; margin-top: 1px; color: var(--secondary); }
  .dq-panel-info strong { color: var(--primary); font-weight: 700; }

  .dq-form { display: flex; flex-direction: column; }

  .dq-field { margin-bottom: 22px; }
  .dq-field:last-of-type { margin-bottom: 26px; }

  .dq-label {
    display: block;
    margin-bottom: 8px;
    font-size: 13.5px;
    font-weight: 650;
    color: var(--text-soft);
    letter-spacing: 0.2px;
  }
  .dq-label-required {
    color: var(--error);
    margin-left: 2px;
    font-weight: 700;
  }

  .dq-input, .dq-select {
    width: 100%;
    height: 50px;
    padding: 0 14px;
    border: 1.5px solid var(--border);
    border-radius: 12px;
    background: var(--surface);
    color: var(--text);
    font-size: 15px;
    font-family: inherit;
    outline: none;
    transition: border-color 0.15s ease, box-shadow 0.15s ease, background 0.15s ease, transform 0.15s ease;
  }
  .dq-input::placeholder { color: var(--muted); }
  .dq-input:hover:not(:disabled), .dq-select:hover:not(:disabled) {
    border-color: var(--text-soft);
    background: #FBFBFD;
  }
  .dq-input:focus, .dq-select:focus {
    border-color: var(--secondary);
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12);
    background: #FAFBFF;
  }
  .dq-input:disabled, .dq-select:disabled {
    background: var(--border-soft);
    cursor: not-allowed;
    color: var(--muted);
  }

  .dq-select {
    appearance: none;
    background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2394A3B8' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
    background-repeat: no-repeat;
    background-position: right 14px center;
    background-size: 18px 18px;
    padding-right: 44px;
    cursor: pointer;
  }
  .dq-select:focus {
    background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%232563EB' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  }
  .dq-select option { color: var(--text); background: var(--surface); }

  .dq-form-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 18px 20px;
    margin-bottom: 26px;
  }
  .dq-form-grid .dq-field { margin-bottom: 0; }

  .dq-submit {
    width: 100%;
    height: 54px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    border: none;
    border-radius: 14px;
    background: linear-gradient(135deg, var(--primary), var(--primary-2));
    color: #fff;
    font-family: inherit;
    font-size: 15.5px;
    font-weight: 700;
    cursor: pointer;
    box-shadow: 0 12px 30px rgba(0, 4, 53, 0.28);
    position: relative;
    overflow: hidden;
    transition: transform 0.15s var(--ease), box-shadow 0.15s var(--ease);
  }
  .dq-submit:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 16px 40px rgba(0, 4, 53, 0.36);
  }
  .dq-submit:active:not(:disabled) { transform: translateY(0); }
  .dq-submit:focus-visible { outline: 3px solid rgba(37, 99, 235, 0.5); outline-offset: 3px; }
  .dq-submit:disabled {
    background: var(--muted);
    box-shadow: none;
    cursor: not-allowed;
    transform: none;
  }
  .dq-submit::after {
    content: '';
    position: absolute;
    top: 0; left: 0;
    width: 40%; height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    animation: dq-sweep 3.2s ease-in-out 1.2s infinite;
  }
  .dq-spinner {
    width: 18px; height: 18px;
    border-radius: 50%;
    border: 2.5px solid rgba(255, 255, 255, 0.38);
    border-top-color: #fff;
    animation: dq-spin 0.7s linear infinite;
  }

  .dq-loading {
    position: relative;
    z-index: 2;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 28px;
  }
  .dq-loading-card {
    background: var(--surface);
    border-radius: var(--radius);
    padding: 48px 42px;
    text-align: center;
    box-shadow: var(--shadow-lg);
    border: 1px solid rgba(226, 232, 240, 0.8);
    animation: dq-rise 0.5s var(--ease);
    min-width: 300px;
  }
  .dq-loader {
    width: 48px; height: 48px;
    border-radius: 50%;
    border: 3.5px solid rgba(37, 99, 235, 0.18);
    border-top-color: var(--secondary);
    animation: dq-spin 0.8s linear infinite;
    margin: 0 auto 18px;
  }
  .dq-loading-card p {
    font-size: 14px;
    color: var(--text-soft);
    margin: 0;
    font-weight: 500;
    letter-spacing: 0.2px;
  }

  @media (max-width: 720px) {
    .dq-nav { padding: 12px 16px; }
    .dq-brand-sub { display: none; }
    .dq-nav-user { display: none; }
    .dq-body { padding: 24px 16px 40px; }
    .dq-welcome { padding: 22px 20px; border-radius: 16px; }
    .dq-panel { padding: 26px 22px 26px; border-radius: 16px; }
    .dq-form-grid { grid-template-columns: 1fr; }
    .dq-welcome-icon { width: 48px; height: 48px; }
  }

  @media (prefers-reduced-motion: reduce) {
    .dq-admin-add *, .dq-admin-add *::before, .dq-admin-add *::after {
      animation: none !important;
      transition: none !important;
    }
  }
`

const UserPlusIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M19 8v6M22 11h-6" />
  </svg>
)

const InfoIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 16v-4M12 8h.01" />
  </svg>
)

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

const ArrowLeftIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="m15 18-6-6 6-6" />
  </svg>
)

const LogOutIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <path d="m16 17 5-5-5-5M21 12H9" />
  </svg>
)

function AddAdmin() {
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [logoFailed, setLogoFailed] = useState(false)
  const [userName, setUserName] = useState('Super Admin')

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: 'admin',
  })

  useEffect(() => {
    checkSuperAdmin()
  }, [])

  async function checkSuperAdmin() {
    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()

      if (userError) throw userError

      if (!user) {
        navigate('/login')
        return
      }

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role, first_name, last_name')
        .eq('id', user.id)
        .single()

      if (profileError) throw profileError

      if (profile.first_name || profile.last_name) {
        setUserName(
          [profile.first_name, profile.last_name].filter(Boolean).join(' ')
        )
      }

      if (profile.role !== 'super_admin') {
        navigate('/admin')
        return
      }
    } catch (err) {
      console.error(err)
      navigate('/admin')
    } finally {
      setLoading(false)
    }
  }

  function handleChange(e) {
    const { name, value } = e.target

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  async function handleSubmit(e) {
    e.preventDefault()

    setError('')
    setSuccess('')

    if (
      !form.firstName.trim() ||
      !form.lastName.trim() ||
      !form.email.trim()
    ) {
      setError('Please complete all required fields.')
      return
    }

    setSaving(true)

    try {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession()

      if (sessionError) {
        throw sessionError
      }

      if (!session) {
        throw new Error(
          'Your session has expired. Please log in again.'
        )
      }

      const { data, error } =
        await supabase.functions.invoke(
          'create-admin',
          {
            body: {
              firstName: form.firstName.trim(),
              lastName: form.lastName.trim(),
              email: form.email.trim().toLowerCase(),
              role: form.role,
            },
            headers: {
              Authorization: `Bearer ${session.access_token}`,
            },
          }
        )

      if (error) {
        throw new Error(
          error.message ||
            'Failed to send administrator invitation.'
        )
      }

      if (!data?.success) {
        throw new Error(
          data?.message ||
            'Failed to send administrator invitation.'
        )
      }

      setSuccess(
        `${
          form.role === 'super_admin'
            ? 'Super Admin'
            : 'Standard Admin'
        } invitation sent successfully. Please ask the administrator to check their email and complete the account setup.`
      )

      setForm({
        firstName: '',
        lastName: '',
        email: '',
        role: 'admin',
      })
    } catch (err) {
      console.error(
        'Create admin error:',
        err
      )

      setError(
        err.message ||
          'Failed to send administrator invitation.'
      )
    } finally {
      setSaving(false)
    }
  }

  async function handleLogout() {
    try {
      await supabase.auth.signOut()
      navigate('/login', { replace: true })
    } catch (err) {
      console.error('Logout error:', err)
      navigate('/login', { replace: true })
    }
  }

  const initials = userName
    .split(' ')
    .map((s) => s[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()

  if (loading) {
    return (
      <div className="dq-admin-add">
        <style>{css}</style>
        <div className="dq-bg" />
        <div className="dq-orb dq-orb-1" />
        <div className="dq-orb dq-orb-2" />
        <div className="dq-loading">
          <div className="dq-loading-card">
            <div className="dq-loader" />
            <p>Checking administrator access...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="dq-admin-add">
      <style>{css}</style>

      <div className="dq-bg" />
      <div className="dq-orb dq-orb-1" />
      <div className="dq-orb dq-orb-2" />

      <nav className="dq-nav">
        <div className="dq-brand" onClick={() => navigate('/admin')}>
          <div className="dq-brand-logo">
            {logoFailed ? (
              <span style={{ color: '#F4B400', fontWeight: 800, fontSize: 18 }}>D</span>
            ) : (
              <img
                src={logoImage}
                alt="Consolatrix College Logo"
                onError={() => setLogoFailed(true)}
              />
            )}
          </div>
          <div className="dq-brand-txt">
            <span className="dq-brand-name">DocQuest</span>
            <span className="dq-brand-sub">REGISTRAR DOCUMENT TRACKING</span>
          </div>
        </div>

        <div className="dq-nav-btns">
          <button
            type="button"
            className="dq-btn dq-btn-ghost"
            onClick={() => navigate('/admin')}
          >
            <ArrowLeftIcon />
            <span>Back</span>
          </button>

          <div className="dq-nav-user" aria-label="Signed in as Super Admin">
            <div className="dq-nav-avatar">{initials || 'SA'}</div>
            <div>
              <div className="dq-nav-user-name">{userName}</div>
              <div className="dq-nav-user-role">Super Admin</div>
            </div>
          </div>

          <button
            type="button"
            className="dq-btn dq-btn-danger"
            onClick={handleLogout}
            aria-label="Sign out"
          >
            <LogOutIcon />
            <span>Logout</span>
          </button>
        </div>
      </nav>

      <div className="dq-body">
        <div className="dq-inner">
          <div className="dq-welcome">
            <div className="dq-welcome-head">
              <div>
                <span className="dq-eyebrow">
                  <span className="dq-dot" />
                  Administrator Management
                </span>
                <h1>Add Admin Account</h1>
                <p>
                  Send a secure invitation email to create a new DocQuest administrator
                  account. The invitee will receive a personalized setup link.
                </p>
              </div>
              <div className="dq-welcome-icon" aria-hidden="true">
                <UserPlusIcon />
              </div>
            </div>
          </div>

          <div className="dq-panel">
            {error && (
              <div className="dq-alert dq-alert-error" role="alert">
                <span className="dq-alert-icon"><AlertIcon /></span>
                <div>
                  <strong>Invitation Failed</strong>
                  {error}
                </div>
              </div>
            )}

            {success && (
              <div className="dq-alert dq-alert-success" role="alert">
                <span className="dq-alert-icon"><CheckCircleIcon /></span>
                <div>
                  <strong>Invitation Sent</strong>
                  {success}
                </div>
              </div>
            )}

            <div className="dq-panel-info">
              <InfoIcon />
              <div>
                <strong>Before you proceed:</strong> Please double-check the administrator's
                email address — invitations are sent only to the exact email listed below.
                Role can be changed later from <strong>Manage Admins</strong>.
              </div>
            </div>

            <form className="dq-form" onSubmit={handleSubmit} noValidate>
              <div className="dq-form-grid">
                <div className="dq-field">
                  <label htmlFor="firstName" className="dq-label">
                    First Name<span className="dq-label-required">*</span>
                  </label>
                  <input
                    id="firstName"
                    type="text"
                    name="firstName"
                    className="dq-input"
                    value={form.firstName}
                    onChange={handleChange}
                    placeholder="e.g. Maria"
                    required
                    disabled={saving}
                    autoComplete="given-name"
                  />
                </div>

                <div className="dq-field">
                  <label htmlFor="lastName" className="dq-label">
                    Last Name<span className="dq-label-required">*</span>
                  </label>
                  <input
                    id="lastName"
                    type="text"
                    name="lastName"
                    className="dq-input"
                    value={form.lastName}
                    onChange={handleChange}
                    placeholder="e.g. Santos"
                    required
                    disabled={saving}
                    autoComplete="family-name"
                  />
                </div>
              </div>

              <div className="dq-field">
                <label htmlFor="email" className="dq-label">
                  Email Address<span className="dq-label-required">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  className="dq-input"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="admin.name@school.edu.ph"
                  required
                  disabled={saving}
                  autoComplete="email"
                />
              </div>

              <div className="dq-field">
                <label htmlFor="role" className="dq-label">Admin Role</label>
                <select
                  id="role"
                  name="role"
                  className="dq-select"
                  value={form.role}
                  onChange={handleChange}
                  disabled={saving}
                >
                  <option value="admin">Standard Admin — Treasurer's Office</option>
                  <option value="super_admin">Super Admin</option>
                </select>
              </div>

              <button type="submit" className="dq-submit" disabled={saving}>
                {saving && <span className="dq-spinner" />}
                {saving ? 'Sending Invitation...' : 'Send Admin Invitation'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddAdmin
