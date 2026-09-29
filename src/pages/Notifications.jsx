import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const logoImage = '/cc.png'
const bgImage = '/conso.jpg'

const iconProps = {
  width: 18,
  height: 18,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
}

const Icons = {
  SUCCESS: (
    <svg {...iconProps}>
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  ),
  WARNING: (
    <svg {...iconProps}>
      <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
  ERROR: (
    <svg {...iconProps}>
      <circle cx="12" cy="12" r="10" />
      <line x1="15" y1="9" x2="9" y2="15" />
      <line x1="9" y1="9" x2="15" y2="15" />
    </svg>
  ),
  REQUEST: (
    <svg {...iconProps}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  ),
  DEFAULT: (
    <svg {...iconProps}>
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  ),
}

const BellLarge = (
  <svg
    width="32"
    height="32"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
)

const TYPE_CONFIG = {
  SUCCESS: { tone: 'success', label: 'Success' },
  WARNING: { tone: 'warning', label: 'Warning' },
  ERROR: { tone: 'error', label: 'Error' },
  REQUEST: { tone: 'request', label: 'Request' },
}

const getNotificationConfig = (type) => {
  const key = (type || '').toUpperCase()
  const config = TYPE_CONFIG[key]
  return config
    ? { ...config, icon: Icons[key] }
    : { tone: 'default', label: type || 'Notice', icon: Icons.DEFAULT }
}

const startOfDay = (date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate())

const getGroupLabel = (date) => {
  const days = Math.round(
    (startOfDay(new Date()) - startOfDay(new Date(date))) / 86400000
  )
  if (days <= 0) return 'Today'
  if (days === 1) return 'Yesterday'
  if (days < 7) return 'This week'
  return 'Earlier'
}

const formatFullDate = (date) => {
  if (!date) return '\u2014'
  return new Date(date).toLocaleString('en-PH', {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}

const formatRelative = (date) => {
  if (!date) return '\u2014'
  const diff = Date.now() - new Date(date).getTime()
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d ago`
  return new Date(date).toLocaleDateString('en-PH', { dateStyle: 'medium' })
}

const groupByDate = (items) => {
  const groups = []
  items.forEach((item) => {
    const label = getGroupLabel(item.created_at)
    const last = groups[groups.length - 1]
    if (last && last.label === label) {
      last.items.push(item)
    } else {
      groups.push({ label, items: [item] })
    }
  })
  return groups
}

const css = `
  html, body, #root {
    width: 100% !important;
    max-width: 100% !important;
    margin: 0 !important;
    padding: 0 !important;
  }

  .dq-notif {
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
    --warning: #D97706;
    --card: #ffffff;
    --bg-soft: #F8FAFC;
    --ease: cubic-bezier(.22, 1, .36, 1);

    position: relative;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    color: var(--text);
    text-align: left;
    background: var(--primary);
    font-family: 'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
    overflow-x: clip;
  }
  .dq-notif *, .dq-notif *::before, .dq-notif *::after { box-sizing: border-box; }
  .dq-notif :where(h1, h2, h3, h4, p) { margin: 0; }
  .dq-notif > *:not(.dq-bg):not(.dq-orb) { position: relative; z-index: 2; }

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
  @keyframes dq-ring { 0% { box-shadow: 0 0 0 0 rgba(244, 180, 0, .55); } 100% { box-shadow: 0 0 0 14px rgba(244, 180, 0, 0); } }
  @keyframes dq-live { 0% { box-shadow: 0 0 0 0 rgba(74, 222, 128, .6); } 100% { box-shadow: 0 0 0 9px rgba(74, 222, 128, 0); } }

  .dq-anim { animation: dq-rise .7s var(--ease) backwards; animation-delay: var(--d, 0s); }

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
  .dq-nav-inner { display: flex; align-items: center; justify-content: space-between; gap: 16px; width: 100%; padding: 0 20px; height: 68px; max-width: 1200px; margin: 0 auto; }
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

  .dq-nav-right { display: flex; align-items: center; gap: 14px; }
  .dq-nav-user { display: flex; align-items: center; gap: 10px; padding-right: 14px; border-right: 1px solid var(--border); }
  .dq-nav-user-avatar { width: 38px; height: 38px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; border-radius: 50%; background: linear-gradient(135deg, #DBEAFE, #EFF6FF); color: var(--secondary); font-size: 13px; font-weight: 800; }
  .dq-nav-user-text { display: flex; flex-direction: column; }
  .dq-nav-user-name { font-size: 13.5px; font-weight: 700; color: var(--text); line-height: 1.2; }
  .dq-nav-user-role { font-size: 12px; color: var(--muted); }
  .dq-btn {
    display: inline-flex; align-items: center; justify-content: center; gap: 8px;
    padding: 10px 18px; border-radius: 10px; border: 1px solid transparent;
    font-size: 14px; font-weight: 700; font-family: inherit; cursor: pointer; white-space: nowrap;
    transition: background .2s ease, border-color .2s ease, box-shadow .2s ease, transform .2s ease;
  }
  .dq-btn:hover { transform: translateY(-2px); }
  .dq-btn:active { transform: scale(.97); }
  .dq-btn:focus-visible { outline: 3px solid rgba(96, 165, 250, .7); outline-offset: 2px; }
  .dq-btn-primary { background: var(--primary); color: #fff; box-shadow: 0 8px 20px rgba(0, 4, 53, .28); }
  .dq-btn-primary:hover { background: var(--primary-2); }
  .dq-btn-outline { background: #fff; color: var(--text); border-color: #CBD5E1; }
  .dq-btn-outline:hover { background: #F1F5F9; border-color: #94A3B8; }
  .dq-btn-gold { position: relative; overflow: hidden; background: var(--accent); color: var(--primary); box-shadow: 0 8px 20px rgba(244, 180, 0, .35); }
  .dq-btn-gold:hover { background: #FFC61A; }
  .dq-btn-ghost { background: transparent; color: var(--secondary); padding: 8px 12px; font-size: 12.5px; border-radius: 8px; }
  .dq-btn-ghost:hover { background: #EFF6FF; }
  .dq-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none !important; }

  .dq-main { width: 100%; max-width: 1000px; margin: 0 auto; padding: 32px 24px 64px; flex: 1; }

  .dq-welcome {
    position: relative; overflow: hidden;
    display: flex; align-items: center; justify-content: space-between; gap: 24px;
    padding: 24px 28px; margin-bottom: 24px; border-radius: 20px; color: #fff !important;
    background: linear-gradient(120deg, rgba(0, 4, 53, .94), rgba(13, 26, 92, .92), rgba(20, 50, 140, .9), rgba(0, 4, 53, .94));
    background-size: 240% 240%;
    border: 1px solid rgba(255, 255, 255, .14);
    box-shadow: 0 30px 60px rgba(0, 0, 0, .35);
    backdrop-filter: blur(6px);
    animation: dq-rise .8s var(--ease) backwards, dq-flow 18s linear infinite;
  }
  .dq-welcome::before {
    content: ''; position: absolute; width: 300px; height: 300px; top: -140px; right: -60px;
    border-radius: 50%; background: rgba(255, 255, 255, .07);
  }
  .dq-welcome > * { position: relative; z-index: 1; }
  .dq-eyebrow {
    display: inline-flex; align-items: center; gap: 8px; margin-bottom: 8px; padding: 4px 10px;
    border-radius: 999px; background: rgba(255, 255, 255, .1); border: 1px solid rgba(255, 255, 255, .18);
    font-size: 12px; font-weight: 600; color: #fff !important;
  }
  .dq-eyebrow-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--accent); animation: dq-ring 2s ease-out infinite; }
  .dq-welcome h1 {
    font-size: clamp(22px, 2.8vw, 30px); font-weight: 800; letter-spacing: -.6px; line-height: 1.2;
    margin-bottom: 6px; color: #fff !important;
  }
  .dq-welcome p { max-width: 560px; font-size: 13.5px; line-height: 1.6; color: rgba(255, 255, 255, .85) !important; }
  .dq-count-pill {
    flex-shrink: 0; display: inline-flex; align-items: center; gap: 8px; padding: 10px 18px;
    border-radius: 999px; background: rgba(255, 255, 255, .12); border: 1px solid rgba(255, 255, 255, .22);
    font-size: 13px; font-weight: 700; white-space: nowrap; color: #fff !important;
    animation: dq-pop .7s var(--ease) .5s backwards;
  }

  .dq-panel {
    background: rgba(255, 255, 255, .97);
    border: 1px solid rgba(255, 255, 255, .7);
    border-radius: 20px;
    box-shadow: 0 20px 50px rgba(0, 0, 0, .25);
    backdrop-filter: blur(8px);
    overflow: hidden;
    animation: dq-rise .7s var(--ease) backwards;
    animation-delay: .15s;
  }

  .dq-toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 12px;
    padding: 18px 24px;
    border-bottom: 1px solid var(--border);
    background: #FAFBFC;
  }
  .dq-tabs {
    display: inline-flex;
    padding: 4px;
    gap: 4px;
    background: #E2E8F0;
    border-radius: 12px;
  }
  .dq-tab {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font: inherit;
    font-size: 13.5px;
    font-weight: 600;
    color: var(--muted);
    background: transparent;
    border: 0;
    padding: 8px 14px;
    border-radius: 9px;
    cursor: pointer;
    transition: all 0.15s ease;
  }
  .dq-tab:hover { color: var(--text); }
  .dq-tab.is-active {
    background: var(--card);
    color: var(--primary);
    box-shadow: 0 1px 3px rgba(15, 23, 42, 0.08);
    font-weight: 700;
  }
  .dq-count {
    min-width: 20px;
    padding: 2px 6px;
    border-radius: 999px;
    background: rgba(15, 23, 42, 0.06);
    color: var(--muted);
    font-size: 11.5px;
    line-height: 1.2;
    text-align: center;
    font-variant-numeric: tabular-nums;
    font-weight: 700;
  }
  .dq-count.is-accent { background: var(--accent); color: var(--primary); }

  .dq-group-label {
    margin: 0;
    padding: 12px 24px;
    font-size: 12px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--muted);
    background: #F8FAFC;
    border-bottom: 1px solid var(--border);
  }
  .dq-list { list-style: none; margin: 0; padding: 0; }

  .dq-row {
    position: relative;
    display: flex;
    align-items: flex-start;
    gap: 16px;
    padding: 20px 24px;
    border-bottom: 1px solid #F1F5F9;
    background: var(--card);
    transition: background-color 0.15s ease;
  }
  .dq-row:hover { background: #FAFBFC; }
  .dq-list .dq-row:last-child { border-bottom: 0; }
  section:not(:last-child) .dq-list .dq-row:last-child { border-bottom: 1px solid var(--border); }

  .dq-row.is-unread { background: #F8FAFC; }
  .dq-row.is-unread:hover { background: #F1F5F9; }
  .dq-row.is-unread::before {
    content: "";
    position: absolute;
    left: 0; top: 0; bottom: 0;
    width: 4px;
    background: linear-gradient(180deg, var(--secondary), var(--accent));
  }

  .dq-icon {
    flex-shrink: 0;
    width: 42px;
    height: 42px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--tone-bg);
    color: var(--tone-fg);
    box-shadow: inset 0 0 0 1px rgba(0,0,0,0.03);
  }
  .dq-tone-success { --tone-bg: #DCFCE7; --tone-fg: #15803D; }
  .dq-tone-warning { --tone-bg: #FEF9C3; --tone-fg: #A16207; }
  .dq-tone-error   { --tone-bg: #FEE2E2; --tone-fg: #B91C1C; }
  .dq-tone-request { --tone-bg: #DBEAFE; --tone-fg: #1D4ED8; }
  .dq-tone-default { --tone-bg: #F1F5F9; --tone-fg: #475569; }

  .dq-body { flex: 1; min-width: 0; }
  .dq-body-top { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; margin-bottom: 4px; }
  .dq-item-title { margin: 0; font-size: 15px; line-height: 1.4; font-weight: 700; color: var(--primary); }
  .dq-row.is-read .dq-item-title { font-weight: 600; color: var(--text); }
  .dq-new {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.03em;
    color: var(--primary);
    background: var(--accent-soft);
    padding: 2px 8px;
    border-radius: 6px;
    border: 1px solid #FDE68A;
  }
  .dq-new-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--accent); }
  .dq-message {
    margin: 0 0 10px;
    font-size: 14px;
    line-height: 1.55;
    color: var(--text);
    max-width: 65ch;
    overflow-wrap: anywhere;
  }
  .dq-row.is-read .dq-message { color: var(--muted); }
  .dq-meta { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
  .dq-type {
    font-size: 11.5px;
    font-weight: 600;
    padding: 3px 9px;
    border-radius: 6px;
    background: var(--tone-bg);
    color: var(--tone-fg);
  }
  .dq-meta-dot { color: #CBD5E1; font-size: 12px; }
  .dq-time { font-size: 12.5px; color: var(--muted); }
  .dq-row > .dq-btn-ghost { align-self: center; }

  .dq-empty { padding: 64px 24px; text-align: center; }
  .dq-empty-icon {
    width: 68px;
    height: 68px;
    margin: 0 auto 18px;
    border-radius: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #EFF6FF, #DBEAFE);
    color: var(--secondary);
    box-shadow: inset 0 0 0 1px rgba(0,0,0,0.04);
  }
  .dq-empty-title { margin: 0 0 8px; font-size: 19px; font-weight: 800; color: var(--primary); }
  .dq-empty-text { margin: 0 auto 24px; max-width: 42ch; font-size: 14px; line-height: 1.6; color: var(--muted); }

  .dq-alert {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 20px;
    padding: 14px 18px;
    border-radius: 14px;
    background: #FEF2F2;
    border: 1px solid #FECACA;
    border-left: 5px solid var(--error);
    color: #991B1B;
    font-size: 14px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, .15);
  }
  .dq-alert-text { line-height: 1.5; }
  .dq-alert-action {
    flex-shrink: 0;
    font: inherit;
    font-size: 13px;
    font-weight: 700;
    color: var(--primary);
    background: var(--accent);
    border: 0;
    padding: 7px 14px;
    border-radius: 8px;
    cursor: pointer;
    transition: background .15s ease;
  }
  .dq-alert-action:hover { background: #FFC61A; }

  .dq-skeleton-row { align-items: center; }
  .dq-skel {
    background: linear-gradient(90deg, #F1F5F9 25%, #E2E8F0 50%, #F1F5F9 75%);
    background-size: 200% 100%;
    animation: dq-shimmer 1.4s ease-in-out infinite;
    border-radius: 6px;
  }
  .dq-skel-icon { width: 42px; height: 42px; border-radius: 12px; flex-shrink: 0; }
  .dq-skel-lines { flex: 1; display: flex; flex-direction: column; gap: 8px; }
  .dq-skel-line { height: 12px; }
  .dq-skel-w20 { width: 20%; }
  .dq-skel-w40 { width: 40%; }
  .dq-skel-w80 { width: 80%; }
  @keyframes dq-shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
  .dq-sr-only {
    position: absolute;
    width: 1px; height: 1px;
    margin: -1px; padding: 0;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  .dq-spinner {
    width: 46px; height: 46px; margin: 0 auto 18px; border-radius: 50%;
    border: 4px solid #DBEAFE; border-top-color: var(--secondary); animation: dq-spin .8s linear infinite;
  }
  .dq-center { min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 20px; }
  .dq-state {
    width: 100%; max-width: 420px; padding: 40px 32px; text-align: center;
    background: rgba(255, 255, 255, .95); border: 1px solid rgba(255, 255, 255, .6);
    border-radius: 22px; box-shadow: 0 30px 70px rgba(0, 0, 0, .35);
    backdrop-filter: blur(10px); animation: dq-pop .5s var(--ease);
  }
  .dq-state h2 { font-size: 18px; font-weight: 800; color: var(--primary); margin-bottom: 6px; }
  .dq-state p { font-size: 14px; line-height: 1.6; color: var(--muted); }

  @media (max-width: 900px) {
    .dq-brand-sub { display: none; }
  }
  @media (max-width: 720px) {
    .dq-nav-inner { padding: 0 12px; height: 62px; }
    .dq-logo { width: 38px; height: 38px; }
    .dq-brand-name { font-size: 18px; }
    .dq-btn-label { display: none; }
    .dq-nav-right .dq-btn { padding: 9px 11px; }
    .dq-main { padding: 20px 14px 48px; }
    .dq-welcome { flex-direction: column; align-items: flex-start; padding: 20px; border-radius: 18px; }
    .dq-row { flex-wrap: wrap; padding: 16px 18px; }
    .dq-group-label { padding: 10px 18px; }
    .dq-row > .dq-btn-ghost { margin-left: 58px; align-self: flex-start; padding-left: 0; }
    .dq-toolbar { flex-direction: column; align-items: stretch; padding: 14px 18px; }
    .dq-toolbar > .dq-btn { width: 100%; justify-content: center; }
    .dq-tabs { display: flex; width: 100%; }
    .dq-tab { flex: 1; justify-content: center; }
  }

  @media (prefers-reduced-motion: reduce) {
    .dq-notif *, .dq-notif *::before, .dq-notif *::after { animation: none !important; transition: none !important; }
    .dq-spinner { animation: dq-spin 1.5s linear infinite !important; }
  }
`

const ArrowLeftIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
)

const CheckIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

const LogoutIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
  </svg>
)

function Notifications() {
  const navigate = useNavigate()

  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('all')
  const [markingAll, setMarkingAll] = useState(false)
  const [profile, setProfile] = useState(null)
  const [logoFailed, setLogoFailed] = useState(false)

  useEffect(() => {
    loadNotifications()
  }, [])

  const loadNotifications = async () => {
    try {
      setLoading(true)
      setError('')

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()

      if (userError) {
        throw userError
      }

      if (!user) {
        navigate('/login', { replace: true })
        return
      }

      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('first_name, last_name, role')
        .eq('id', user.id)
        .single()

      setProfile(profileError ? null : profileData)

      const { data, error: notificationError } = await supabase
        .from('notifications')
        .select(`
          id,
          title,
          message,
          type,
          is_read,
          created_at
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (notificationError) {
        throw notificationError
      }

      setNotifications(data || [])
    } catch (error) {
      console.error('Notifications error:', error)
      setError(error?.message || 'Unable to load your notifications.')
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (notificationId) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId)

      if (error) throw error

      setNotifications((current) =>
        current.map((notification) =>
          notification.id === notificationId
            ? { ...notification, is_read: true }
            : notification
        )
      )
    } catch (error) {
      console.error('Mark notification as read error:', error)
      setError(error?.message || 'Unable to update the notification.')
    }
  }

  const markAllAsRead = async () => {
    try {
      setMarkingAll(true)

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()

      if (userError) throw userError

      if (!user) {
        navigate('/login', { replace: true })
        return
      }

      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', user.id)
        .eq('is_read', false)

      if (error) throw error

      setNotifications((current) =>
        current.map((notification) => ({
          ...notification,
          is_read: true,
        }))
      )
    } catch (error) {
      console.error('Mark all notifications as read error:', error)
      setError(error?.message || 'Unable to mark all notifications as read.')
    } finally {
      setMarkingAll(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/login', { replace: true })
  }

  const fullName = [profile?.first_name, profile?.last_name]
    .filter(Boolean)
    .join(' ')

  const initials =
    `${profile?.first_name?.[0] || ''}${profile?.last_name?.[0] || ''}`.toUpperCase() || 'DQ'

  const unreadCount = notifications.filter((n) => !n.is_read).length
  const visible =
    filter === 'unread' ? notifications.filter((n) => !n.is_read) : notifications
  const groups = groupByDate(visible)

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
    </>
  )

  if (loading) {
    return (
      <div className="dq-notif">
        <style>{css}</style>
        <Backdrop />
        <div className="dq-center">
          <div className="dq-state" role="status">
            <div className="dq-spinner" />
            <h2>Loading notifications</h2>
            <p>Fetching your latest updates...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="dq-notif">
      <style>{css}</style>
      <Backdrop />

      <header className="dq-nav">
        <div className="dq-nav-inner">
          <div className="dq-brand">
            <Logo />
            <div style={{ minWidth: 0 }}>
              <div className="dq-brand-name">DocQuest</div>
              <small className="dq-brand-sub">
                Registrar's Office Document Tracking Request System
              </small>
            </div>
          </div>

          <div className="dq-nav-right">
            {profile && (
              <div className="dq-nav-user">
              </div>
            )}
            <button
              className="dq-btn dq-btn-outline"
              onClick={() => navigate(profile?.role === 'admin' || profile?.role === 'super_admin' ? '/admin' : '/dashboard')}
              aria-label="Back"
            >
              <ArrowLeftIcon />
              <span className="dq-btn-label">Back</span>
            </button>
            <button
              className="dq-btn dq-btn-primary"
              onClick={handleLogout}
              aria-label="Logout"
            >
              <LogoutIcon />
              <span className="dq-btn-label">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="dq-main">
        <section className="dq-welcome">
          <div>
            <span className="dq-eyebrow">
              <span className="dq-eyebrow-dot" /> Notifications
            </span>
            <h1>Stay updated on your requests</h1>
            <p>
              See alerts about your document requests, account updates, and important announcements.
            </p>
          </div>
          <div className="dq-count-pill">
            {unreadCount} unread message{unreadCount !== 1 ? 's' : ''}
          </div>
        </section>

        {error && (
          <div className="dq-alert" role="alert">
            <span className="dq-alert-text">{error}</span>
            <button
              type="button"
              className="dq-alert-action"
              onClick={loadNotifications}
            >
              Try again
            </button>
          </div>
        )}

        <div className="dq-panel">
          <div className="dq-toolbar">
            <div className="dq-tabs" role="tablist" aria-label="Filter notifications">
              <button
                type="button"
                role="tab"
                aria-selected={filter === 'all'}
                className={`dq-tab ${filter === 'all' ? 'is-active' : ''}`}
                onClick={() => setFilter('all')}
              >
                All
                <span className="dq-count">{notifications.length}</span>
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={filter === 'unread'}
                className={`dq-tab ${filter === 'unread' ? 'is-active' : ''}`}
                onClick={() => setFilter('unread')}
              >
                Unread
                <span className={`dq-count ${unreadCount > 0 ? 'is-accent' : ''}`}>
                  {unreadCount}
                </span>
              </button>
            </div>

            {unreadCount > 0 && (
              <button
                type="button"
                className="dq-btn dq-btn-gold"
                onClick={markAllAsRead}
                disabled={markingAll}
              >
                <CheckIcon />
                {markingAll ? 'Marking\u2026' : 'Mark all as read'}
              </button>
            )}
          </div>

          {visible.length === 0 ? (
            <div className="dq-empty">
              <div className="dq-empty-icon">{BellLarge}</div>
              <h2 className="dq-empty-title">
                {filter === 'unread' && notifications.length > 0
                  ? "You're all caught up!"
                  : 'No notifications yet'}
              </h2>
              <p className="dq-empty-text">
                {filter === 'unread' && notifications.length > 0
                  ? 'You have no unread notifications right now.'
                  : 'Updates about your document requests and account status will appear here.'}
              </p>
              {filter === 'unread' && notifications.length > 0 && (
                <button
                  type="button"
                  className="dq-btn dq-btn-outline"
                  onClick={() => setFilter('all')}
                >
                  View all notifications
                </button>
              )}
            </div>
          ) : (
            <>
              {groups.map((group) => (
                <section key={group.label} aria-label={group.label}>
                  <h2 className="dq-group-label">{group.label}</h2>
                  <ul className="dq-list">
                    {group.items.map((notification) => {
                      const config = getNotificationConfig(notification.type)
                      return (
                        <li
                          key={notification.id}
                          className={`dq-row ${
                            notification.is_read ? 'is-read' : 'is-unread'
                          }`}
                        >
                          <div className={`dq-icon dq-tone-${config.tone}`}>
                            {config.icon}
                          </div>

                          <div className="dq-body">
                            <div className="dq-body-top">
                              <h3 className="dq-item-title">
                                {notification.title}
                              </h3>
                              {!notification.is_read && (
                                <span className="dq-new">
                                  <span className="dq-new-dot" aria-hidden="true" />
                                  New
                                </span>
                              )}
                            </div>

                            <p className="dq-message">{notification.message}</p>

                            <div className="dq-meta">
                              <span className={`dq-type dq-tone-${config.tone}`}>
                                {config.label}
                              </span>
                              <span className="dq-meta-dot">\u2022</span>
                              <time
                                className="dq-time"
                                dateTime={notification.created_at}
                                title={formatFullDate(notification.created_at)}
                              >
                                {formatRelative(notification.created_at)}
                              </time>
                            </div>
                          </div>

                          {!notification.is_read && (
                            <button
                              type="button"
                              className="dq-btn dq-btn-ghost"
                              onClick={() => markAsRead(notification.id)}
                              aria-label={`Mark "${notification.title}" as read`}
                            >
                              Mark as read
                            </button>
                          )}
                        </li>
                      )
                    })}
                  </ul>
                </section>
              ))}
            </>
          )}
        </div>
      </main>
    </div>
  )
}

export default Notifications
