import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

// Logo and Background in the public folder (public/cc.png & public/conso.jpg)
const logoImage = '/cc.png'
const bgImage = '/conso.jpg'

const COURSE_NAMES = {
  BSIT: 'BS Information Technology',
  BSHM: 'BS Hospitality Management',
  BSENTREP: 'BS Entrepreneurship',
  BEED: 'Bachelor of Elementary Education',
  BSED: 'Bachelor of Secondary Education',
  BPED: 'Bachelor of Physical Education',
}

const css = `
  html, body, #root {
    width: 100% !important;
    max-width: 100% !important;
    margin: 0 !important;
    padding: 0 !important;
  }

  .dq-dash {
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
  .dq-dash *, .dq-dash *::before, .dq-dash *::after { box-sizing: border-box; }
  .dq-dash :where(h1, h2, h3, h4, p) { margin: 0; }
  .dq-dash > *:not(.dq-bg):not(.dq-orb) { position: relative; z-index: 2; }

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
  @keyframes dq-word { from { opacity: 0; transform: translateY(100%); } to { opacity: 1; transform: none; } }

  .dq-anim { animation: dq-rise .7s var(--ease) backwards; animation-delay: var(--d, 0s); }

  /* ---------- CENTER STATES ---------- */
  .dq-center { min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 20px; }
  .dq-state {
    width: 100%; max-width: 420px; padding: 40px 32px; text-align: center;
    background: rgba(255, 255, 255, .95); border: 1px solid rgba(255, 255, 255, .6);
    border-radius: 22px; box-shadow: 0 30px 70px rgba(0, 0, 0, .35);
    backdrop-filter: blur(10px); animation: dq-pop .5s var(--ease);
  }
  .dq-spinner {
    width: 46px; height: 46px; margin: 0 auto 18px; border-radius: 50%;
    border: 4px solid #DBEAFE; border-top-color: var(--secondary); animation: dq-spin .8s linear infinite;
  }
  .dq-state h2 { font-size: 18px; font-weight: 800; color: var(--primary); margin-bottom: 6px; }
  .dq-state p { font-size: 14px; line-height: 1.6; color: var(--muted); }
  .dq-state-icon {
    width: 56px; height: 56px; margin: 0 auto 16px; display: flex; align-items: center; justify-content: center;
    border-radius: 50%; background: #FEF2F2; color: var(--error);
  }
  .dq-state .dq-btn { margin-top: 22px; }

  /* ---------- BUTTONS ---------- */
  .dq-btn {
    display: inline-flex; align-items: center; justify-content: center; gap: 8px;
    padding: 10px 18px; border-radius: 10px; border: 1px solid transparent;
    font-size: 14px; font-weight: 700; font-family: inherit; cursor: pointer; white-space: nowrap;
    transition: background .2s ease, border-color .2s ease, box-shadow .2s ease, transform .2s ease;
  }
  .dq-btn:hover { transform: translateY(-2px); }
  .dq-btn:active { transform: scale(.97); }
  .dq-btn:focus-visible, .dq-action:focus-visible { outline: 3px solid rgba(96, 165, 250, .7); outline-offset: 2px; }
  .dq-btn-primary { background: var(--primary); color: #fff; box-shadow: 0 8px 20px rgba(0, 4, 53, .28); }
  .dq-btn-primary:hover { background: var(--primary-2); }
  .dq-btn-outline { background: #fff; color: var(--text); border-color: #CBD5E1; }
  .dq-btn-outline:hover { background: #F1F5F9; border-color: #94A3B8; }
  .dq-btn-gold { position: relative; overflow: hidden; background: var(--accent); color: var(--primary); box-shadow: 0 8px 20px rgba(244, 180, 0, .35); }
  .dq-btn-gold:hover { background: #FFC61A; }
  .dq-btn-gold::after {
    content: ''; position: absolute; top: 0; left: 0; width: 40%; height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, .55), transparent);
    animation: dq-sweep 3.2s ease-in-out 1.2s infinite;
  }
  .dq-btn-danger { background: #fff; color: var(--error); border-color: #FECACA; }
  .dq-btn-danger:hover { background: #FEF2F2; border-color: var(--error); box-shadow: 0 8px 18px rgba(220, 38, 38, .18); }
  .dq-btn svg { transition: transform .2s ease; }
  .dq-btn-gold:hover svg { transform: translateX(3px); }

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
  .dq-nav-inner { display: flex; align-items: center; justify-content: space-between; gap: 16px; width: 100%; padding: 0 20px; height: 68px; }
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
  .dq-user { display: flex; align-items: center; gap: 10px; padding-right: 14px; border-right: 1px solid var(--border); }
  .dq-avatar {
    position: relative; width: 38px; height: 38px; flex-shrink: 0; display: flex; align-items: center; justify-content: center;
    border-radius: 50%; background: linear-gradient(135deg, #DBEAFE, #EFF6FF); color: var(--secondary); font-size: 13px; font-weight: 800;
  }
  .dq-avatar::after {
    content: ''; position: absolute; right: -1px; bottom: -1px; width: 11px; height: 11px;
    border-radius: 50%; background: #22C55E; border: 2px solid #fff; animation: dq-live 2.2s ease-out infinite;
  }
  .dq-user-name { font-size: 13.5px; font-weight: 700; color: var(--text); line-height: 1.2; max-width: 170px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .dq-user-role { font-size: 12px; color: var(--muted); }

  /* ---------- MAIN ---------- */
  .dq-main { width: 100%; max-width: 1200px; margin: 0 auto; padding: 32px 32px 64px; flex: 1; }

  /* Welcome banner (Pinatangkad at mas compact) */
  .dq-welcome {
    position: relative; overflow: hidden;
    display: flex; align-items: center; justify-content: space-between; gap: 24px;
    padding: 24px 32px; margin-bottom: 22px; border-radius: 20px; color: #fff !important;
    background: linear-gradient(120deg, rgba(0, 4, 53, .94), rgba(13, 26, 92, .92), rgba(20, 50, 140, .9), rgba(0, 4, 53, .94));
    background-size: 240% 240%;
    border: 1px solid rgba(255, 255, 255, .14);
    box-shadow: 0 30px 60px rgba(0, 0, 0, .35);
    backdrop-filter: blur(6px);
    animation: dq-rise .8s var(--ease) backwards, dq-flow 18s linear infinite;
  }
  .dq-welcome::before {
    content: ''; position: absolute; width: 340px; height: 340px; top: -160px; right: -80px;
    border-radius: 50%; background: rgba(255, 255, 255, .07); animation: dq-bob 7s ease-in-out infinite;
  }
  .dq-welcome::after {
    content: ''; position: absolute; width: 220px; height: 220px; bottom: -120px; left: 34%;
    border-radius: 50%; background: rgba(244, 180, 0, .14); animation: dq-bob 9s ease-in-out 1s infinite;
  }
  .dq-welcome > * { position: relative; z-index: 1; }
  .dq-eyebrow {
    display: inline-flex; align-items: center; gap: 8px; margin-bottom: 8px; padding: 4px 10px;
    border-radius: 999px; background: rgba(255, 255, 255, .1); border: 1px solid rgba(255, 255, 255, .18);
    font-size: 12px; font-weight: 600; color: #fff !important;
  }
  .dq-eyebrow-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--accent); animation: dq-ring 2s ease-out infinite; }
  .dq-welcome h1 {
    font-size: clamp(22px, 2.8vw, 32px); font-weight: 800; letter-spacing: -.6px; line-height: 1.2;
    margin-bottom: 6px; color: #fff !important; display: flex; flex-wrap: wrap; align-items: center; gap: 8px;
  }
  .dq-name {
    background: linear-gradient(90deg, #FDE68A, var(--accent), #FDE68A);
    background-size: 200% auto; -webkit-background-clip: text; background-clip: text; color: transparent;
    animation: dq-word .8s var(--ease) .3s backwards, dq-flow 5s linear 1.2s infinite;
  }
  .dq-welcome p { max-width: 560px; font-size: 13.5px; line-height: 1.6; color: rgba(255, 255, 255, .85) !important; margin-bottom: 14px; }

  .dq-chips { display: flex; flex-wrap: wrap; gap: 8px; }
  .dq-chip {
    display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px; border-radius: 8px;
    background: rgba(255, 255, 255, .1); border: 1px solid rgba(255, 255, 255, .16);
    font-size: 12px; font-weight: 600; color: #fff !important;
    animation: dq-rise .6s var(--ease) backwards; animation-delay: var(--d, .6s);
    transition: background .2s ease, transform .2s ease;
  }
  .dq-chip:hover { background: rgba(255, 255, 255, .18); transform: translateY(-2px); }
  .dq-chip small { font-size: 10.5px; font-weight: 500; color: rgba(255, 255, 255, .65); }

  .dq-pill {
    flex-shrink: 0; display: inline-flex; align-items: center; gap: 8px; padding: 8px 16px;
    border-radius: 999px; background: rgba(255, 255, 255, .12); border: 1px solid rgba(255, 255, 255, .22);
    font-size: 12.5px; font-weight: 700; white-space: nowrap; color: #fff !important;
    animation: dq-pop .7s var(--ease) .5s backwards;
  }
  .dq-pill-dot { width: 8px; height: 8px; border-radius: 50%; background: #4ADE80; animation: dq-live 2s ease-out infinite; }
  .dq-pill-dot.grad { background: var(--accent); animation: dq-ring 2s ease-out infinite; }

  /* Verification banner */
  .dq-verify {
    position: relative; overflow: hidden;
    display: flex; align-items: center; gap: 16px; padding: 18px 22px; margin-bottom: 30px;
    border-radius: 18px; background: rgba(255, 251, 235, .96); border: 1px solid #FDE68A; border-left: 5px solid var(--accent);
    box-shadow: 0 18px 40px rgba(0, 0, 0, .25); backdrop-filter: blur(6px);
  }
  .dq-verify::after {
    content: ''; position: absolute; top: 0; left: 0; width: 30%; height: 100%; pointer-events: none;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, .7), transparent);
    animation: dq-sweep 4.5s ease-in-out 1.5s infinite;
  }
  .dq-verify-icon {
    width: 46px; height: 46px; flex-shrink: 0; display: flex; align-items: center; justify-content: center;
    border-radius: 13px; background: #fff; color: #B45309; animation: dq-ring 2.2s ease-out infinite;
  }
  .dq-verify-body { flex: 1; min-width: 0; }
  .dq-verify h3 { font-size: 15.5px; font-weight: 800; color: var(--primary); margin-bottom: 3px; }
  .dq-verify p { font-size: 13.5px; line-height: 1.55; color: #78560B; }
  .dq-verify .dq-btn { flex-shrink: 0; position: relative; z-index: 1; }

  /* Sections */
  .dq-section { margin-bottom: 34px; }
  .dq-section-head { display: flex; align-items: center; gap: 14px; margin-bottom: 18px; }
  .dq-section-head h2 { font-size: 19px; font-weight: 800; letter-spacing: -.3px; color: #fff !important; text-shadow: 0 2px 8px rgba(0, 0, 0, .45); white-space: nowrap; }
  .dq-section-head::after {
    content: ''; flex: 1; height: 1px; transform-origin: left;
    background: linear-gradient(90deg, rgba(255, 255, 255, .5), transparent);
    animation: dq-grow 1s var(--ease) .3s backwards;
  }
  @keyframes dq-grow { from { transform: scaleX(0); } to { transform: scaleX(1); } }

  /* Action cards */
  .dq-actions { display: grid; grid-template-columns: repeat(4, 1fr); gap: 18px; }
  .dq-action {
    position: relative; overflow: hidden; display: flex; flex-direction: column; text-align: left; width: 100%;
    padding: 26px; border-radius: 18px; background: rgba(255, 255, 255, .95); border: 1px solid rgba(255, 255, 255, .7);
    font-family: inherit; color: var(--text); cursor: pointer; backdrop-filter: blur(8px);
    box-shadow: 0 14px 34px rgba(0, 0, 0, .22);
    transition: transform .3s var(--ease), box-shadow .3s ease, background .3s ease;
  }
  .dq-action::before {
    content: ''; position: absolute; inset: 0; z-index: 0; pointer-events: none; opacity: 0;
    background: radial-gradient(260px circle at var(--mx, 50%) var(--my, 50%), rgba(37, 99, 235, .16), transparent 65%);
    transition: opacity .3s ease;
  }
  .dq-action::after {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 4px; z-index: 2;
    background: linear-gradient(90deg, var(--secondary), var(--accent));
    transform: scaleX(0); transform-origin: left; transition: transform .45s var(--ease);
  }
  .dq-action:hover { transform: translateY(-8px); background: #fff; box-shadow: 0 28px 50px rgba(0, 0, 0, .32); }
  .dq-action:hover::before { opacity: 1; }
  .dq-action:hover::after { transform: scaleX(1); }
  .dq-action:active { transform: translateY(-4px) scale(.99); }
  .dq-action > *:not(.dq-lock) { position: relative; z-index: 1; }

  .dq-action-icon {
    width: 52px; height: 52px; display: flex; align-items: center; justify-content: center;
    margin-bottom: 20px; border-radius: 15px; transition: transform .4s var(--ease), box-shadow .3s ease;
  }
  .dq-action:hover .dq-action-icon { transform: scale(1.12) rotate(-8deg); box-shadow: 0 10px 20px rgba(0, 4, 53, .16); }
  .dq-tone-blue { background: #EFF6FF; color: var(--secondary); }
  .dq-tone-green { background: #F0FDF4; color: var(--success); }
  .dq-tone-gold { background: var(--accent-soft); color: #B45309; }
  .dq-tone-navy { background: #E8EAF6; color: var(--primary); }
  .dq-action h3 { font-size: 16.5px; font-weight: 800; color: var(--primary) !important; margin-bottom: 6px; }
  .dq-action p { font-size: 13.5px; line-height: 1.6; color: #334155 !important; margin-bottom: 20px; }
  .dq-action-go {
    margin-top: auto; display: inline-flex; align-items: center; gap: 6px;
    font-size: 13px; font-weight: 700; color: var(--secondary);
  }
  .dq-action-go svg { transition: transform .3s var(--ease); }
  .dq-action:hover .dq-action-go svg { transform: translateX(6px); }
  .dq-action.locked .dq-action-go { color: #B45309; }
  .dq-lock {
    position: absolute; top: 16px; right: 16px; z-index: 3; display: inline-flex; align-items: center; gap: 5px;
    padding: 4px 10px; border-radius: 999px; background: var(--accent-soft); border: 1px solid #FDE68A;
    color: #B45309; font-size: 11.5px; font-weight: 700; animation: dq-bob 3s ease-in-out infinite;
  }

  /* ---------- MODAL ---------- */
  .dq-overlay {
    position: fixed; inset: 0; z-index: 100; display: flex; align-items: center; justify-content: center;
    padding: 20px; background: rgba(0, 4, 53, .6); backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px);
    animation: dq-fade .25s ease;
  }
  .dq-modal {
    width: 100%; max-width: 440px; padding: 34px 32px 28px; text-align: center; background: #fff;
    border-radius: 24px; box-shadow: 0 40px 80px rgba(0, 4, 53, .45); animation: dq-pop .4s var(--ease);
  }
  .dq-modal-icon {
    width: 62px; height: 62px; margin: 0 auto 18px; display: flex; align-items: center; justify-content: center;
    border-radius: 50%; background: var(--accent-soft); color: #B45309; border: 1px solid #FDE68A; animation: dq-ring 2.2s ease-out infinite;
  }
  .dq-modal h2 { font-size: 21px; font-weight: 800; letter-spacing: -.3px; color: var(--primary); margin-bottom: 10px; }
  .dq-modal p { font-size: 14.5px; line-height: 1.65; color: #475569; }
  .dq-modal p + p { margin-top: 6px; font-size: 13.5px; color: var(--muted); }
  .dq-modal-actions { display: flex; gap: 12px; margin-top: 26px; }
  .dq-modal-actions .dq-btn { flex: 1; height: 46px; }

  /* ---------- RESPONSIVE ---------- */
  @media (max-width: 1080px) {
    .dq-actions { grid-template-columns: repeat(2, 1fr); }
  }
  @media (max-width: 900px) {
    .dq-user-text { display: none; }
    .dq-user { padding-right: 0; border-right: none; }
  }
  @media (max-width: 720px) {
    .dq-nav-inner { padding: 0 12px; height: 62px; }
    .dq-brand-sub { display: none; }
    .dq-logo { width: 38px; height: 38px; }
    .dq-brand-name { font-size: 18px; }
    .dq-btn-label { display: none; }
    .dq-nav-right .dq-btn { padding: 9px 11px; }
    .dq-main { padding: 20px 16px 48px; }
    .dq-welcome { flex-direction: column; align-items: flex-start; padding: 22px 18px; border-radius: 18px; }
    .dq-verify { flex-direction: column; align-items: flex-start; padding: 18px; }
    .dq-verify .dq-btn { width: 100%; }
    .dq-actions { grid-template-columns: 1fr; gap: 14px; }
    .dq-modal { padding: 28px 22px 22px; }
    .dq-orb { opacity: .18; }
  }

  @media (prefers-reduced-motion: reduce) {
    .dq-dash *, .dq-dash *::before, .dq-dash *::after { animation: none !important; transition: none !important; }
    .dq-spinner { animation: dq-spin 1.5s linear infinite !important; }
  }
`

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
    <path d="M14 2v6h6M12 12v6M9 15h6" />
  </svg>
)
const HistoryIcon = () => (
  <svg {...ico}>
    <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
    <path d="M3 3v5h5M12 7v5l3 2" />
  </svg>
)
const BellIcon = () => (
  <svg {...ico}>
    <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.7 21a2 2 0 0 1-3.4 0" />
  </svg>
)
const UserIcon = () => (
  <svg {...ico}>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1" />
  </svg>
)
const MailIcon = ({ size = 22 }) => (
  <svg {...ico} width={size} height={size}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m3 7 9 6 9-6" />
  </svg>
)
const LogoutIcon = () => (
  <svg {...ico} width={17} height={17}>
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
  </svg>
)
const ArrowIcon = () => (
  <svg {...ico} width={16} height={16}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
)
const AlertIcon = () => (
  <svg {...ico} width={26} height={26}>
    <path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" />
    <path d="M12 9v4M12 17h.01" />
  </svg>
)
const LockIcon = () => (
  <svg {...ico} width={12} height={12} strokeWidth={2.5}>
    <rect x="4" y="11" width="16" height="10" rx="2" />
    <path d="M8 11V7a4 4 0 0 1 8 0v4" />
  </svg>
)
const IdIcon = () => (
  <svg {...ico} width={14} height={14}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <circle cx="9" cy="11" r="2" />
    <path d="M14 10h4M14 14h3M6 16c.5-1.5 5.5-1.5 6 0" />
  </svg>
)
const CapIcon = () => (
  <svg {...ico} width={14} height={14}>
    <path d="m22 9-10-5L2 9l10 5 10-5z" />
    <path d="M6 11v5c0 1.5 2.7 3 6 3s6-1.5 6-3v-5" />
  </svg>
)

const getGreeting = () => {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 18) return 'Good afternoon'
  return 'Good evening'
}

function Dashboard() {
  const navigate = useNavigate()

  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showEmailVerificationModal, setShowEmailVerificationModal] = useState(false)
  const [logoFailed, setLogoFailed] = useState(false)

  useEffect(() => {
    loadProfile()
  }, [])

  /* Close the modal with the Escape key */
  useEffect(() => {
    if (!showEmailVerificationModal) return
    const onKey = (e) => {
      if (e.key === 'Escape') setShowEmailVerificationModal(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [showEmailVerificationModal])

  const loadProfile = async () => {
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

      const { data, error: profileError } = await supabase
        .from('profiles')
        .select(
          'id, first_name, middle_initial, last_name, student_id, course, student_status, email, phone, email_verified, phone_verified'
        )
        .eq('id', user.id)
        .single()

      if (profileError) throw profileError

      setProfile(data)
    } catch (error) {
      console.error('Dashboard error:', error)
      setError(error?.message || 'Unable to load your profile information.')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/login', { replace: true })
  }

  const handleRequestDocumentClick = () => {
    if (!profile?.email_verified) {
      setShowEmailVerificationModal(true)
      return
    }

    navigate('/request-document')
  }

  /* Cursor-following spotlight on the action cards */
  const handleCardMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    e.currentTarget.style.setProperty('--mx', `${e.clientX - rect.left}px`)
    e.currentTarget.style.setProperty('--my', `${e.clientY - rect.top}px`)
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
    </>
  )

  /* ---------- LOADING ---------- */
  if (loading) {
    return (
      <div className="dq-dash">
        <style>{css}</style>
        <Backdrop />
        <div className="dq-center">
          <div className="dq-state" role="status">
            <div className="dq-spinner" />
            <h2>Loading DocQuest</h2>
            <p>Fetching your profile records...</p>
          </div>
        </div>
      </div>
    )
  }

  /* ---------- ERROR ---------- */
  if (error) {
    return (
      <div className="dq-dash">
        <style>{css}</style>
        <Backdrop />
        <div className="dq-center">
          <div className="dq-state" role="alert">
            <div className="dq-state-icon"><AlertIcon /></div>
            <h2>Unable to load dashboard</h2>
            <p>{error}</p>
            <button className="dq-btn dq-btn-primary" onClick={loadProfile}>
              Try again
            </button>
          </div>
        </div>
      </div>
    )
  }

  /* ---------- DERIVED VALUES ---------- */
  const fullName = [profile?.first_name, profile?.middle_initial, profile?.last_name]
    .filter(Boolean)
    .join(' ')

  const initials =
    `${profile?.first_name?.[0] || ''}${profile?.last_name?.[0] || ''}`.toUpperCase() || 'DQ'

  const isStudent = profile?.student_status === 'student'
  const statusLabel = isStudent ? 'Current Student' : 'Graduated'
  const emailVerified = !!profile?.email_verified
  const courseLabel = profile?.course ? COURSE_NAMES[profile.course] || profile.course : ''

  const actions = [
    {
      key: 'request',
      title: 'Request Document',
      desc: 'Submit a new online request for transcripts, certifications, or diplomas.',
      cta: 'Start a request',
      tone: 'blue',
      icon: <FileIcon />,
      onClick: handleRequestDocumentClick,
      locked: !emailVerified,
    },
    {
      key: 'history',
      title: 'Request History',
      desc: 'View real-time progress and track the status of previous requests.',
      cta: 'View requests',
      tone: 'green',
      icon: <HistoryIcon />,
      onClick: () => navigate('/request-history'),
    },
    {
      key: 'notifications',
      title: 'Notifications',
      desc: 'Check updates and alerts about your pending document requests.',
      cta: 'Open notifications',
      tone: 'gold',
      icon: <BellIcon />,
      onClick: () => navigate('/notifications'),
    },
    {
      key: 'profile',
      title: 'My Profile',
      desc: 'Update personal details, contact information, and verify your Gmail.',
      cta: 'Manage profile',
      tone: 'navy',
      icon: <UserIcon />,
      onClick: () => navigate('/profile'),
    },
  ]

  /* ---------- PAGE ---------- */
  return (
    <div className="dq-dash">
      <style>{css}</style>
      <Backdrop />

      {/* NAVBAR */}
      <header className="dq-nav">
        <div className="dq-nav-inner">
          <div className="dq-brand">
            <Logo />
            <div className="dq-min-w-0">
              <div className="dq-brand-name">DocQuest</div>
              <small className="dq-brand-sub">
                Registrar's Office Document Tracking Request System
              </small>
            </div>
          </div>

          <div className="dq-nav-right">
            <div className="dq-user">
              <div className="dq-avatar" aria-hidden="true">{initials}</div>
              <div className="dq-user-text">
                <div className="dq-user-name">{fullName || 'Student'}</div>
                <div className="dq-user-role">{statusLabel}</div>
              </div>
            </div>

            <button
              className="dq-btn dq-btn-danger"
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
        {/* WELCOME BANNER (Inayos para magkasama ang Greeting at Name) */}
        <section className="dq-welcome">
          <div>
            <span className="dq-eyebrow">
              <span className="dq-eyebrow-dot" /> Student Dashboard
            </span>

            <h1>
              <span>{getGreeting()},</span>
              <span className="dq-name">
                {profile?.first_name || 'Student'}!
              </span>
            </h1>

            <p>
              Manage your registrar document requests and track their processing
              status online.
            </p>

            {(profile?.student_id || courseLabel) && (
              <div className="dq-chips">
                {profile?.student_id && (
                  <span className="dq-chip" style={{ '--d': '.6s' }}>
                    <IdIcon /> <small>ID</small> {profile.student_id}
                  </span>
                )}
                {courseLabel && (
                  <span className="dq-chip" style={{ '--d': '.72s' }}>
                    <CapIcon /> {courseLabel}
                  </span>
                )}
              </div>
            )}
          </div>

          <div className="dq-pill">
            <span className={`dq-pill-dot${isStudent ? '' : ' grad'}`} />
            {statusLabel}
          </div>
        </section>

        {/* VERIFICATION ALERT */}
        {!emailVerified && (
          <section className="dq-verify dq-anim" style={{ '--d': '.2s' }} role="alert">
            <div className="dq-verify-icon"><MailIcon /></div>
            <div className="dq-verify-body">
              <h3>Gmail verification required</h3>
              <p>
                Verify your Gmail account in your profile before submitting
                document requests.
              </p>
            </div>
            <button className="dq-btn dq-btn-gold" onClick={() => navigate('/profile')}>
              Go to Profile <ArrowIcon />
            </button>
          </section>
        )}

        {/* QUICK ACTIONS */}
        <section className="dq-section">
          <div className="dq-section-head">
            <h2>Quick Actions</h2>
          </div>

          <div className="dq-actions">
            {actions.map((a, i) => (
              <button
                key={a.key}
                type="button"
                className={`dq-action dq-anim${a.locked ? ' locked' : ''}`}
                style={{ '--d': `${0.3 + i * 0.1}s` }}
                onClick={a.onClick}
                onMouseMove={handleCardMove}
              >
                {a.locked && (
                  <span className="dq-lock"><LockIcon /> Verify first</span>
                )}
                <div className={`dq-action-icon dq-tone-${a.tone}`}>
                  {a.icon}
                </div>
                <h3>{a.title}</h3>
                <p>{a.desc}</p>
                <span className="dq-action-go">
                  {a.cta} <ArrowIcon />
                </span>
              </button>
            ))}
          </div>
        </section>
      </main>

      {/* EMAIL VERIFICATION MODAL */}
      {showEmailVerificationModal && (
        <div className="dq-overlay" onClick={() => setShowEmailVerificationModal(false)}>
          <div className="dq-modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
            <div className="dq-modal-icon"><MailIcon size={28} /></div>
            <h2>Verify Your Email First</h2>
            <p>
              Please verify your Gmail account in your Profile section before requesting documents.
            </p>
            <div className="dq-modal-actions">
              <button
                className="dq-btn dq-btn-outline"
                onClick={() => setShowEmailVerificationModal(false)}
              >
                Cancel
              </button>
              <button
                className="dq-btn dq-btn-gold"
                onClick={() => {
                  setShowEmailVerificationModal(false)
                  navigate('/profile')
                }}
              >
                Go to Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard