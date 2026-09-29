import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const logoImage = '/cc.png'
const bgImage = '/conso.jpg'

/* ------------------------------------------------------------------ */
/*  Icons                                                             */
/* ------------------------------------------------------------------ */
const Icon = ({ children, size = 20, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    {...props}
  >
    {children}
  </svg>
)

const ArrowLeftIcon = (p) => (
  <Icon {...p}>
    <path d="M19 12H5" />
    <path d="m12 19-7-7 7-7" />
  </Icon>
)
const FileIcon = (p) => (
  <Icon {...p}>
    <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
    <path d="M14 3v5h5" />
    <path d="M9 13h6" />
    <path d="M9 17h4" />
  </Icon>
)
const PlusIcon = (p) => (
  <Icon {...p}>
    <path d="M12 5v14M5 12h14" />
  </Icon>
)
const AlertIcon = (p) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 8v4.5" />
    <path d="M12 16h.01" />
  </Icon>
)
const CheckIcon = (p) => (
  <Icon {...p}>
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </Icon>
)
const ChevronDownIcon = (p) => (
  <Icon {...p}>
    <path d="m6 9 6 6 6-6" />
  </Icon>
)
const InfoIcon = (p) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 11v5" />
    <path d="M12 8h.01" />
  </Icon>
)
const LogoutIcon = (p) => (
  <Icon {...p} size={17}>
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <path d="M16 17l5-5-5-5" />
    <path d="M21 12H9" />
  </Icon>
)

/* ------------------------------------------------------------------ */
/*  Config and helpers                                                */
/* ------------------------------------------------------------------ */
const TIMELINE_STEPS = [
  { key: 'date_requested', label: 'Requested' },
  { key: 'date_approved', label: 'Approved' },
  { key: 'date_processing', label: 'Processing' },
  { key: 'date_ready', label: 'Ready for pickup' },
  { key: 'date_released', label: 'Released' },
]

const STATUS_META = {
  PENDING: {
    label: 'Pending review',
    tone: 'amber',
    hint: 'Waiting for the Registrar to review your request.',
  },
  APPROVED: {
    label: 'Approved',
    tone: 'sky',
    hint: 'Your request is approved. Settle the payment at the Treasurer\u2019s Office so processing can start.',
  },
  PROCESSING: {
    label: 'Processing',
    tone: 'blue',
    hint: 'The Registrar is preparing your document.',
  },
  READY: {
    label: 'Ready for pickup',
    tone: 'green',
    hint: 'Your document is ready. Bring a valid ID when you collect it.',
  },
  RELEASED: {
    label: 'Released',
    tone: 'teal',
    hint: 'This document has been released to you.',
  },
  REJECTED: {
    label: 'Rejected',
    tone: 'red',
    hint: 'This request was rejected. Visit the Registrar\u2019s Office to find out why.',
  },
}

const getStatusMeta = (status) =>
  STATUS_META[status?.toUpperCase()] || { label: status || 'Unknown', tone: 'gray', hint: '' }

const FILTERS = [
  { key: 'ALL', label: 'All', match: () => true },
  { key: 'ACTIVE', label: 'In progress', match: (s) => ['PENDING', 'APPROVED', 'PROCESSING'].includes(s) },
  { key: 'READY', label: 'Ready for pickup', match: (s) => s === 'READY' },
  { key: 'DONE', label: 'Released', match: (s) => s === 'RELEASED' },
  { key: 'REJECTED', label: 'Rejected', match: (s) => s === 'REJECTED' },
]

const formatPeso = (value) =>
  `\u20B1${Number(value || 0).toLocaleString('en-PH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`

const formatDay = (date) =>
  date ? new Date(date).toLocaleDateString('en-PH', { dateStyle: 'medium' }) : ''

const formatTime = (date) =>
  date ? new Date(date).toLocaleTimeString('en-PH', { timeStyle: 'short' }) : ''

const shortId = (id) => {
  const text = String(id ?? '')
  return text.length > 10 ? text.slice(0, 8).toUpperCase() : text
}

/* ------------------------------------------------------------------ */
/*  Component                                                         */
/* ------------------------------------------------------------------ */
function RequestHistory() {
  const navigate = useNavigate()

  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('ALL')
  const [expanded, setExpanded] = useState({})
  const [logoFailed, setLogoFailed] = useState(false)

  // Fonts
  useEffect(() => {
    if (document.getElementById('docquest-fonts')) return
    const link = document.createElement('link')
    link.id = 'docquest-fonts'
    link.rel = 'stylesheet'
    link.href =
      'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&display=swap'
    document.head.appendChild(link)
  }, [])

  // Styles
  useEffect(() => {
    let style = document.getElementById('docquest-history-styles')
    if (!style) {
      style = document.createElement('style')
      style.id = 'docquest-history-styles'
      document.head.appendChild(style)
    }
    style.textContent = CSS
  }, [])

  useEffect(() => {
    loadRequestHistory()
  }, [])

  const loadRequestHistory = async () => {
    try {
      setLoading(true)
      setError('')

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()

      if (userError) throw userError

      if (!user) {
        navigate('/login', { replace: true })
        return
      }

      const { data, error: requestError } = await supabase
        .from('document_requests')
        .select(`
          id,
          quantity,
          purpose,
          additional_details,
          total_amount,
          payment_status,
          status,
          date_requested,
          date_approved,
          date_processing,
          date_ready,
          date_released,
          document_types (
            name,
            price
          )
        `)
        .eq('user_id', user.id)
        .neq('status', 'CANCEL')
        .order('date_requested', { ascending: false })

      if (requestError) throw requestError

      setRequests(data || [])
    } catch (err) {
      console.error('Request History error:', err)
      setError(err?.message || 'Unable to load your request history.')
    } finally {
      setLoading(false)
    }
  }

  const counts = useMemo(() => {
    const result = {}
    FILTERS.forEach((f) => {
      result[f.key] = requests.filter((r) => f.match(r.status?.toUpperCase())).length
    })
    return result
  }, [requests])

  const visibleRequests = useMemo(() => {
    const active = FILTERS.find((f) => f.key === filter) || FILTERS[0]
    return requests.filter((r) => active.match(r.status?.toUpperCase()))
  }, [requests, filter])

  const toggleExpanded = (id) => setExpanded((prev) => ({ ...prev, [id]: !prev[id] }))

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/login', { replace: true })
  }

  const Logo = () => (
    <div className="dq-logo">
      {logoFailed ? (
        'DQ'
      ) : (
        <img
          src={logoImage}
          alt="Consolatrix College Logo"
          onError={() => setLogoFailed(true)}
        />
      )}
    </div>
  )

  const Backdrop = () => (
    <>
      <div className="dq-bg" />
      <div className="dq-orb dq-orb-1" />
      <div className="dq-orb dq-orb-2" />
      <div className="dq-orb dq-orb-3" />
    </>
  )

  /* ---------------------------- Back Button ---------------------------- */
  const backButton = (
    <button
      type="button"
      onClick={() => navigate('/dashboard')}
      className="rh-back"
      aria-label="Back to dashboard"
    >
      <ArrowLeftIcon size={18} />
      <span>Back to dashboard</span>
    </button>
  )

  return (
    <div className="rh-page">
      <Backdrop />

      {/* Glassmorphic Sticky Navbar */}
      <header className="dq-nav">
        <div className="dq-nav-inner">
          <div className="dq-brand rh-brand">
            <Logo />
            <div className="dq-min-w-0">
              <div className="dq-brand-name">DocQuest</div>
              <small className="dq-brand-sub">
                Registrar's Office Document Tracking Request System
              </small>
            </div>
          </div>

          <div className="dq-nav-right">
            {backButton}
            <button
              className="dq-btn dq-btn-outline"
              onClick={handleLogout}
              aria-label="Logout"
            >
              <LogoutIcon size={17} />
              <span className="dq-btn-label">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="rh-container">
        {/* ------------------------- Gradient Hero Banner ------------------------- */}
        <section className="dq-welcome rh-hero">
          <div>
            <span className="dq-eyebrow">
              <span className="dq-eyebrow-dot" /> Request History
            </span>

            <h1>Track your document requests</h1>

            <p>See where each document request stands, from review to pickup.</p>
          </div>

          <button type="button" onClick={() => navigate('/request-document')} className="dq-btn dq-btn-gold rh-hero-btn">
            <PlusIcon size={18} />
            New request
          </button>
        </section>

        {/* ------------------------- Loading Skeleton ------------------------- */}
        {loading && (
          <div className="rh-skeleton-wrapper" role="status" aria-live="polite">
            <div className="rh-skeleton-filter-bar">
              <div className="rh-skeleton-pill" />
              <div className="rh-skeleton-pill" />
              <div className="rh-skeleton-pill" />
            </div>
            {[1, 2].map((n) => (
              <div key={n} className="rh-skeleton-card">
                <div className="rh-skeleton-header">
                  <div className="rh-skeleton-avatar" />
                  <div className="rh-skeleton-text-group">
                    <div className="rh-skeleton-line title" />
                    <div className="rh-skeleton-line sub" />
                  </div>
                  <div className="rh-skeleton-badge" />
                </div>
                <div className="rh-skeleton-body">
                  <div className="rh-skeleton-line fact" />
                  <div className="rh-skeleton-line fact" />
                  <div className="rh-skeleton-line fact" />
                </div>
              </div>
            ))}
            <div className="rh-skeleton-caption">Loading your document requests...</div>
          </div>
        )}

        {/* ------------------------- Error ------------------------- */}
        {!loading && error && (
          <div className="rh-alert" role="alert">
            <AlertIcon size={20} />
            <div className="rh-alert__body">
              <strong>We couldn't load your requests</strong>
              <p>{error}</p>
            </div>
            <button type="button" onClick={loadRequestHistory} className="rh-btn rh-btn--ghost rh-btn--sm">
              Try again
            </button>
          </div>
        )}

        {/* ------------------------- Empty ------------------------- */}
        {!loading && !error && requests.length === 0 && (
          <div className="rh-empty">
            <span className="rh-empty__icon">
              <FileIcon size={28} />
            </span>
            <h2>No requests yet</h2>
            <p>When you request a transcript, certificate, or other record, it will show up here.</p>
            <button type="button" onClick={() => navigate('/request-document')} className="rh-btn rh-btn--primary">
              <PlusIcon size={18} />
              Request a document
            </button>
          </div>
        )}

        {/* ------------------------- List ------------------------- */}
        {!loading && requests.length > 0 && (
          <>
            <div className="rh-filters" role="group" aria-label="Filter requests by status">
              {FILTERS.filter((f) => f.key === 'ALL' || counts[f.key] > 0).map((f) => (
                <button
                  key={f.key}
                  type="button"
                  className={`rh-filter ${filter === f.key ? 'is-active' : ''}`}
                  aria-pressed={filter === f.key}
                  onClick={() => setFilter(f.key)}
                >
                  {f.label}
                  <span className="rh-filter__count">{counts[f.key]}</span>
                </button>
              ))}
            </div>

            {visibleRequests.length === 0 ? (
              <div className="rh-empty rh-empty--small">
                <p>No requests match this filter.</p>
                <button type="button" onClick={() => setFilter('ALL')} className="rh-linkbtn">
                  Show all requests
                </button>
              </div>
            ) : (
              <ul className="rh-list">
                {visibleRequests.map((request) => {
                  const status = request.status?.toUpperCase()
                  const meta = getStatusMeta(request.status)
                  const isPaid = request.payment_status?.toUpperCase() === 'PAID'
                  const isRejected = status === 'REJECTED'
                  const copies = Number(request.quantity) || 1
                  const isOpen = Boolean(expanded[request.id])

                  const lastDoneIndex = TIMELINE_STEPS.reduce(
                    (last, step, i) => (request[step.key] ? i : last),
                    -1
                  )

                  return (
                    <li key={request.id} className="rh-card">
                      {/* Header */}
                      <div className="rh-card__head">
                        <span className="rh-card__icon">
                          <FileIcon size={22} />
                        </span>
                        <div className="rh-card__title">
                          <h2>{request.document_types?.name || 'Document request'}</h2>
                          <span className="rh-ref" title={`Reference ${request.id}`}>
                            Ref. #{shortId(request.id)}
                          </span>
                        </div>
                        <span className={`rh-badge rh-tone--${meta.tone}`}>
                          <span className="rh-badge__dot" />
                          {meta.label}
                        </span>
                      </div>

                      {/* Key facts */}
                      <dl className="rh-facts">
                        <div>
                          <dt>Requested</dt>
                          <dd>{formatDay(request.date_requested) || '\u2014'}</dd>
                        </div>
                        <div>
                          <dt>Copies</dt>
                          <dd>{copies}</dd>
                        </div>
                        <div>
                          <dt>Total</dt>
                          <dd>{formatPeso(request.total_amount)}</dd>
                        </div>
                        <div>
                          <dt>Payment</dt>
                          <dd>
                            <span className={`rh-pay ${isPaid ? 'is-paid' : 'is-unpaid'}`}>
                              {isPaid ? 'Paid' : 'Unpaid'}
                            </span>
                          </dd>
                        </div>
                      </dl>

                      {/* Next step message */}
                      {meta.hint && (
                        <div className={`rh-hint rh-tone--${meta.tone}`}>
                          <InfoIcon size={18} />
                          <p>{meta.hint}</p>
                        </div>
                      )}
                      {!isPaid && !isRejected && status !== 'APPROVED' && (
                        <p className="rh-paynote">
                          Payment is still due at the Treasurer's Office before this request is processed.
                        </p>
                      )}

                      {/* Timeline */}
                      <ol className="rh-track" aria-label="Request progress">
                        {TIMELINE_STEPS.map((step, index) => {
                          const done = Boolean(request[step.key])
                          const current = index === lastDoneIndex && !isRejected
                          const linked = done && Boolean(request[TIMELINE_STEPS[index + 1]?.key])
                          return (
                            <li
                              key={step.key}
                              className={`rh-tstep ${done ? 'is-done' : ''} ${current ? 'is-current' : ''} ${linked ? 'is-linked' : ''}`}
                              aria-current={current ? 'step' : undefined}
                            >
                              <span className="rh-tstep__dot">
                                {done ? <CheckIcon size={14} strokeWidth={2.8} /> : index + 1}
                              </span>
                              <span className="rh-tstep__label">{step.label}</span>
                              <span className="rh-tstep__date">
                                {done ? (
                                  <>
                                    {formatDay(request[step.key])}
                                    <br />
                                    {formatTime(request[step.key])}
                                  </>
                                ) : (
                                  'Not yet'
                                )}
                              </span>
                            </li>
                          )
                        })}
                      </ol>

                      {/* Expandable details */}
                      <button
                        type="button"
                        className="rh-toggle"
                        aria-expanded={isOpen}
                        aria-controls={`rh-details-${request.id}`}
                        onClick={() => toggleExpanded(request.id)}
                      >
                        {isOpen ? 'Hide details' : 'Show details'}
                        <ChevronDownIcon size={16} className={isOpen ? 'is-flipped' : ''} />
                      </button>

                      {isOpen && (
                        <div id={`rh-details-${request.id}`} className="rh-details">
                          <div>
                            <span className="rh-details__label">Purpose</span>
                            <p>{request.purpose || '\u2014'}</p>
                          </div>
                          <div>
                            <span className="rh-details__label">Price per copy</span>
                            <p>{formatPeso(request.document_types?.price)}</p>
                          </div>
                          {request.additional_details && (
                            <div className="rh-details__wide">
                              <span className="rh-details__label">Additional notes</span>
                              <p>{request.additional_details}</p>
                            </div>
                          )}
                        </div>
                      )}
                    </li>
                  )
                })}
              </ul>
            )}
          </>
        )}
      </main>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Styles                                                            */
/* ------------------------------------------------------------------ */
const CSS = `
.rh-page {
  --primary: #000435;
  --primary-2: #0a1050;
  --secondary: #2563EB;
  --accent: #F4B400;
  --accent-soft: #FFFBEB;
  --text: #1E293B;
  --muted: #64748B;
  --border: #E2E8F0;
  --success: #16A34A;
  --error: #DC2626;
  --card: #ffffff;
  --ease: cubic-bezier(.22, 1, .36, 1);

  --ink: #0f172a;
  --ink-2: #334155;
  --line: #e2e8f0;
  --line-soft: #f1f5f9;
  --blue: #2563eb;
  --blue-dark: #1d4ed8;
  --blue-soft: #eff6ff;
  --gold: #f59e0b;

  position: relative;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--primary);
  color: var(--text);
  font-family: 'Inter', 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 15px;
  line-height: 1.5;
  padding-bottom: 72px;
  box-sizing: border-box;
  overflow-x: clip;
}
.rh-page *, .rh-page *::before, .rh-page *::after { box-sizing: border-box; }
.rh-page h1, .rh-page h2, .rh-page p, .rh-page dl, .rh-page dd, .rh-page dt, .rh-page ol, .rh-page ul { margin: 0; padding: 0; }
.rh-page h1, .rh-page h2, .rh-btn, .rh-back, .rh-filter { font-family: 'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif; }
.rh-page button { font: inherit; }
.rh-page ul, .rh-page ol { list-style: none; }
.rh-page :focus-visible { outline: 3px solid rgba(96, 165, 250, .7); outline-offset: 2px; }
.rh-page > *:not(.dq-bg):not(.dq-orb) { position: relative; z-index: 2; }

/* ---------- ANIMATED BACKGROUND ---------- */
.dq-bg {
  position: fixed;
  inset: 0;
  z-index: 0;
  background:
    linear-gradient(160deg, rgba(0, 4, 53, .72) 0%, rgba(0, 4, 53, .5) 45%, rgba(0, 4, 53, .8) 100%),
    url('${bgImage}') center / cover no-repeat;
  animation: dq-kenburns 28s ease-in-out infinite alternate;
  will-change: transform;
}
.dq-orb {
  position: fixed;
  z-index: 1;
  border-radius: 50%;
  filter: blur(90px);
  pointer-events: none;
  opacity: .28;
}
.dq-orb-1 { width: 420px; height: 420px; top: -120px; left: -100px; background: #3B82F6; animation: dq-drift 20s ease-in-out infinite; }
.dq-orb-2 { width: 360px; height: 360px; bottom: -100px; right: -80px; background: var(--accent); opacity: .18; animation: dq-drift 24s ease-in-out infinite reverse; }
.dq-orb-3 { width: 300px; height: 300px; top: 40%; left: 45%; background: #8B5CF6; opacity: .14; animation: dq-drift 28s ease-in-out infinite; }

/* ---------- KEYFRAMES ---------- */
@keyframes dq-kenburns { from { transform: scale(1); } to { transform: scale(1.09) translate(-1%, -1%); } }
@keyframes dq-drift {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33%      { transform: translate(50px, 30px) scale(1.1); }
  66%      { transform: translate(-30px, 50px) scale(.94); }
}
@keyframes dq-spin { to { transform: rotate(360deg); } }
@keyframes dq-rise { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: none; } }
@keyframes dq-drop { from { opacity: 0; transform: translateY(-100%); } to { opacity: 1; transform: none; } }
@keyframes dq-fade { from { opacity: 0; } to { opacity: 1; } }
@keyframes dq-pop { from { opacity: 0; transform: scale(.94) translateY(10px); } to { opacity: 1; transform: none; } }
@keyframes dq-flow { 0% { background-position: 0% 50%; } 100% { background-position: 200% 50%; } }
@keyframes dq-sweep { from { transform: translateX(-120%) skewX(-20deg); } to { transform: translateX(320%) skewX(-20deg); } }
@keyframes dq-ring { 0% { box-shadow: 0 0 0 0 rgba(244, 180, 0, .55); } 100% { box-shadow: 0 0 0 14px rgba(244, 180, 0, 0); } }
@keyframes dq-live { 0% { box-shadow: 0 0 0 0 rgba(74, 222, 128, .6); } 100% { box-shadow: 0 0 0 9px rgba(74, 222, 128, 0); } }
@keyframes dq-bob { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
@keyframes dq-shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
@keyframes dq-pulse-ring { 0% { box-shadow: 0 0 0 0 rgba(37,99,235,.45); } 100% { box-shadow: 0 0 0 10px rgba(37,99,235,0); } }

/* ---------- BUTTONS ---------- */
.dq-btn {
  display: inline-flex; align-items: center; justify-content: center; gap: 8px;
  padding: 10px 18px; border-radius: 10px; border: 1px solid transparent;
  font-size: 14px; font-weight: 700; font-family: inherit; cursor: pointer; white-space: nowrap;
  transition: background .2s ease, border-color .2s ease, box-shadow .2s ease, transform .2s ease, opacity .2s ease;
  position: relative; overflow: hidden;
}
.dq-btn:not(:disabled):hover { transform: translateY(-2px); }
.dq-btn:not(:disabled):active { transform: scale(.97); }
.dq-btn:disabled { opacity: .65; cursor: not-allowed; }
.dq-btn-outline { background: rgba(255,255,255,.95); color: var(--text); border-color: #CBD5E1; box-shadow: 0 2px 8px rgba(0,0,0,.06); }
.dq-btn-outline:not(:disabled):hover { background: #F1F5F9; border-color: #94A3B8; }
.dq-btn-gold { background: var(--accent); color: var(--primary); box-shadow: 0 8px 20px rgba(244, 180, 0, .35); }
.dq-btn-gold::after {
  content: ''; position: absolute; top: 0; left: 0; width: 40%; height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, .55), transparent);
  animation: dq-sweep 3.2s ease-in-out 1.2s infinite;
}
.dq-btn-gold:not(:disabled):hover { background: #FFC61A; }

/* ---------- NAVBAR ---------- */
.dq-nav {
  position: sticky; top: 0; z-index: 20; width: 100%;
  background: rgba(255, 255, 255, .9); backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px);
  border-bottom: 1px solid rgba(255, 255, 255, .5); box-shadow: 0 6px 24px rgba(0, 0, 0, .12);
  animation: dq-drop .7s var(--ease) backwards;
}
.dq-nav::after {
  content: ''; position: absolute; left: 0; right: 0; bottom: -1px; height: 2px;
  background: linear-gradient(90deg, var(--primary), var(--secondary), var(--accent), var(--secondary), var(--primary));
  background-size: 200% 100%; animation: dq-flow 6s linear infinite; opacity: .9;
}
.dq-nav-inner { display: flex; align-items: center; justify-content: space-between; gap: 16px; width: 100%; max-width: 1280px; margin: 0 auto; padding: 0 24px; height: 68px; }
.dq-brand { display: flex; align-items: center; gap: 12px; min-width: 0; }
.dq-logo {
  width: 44px; height: 44px; flex-shrink: 0; display: flex; align-items: center; justify-content: center;
  border-radius: 50%; border: 2px solid var(--primary); background: var(--primary); color: var(--accent);
  font-size: 16px; font-weight: 800; overflow: hidden; transition: transform .6s var(--ease);
}
.dq-brand:hover .dq-logo { transform: rotate(360deg) scale(1.06); }
.dq-logo img { width: 100%; height: 100%; object-fit: cover; background: #fff; }
.dq-brand-name { font-size: 20px; font-weight: 800; letter-spacing: -.4px; color: var(--primary); line-height: 1.1; }
.dq-brand-sub { display: block; margin-top: 2px; font-size: 11.5px; font-weight: 500; color: var(--muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.dq-min-w-0 { min-width: 0; }

.dq-nav-right { display: flex; align-items: center; gap: 14px; }

/* ---------- WELCOME / HERO BANNER ---------- */
.dq-welcome {
  position: relative; overflow: hidden;
  display: flex; align-items: center; justify-content: space-between; gap: 24px;
  padding: 28px 36px; margin-bottom: 26px; border-radius: 24px; color: #fff !important;
  background: linear-gradient(120deg, rgba(0, 4, 53, .96), rgba(13, 26, 92, .93), rgba(20, 50, 140, .9), rgba(0, 4, 53, .96));
  background-size: 280% 280%;
  border: 1px solid rgba(255, 255, 255, .14);
  box-shadow: 0 30px 70px rgba(0, 0, 0, .4);
  backdrop-filter: blur(8px);
  animation: dq-rise .8s var(--ease) backwards, dq-flow 20s linear infinite;
  flex-wrap: wrap;
}
.dq-welcome::before {
  content: ''; position: absolute; width: 360px; height: 360px; top: -180px; right: -80px;
  border-radius: 50%; background: rgba(255, 255, 255, .07); animation: dq-bob 7s ease-in-out infinite;
}
.dq-welcome::after {
  content: ''; position: absolute; width: 240px; height: 240px; bottom: -130px; left: 34%;
  border-radius: 50%; background: rgba(244, 180, 0, .16); animation: dq-bob 9s ease-in-out 1s infinite;
}
.dq-welcome > * { position: relative; z-index: 1; }
.dq-eyebrow {
  display: inline-flex; align-items: center; gap: 8px; margin-bottom: 10px; padding: 5px 12px;
  border-radius: 999px; background: rgba(255, 255, 255, .1); border: 1px solid rgba(255, 255, 255, .18);
  font-size: 12px; font-weight: 700; color: #fff !important; letter-spacing: .2px;
}
.dq-eyebrow-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--accent); animation: dq-ring 2s ease-out infinite; }
.dq-welcome h1 {
  font-size: clamp(22px, 2.8vw, 34px); font-weight: 800; letter-spacing: -.6px; line-height: 1.2;
  margin-bottom: 8px; color: #fff !important;
}
.dq-welcome p { max-width: 600px; font-size: 14px; line-height: 1.65; color: rgba(255, 255, 255, .85) !important; }

.rh-hero-btn { flex-shrink: 0; }

/* ---------- Back Button ---------- */
.rh-back {
  display: inline-flex; align-items: center; gap: 8px;
  height: 38px; padding: 0 16px 0 12px;
  border: 1px solid #CBD5E1; border-radius: 999px;
  background: rgba(255,255,255,.95); color: var(--text);
  font-size: 14px; font-weight: 600; cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, .06);
  transition: background 0.2s ease, border-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
}
.rh-back svg { transition: transform 0.2s ease; }
.rh-back:hover { background: #F1F5F9; border-color: #94A3B8; box-shadow: 0 4px 14px rgba(0,0,0,.08); transform: translateY(-1px); }
.rh-back:hover svg { transform: translateX(-2px); }
.rh-back:active { background: #E2E8F0; transform: translateY(0); }

/* ---------- Layout ---------- */
.rh-container { width: 100%; max-width: 1100px; margin: 0 auto; padding: 28px 24px 0; }

/* ---------- Buttons ---------- */
.rh-btn {
  display: inline-flex; align-items: center; justify-content: center; gap: 8px;
  padding: 10px 18px; border-radius: 10px; border: 1px solid transparent;
  font-size: 14px; font-weight: 700; cursor: pointer;
  transition: background 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
}
.rh-btn:active { transform: scale(.97); }
.rh-btn--primary {
  background: var(--secondary); color: #fff;
  box-shadow: 0 8px 20px rgba(37, 99, 235, .28);
}
.rh-btn--primary:hover { background: var(--blue-dark); transform: translateY(-2px); box-shadow: 0 12px 26px rgba(37, 99, 235, .35); }
.rh-btn--ghost { background: rgba(255,255,255,.95); color: var(--text); border-color: var(--border); }
.rh-btn--ghost:hover { background: #F1F5F9; border-color: #94A3B8; }
.rh-btn--sm { padding: 8px 14px; font-size: 13px; flex-shrink: 0; }
.rh-linkbtn {
  background: none; border: 0; padding: 0; color: var(--secondary);
  font-size: 14px; font-weight: 600; cursor: pointer;
  text-decoration: underline; text-underline-offset: 3px;
}
.rh-linkbtn:hover { color: var(--primary); }

/* ---------- Skeleton Loader (Shimmer instead of flat pulse) ---------- */
.rh-skeleton-wrapper {
  display: flex; flex-direction: column; gap: 16px; margin-top: 10px;
  animation: dq-rise .6s var(--ease);
}
.rh-skeleton-filter-bar {
  display: flex; gap: 10px; margin-bottom: 8px;
}
.rh-skeleton-pill,
.rh-skeleton-avatar,
.rh-skeleton-line,
.rh-skeleton-badge {
  background: linear-gradient(90deg, #E2E8F0 0%, #F1F5F9 40%, #F8FAFC 50%, #F1F5F9 60%, #E2E8F0 100%);
  background-size: 200% 100%;
  animation: dq-shimmer 1.6s linear infinite;
}
.rh-skeleton-pill {
  width: 80px; height: 32px; border-radius: 999px;
}
.rh-skeleton-card {
  background: rgba(255,255,255,.97); border: 1px solid rgba(255,255,255,.7); border-radius: 22px;
  padding: 24px; display: flex; flex-direction: column; gap: 18px;
  backdrop-filter: blur(8px);
  box-shadow: 0 18px 44px rgba(0, 0, 0, .2);
}
.rh-skeleton-header {
  display: flex; align-items: center; gap: 14px;
}
.rh-skeleton-avatar {
  width: 46px; height: 46px; border-radius: 12px;
}
.rh-skeleton-text-group {
  flex: 1; display: flex; flex-direction: column; gap: 8px;
}
.rh-skeleton-line {
  border-radius: 6px;
}
.rh-skeleton-line.title { width: 40%; height: 18px; }
.rh-skeleton-line.sub { width: 20%; height: 12px; }
.rh-skeleton-line.fact { width: 100%; height: 14px; }
.rh-skeleton-badge {
  width: 90px; height: 26px; border-radius: 999px;
}
.rh-skeleton-body {
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px;
  padding-top: 12px; border-top: 1px solid var(--line-soft);
}
.rh-skeleton-caption {
  text-align: center; color: rgba(255,255,255,.75); font-size: 13.5px; margin-top: 12px; font-weight: 500;
}

/* ---------- Alert & Empty ---------- */
.rh-alert {
  display: flex; align-items: center; gap: 14px;
  background: rgba(254, 242, 242, .96); border: 1px solid #FECACA; color: #991B1B;
  padding: 16px 18px; border-radius: 16px; margin-bottom: 22px;
  backdrop-filter: blur(6px);
  box-shadow: 0 14px 34px rgba(0, 0, 0, .2);
  animation: dq-pop .45s var(--ease);
}
.rh-alert > svg { flex-shrink: 0; }
.rh-alert__body { flex: 1; min-width: 0; }
.rh-alert__body strong { display: block; font-size: 14px; }
.rh-alert__body p { font-size: 13.5px; margin-top: 2px; }
@media (max-width: 560px) { .rh-alert { flex-wrap: wrap; } }

.rh-empty {
  background: rgba(255, 255, 255, .96); border: 1px solid rgba(255,255,255,.7); border-radius: 24px;
  padding: 56px 32px; text-align: center;
  display: flex; flex-direction: column; align-items: center; gap: 8px;
  backdrop-filter: blur(10px);
  box-shadow: 0 30px 70px rgba(0, 0, 0, .32);
  animation: dq-pop .5s var(--ease);
}
.rh-empty__icon {
  width: 72px; height: 72px; border-radius: 20px; margin-bottom: 8px;
  background: linear-gradient(135deg, var(--accent-soft), #FEF3C7); color: #B45309;
  display: flex; align-items: center; justify-content: center;
  animation: dq-bob 3s ease-in-out infinite;
}
.rh-empty h2 { font-size: 20px; font-weight: 800; color: var(--primary); }
.rh-empty p { color: var(--muted); max-width: 40ch; margin-bottom: 12px; }
.rh-empty--small { padding: 36px 24px; }
.rh-empty--small p { margin-bottom: 0; }

/* ---------- Filters ---------- */
.rh-filters { display: flex; gap: 8px; overflow-x: auto; padding-bottom: 4px; margin-bottom: 22px; scrollbar-width: none; }
.rh-filters::-webkit-scrollbar { display: none; }
.rh-filter {
  display: inline-flex; align-items: center; gap: 8px; flex-shrink: 0;
  padding: 8px 14px; border-radius: 999px;
  border: 1px solid var(--border); background: rgba(255,255,255,.96); color: var(--ink-2);
  font-size: 13.5px; font-weight: 600; cursor: pointer;
  backdrop-filter: blur(6px);
  transition: background 0.2s ease, border-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
  box-shadow: 0 2px 8px rgba(0,0,0,.06);
}
.rh-filter:hover { border-color: #93C5FD; transform: translateY(-1px); box-shadow: 0 4px 14px rgba(37,99,235,.15); }
.rh-filter__count {
  min-width: 22px; padding: 0 6px; border-radius: 999px;
  background: #F1F5F9; color: var(--muted);
  font-size: 12px; font-weight: 700; text-align: center;
  transition: background 0.2s ease, color 0.2s ease;
}
.rh-filter.is-active {
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  border-color: transparent;
  color: #fff;
  box-shadow: 0 8px 20px rgba(0, 4, 53, .28);
}
.rh-filter.is-active .rh-filter__count { background: rgba(255, 255, 255, .18); color: #fff; }

/* ---------- Request cards ---------- */
.rh-list { display: flex; flex-direction: column; gap: 22px; }
.rh-card {
  background: rgba(255, 255, 255, .97); border: 1px solid rgba(255,255,255,.75); border-radius: 22px;
  padding: 24px 28px;
  backdrop-filter: blur(10px);
  box-shadow: 0 18px 44px rgba(0, 0, 0, .2);
  transition: transform .3s var(--ease), box-shadow .3s ease, border-color .3s ease;
  animation: dq-rise .6s var(--ease) backwards;
  position: relative;
  overflow: hidden;
}
.rh-card::after {
  content: ''; position: absolute; top: 0; left: 0; right: 0; height: 4px; z-index: 2;
  background: linear-gradient(90deg, var(--primary), var(--secondary), var(--accent));
  transform: scaleX(0); transform-origin: left; transition: transform .45s var(--ease);
}
.rh-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 28px 58px rgba(0, 0, 0, .28);
  border-color: rgba(37,99,235,.2);
}
.rh-card:hover::after { transform: scaleX(1); }
@media (max-width: 560px) { .rh-card { padding: 20px; border-radius: 18px; } }

.rh-card__head { display: flex; align-items: center; gap: 14px; }
.rh-card__icon {
  flex-shrink: 0; width: 48px; height: 48px; border-radius: 14px;
  background: linear-gradient(135deg, #EFF6FF, #DBEAFE); color: var(--secondary);
  display: flex; align-items: center; justify-content: center;
  transition: transform .4s var(--ease), box-shadow .3s ease;
}
.rh-card:hover .rh-card__icon { transform: scale(1.08) rotate(-5deg); box-shadow: 0 10px 20px rgba(37,99,235,.16); }
.rh-card__title { flex: 1; min-width: 0; }
.rh-card__title h2 { font-size: 18px; font-weight: 800; letter-spacing: -0.01em; line-height: 1.25; color: var(--primary); }
.rh-ref { display: block; margin-top: 3px; font-size: 12.5px; color: var(--muted); font-variant-numeric: tabular-nums; font-weight: 600; }
@media (max-width: 560px) {
  .rh-card__head { flex-wrap: wrap; }
  .rh-card__title { flex-basis: calc(100% - 62px); }
  .rh-badge { margin-left: 62px; }
}

/* ---------- Status badge and tones (gradient palette matching AdminDashboard dq-status-*) ---------- */
.rh-badge {
  display: inline-flex; align-items: center; gap: 7px; flex-shrink: 0;
  padding: 6px 14px; border-radius: 999px;
  font-size: 12px; font-weight: 800; letter-spacing: .2px; text-transform: uppercase;
  border: 1px solid transparent;
}
.rh-badge__dot { width: 8px; height: 8px; border-radius: 50%; background: currentColor; }

.rh-tone--amber { background: linear-gradient(135deg, #FEF3C7, #FDE68A); color: #92400E; border-color: #FCD34D; }
.rh-tone--amber .rh-badge__dot { background: #F59E0B; animation: dq-ring 2s ease-out infinite; }

.rh-tone--sky   { background: linear-gradient(135deg, #CFFAFE, #A5F3FC); color: #155E75; border-color: #67E8F9; }
.rh-tone--sky .rh-badge__dot { background: #06B6D4; }

.rh-tone--blue  { background: linear-gradient(135deg, #DBEAFE, #BFDBFE); color: #1E40AF; border-color: #93C5FD; }
.rh-tone--blue .rh-badge__dot { background: var(--secondary); animation: dq-ring 2s ease-out infinite; }

.rh-tone--green { background: linear-gradient(135deg, #CCFBF1, #99F6E4); color: #115E59; border-color: #5EEAD4; }
.rh-tone--green .rh-badge__dot { background: #0D9488; animation: dq-ring 2s ease-out infinite; }

.rh-tone--teal  { background: linear-gradient(135deg, #DCFCE7, #BBF7D0); color: #14532D; border-color: #86EFAC; }
.rh-tone--teal .rh-badge__dot { background: var(--success); }

.rh-tone--red   { background: linear-gradient(135deg, #FEE2E2, #FECACA); color: #7F1D1D; border-color: #FCA5A5; }
.rh-tone--red .rh-badge__dot { background: var(--error); }

.rh-tone--gray  { background: linear-gradient(135deg, #F1F5F9, #E2E8F0); color: #334155; border-color: #CBD5E1; }
.rh-tone--gray .rh-badge__dot { background: #64748B; }

/* ---------- Facts ---------- */
.rh-facts {
  display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 20px;
  margin-top: 22px; padding: 20px 0;
  border-top: 1px solid var(--line-soft); border-bottom: 1px solid var(--line-soft);
}
.rh-facts div {
  position: relative;
  padding-left: 14px;
}
.rh-facts div::before {
  content: ''; position: absolute; left: 0; top: 6px; bottom: 6px; width: 3px; border-radius: 4px;
  background: linear-gradient(180deg, var(--secondary), var(--accent));
  opacity: .6;
}
.rh-facts dt { font-size: 11.5px; color: var(--muted); margin-bottom: 4px; font-weight: 700; text-transform: uppercase; letter-spacing: .5px; }
.rh-facts dd { font-size: 15.5px; font-weight: 800; color: var(--text); letter-spacing: -.2px; }
@media (max-width: 640px) { .rh-facts { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; } }

.rh-pay { display: inline-flex; align-items: center; gap: 6px; font-size: 14px; font-weight: 800; }
.rh-pay::before { content: ''; width: 8px; height: 8px; border-radius: 50%; background: currentColor; }
.rh-pay.is-paid { color: #15803d; }
.rh-pay.is-paid::before { box-shadow: 0 0 0 3px rgba(34,197,94,.2); animation: dq-live 2.2s ease-out infinite; }
.rh-pay.is-unpaid { color: #b45309; }
.rh-pay.is-unpaid::before { animation: dq-pulse-ring 1.8s ease-out infinite; }

/* ---------- Hint ---------- */
.rh-hint {
  display: flex; align-items: flex-start; gap: 10px;
  margin-top: 18px; padding: 14px 16px; border-radius: 14px; border: 1px solid;
  font-weight: 500;
}
.rh-hint svg { flex-shrink: 0; margin-top: 1px; }
.rh-hint p { font-size: 13.5px; line-height: 1.6; }
.rh-tone--amber.rh-hint { background: linear-gradient(135deg, #FFFBEB, #FEF3C7); color: #92400E; border-color: #FDE68A; }
.rh-tone--sky.rh-hint   { background: linear-gradient(135deg, #ECFEFF, #CFFAFE); color: #155E75; border-color: #A5F3FC; }
.rh-tone--blue.rh-hint  { background: linear-gradient(135deg, #EFF6FF, #DBEAFE); color: #1E40AF; border-color: #BFDBFE; }
.rh-tone--green.rh-hint { background: linear-gradient(135deg, #F0FDFA, #CCFBF1); color: #115E59; border-color: #99F6E4; }
.rh-tone--teal.rh-hint  { background: linear-gradient(135deg, #F0FDF4, #DCFCE7); color: #14532D; border-color: #BBF7D0; }
.rh-tone--red.rh-hint   { background: linear-gradient(135deg, #FEF2F2, #FEE2E2); color: #7F1D1D; border-color: #FECACA; }
.rh-tone--gray.rh-hint  { background: linear-gradient(135deg, #F8FAFC, #F1F5F9); color: #334155; border-color: #E2E8F0; }

.rh-paynote { margin-top: 12px; font-size: 13px; color: #b45309; font-weight: 500; padding: 10px 14px; border-radius: 12px; background: linear-gradient(135deg, #FFFBEB, #FEF3C7); border: 1px solid #FDE68A; }

/* ---------- Timeline with shimmer/pulse on active step ---------- */
.rh-track { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); margin-top: 26px; }
.rh-tstep { position: relative; padding-top: 36px; padding-right: 10px; }
.rh-tstep::after {
  content: ''; position: absolute; top: 12px; left: 34px; right: 10px; height: 2px;
  background: var(--border); border-radius: 2px;
  transition: background 0.3s ease;
}
.rh-tstep:last-child::after { display: none; }
.rh-tstep.is-linked::after { background: linear-gradient(90deg, var(--secondary), var(--accent)); }

.rh-tstep__dot {
  position: absolute; top: 0; left: 0; width: 26px; height: 26px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  background: #fff; border: 2px solid var(--border); color: #94a3b8;
  font-size: 11px; font-weight: 800; z-index: 1;
  transition: background 0.3s ease, border-color 0.3s ease, color 0.3s ease;
}
.rh-tstep.is-done .rh-tstep__dot {
  background: linear-gradient(135deg, var(--secondary), var(--primary));
  border-color: transparent;
  color: #fff;
  box-shadow: 0 6px 16px rgba(37,99,235,.35);
}
.rh-tstep.is-current .rh-tstep__dot {
  background: linear-gradient(135deg, var(--accent), #FFC61A);
  border-color: transparent;
  color: var(--primary);
  animation: dq-pulse-ring 1.8s ease-out infinite, dq-bob 2.4s ease-in-out infinite;
}

.rh-tstep__label { display: block; font-size: 13px; font-weight: 500; color: #94a3b8; line-height: 1.3; }
.rh-tstep.is-done .rh-tstep__label { color: var(--text); font-weight: 700; }
.rh-tstep.is-current .rh-tstep__label { color: var(--primary); font-weight: 800; }
.rh-tstep__date { display: block; margin-top: 4px; font-size: 11.5px; color: #94a3b8; line-height: 1.4; font-weight: 600; }
.rh-tstep.is-done .rh-tstep__date { color: var(--muted); }
.rh-tstep.is-current .rh-tstep__date { color: var(--secondary); font-weight: 700; }

@media (max-width: 700px) {
  .rh-track { grid-template-columns: minmax(0, 1fr); }
  .rh-tstep { padding: 0 0 24px 46px; min-height: 28px; }
  .rh-tstep:last-child { padding-bottom: 0; }
  .rh-tstep::after { top: 30px; bottom: 6px; left: 12px; right: auto; width: 2px; height: auto; }
  .rh-tstep__date br { display: none; }
  .rh-tstep__date::before { content: ''; }
}

/* ---------- Details toggle ---------- */
.rh-toggle {
  display: inline-flex; align-items: center; gap: 6px; margin-top: 22px;
  background: linear-gradient(135deg, rgba(37,99,235,.08), rgba(244,180,0,.08)); border: 1px solid rgba(37,99,235,.15);
  padding: 8px 16px; border-radius: 999px;
  color: var(--secondary); font-size: 13px; font-weight: 700; cursor: pointer;
  transition: background 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
}
.rh-toggle:hover {
  background: linear-gradient(135deg, rgba(37,99,235,.14), rgba(244,180,0,.14));
  border-color: rgba(37,99,235,.3);
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(37,99,235,.15);
  color: var(--primary);
}
.rh-toggle svg { transition: transform 0.25s ease; }
.rh-toggle svg.is-flipped { transform: rotate(180deg); }

.rh-details {
  display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 18px;
  margin-top: 14px; padding: 20px 22px;
  background: linear-gradient(135deg, #F8FAFC 0%, #EFF6FF 50%, #FFFBEB 100%);
  border: 1px solid #DBEAFE; border-radius: 16px;
  animation: dq-pop .4s var(--ease);
}
.rh-details__wide { grid-column: 1 / -1; }
.rh-details__label {
  display: block; font-size: 11.5px; color: var(--muted); margin-bottom: 5px;
  font-weight: 700; text-transform: uppercase; letter-spacing: .5px;
}
.rh-details p { font-size: 14.5px; color: var(--text); overflow-wrap: anywhere; font-weight: 600; line-height: 1.6; }
@media (max-width: 560px) { .rh-details { grid-template-columns: minmax(0, 1fr); gap: 14px; padding: 18px; } }

/* ---------- RESPONSIVE ---------- */
@media (max-width: 820px) {
  .dq-nav-inner { padding: 0 16px; height: 64px; }
  .dq-brand-sub { display: none; }
  .dq-logo { width: 40px; height: 40px; }
  .dq-brand-name { font-size: 18px; }
  .dq-nav-right { gap: 10px; }
  .dq-nav-right .dq-btn-label { display: none; }
  .dq-nav-right .dq-btn { padding: 8px 12px; }
  .rh-back span { display: none; }
  .rh-back { padding: 0 12px; }
  .rh-container { padding: 22px 16px 0; }
  .dq-welcome { flex-direction: column; align-items: flex-start; padding: 22px 20px; border-radius: 20px; }
  .rh-hero-btn { width: 100%; }
  .dq-orb { opacity: .18; }
}

@media (prefers-reduced-motion: reduce) {
  .rh-page *, .rh-page *::before, .rh-page *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
}
`

export default RequestHistory
