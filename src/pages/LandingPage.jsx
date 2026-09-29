import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

// Logo in the public folder (public/cc.png)
const logoImage = '/cc.png'

const css = `
  html, body, #root {
    width: 100% !important;
    max-width: 100% !important;
    margin: 0 !important;
    padding: 0 !important;
    overflow-x: clip !important;
  }
  html { scroll-behavior: smooth; }

  .dq-page {
    --primary: #000435;
    --primary-2: #0a1050;
    --secondary: #2563EB;
    --accent: #F4B400;
    --accent-soft: #FFFBEB;
    --bg: #F8FAFC;
    --text: #1E293B;
    --muted: #64748B;
    --border: #E2E8F0;
    --success: #16A34A;

    width: 100%;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background: #fff;
    color: var(--text);
    text-align: left;
    font-family: 'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
    overflow-x: clip;
  }
  .dq-page *, .dq-page *::before, .dq-page *::after { box-sizing: border-box; }
  .dq-page :where(h1, h2, h3, h4, p, ul) { margin: 0; padding: 0; }
  .dq-page a { text-decoration: none; color: inherit; }
  .dq-page section[id] { scroll-margin-top: 72px; }

  /* Adjusted container width & padding */
  .dq-container { width: 100%; max-width: 1280px; margin: 0 auto; padding: 0 24px; }

  /* ---------- MOTION ---------- */
  @keyframes dq-rise {
    from { opacity: 0; transform: translateY(22px); }
    to   { opacity: 1; transform: none; }
  }
  @keyframes dq-pulse {
    0%   { box-shadow: 0 0 0 0 rgba(37, 99, 235, .45); }
    100% { box-shadow: 0 0 0 9px rgba(37, 99, 235, 0); }
  }
  .dq-hero-copy > * { animation: dq-rise .7s cubic-bezier(.22, 1, .36, 1) backwards; }
  .dq-hero-copy > *:nth-child(2) { animation-delay: .08s; }
  .dq-hero-copy > *:nth-child(3) { animation-delay: .16s; }
  .dq-hero-copy > *:nth-child(4) { animation-delay: .24s; }
  .dq-hero-copy > *:nth-child(5) { animation-delay: .32s; }
  .dq-hero-visual { animation: dq-rise .8s cubic-bezier(.22, 1, .36, 1) .2s backwards; }

  .dq-reveal { opacity: 0; }
  .dq-reveal.is-visible {
    opacity: 1;
    animation: dq-rise .65s cubic-bezier(.22, 1, .36, 1) backwards;
    animation-delay: var(--d, 0s);
  }

  /* ---------- BUTTONS ---------- */
  .dq-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 10px 20px;
    border-radius: 10px;
    border: 1px solid transparent;
    font-size: 14px;
    font-weight: 700;
    font-family: inherit;
    cursor: pointer;
    white-space: nowrap;
    transition: background .15s ease, border-color .15s ease, box-shadow .15s ease, transform .15s ease;
  }
  .dq-btn:hover { transform: translateY(-1px); }
  .dq-btn:active { transform: none; }
  .dq-btn:focus-visible, .dq-link:focus-visible { outline: 3px solid rgba(37, 99, 235, .45); outline-offset: 2px; }
  .dq-btn-primary { background: var(--primary); color: #fff; box-shadow: 0 8px 20px rgba(0, 4, 53, .22); }
  .dq-btn-primary:hover { background: var(--primary-2); box-shadow: 0 12px 26px rgba(0, 4, 53, .28); }
  .dq-btn-outline { background: #fff; color: var(--primary); border-color: #CBD5E1; }
  .dq-btn-outline:hover { border-color: var(--primary); background: #F1F5F9; }
  .dq-btn-gold { background: var(--accent); color: var(--primary); box-shadow: 0 8px 20px rgba(244, 180, 0, .3); }
  .dq-btn-gold:hover { background: #FFC61A; }
  .dq-btn-ghost-light { background: transparent; color: #fff; border-color: rgba(255, 255, 255, .4); }
  .dq-btn-ghost-light:hover { background: rgba(255, 255, 255, .1); border-color: #fff; }
  .dq-btn-lg { padding: 14px 26px; font-size: 15px; }

  /* ---------- NAVBAR ---------- */
  .dq-nav {
    position: sticky;
    top: 0;
    z-index: 50;
    background: rgba(255, 255, 255, .92);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border-bottom: 1px solid var(--border);
    transition: box-shadow .2s ease;
    width: 100%;
  }
  .dq-nav.is-scrolled { box-shadow: 0 8px 24px rgba(0, 4, 53, .08); }
  .dq-nav-inner { 
    display: flex; 
    align-items: center; 
    justify-content: space-between; 
    gap: 16px; 
    height: 68px; 
    padding: 0 24px;
    max-width: 100%;
  }

  .dq-brand { display: flex; align-items: center; gap: 12px; }
  .dq-logo {
    width: 42px;
    height: 42px;
    flex-shrink: 0;
    border-radius: 50%;
    object-fit: cover;
    background: #fff;
    border: 2px solid var(--primary);
  }
  .dq-brand-name { font-size: 20px; font-weight: 800; color: var(--primary); letter-spacing: -.4px; line-height: 1.1; }
  .dq-brand-sub { display: block; margin-top: 2px; font-size: 11.5px; color: var(--muted); font-weight: 500; }

  .dq-links { display: flex; align-items: center; gap: 30px; }
  .dq-link { font-size: 14px; font-weight: 600; color: var(--muted); border-radius: 6px; transition: color .15s ease; }
  .dq-link:hover { color: var(--primary); }
  .dq-nav-actions { display: flex; align-items: center; gap: 10px; }

  /* ---------- HERO ---------- */
  .dq-hero {
    position: relative;
    padding: 64px 0 80px;
    background:
      radial-gradient(900px 420px at 88% -10%, rgba(147, 197, 253, .45), transparent 60%),
      radial-gradient(700px 380px at -5% 105%, rgba(254, 240, 138, .5), transparent 60%),
      var(--bg);
    border-bottom: 1px solid var(--border);
    overflow: hidden;
  }
  .dq-hero-grid { display: grid; grid-template-columns: 1.05fr .95fr; gap: 48px; align-items: center; }

  .dq-badge {
    display: inline-flex;
    align-items: center;
    gap: 9px;
    padding: 7px 14px;
    margin-bottom: 22px;
    border-radius: 999px;
    background: #fff;
    border: 1px solid var(--border);
    color: var(--primary);
    font-size: 13px;
    font-weight: 600;
    box-shadow: 0 2px 8px rgba(0, 4, 53, .05);
  }
  .dq-badge-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--secondary); animation: dq-pulse 2s ease-out infinite; }

  .dq-title {
    font-size: clamp(38px, 5vw, 58px);
    line-height: 1.08;
    font-weight: 800;
    letter-spacing: -1.4px;
    color: var(--primary);
    margin-bottom: 20px;
  }
  .dq-title em {
    font-style: normal;
    color: var(--secondary);
  }
  .dq-lead { max-width: 540px; font-size: 17px; line-height: 1.7; color: var(--muted); margin-bottom: 30px; }
  .dq-cta { display: flex; flex-wrap: wrap; gap: 12px; margin-bottom: 30px; }

  .dq-checks { list-style: none; display: flex; flex-wrap: wrap; gap: 10px 26px; }
  .dq-checks li { display: flex; align-items: center; gap: 8px; font-size: 13.5px; font-weight: 600; color: var(--text); }
  .dq-checks svg { color: var(--success); flex-shrink: 0; }

  /* Tracker preview card */
  .dq-hero-visual { position: relative; display: flex; justify-content: center; }
  .dq-tracker {
    width: 100%;
    max-width: 460px;
    padding: 26px;
    border-radius: 20px;
    background: #fff;
    border: 1px solid var(--border);
    box-shadow: 0 30px 70px rgba(0, 4, 53, .16);
  }
  .dq-tracker-head { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 20px; }
  .dq-tracker-doc { display: flex; align-items: center; gap: 12px; }
  .dq-tracker-icon {
    width: 44px;
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 12px;
    background: #EFF6FF;
    color: var(--secondary);
    flex-shrink: 0;
  }
  .dq-tracker-doc strong { display: block; font-size: 15px; color: var(--primary); }
  .dq-tracker-doc span { font-size: 12.5px; color: var(--muted); }
  .dq-pill {
    padding: 5px 11px;
    border-radius: 999px;
    background: #EFF6FF;
    color: var(--secondary);
    font-size: 12px;
    font-weight: 700;
    white-space: nowrap;
  }

  .dq-steps-list { list-style: none; position: relative; margin-bottom: 20px; }
  .dq-track {
    position: relative;
    display: flex;
    gap: 14px;
    padding-bottom: 18px;
  }
  .dq-track:last-child { padding-bottom: 0; }
  .dq-track::before {
    content: '';
    position: absolute;
    left: 13px;
    top: 28px;
    bottom: 0;
    width: 2px;
    background: var(--border);
  }
  .dq-track:last-child::before { display: none; }
  .dq-track.done::before { background: var(--success); }
  .dq-track-dot {
    width: 28px;
    height: 28px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    border: 2px solid var(--border);
    background: #fff;
    color: #94A3B8;
    font-size: 12px;
    font-weight: 700;
  }
  .dq-track.done .dq-track-dot { background: var(--success); border-color: var(--success); color: #fff; }
  .dq-track.current .dq-track-dot { border-color: var(--secondary); color: var(--secondary); animation: dq-pulse 2s ease-out infinite; }
  .dq-track strong { display: block; font-size: 14px; color: var(--text); line-height: 1.3; }
  .dq-track span { font-size: 12.5px; color: var(--muted); }
  .dq-track.pending strong { color: #94A3B8; }

  .dq-tracker-note {
    display: flex;
    gap: 12px;
    padding: 12px 14px;
    border-radius: 12px;
    background: var(--accent-soft);
    border: 1px solid #FDE68A;
    border-left: 4px solid var(--accent);
    color: #78560B;
    font-size: 13px;
    line-height: 1.5;
  }
  .dq-tracker-note svg { flex-shrink: 0; margin-top: 1px; color: #B45309; }
  .dq-tracker-note strong { color: var(--primary); }
  .dq-sample { margin-top: 12px; text-align: center; font-size: 12px; color: var(--muted); }

  /* ---------- SECTIONS ---------- */
  .dq-section { padding: 64px 0; }
  .dq-section-alt { background: var(--bg); border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); }
  .dq-section-head { max-width: 640px; margin: 0 auto 40px; text-align: center; }
  .dq-section-head h2 {
    font-size: clamp(27px, 3.4vw, 38px);
    line-height: 1.15;
    font-weight: 800;
    letter-spacing: -.8px;
    color: var(--primary);
    margin-bottom: 14px;
  }
  .dq-section-head p { font-size: 16px; line-height: 1.7; color: var(--muted); }

  /* Features */
  .dq-features { display: grid; grid-template-columns: repeat(4, 1fr); gap: 22px; }
  .dq-feature {
    padding: 28px;
    border-radius: 16px;
    background: #fff;
    border: 1px solid var(--border);
    transition: box-shadow .2s ease, border-color .2s ease, transform .2s ease;
  }
  .dq-feature:hover { transform: translateY(-4px); box-shadow: 0 18px 36px rgba(0, 4, 53, .09); border-color: #CBD5E1; }
  .dq-feature-icon {
    width: 46px;
    height: 46px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 18px;
    border-radius: 12px;
    background: #EFF6FF;
    color: var(--secondary);
  }
  .dq-feature.key { border-top: 4px solid var(--accent); }
  .dq-feature.key .dq-feature-icon { background: var(--accent-soft); color: #B45309; }
  .dq-feature h3 { font-size: 17px; font-weight: 700; color: var(--primary); margin-bottom: 8px; }
  .dq-feature p { font-size: 14.5px; line-height: 1.65; color: var(--muted); }

  /* How it works */
  .dq-how { display: grid; grid-template-columns: repeat(3, 1fr); gap: 28px; position: relative; }
  .dq-how::before {
    content: '';
    position: absolute;
    top: 25px;
    left: 16%;
    right: 16%;
    height: 2px;
    background: repeating-linear-gradient(90deg, #CBD5E1 0 8px, transparent 8px 16px);
  }
  .dq-how-item { position: relative; text-align: center; padding: 0 12px; }
  .dq-how-num {
    position: relative;
    width: 52px;
    height: 52px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 20px;
    border-radius: 50%;
    background: var(--primary);
    color: var(--accent);
    font-size: 20px;
    font-weight: 800;
    border: 4px solid var(--bg);
    box-shadow: 0 8px 18px rgba(0, 4, 53, .22);
  }
  .dq-how-item h3 { font-size: 18px; font-weight: 700; color: var(--primary); margin-bottom: 8px; }
  .dq-how-item p { font-size: 14.5px; line-height: 1.65; color: var(--muted); max-width: 300px; margin: 0 auto; }

  /* ---------- COMPACT FOOTER ---------- */
  .dq-footer { background: var(--primary); color: rgba(255, 255, 255, .75); }
  .dq-footer-grid { display: flex; flex-direction: column; align-items: flex-start; gap: 12px; padding: 28px 0 20px; }
  .dq-footer .dq-brand-name { color: #fff; font-size: 18px; }
  .dq-footer .dq-logo { border-color: rgba(255, 255, 255, .8); width: 34px; height: 34px; }
  .dq-footer-about { margin-top: 6px; max-width: 480px; font-size: 13px; line-height: 1.5; color: rgba(255, 255, 255, .7); }
  .dq-footer-bar {
    padding: 12px 0;
    border-top: 1px solid rgba(255, 255, 255, .1);
    font-size: 12px;
    text-align: center;
    color: rgba(255, 255, 255, .5);
  }

  /* ---------- RESPONSIVE ---------- */
  @media (max-width: 1080px) {
    .dq-features { grid-template-columns: repeat(2, 1fr); }
  }
  @media (max-width: 960px) {
    .dq-links { display: none; }
    .dq-hero { padding: 48px 0 60px; }
    .dq-hero-grid { grid-template-columns: 1fr; gap: 40px; }
    .dq-lead { max-width: 640px; }
  }
  @media (max-width: 720px) {
    .dq-how { grid-template-columns: 1fr; gap: 32px; }
    .dq-how::before { display: none; }
    .dq-how-item { display: grid; grid-template-columns: 52px 1fr; gap: 0 18px; text-align: left; padding: 0; }
    .dq-how-num { margin: 0; grid-row: span 2; }
    .dq-how-item p { margin: 0; max-width: none; }
  }
  @media (max-width: 640px) {
    .dq-container { padding: 0 16px; }
    .dq-nav-inner { height: 60px; padding: 0 16px; }
    .dq-logo { width: 34px; height: 34px; }
    .dq-brand-name { font-size: 17px; }
    .dq-brand-sub { display: none; }
    .dq-nav-actions .dq-btn { padding: 7px 12px; font-size: 13px; }
    .dq-hero { padding: 36px 0 48px; }
    .dq-lead { font-size: 15px; }
    .dq-cta .dq-btn { width: 100%; }
    .dq-tracker { padding: 18px; }
    .dq-section { padding: 48px 0; }
    .dq-features { grid-template-columns: 1fr; }
    .dq-footer-grid { padding: 24px 0 16px; }
  }
  @media (max-width: 360px) {
    .dq-nav-register { display: none; }
  }
  @media (prefers-reduced-motion: reduce) {
    html { scroll-behavior: auto; }
    .dq-page *, .dq-page *::before, .dq-page *::after { animation: none !important; transition: none !important; }
    .dq-reveal { opacity: 1 !important; }
  }
`

/* ---------- INLINE ICONS ---------- */
const ico = {
  width: 22,
  height: 22,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
}

const FileIcon = () => (
  <svg {...ico}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <path d="M14 2v6h6M8 13h8M8 17h6" />
  </svg>
)
const TrackIcon = () => (
  <svg {...ico}>
    <circle cx="11" cy="11" r="7" />
    <path d="m21 21-4.3-4.3M11 8v3l2 2" />
  </svg>
)
const BellIcon = () => (
  <svg {...ico}>
    <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.7 21a2 2 0 0 1-3.4 0" />
  </svg>
)
const MailCheckIcon = () => (
  <svg {...ico}>
    <path d="M22 13V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    <path d="m16 19 2 2 4-4" />
  </svg>
)
const CheckIcon = ({ size = 16 }) => (
  <svg {...ico} width={size} height={size} strokeWidth={3}>
    <path d="m5 12 5 5 9-10" />
  </svg>
)
const ArrowIcon = () => (
  <svg {...ico} width={18} height={18}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
)

function LandingPage() {
  const navigate = useNavigate()
  const pageRef = useRef(null)
  const [scrolled, setScrolled] = useState(false)
  const [logoFailed, setLogoFailed] = useState(false)

  /* Navbar shadow on scroll */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /* Scroll reveal */
  useEffect(() => {
    const root = pageRef.current
    if (!root) return

    const items = root.querySelectorAll('.dq-reveal')

    if (!('IntersectionObserver' in window)) {
      items.forEach((el) => el.classList.add('is-visible'))
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    )

    items.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  const Logo = () =>
    logoFailed ? null : (
      <img
        src={logoImage}
        alt="Consolatrix College Logo"
        className="dq-logo"
        onError={() => setLogoFailed(true)}
      />
    )

  return (
    <div className="dq-page" ref={pageRef}>
      <style>{css}</style>

      {/* ---------- NAVBAR ---------- */}
      <header className={`dq-nav${scrolled ? ' is-scrolled' : ''}`}>
        <div className="dq-nav-inner">
          <div className="dq-brand">
            <Logo />
            <div>
              <div className="dq-brand-name">DocQuest</div>
              <small className="dq-brand-sub">Registrar's Office Document Tracking</small>
            </div>
          </div>

          <div className="dq-nav-actions">
            <button className="dq-btn dq-btn-outline" onClick={() => navigate('/login')}>
              Sign In
            </button>
            <button
              className="dq-btn dq-btn-primary dq-nav-register"
              onClick={() => navigate('/register')}
            >
              Register
            </button>
          </div>
        </div>
      </header>

      <main>
        {/* ---------- HERO ---------- */}
        <section className="dq-hero">
          <div className="dq-container dq-hero-grid">
            <div className="dq-hero-copy">
              <div className="dq-badge">
                <span className="dq-badge-dot" />
                Consolatrix College of Toledo City, Inc.
              </div>

              <h1 className="dq-title">
                Easy document processing right <em>at your fingertips.</em>
              </h1>

              <p className="dq-lead">
                DocQuest lets students request and track Registrar's Office documents
                online. Submit a request, follow its progress, and get email updates
                without unnecessary trips to the office.
              </p>

              <div className="dq-cta">
                <button className="dq-btn dq-btn-primary dq-btn-lg" onClick={() => navigate('/register')}>
                  Get started <ArrowIcon />
                </button>
              </div>

              <ul className="dq-checks">
                <li><CheckIcon /> Track every request</li>
                <li><CheckIcon /> Email notifications</li>
              </ul>
            </div>

            {/* Tracker preview */}
            <div className="dq-hero-visual">
              <div>
                <div className="dq-tracker" role="img" aria-label="Sample document request with progress steps">
                  <div className="dq-tracker-head">
                    <div className="dq-tracker-doc">
                      <div className="dq-tracker-icon"><FileIcon /></div>
                      <div>
                        <strong>Document request</strong>
                        <span>Registrar's Office</span>
                      </div>
                    </div>
                    <span className="dq-pill">In progress</span>
                  </div>

                  <ol className="dq-steps-list">
                    <li className="dq-track done">
                      <span className="dq-track-dot"><CheckIcon size={13} /></span>
                      <div>
                        <strong>Request submitted</strong>
                        <span>Your request was received</span>
                      </div>
                    </li>
                    <li className="dq-track current">
                      <span className="dq-track-dot">2</span>
                      <div>
                        <strong>Under review</strong>
                        <span>The Registrar is processing it</span>
                      </div>
                    </li>
                    <li className="dq-track pending">
                      <span className="dq-track-dot">3</span>
                      <div>
                        <strong>Ready for release</strong>
                        <span>You'll be notified by email</span>
                      </div>
                    </li>
                  </ol>

                  <div className="dq-tracker-note">
                    <MailCheckIcon />
                    <span>
                      <strong>Verify your Gmail first.</strong> It is required before you
                      can request documents.
                    </span>
                  </div>
                </div>
                <p className="dq-sample">Sample view of a request in DocQuest</p>
              </div>
            </div>
          </div>
        </section>

        {/* ---------- FEATURES ---------- */}
        <section className="dq-section" id="features">
          <div className="dq-container">
            <div className="dq-section-head dq-reveal">
              <h2>Everything you need to get your documents</h2>
              <p>
                Simple tools that make requesting school documents faster and less
                stressful.
              </p>
            </div>

            <div className="dq-features">
              <article className="dq-feature key dq-reveal" style={{ '--d': '0s' }}>
                <div className="dq-feature-icon"><MailCheckIcon /></div>
                <h3>Gmail verification</h3>
                <p>Verify your Gmail account first. It is required before you can request any document.</p>
              </article>

              <article className="dq-feature dq-reveal" style={{ '--d': '.1s' }}>
                <div className="dq-feature-icon"><FileIcon /></div>
                <h3>Easy document requests</h3>
                <p>Request available Registrar's Office documents through the online system.</p>
              </article>

              <article className="dq-feature dq-reveal" style={{ '--d': '.2s' }}>
                <div className="dq-feature-icon"><TrackIcon /></div>
                <h3>Track your request</h3>
                <p>Check the current status of every document request you have submitted.</p>
              </article>

              <article className="dq-feature dq-reveal" style={{ '--d': '.3s' }}>
                <div className="dq-feature-icon"><BellIcon /></div>
                <h3>Stay updated</h3>
                <p>Get email notifications whenever your document request changes.</p>
              </article>
            </div>
          </div>
        </section>

        {/* ---------- HOW IT WORKS ---------- */}
        <section className="dq-section dq-section-alt" id="how-it-works">
          <div className="dq-container">
            <div className="dq-section-head dq-reveal">
              <h2>Three steps from request to release</h2>
              <p>Everything is handled online, so you only visit the office when your document is ready.</p>
            </div>

            <div className="dq-how">
              <div className="dq-how-item dq-reveal" style={{ '--d': '0s' }}>
                <div className="dq-how-num">1</div>
                <h3>Create an account</h3>
                <p>Register, verify your Gmail, and sign in to your student dashboard.</p>
              </div>

              <div className="dq-how-item dq-reveal" style={{ '--d': '.12s' }}>
                <div className="dq-how-num">2</div>
                <h3>Submit your request</h3>
                <p>Choose the document you need and send your request online.</p>
              </div>

              <div className="dq-how-item dq-reveal" style={{ '--d': '.24s' }}>
                <div className="dq-how-num">3</div>
                <h3>Track and get notified</h3>
                <p>Follow your request's progress and receive updates by email.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ---------- FOOTER ---------- */}
      <footer className="dq-footer">
        <div className="dq-container">
          <div className="dq-footer-grid">
            <div className="dq-brand">
              <Logo />
              <div className="dq-brand-name">DocQuest</div>
            </div>
            <p className="dq-footer-about">
              Registrar's Office Document Tracking Request of Consolatrix
              College of Toledo City, Inc.
            </p>
          </div>

          <div className="dq-footer-bar">
            © {new Date().getFullYear()} DocQuest — Consolatrix College of Toledo City, Inc.
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage