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

  .dq-admin {
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
    --info: #0284C7;
    --purple: #7C3AED;
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
  .dq-admin *, .dq-admin *::before, .dq-admin *::after { box-sizing: border-box; }
  .dq-admin :where(h1, h2, h3, h4, p) { margin: 0; }
  .dq-admin > *:not(.dq-bg):not(.dq-orb) { position: relative; z-index: 2; }

  /* ---------- ANIMATED BACKGROUND ---------- */
  .dq-bg {
    position: fixed;
    inset: 0;
    z-index: 0;
    background:
      linear-gradient(160deg, rgba(0, 4, 53, .78) 0%, rgba(0, 4, 53, .55) 45%, rgba(0, 4, 53, .85) 100%),
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
  @keyframes dq-shine { 0% { background-position: -200% center; } 100% { background-position: 200% center; } }

  .dq-anim { animation: dq-rise .7s var(--ease) backwards; animation-delay: var(--d, 0s); }

  /* ---------- CENTER STATES ---------- */
  .dq-center { min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 20px; }
  .dq-state {
    width: 100%; max-width: 460px; padding: 40px 32px; text-align: center;
    background: rgba(255, 255, 255, .95); border: 1px solid rgba(255, 255, 255, .6);
    border-radius: 22px; box-shadow: 0 30px 70px rgba(0, 0, 0, .35);
    backdrop-filter: blur(10px); animation: dq-pop .5s var(--ease);
  }
  .dq-spinner {
    width: 46px; height: 46px; margin: 0 auto 18px; border-radius: 50%;
    border: 4px solid #DBEAFE; border-top-color: var(--secondary); animation: dq-spin .8s linear infinite;
  }
  .dq-spinner-sm {
    width: 16px; height: 16px; border-radius: 50%;
    border: 2.5px solid rgba(255,255,255,.45); border-top-color: #fff; animation: dq-spin .7s linear infinite;
  }
  .dq-state h2 { font-size: 18px; font-weight: 800; color: var(--primary); margin-bottom: 6px; }
  .dq-state p { font-size: 14px; line-height: 1.6; color: var(--muted); }
  .dq-state-icon {
    width: 56px; height: 56px; margin: 0 auto 16px; display: flex; align-items: center; justify-content: center;
    border-radius: 50%; background: #FEF2F2; color: var(--error);
  }

  /* ---------- BUTTONS ---------- */
  .dq-btn {
    display: inline-flex; align-items: center; justify-content: center; gap: 8px;
    padding: 10px 18px; border-radius: 10px; border: 1px solid transparent;
    font-size: 13.5px; font-weight: 700; font-family: inherit; cursor: pointer; white-space: nowrap;
    transition: background .2s ease, border-color .2s ease, box-shadow .2s ease, transform .2s ease, opacity .2s ease;
  }
  .dq-btn:hover:not(:disabled) { transform: translateY(-2px); }
  .dq-btn:active:not(:disabled) { transform: scale(.97); }
  .dq-btn:disabled { opacity: .6; cursor: not-allowed; }
  .dq-btn:focus-visible { outline: 3px solid rgba(96, 165, 250, .7); outline-offset: 2px; }

  .dq-btn-primary { background: var(--secondary); color: #fff; box-shadow: 0 8px 20px rgba(37, 99, 235, .28); }
  .dq-btn-primary:hover:not(:disabled) { background: #1D4ED8; }
  .dq-btn-navy { background: var(--primary); color: #fff; box-shadow: 0 8px 20px rgba(0, 4, 53, .28); }
  .dq-btn-navy:hover:not(:disabled) { background: var(--primary-2); }
  .dq-btn-outline { background: rgba(255,255,255,.95); color: var(--text); border-color: #CBD5E1; box-shadow: 0 2px 8px rgba(0,0,0,.06); }
  .dq-btn-outline:hover:not(:disabled) { background: #F1F5F9; border-color: #94A3B8; }
  .dq-btn-gold { position: relative; overflow: hidden; background: var(--accent); color: var(--primary); box-shadow: 0 8px 20px rgba(244, 180, 0, .35); }
  .dq-btn-gold:hover:not(:disabled) { background: #FFC61A; }
  .dq-btn-gold::after {
    content: ''; position: absolute; top: 0; left: 0; width: 40%; height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, .55), transparent);
    animation: dq-sweep 3.2s ease-in-out 1.2s infinite;
  }
  .dq-btn-danger { background: #fff; color: var(--error); border-color: #FECACA; }
  .dq-btn-danger:hover:not(:disabled) { background: #FEF2F2; border-color: var(--error); box-shadow: 0 8px 18px rgba(220, 38, 38, .18); }
  .dq-btn-success { background: linear-gradient(135deg, #16A34A, #15803D); color: #fff; box-shadow: 0 8px 20px rgba(22, 163, 74, .28); }
  .dq-btn-success:hover:not(:disabled) { background: linear-gradient(135deg, #15803D, #166534); }
  .dq-btn-info { background: linear-gradient(135deg, #0284C7, #0369A1); color: #fff; box-shadow: 0 8px 20px rgba(2, 132, 199, .28); }
  .dq-btn-info:hover:not(:disabled) { background: linear-gradient(135deg, #0369A1, #075985); }
  .dq-btn-teal { background: linear-gradient(135deg, #0D9488, #0F766E); color: #fff; box-shadow: 0 8px 20px rgba(13, 148, 136, .28); }
  .dq-btn-teal:hover:not(:disabled) { background: linear-gradient(135deg, #0F766E, #115E59); }
  .dq-btn-purple { background: linear-gradient(135deg, #7C3AED, #6D28D9); color: #fff; box-shadow: 0 8px 20px rgba(124, 58, 237, .28); }
  .dq-btn-purple:hover:not(:disabled) { background: linear-gradient(135deg, #6D28D9, #5B21B6); }
  .dq-btn-reject { background: linear-gradient(135deg, #DC2626, #B91C1C); color: #fff; box-shadow: 0 8px 20px rgba(220, 38, 38, .28); }
  .dq-btn-reject:hover:not(:disabled) { background: linear-gradient(135deg, #B91C1C, #991B1B); }
  .dq-btn-cancel { background: linear-gradient(135deg, #64748B, #475569); color: #fff; box-shadow: 0 8px 20px rgba(100, 116, 139, .25); }
  .dq-btn-cancel:hover:not(:disabled) { background: linear-gradient(135deg, #475569, #334155); }

  .dq-btn-logout { background: rgba(220, 38, 38, .08); color: var(--error); border-color: #FECACA; }
  .dq-btn-logout:hover:not(:disabled) { background: #FEF2F2; border-color: var(--error); }

  .dq-btn svg { flex-shrink: 0; transition: transform .2s ease; }

  /* ---------- NAVBAR ---------- */
  .dq-nav {
    position: sticky; top: 0; z-index: 20; width: 100%;
    background: rgba(255, 255, 255, .9); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
    border-bottom: 1px solid rgba(255, 255, 255, .5); box-shadow: 0 6px 24px rgba(0, 0, 0, .12);
    animation: dq-drop .7s var(--ease) backwards;
  }
  .dq-nav::after {
    content: ''; position: absolute; left: 0; right: 0; bottom: -1px; height: 2px;
    background: linear-gradient(90deg, var(--primary), var(--secondary), var(--accent), var(--secondary), var(--primary));
    background-size: 200% 100%; animation: dq-flow 6s linear infinite; opacity: .9;
  }
  .dq-nav-inner { display: flex; align-items: center; justify-content: space-between; gap: 16px; width: 100%; max-width: 1280px; margin: 0 auto; padding: 0 24px; height: 70px; }
  .dq-brand { display: flex; align-items: center; gap: 12px; min-width: 0; }
  .dq-logo {
    width: 46px; height: 46px; flex-shrink: 0; display: flex; align-items: center; justify-content: center;
    border-radius: 14px; border: 2px solid var(--primary); background: var(--primary); color: var(--accent);
    font-size: 16px; font-weight: 800; overflow: hidden; transition: transform .6s var(--ease);
  }
  .dq-brand:hover .dq-logo { transform: rotate(360deg) scale(1.06); }
  .dq-logo img { width: 100%; height: 100%; object-fit: cover; background: #fff; }
  .dq-brand-name { font-size: 20px; font-weight: 800; letter-spacing: -.4px; color: var(--primary); line-height: 1.1; }
  .dq-brand-sub { display: block; margin-top: 2px; font-size: 11.5px; font-weight: 500; color: var(--muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

  .dq-nav-right { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
  .dq-nav-btns { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
  .dq-user { display: flex; align-items: center; gap: 10px; padding: 6px 14px 6px 6px; border-radius: 999px; background: rgba(37,99,235,.06); border: 1px solid rgba(37,99,235,.12); }
  .dq-avatar {
    position: relative; width: 38px; height: 38px; flex-shrink: 0; display: flex; align-items: center; justify-content: center;
    border-radius: 50%; background: linear-gradient(135deg, var(--primary), var(--secondary)); color: #fff; font-size: 13px; font-weight: 800;
  }
  .dq-avatar::after {
    content: ''; position: absolute; right: -1px; bottom: -1px; width: 11px; height: 11px;
    border-radius: 50%; background: var(--accent); border: 2px solid #fff; animation: dq-ring 2.2s ease-out infinite;
  }
  .dq-user-name { font-size: 13px; font-weight: 700; color: var(--text); line-height: 1.2; max-width: 160px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .dq-user-role { font-size: 11px; font-weight: 600; color: var(--secondary); }
  .dq-user-role.super { color: var(--accent); }

  /* ---------- MAIN ---------- */
  .dq-main { width: 100%; max-width: 1280px; margin: 0 auto; padding: 28px 24px 64px; flex: 1; }

  /* ---------- WELCOME BANNER ---------- */
  .dq-welcome {
    position: relative; overflow: hidden;
    display: flex; align-items: center; justify-content: space-between; gap: 24px;
    padding: 28px 36px; margin-bottom: 26px; border-radius: 24px; color: #fff !important;
    background: linear-gradient(120deg, rgba(0, 4, 53, .96), rgba(13, 26, 92, .93), rgba(20, 50, 140, .9), rgba(37,99,235,.85), rgba(0, 4, 53, .96));
    background-size: 280% 280%;
    border: 1px solid rgba(255, 255, 255, .14);
    box-shadow: 0 30px 70px rgba(0, 0, 0, .4);
    backdrop-filter: blur(8px);
    animation: dq-rise .8s var(--ease) backwards, dq-flow 20s linear infinite;
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
    margin-bottom: 8px; color: #fff !important; display: flex; flex-wrap: wrap; align-items: center; gap: 8px;
  }
  .dq-role-badge {
    display: inline-flex; align-items: center; gap: 6px; padding: 4px 12px; border-radius: 999px;
    background: rgba(244, 180, 0, .18); border: 1px solid rgba(244, 180, 0, .35);
    font-size: 12px; font-weight: 700; color: var(--accent);
  }
  .dq-welcome p { max-width: 600px; font-size: 14px; line-height: 1.65; color: rgba(255, 255, 255, .85) !important; }

  .dq-welcome-stats {
    display: flex; gap: 12px; flex-shrink: 0;
  }
  .dq-ws-card {
    min-width: 110px; padding: 14px 18px; border-radius: 16px; text-align: center;
    background: rgba(255, 255, 255, .1); border: 1px solid rgba(255, 255, 255, .16); backdrop-filter: blur(6px);
    transition: transform .3s ease, background .3s ease;
  }
  .dq-ws-card:hover { transform: translateY(-3px); background: rgba(255, 255, 255, .16); }
  .dq-ws-num { font-size: 26px; font-weight: 800; color: var(--accent); line-height: 1; letter-spacing: -.5px; }
  .dq-ws-label { display: block; margin-top: 6px; font-size: 11px; font-weight: 600; color: rgba(255,255,255,.75); text-transform: uppercase; letter-spacing: .5px; }

  /* ---------- ALERTS ---------- */
  .dq-alert {
    display: flex; align-items: flex-start; gap: 12px;
    padding: 16px 20px; margin-bottom: 22px; border-radius: 14px;
    font-size: 14px; line-height: 1.6; font-weight: 500;
    animation: dq-pop .4s var(--ease);
  }
  .dq-alert-success {
    background: rgba(220, 252, 231, .95); color: #065F46; border: 1px solid #86EFAC;
    box-shadow: 0 10px 30px rgba(16, 185, 129, .15);
  }
  .dq-alert-error {
    background: rgba(254, 226, 226, .95); color: #7F1D1D; border: 1px solid #FCA5A5;
    box-shadow: 0 10px 30px rgba(220, 38, 38, .15);
  }
  .dq-alert-icon { flex-shrink: 0; margin-top: 2px; }

  /* ---------- STATS GRID ---------- */
  .dq-stats {
    display: grid; grid-template-columns: repeat(6, 1fr); gap: 16px;
    margin-bottom: 26px;
  }
  .dq-stat {
    position: relative; overflow: hidden;
    padding: 20px 18px; border-radius: 18px;
    background: rgba(255, 255, 255, .95); border: 1px solid rgba(255, 255, 255, .7);
    backdrop-filter: blur(8px); box-shadow: 0 14px 34px rgba(0, 0, 0, .18);
    transition: transform .3s var(--ease), box-shadow .3s ease;
    animation: dq-rise .6s var(--ease) backwards;
    animation-delay: var(--d, 0s);
  }
  .dq-stat:hover { transform: translateY(-6px); box-shadow: 0 22px 44px rgba(0, 0, 0, .26); }
  .dq-stat::after {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 4px; z-index: 2;
  }
  .dq-stat-icon {
    width: 44px; height: 44px; display: flex; align-items: center; justify-content: center;
    border-radius: 13px; margin-bottom: 14px;
  }
  .dq-stat-icon svg { width: 22px; height: 22px; }
  .dq-stat-label {
    display: block; font-size: 11.5px; font-weight: 700; color: var(--muted);
    text-transform: uppercase; letter-spacing: .6px; margin-bottom: 6px;
  }
  .dq-stat-num { font-size: 30px; font-weight: 800; letter-spacing: -.8px; line-height: 1; }

  .dq-stat.total::after { background: linear-gradient(90deg, var(--primary), var(--secondary)); }
  .dq-stat.total .dq-stat-icon { background: linear-gradient(135deg, #E8EAF6, #DBEAFE); color: var(--primary); }
  .dq-stat.total .dq-stat-num { color: var(--primary); }

  .dq-stat.pending::after { background: linear-gradient(90deg, #F59E0B, #D97706); }
  .dq-stat.pending .dq-stat-icon { background: linear-gradient(135deg, #FEF3C7, #FDE68A); color: #B45309; }
  .dq-stat.pending .dq-stat-num { color: #B45309; }

  .dq-stat.processing::after { background: linear-gradient(90deg, var(--secondary), #1D4ED8); }
  .dq-stat.processing .dq-stat-icon { background: linear-gradient(135deg, #DBEAFE, #BFDBFE); color: var(--secondary); }
  .dq-stat.processing .dq-stat-num { color: var(--secondary); }

  .dq-stat.ready::after { background: linear-gradient(90deg, #0D9488, #0F766E); }
  .dq-stat.ready .dq-stat-icon { background: linear-gradient(135deg, #CCFBF1, #99F6E4); color: #0F766E; }
  .dq-stat.ready .dq-stat-num { color: #0F766E; }

  .dq-stat.released::after { background: linear-gradient(90deg, var(--success), #15803D); }
  .dq-stat.released .dq-stat-icon { background: linear-gradient(135deg, #DCFCE7, #BBF7D0); color: #15803D; }
  .dq-stat.released .dq-stat-num { color: #15803D; }

  .dq-stat.rejected::after { background: linear-gradient(90deg, var(--error), #B91C1C); }
  .dq-stat.rejected .dq-stat-icon { background: linear-gradient(135deg, #FEE2E2, #FECACA); color: #B91C1C; }
  .dq-stat.rejected .dq-stat-num { color: #B91C1C; }

  /* ---------- FILTER CARD ---------- */
  .dq-filter-card {
    background: rgba(255, 255, 255, .96); border: 1px solid rgba(255, 255, 255, .7);
    border-radius: 20px; padding: 24px 26px; margin-bottom: 26px;
    backdrop-filter: blur(10px); box-shadow: 0 16px 40px rgba(0, 0, 0, .2);
    animation: dq-rise .7s var(--ease) backwards; animation-delay: .15s;
  }
  .dq-filter-head {
    display: flex; justify-content: space-between; align-items: flex-start; gap: 16px;
    margin-bottom: 22px; flex-wrap: wrap;
  }
  .dq-filter-title {
    font-size: 18px; font-weight: 800; color: var(--primary); letter-spacing: -.3px;
  }
  .dq-filter-subtitle { margin-top: 5px; font-size: 13px; color: var(--muted); line-height: 1.5; }
  .dq-filter-grid {
    display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px;
  }
  .dq-filter-field { display: flex; flex-direction: column; gap: 8px; }
  .dq-filter-label { font-size: 12.5px; font-weight: 700; color: #334155; letter-spacing: .2px; }
  .dq-filter-label-icon { display: inline-flex; align-items: center; gap: 6px; }
  .dq-filter-label-icon svg { width: 14px; height: 14px; color: var(--secondary); }

  .dq-input, .dq-select {
    width: 100%; padding: 12px 14px; border-radius: 11px;
    border: 1.5px solid #E2E8F0; background: #fff; color: var(--text);
    font-size: 14px; font-family: inherit; font-weight: 500; line-height: 1.4;
    transition: border-color .2s ease, box-shadow .2s ease, background .2s ease;
    appearance: none;
  }
  .dq-input:focus, .dq-select:focus {
    outline: none; border-color: var(--secondary);
    box-shadow: 0 0 0 4px rgba(37, 99, 235, .12); background: #fff;
  }
  .dq-input::placeholder { color: #94A3B8; }
  .dq-select { cursor: pointer; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%2364748B' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 14px center; padding-right: 40px; }

  .dq-result-count {
    display: flex; align-items: center; justify-content: space-between;
    margin-top: 20px; padding-top: 18px; border-top: 1px dashed #E2E8F0;
    font-size: 13px; color: var(--muted); font-weight: 500;
  }
  .dq-result-count strong { color: var(--primary); font-weight: 800; }

  /* ---------- SECTION HEAD ---------- */
  .dq-section-head { display: flex; align-items: center; gap: 14px; margin: 0 0 18px; }
  .dq-section-head h2 { font-size: 18px; font-weight: 800; letter-spacing: -.3px; color: #fff !important; text-shadow: 0 2px 8px rgba(0, 0, 0, .45); white-space: nowrap; }
  .dq-section-head::after {
    content: ''; flex: 1; height: 1px; transform-origin: left;
    background: linear-gradient(90deg, rgba(255, 255, 255, .5), transparent);
    animation: dq-grow 1s var(--ease) .3s backwards;
  }
  @keyframes dq-grow { from { transform: scaleX(0); } to { transform: scaleX(1); } }

  /* ---------- EMPTY CARD ---------- */
  .dq-empty {
    padding: 60px 40px; text-align: center; border-radius: 22px;
    background: rgba(255,255,255,.95); border: 1px solid rgba(255,255,255,.7); backdrop-filter: blur(8px);
    box-shadow: 0 20px 50px rgba(0,0,0,.25); animation: dq-pop .5s var(--ease);
  }
  .dq-empty-icon {
    width: 72px; height: 72px; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;
    border-radius: 20px; background: linear-gradient(135deg, var(--accent-soft), #FEF3C7); color: #B45309;
  }
  .dq-empty-icon svg { width: 34px; height: 34px; }
  .dq-empty h2 { font-size: 20px; font-weight: 800; color: var(--primary); margin-bottom: 8px; }
  .dq-empty p { font-size: 14px; color: var(--muted); line-height: 1.6; }
  .dq-empty .dq-btn { margin-top: 22px; }

  /* ---------- REQUEST LIST ---------- */
  .dq-request-list { display: grid; gap: 22px; }

  /* ---------- REQUEST CARD ---------- */
  .dq-req {
    background: rgba(255, 255, 255, .97); border: 1px solid rgba(255, 255, 255, .75);
    border-radius: 22px; overflow: hidden; backdrop-filter: blur(8px);
    box-shadow: 0 18px 44px rgba(0, 0, 0, .2);
    animation: dq-rise .6s var(--ease) backwards;
    transition: transform .3s var(--ease), box-shadow .3s ease;
  }
  .dq-req:hover { transform: translateY(-3px); box-shadow: 0 26px 58px rgba(0, 0, 0, .28); }

  /* Card Header */
  .dq-req-head {
    display: flex; justify-content: space-between; align-items: flex-start; gap: 16px;
    padding: 22px 26px 20px;
    background: linear-gradient(135deg, #F8FAFC 0%, #EFF6FF 50%, #F0FDFA 100%);
    border-bottom: 1px solid #E2E8F0;
    flex-wrap: wrap;
  }
  .dq-req-doc { font-size: 20px; font-weight: 800; color: var(--primary); letter-spacing: -.4px; }
  .dq-req-id { margin-top: 6px; font-size: 13px; color: var(--muted); font-weight: 600; }
  .dq-req-id strong { color: var(--secondary); }

  /* Status Pills */
  .dq-status {
    display: inline-flex; align-items: center; gap: 7px;
    padding: 7px 14px; border-radius: 999px;
    font-size: 12px; font-weight: 800; letter-spacing: .3px; text-transform: uppercase;
    border: 1px solid transparent; white-space: nowrap;
  }
  .dq-status-dot { width: 8px; height: 8px; border-radius: 50%; }
  .dq-status-pending { background: linear-gradient(135deg, #FEF3C7, #FDE68A); color: #92400E; border-color: #FCD34D; }
  .dq-status-pending .dq-status-dot { background: #F59E0B; animation: dq-ring 2s ease-out infinite; }
  .dq-status-approved { background: linear-gradient(135deg, #CFFAFE, #A5F3FC); color: #155E75; border-color: #67E8F9; }
  .dq-status-approved .dq-status-dot { background: #06B6D4; }
  .dq-status-processing { background: linear-gradient(135deg, #DBEAFE, #BFDBFE); color: #1E40AF; border-color: #93C5FD; }
  .dq-status-processing .dq-status-dot { background: var(--secondary); animation: dq-ring 2s ease-out infinite; }
  .dq-status-ready { background: linear-gradient(135deg, #CCFBF1, #99F6E4); color: #115E59; border-color: #5EEAD4; }
  .dq-status-ready .dq-status-dot { background: #0D9488; animation: dq-ring 2s ease-out infinite; }
  .dq-status-released { background: linear-gradient(135deg, #DCFCE7, #BBF7D0); color: #14532D; border-color: #86EFAC; }
  .dq-status-released .dq-status-dot { background: var(--success); }
  .dq-status-rejected { background: linear-gradient(135deg, #FEE2E2, #FECACA); color: #7F1D1D; border-color: #FCA5A5; }
  .dq-status-rejected .dq-status-dot { background: var(--error); }
  .dq-status-sm { font-size: 11px; padding: 5px 11px; }

  /* Card Body */
  .dq-req-body { padding: 22px 26px; }
  .dq-req-section { padding-top: 20px; margin-top: 20px; border-top: 1px solid #E2E8F0; }
  .dq-req-section:first-child { padding-top: 0; margin-top: 0; border-top: none; }
  .dq-req-section-title {
    display: inline-flex; align-items: center; gap: 8px;
    font-size: 14px; font-weight: 800; color: var(--primary); margin-bottom: 16px;
    letter-spacing: .2px;
  }
  .dq-req-section-title svg { width: 16px; height: 16px; color: var(--secondary); }

  /* Info Grid */
  .dq-info-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px 20px; }
  .dq-info-item { min-width: 0; }
  .dq-info-label {
    display: block; font-size: 11px; font-weight: 700; color: var(--muted);
    text-transform: uppercase; letter-spacing: .5px; margin-bottom: 5px;
  }
  .dq-info-value { font-size: 14px; font-weight: 600; color: #1E293B; line-height: 1.45; word-break: break-word; }
  .dq-info-value.muted { color: var(--muted); }
  .dq-info-value-strong { color: var(--primary); font-weight: 800; }

  /* Additional Details */
  .dq-additional {
    margin-top: 20px; padding: 18px 20px; border-radius: 14px;
    background: linear-gradient(135deg, #FEFCE8, #FFFBEB);
    border: 1px solid #FDE68A;
  }
  .dq-additional-title { display: block; font-size: 12.5px; font-weight: 800; color: #92400E; margin-bottom: 8px; letter-spacing: .2px; }
  .dq-additional p { font-size: 14px; color: #713F12; line-height: 1.65; font-weight: 500; }

  /* Timeline */
  .dq-timeline { margin-top: 4px; }
  .dq-tl-list { display: grid; gap: 0; border-left: 2px solid #E2E8F0; margin-left: 9px; }
  .dq-tl-item {
    position: relative; padding: 10px 0 10px 20px; display: flex; justify-content: space-between; gap: 12px; align-items: flex-start;
  }
  .dq-tl-item::before {
    content: ''; position: absolute; left: -7px; top: 16px; width: 12px; height: 12px;
    border-radius: 50%; background: #fff; border: 2.5px solid var(--secondary);
    box-shadow: 0 0 0 3px rgba(37, 99, 235, .12);
  }
  .dq-tl-item:last-child::after { display: none; }
  .dq-tl-label { font-size: 13px; font-weight: 700; color: #334155; display: flex; align-items: center; gap: 8px; }
  .dq-tl-label svg { width: 14px; height: 14px; color: var(--secondary); }
  .dq-tl-date { font-size: 12.5px; font-weight: 600; color: var(--muted); white-space: nowrap; }

  /* Actions Section */
  .dq-actions-wrap { padding: 20px 26px 24px; border-top: 1px solid #E2E8F0; background: linear-gradient(180deg, #F8FAFC 0%, #fff 100%); }
  .dq-actions-title {
    display: inline-flex; align-items: center; gap: 8px;
    font-size: 14px; font-weight: 800; color: var(--primary); margin-bottom: 14px;
  }
  .dq-actions-title svg { width: 16px; height: 16px; color: var(--accent); }
  .dq-action-btns { display: flex; gap: 10px; flex-wrap: wrap; }
  .dq-completed {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 10px 16px; border-radius: 12px;
    font-size: 13.5px; font-weight: 700; color: var(--muted);
    background: #F1F5F9; border: 1px solid #E2E8F0;
  }
  .dq-completed svg { width: 16px; height: 16px; color: var(--success); }
  .dq-completed.rejected { color: #7F1D1D; background: #FEF2F2; border-color: #FECACA; }
  .dq-completed.rejected svg { color: var(--error); }

  /* ---------- UTILITY CLASSES ---------- */
  .dq-min-w-0 { min-width: 0; }
  .dq-text-accent { color: var(--accent); }

  /* ---------- RESPONSIVE ---------- */
  @media (max-width: 1180px) {
    .dq-stats { grid-template-columns: repeat(3, 1fr); }
    .dq-info-grid { grid-template-columns: repeat(2, 1fr); }
    .dq-welcome-stats { display: none; }
  }
  @media (max-width: 960px) {
    .dq-filter-grid { grid-template-columns: repeat(2, 1fr); }
    .dq-user-text { display: none; }
    .dq-user { padding: 6px; border-radius: 50%; background: transparent; border: none; }
  }
  @media (max-width: 720px) {
    .dq-nav-inner { padding: 0 14px; height: 64px; }
    .dq-brand-sub { display: none; }
    .dq-logo { width: 40px; height: 40px; border-radius: 12px; }
    .dq-brand-name { font-size: 17px; }
    .dq-nav-btns { gap: 6px; }
    .dq-nav-right .dq-btn { padding: 8px 12px; font-size: 12px; }
    .dq-btn-label { display: none; }
    .dq-main { padding: 18px 14px 48px; }
    .dq-welcome { flex-direction: column; align-items: flex-start; padding: 22px 20px; border-radius: 18px; }
    .dq-stats { grid-template-columns: repeat(2, 1fr); gap: 12px; }
    .dq-stat { padding: 16px 14px; border-radius: 15px; }
    .dq-stat-num { font-size: 24px; }
    .dq-stat-icon { width: 38px; height: 38px; border-radius: 11px; margin-bottom: 10px; }
    .dq-stat-icon svg { width: 18px; height: 18px; }
    .dq-filter-card { padding: 18px 16px; border-radius: 16px; }
    .dq-filter-grid { grid-template-columns: 1fr; gap: 14px; }
    .dq-filter-head { margin-bottom: 18px; }
    .dq-req-head { padding: 18px 18px 16px; }
    .dq-req-body { padding: 18px; }
    .dq-req-doc { font-size: 17px; }
    .dq-info-grid { grid-template-columns: 1fr; gap: 14px; }
    .dq-actions-wrap { padding: 18px; }
    .dq-tl-item { flex-direction: column; align-items: flex-start; gap: 4px; padding: 10px 0 10px 18px; }
    .dq-tl-item::before { top: 14px; }
    .dq-empty { padding: 44px 22px; border-radius: 18px; }
    .dq-empty-icon { width: 60px; height: 60px; border-radius: 16px; }
    .dq-empty-icon svg { width: 28px; height: 28px; }
    .dq-alert { padding: 14px 16px; border-radius: 12px; font-size: 13px; }
    .dq-action-btns { flex-direction: column; }
    .dq-action-btns .dq-btn { width: 100%; }
    .dq-orb { opacity: .18; }
  }

  @media (prefers-reduced-motion: reduce) {
    .dq-admin *, .dq-admin *::before, .dq-admin *::after { animation: none !important; transition: none !important; }
    .dq-spinner, .dq-spinner-sm { animation: dq-spin 1.5s linear infinite !important; }
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

const StackIcon = (props) => (<svg {...ico} {...props}><path d="M12 2 2 7l10 5 10-5-10-5Z"/><path d="m2 17 10 5 10-5"/><path d="m2 12 10 5 10-5"/></svg>)
const ClockIcon = (props) => (<svg {...ico} {...props}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>)
const GearIcon = (props) => (<svg {...ico} {...props}><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>)
const CheckIcon = (props) => (<svg {...ico} {...props}><polyline points="20 6 9 17 4 12"/></svg>)
const SendIcon = (props) => (<svg {...ico} {...props}><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>)
const XIcon = (props) => (<svg {...ico} {...props}><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>)
const SearchIcon = (props) => (<svg {...ico} {...props}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>)
const FilterIcon = (props) => (<svg {...ico} {...props}><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>)
const FileIcon = (props) => (<svg {...ico} {...props}><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>)
const UserIcon = (props) => (<svg {...ico} {...props}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>)
const DocIcon = (props) => (<svg {...ico} {...props}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/></svg>)
const CalendarIcon = (props) => (<svg {...ico} {...props}><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>)
const ShieldIcon = (props) => (<svg {...ico} {...props}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/></svg>)
const ZapIcon = (props) => (<svg {...ico} {...props}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>)
const LogoutIcon = (props) => (<svg {...ico} width={17} height={17} {...props}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/></svg>)
const AlertIcon = (props) => (<svg {...ico} {...props}><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>)
const InfoIcon = (props) => (<svg {...ico} {...props}><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>)
const RefreshIcon = (props) => (<svg {...ico} {...props}><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/></svg>)
const TrashIcon = (props) => (<svg {...ico} {...props}><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>)
const UsersIcon = (props) => (<svg {...ico} {...props}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>)
const ChartIcon = (props) => (<svg {...ico} {...props}><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>)
const PlusIcon = (props) => (<svg {...ico} {...props}><path d="M12 5v14M5 12h14"/></svg>)
const MailIcon = (props) => (<svg {...ico} {...props}><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>)
const InboxIcon = (props) => (<svg {...ico} {...props}><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></svg>)
const FolderIcon = (props) => (<svg {...ico} {...props}><path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z"/></svg>)

const getGreeting = () => {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 18) return 'Good afternoon'
  return 'Good evening'
}

function AdminDashboard() {
  const navigate = useNavigate()

  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [actionLoading, setActionLoading] = useState(null)
  const [actionMessage, setActionMessage] = useState('')
  const [adminRole, setAdminRole] = useState('')
  const [adminProfile, setAdminProfile] = useState(null)
  const [logoFailed, setLogoFailed] = useState(false)

  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [documentFilter, setDocumentFilter] = useState('ALL')

  useEffect(() => {
    checkAdminAndLoadRequests()
  }, [])

  const getStudentFullName = (profile) => {
    return [
      profile?.first_name,
      profile?.middle_initial,
      profile?.last_name,
    ]
      .filter(
        (part) =>
          typeof part === 'string' &&
          part.trim() !== ''
      )
      .join(' ')
  }

  const handleLogout = async () => {
    try {
      setError('')
      const { error: logoutError } =
        await supabase.auth.signOut()
      if (logoutError) {
        throw logoutError
      }
      navigate('/login', { replace: true })
    } catch (error) {
      console.error('Logout error:', error)
      setError(
        error?.message ||
          'Unable to log out. Please try again.'
      )
    }
  }

  const checkAdminAndLoadRequests = async () => {
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

      const { data: profile, error: profileError } =
        await supabase
          .from('profiles')
          .select(
            'id, first_name, last_name, email, role'
          )
          .eq('id', user.id)
          .single()

      if (profileError) {
        throw profileError
      }

      if (
        profile.role !== 'admin' &&
        profile.role !== 'super_admin'
      ) {
        setError(
          'Access denied. This page is only available to administrators.'
        )
        return
      }

      setAdminRole(profile.role)
      setAdminProfile(profile)

      console.log(
        'CURRENT ADMIN ROLE:',
        profile.role
      )

      const {
        data: requestData,
        error: requestError,
      } = await supabase
        .from('document_requests')
        .select(`
          id,
          user_id,
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
          profiles (
            first_name,
            middle_initial,
            last_name,
            student_id,
            course,
            email,
            phone
          ),
          document_types (
            name,
            price
          )
        `)
        .order('date_requested', {
          ascending: false,
        })

      if (requestError) {
        throw requestError
      }

      setRequests(requestData || [])
    } catch (error) {
      console.error(
        'Admin Dashboard error:',
        error
      )

      setError(
        error?.message ||
          'Unable to load admin dashboard.'
      )
    } finally {
      setLoading(false)
    }
  }

  const sendStatusEmail = async (
    request,
    status
  ) => {
    try {
      const studentEmail =
        request.profiles?.email

      const studentName =
        getStudentFullName(request.profiles)

      const documentName =
        request.document_types?.name ||
        'Document'

      if (!studentEmail) {
        console.error(
          'Student email is missing.',
          request
        )

        return {
          success: false,
          error:
            'Student email address is missing.',
        }
      }

      console.log(
        'Sending DocQuest email:',
        {
          studentEmail,
          studentName,
          documentName,
          requestId: request.id,
          status,
        }
      )

      const response =
        await supabase.functions.invoke(
          'send-document-notification',
          {
            body: {
              studentEmail,
              studentName,
              documentName,
              requestId: request.id,
              status,
            },
          }
        )

      console.log(
        'Edge Function response:',
        response
      )

      if (response.error) {
        console.error(
          'Edge Function returned an error:',
          response.error
        )

        return {
          success: false,
          error:
            response.error.message ||
            'Edge Function request failed.',
        }
      }

      if (
        response.data &&
        response.data.success === true
      ) {
        console.log(
          'DocQuest Gmail notification sent successfully.'
        )

        return {
          success: true,
        }
      }

      console.error(
        'Unexpected Edge Function response:',
        response.data
      )

      return {
        success: false,
        error:
          response.data?.error ||
          'Unexpected response from notification service.',
      }
    } catch (error) {
      console.error(
        'Send status email error:',
        error
      )

      return {
        success: false,
        error:
          error?.message ||
          'Unable to send email notification.',
      }
    }
  }

  const updateStatus = async (
    request,
    newStatus
  ) => {
    const actionKey =
      `${request.id}-${newStatus}`

    try {
      setActionLoading(actionKey)
      setError('')
      setActionMessage('')

      const { data, error } =
        await supabase.rpc(
          'admin_update_request_status',
          {
            p_request_id: request.id,
            p_status: newStatus,
          }
        )

      if (error) {
        throw error
      }

      if (!data) {
        throw new Error(
          'The request status was not updated.'
        )
      }

      setRequests((currentRequests) =>
        currentRequests.map((item) =>
          item.id === request.id
            ? {
                ...item,
                ...data,
              }
            : item
        )
      )

      const emailResult =
        await sendStatusEmail(
          request,
          newStatus
        )

      if (emailResult.success) {
        setActionMessage(
          `Request #${request.id} updated to ${newStatus}. Student notification sent successfully.`
        )
      } else {
        setActionMessage(
          `Request #${request.id} updated to ${newStatus}, but the Gmail notification could not be sent.`
        )
      }
    } catch (error) {
      console.error(
        'Update status error:',
        error
      )

      setError(
        error?.message ||
          'Unable to update request status.'
      )
    } finally {
      setActionLoading(null)
    }
  }

  const cancelRequest = async (
    request
  ) => {
    const confirmed =
      window.confirm(
        `Are you sure you want to cancel Request #${request.id}?\n\nThis request will be permanently removed from the system.`
      )

    if (!confirmed) {
      return
    }

    const actionKey =
      `${request.id}-CANCEL`

    try {
      setActionLoading(actionKey)
      setError('')
      setActionMessage('')

      const {
        data,
        error,
      } = await supabase.rpc(
        'admin_cancel_request',
        {
          p_request_id: request.id,
        }
      )

      if (error) {
        throw error
      }

      if (!data) {
        throw new Error(
          'The request could not be cancelled.'
        )
      }

      setRequests((currentRequests) =>
        currentRequests.filter(
          (item) =>
            item.id !== request.id
        )
      )

      let emailResult = {
        success: false,
      }

      if (data.student_email) {
        const {
          data: emailData,
          error: emailError,
        } = await supabase.functions.invoke(
          'send-document-notification',
          {
            body: {
              studentEmail:
                data.student_email,

              studentName:
                data.student_name ||
                'Student',

              documentName:
                data.document_name ||
                'Document',

              requestId:
                data.request_id,

              status: 'CANCEL',
            },
          }
        )

        if (
          !emailError &&
          emailData?.success
        ) {
          emailResult = {
            success: true,
          }
        } else {
          console.error(
            'Cancel email error:',
            emailError || emailData
          )
        }
      }

      if (emailResult.success) {
        setActionMessage(
          `Request #${request.id} was cancelled and the student notification was sent successfully.`
        )
      } else {
        setActionMessage(
          `Request #${request.id} was cancelled, but the Gmail notification could not be sent.`
        )
      }
    } catch (error) {
      console.error(
        'Cancel request error:',
        error
      )

      setError(
        error?.message ||
          'Unable to cancel request.'
      )
    } finally {
      setActionLoading(null)
    }
  }

  const formatDate = (date) => {
    if (!date) return '—'
    return new Date(date).toLocaleString(
      'en-PH',
      {
        dateStyle: 'medium',
        timeStyle: 'short',
      }
    )
  }

  const getStatusClass = (status) => {
    switch (status) {
      case 'PENDING': return 'dq-status dq-status-pending'
      case 'APPROVED': return 'dq-status dq-status-approved'
      case 'PROCESSING': return 'dq-status dq-status-processing'
      case 'READY': return 'dq-status dq-status-ready'
      case 'RELEASED': return 'dq-status dq-status-released'
      case 'REJECTED': return 'dq-status dq-status-rejected'
      default: return 'dq-status'
    }
  }

  const isButtonLoading = (requestId, status) =>
    actionLoading === `${requestId}-${status}`

  const renderActionButtons = (
    request
  ) => {
    const status = request.status
    const isLoading = actionLoading !== null
    const isSuperAdmin = adminRole === 'super_admin'
    const isStandardAdmin = adminRole === 'admin'

    return (
      <div className="dq-actions-wrap">
        <div className="dq-actions-title">
          <ShieldIcon width={16} height={16} />
          Admin Actions
        </div>

        <div className="dq-action-btns">

          {isStandardAdmin && status === 'PENDING' && (
            <button
              type="button"
              onClick={() => updateStatus(request, 'APPROVED')}
              disabled={isLoading}
              className="dq-btn dq-btn-success"
            >
              {isButtonLoading(request.id, 'APPROVED') ? (
                <><span className="dq-spinner-sm" /> Approving...</>
              ) : (
                <><CheckIcon width={16} height={16} /> Approve</>
              )}
            </button>
          )}

          {isStandardAdmin && status !== 'PENDING' && (
            <span className="dq-completed">
              <InfoIcon width={16} height={16} />
              No actions available for Standard Admin.
            </span>
          )}

          {isSuperAdmin && status === 'PENDING' && (
            <>
              <button
                type="button"
                onClick={() => updateStatus(request, 'APPROVED')}
                disabled={isLoading}
                className="dq-btn dq-btn-success"
              >
                {isButtonLoading(request.id, 'APPROVED') ? (
                  <><span className="dq-spinner-sm" /> Approving...</>
                ) : (
                  <><CheckIcon width={16} height={16} /> Approve</>
                )}
              </button>

              <button
                type="button"
                onClick={() => updateStatus(request, 'REJECTED')}
                disabled={isLoading}
                className="dq-btn dq-btn-reject"
              >
                {isButtonLoading(request.id, 'REJECTED') ? (
                  <><span className="dq-spinner-sm" /> Rejecting...</>
                ) : (
                  <><XIcon width={16} height={16} /> Reject</>
                )}
              </button>

              <button
                type="button"
                onClick={() => cancelRequest(request)}
                disabled={isLoading}
                className="dq-btn dq-btn-cancel"
              >
                {isButtonLoading(request.id, 'CANCEL') ? (
                  <><span className="dq-spinner-sm" /> Cancelling...</>
                ) : (
                  <><TrashIcon width={16} height={16} /> Cancel Request</>
                )}
              </button>
            </>
          )}

          {isSuperAdmin && status === 'APPROVED' && (
            <>
              <button
                type="button"
                onClick={() => updateStatus(request, 'PROCESSING')}
                disabled={isLoading}
                className="dq-btn dq-btn-info"
              >
                {isButtonLoading(request.id, 'PROCESSING') ? (
                  <><span className="dq-spinner-sm" /> Updating...</>
                ) : (
                  <><GearIcon width={16} height={16} /> Mark as Processing</>
                )}
              </button>

              <button
                type="button"
                onClick={() => updateStatus(request, 'REJECTED')}
                disabled={isLoading}
                className="dq-btn dq-btn-reject"
              >
                {isButtonLoading(request.id, 'REJECTED') ? (
                  <><span className="dq-spinner-sm" /> Rejecting...</>
                ) : (
                  <><XIcon width={16} height={16} /> Reject</>
                )}
              </button>

              <button
                type="button"
                onClick={() => cancelRequest(request)}
                disabled={isLoading}
                className="dq-btn dq-btn-cancel"
              >
                {isButtonLoading(request.id, 'CANCEL') ? (
                  <><span className="dq-spinner-sm" /> Cancelling...</>
                ) : (
                  <><TrashIcon width={16} height={16} /> Cancel Request</>
                )}
              </button>
            </>
          )}

          {isSuperAdmin && status === 'PROCESSING' && (
            <>
              <button
                type="button"
                onClick={() => updateStatus(request, 'READY')}
                disabled={isLoading}
                className="dq-btn dq-btn-teal"
              >
                {isButtonLoading(request.id, 'READY') ? (
                  <><span className="dq-spinner-sm" /> Updating...</>
                ) : (
                  <><CheckIcon width={16} height={16} /> Ready for Pickup</>
                )}
              </button>

              <button
                type="button"
                onClick={() => updateStatus(request, 'REJECTED')}
                disabled={isLoading}
                className="dq-btn dq-btn-reject"
              >
                {isButtonLoading(request.id, 'REJECTED') ? (
                  <><span className="dq-spinner-sm" /> Rejecting...</>
                ) : (
                  <><XIcon width={16} height={16} /> Reject</>
                )}
              </button>

              <button
                type="button"
                onClick={() => cancelRequest(request)}
                disabled={isLoading}
                className="dq-btn dq-btn-cancel"
              >
                {isButtonLoading(request.id, 'CANCEL') ? (
                  <><span className="dq-spinner-sm" /> Cancelling...</>
                ) : (
                  <><TrashIcon width={16} height={16} /> Cancel Request</>
                )}
              </button>
            </>
          )}

          {isSuperAdmin && status === 'READY' && (
            <>
              <button
                type="button"
                onClick={() => updateStatus(request, 'RELEASED')}
                disabled={isLoading}
                className="dq-btn dq-btn-purple"
              >
                {isButtonLoading(request.id, 'RELEASED') ? (
                  <><span className="dq-spinner-sm" /> Updating...</>
                ) : (
                  <><SendIcon width={16} height={16} /> Mark as Released</>
                )}
              </button>

              <button
                type="button"
                onClick={() => cancelRequest(request)}
                disabled={isLoading}
                className="dq-btn dq-btn-cancel"
              >
                {isButtonLoading(request.id, 'CANCEL') ? (
                  <><span className="dq-spinner-sm" /> Cancelling...</>
                ) : (
                  <><TrashIcon width={16} height={16} /> Cancel Request</>
                )}
              </button>
            </>
          )}

          {status === 'RELEASED' && (
            <span className="dq-completed">
              <CheckIcon width={16} height={16} />
              Request completed and released.
            </span>
          )}

          {status === 'REJECTED' && (
            <span className="dq-completed rejected">
              <XIcon width={16} height={16} />
              This request has been rejected.
            </span>
          )}

        </div>
      </div>
    )
  }

  const pendingCount =
    requests.filter(
      (request) =>
        request.status === 'PENDING'
    ).length

  const processingCount =
    requests.filter(
      (request) =>
        request.status === 'PROCESSING'
    ).length

  const readyCount =
    requests.filter(
      (request) =>
        request.status === 'READY'
    ).length

  const releasedCount =
    requests.filter(
      (request) =>
        request.status === 'RELEASED'
    ).length

  const rejectedCount =
    requests.filter(
      (request) =>
        request.status === 'REJECTED'
    ).length

  const filteredRequests =
    requests.filter((request) => {
      const search =
        searchTerm.trim().toLowerCase()

      const studentName =
        getStudentFullName(
          request.profiles
        ).toLowerCase()

      const studentId =
        request.profiles?.student_id
          ?.toLowerCase() || ''

      const email =
        request.profiles?.email
          ?.toLowerCase() || ''

      const requestId =
        String(request.id).toLowerCase()

      const documentName =
        request.document_types?.name
          ?.toLowerCase() || ''

      const matchesSearch =
        !search ||
        studentName.includes(search) ||
        studentId.includes(search) ||
        email.includes(search) ||
        requestId.includes(search)

      const matchesStatus =
        statusFilter === 'ALL' ||
        request.status === statusFilter

      const matchesDocument =
        documentFilter === 'ALL' ||
        documentName ===
          documentFilter.toLowerCase()

      return (
        matchesSearch &&
        matchesStatus &&
        matchesDocument
      )
    })

  const documentOptions =
    [
      ...new Set(
        requests
          .map(
            (request) =>
              request.document_types?.name
          )
          .filter(Boolean)
      ),
    ].sort()

  const Backdrop = () => (
    <>
      <div className="dq-bg" />
      <div className="dq-orb dq-orb-1" />
      <div className="dq-orb dq-orb-2" />
    </>
  )

  const Logo = () => (
    <div className="dq-logo">
      {logoFailed ? (
        'DQ'
      ) : (
        <img
          src={logoImage}
          alt="DocQuest Logo"
          onError={() => setLogoFailed(true)}
        />
      )}
    </div>
  )

  const adminInitials =
    `${adminProfile?.first_name?.[0] || 'A'}${adminProfile?.last_name?.[0] || 'D'}`.toUpperCase()
  const adminFullName =
    [adminProfile?.first_name, adminProfile?.last_name].filter(Boolean).join(' ') || 'Admin'
  const isSuper = adminRole === 'super_admin'

  if (loading) {
    return (
      <div className="dq-admin">
        <style>{css}</style>
        <Backdrop />
        <div className="dq-center">
          <div className="dq-state" role="status">
            <div className="dq-spinner" />
            <h2>Loading Admin Dashboard</h2>
            <p>Fetching document requests and admin data...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="dq-admin">
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
                Admin Control Panel
              </small>
            </div>
          </div>

          <div className="dq-nav-right">
            <div className="dq-nav-btns">
              <button
                type="button"
                onClick={checkAdminAndLoadRequests}
                disabled={loading}
                className="dq-btn dq-btn-outline"
                title="Refresh data"
              >
                <RefreshIcon width={16} height={16} />
                <span className="dq-btn-label">Refresh</span>
              </button>

              {isSuper && (
                <>
                  <button
                    type="button"
                    onClick={() => navigate('/request-analysis')}
                    className="dq-btn dq-btn-outline"
                  >
                    <ChartIcon width={16} height={16} />
                    <span className="dq-btn-label">Analysis</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate('/manage-students')}
                    className="dq-btn dq-btn-outline"
                  >
                    <UsersIcon width={16} height={16} />
                    <span className="dq-btn-label">Students</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate('/manage-admin-accounts')}
                    className="dq-btn dq-btn-outline"
                  >
                    <ShieldIcon width={16} height={16} />
                    <span className="dq-btn-label">Admins</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate('/add-admin')}
                    className="dq-btn dq-btn-gold"
                  >
                    <PlusIcon width={16} height={16} />
                    <span className="dq-btn-label">Add Admin</span>
                  </button>
                </>
              )}
            </div>

            <div className="dq-user">
              <div className="dq-avatar" aria-hidden="true">{adminInitials}</div>
              <div className="dq-user-text">
                <div className="dq-user-name">{adminFullName}</div>
                <div className={`dq-user-role${isSuper ? ' super' : ''}`}>
                  {isSuper ? '✦ SUPER ADMIN' : 'ADMIN'}
                </div>
              </div>
            </div>

            <button
              type="button"
              className="dq-btn dq-btn-logout"
              onClick={handleLogout}
              aria-label="Logout"
              title="Logout"
            >
              <LogoutIcon />
              <span className="dq-btn-label">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="dq-main">

        {/* WELCOME BANNER */}
        <section className="dq-welcome">
          <div>
            <span className="dq-eyebrow">
              <span className="dq-eyebrow-dot" />
              Admin Dashboard
            </span>

            <h1>
              <span>{getGreeting()},</span>
              <span className="dq-text-accent">
                {adminProfile?.first_name || 'Admin'}!
              </span>
            </h1>

            <p>
              Manage student document requests, track processing statuses,
              and oversee registrar operations from one central hub.
            </p>
          </div>

          <div className="dq-welcome-stats">
            <div className="dq-ws-card">
              <div className="dq-ws-num">{requests.length}</div>
              <span className="dq-ws-label">Total</span>
            </div>
            <div className="dq-ws-card">
              <div className="dq-ws-num">{pendingCount}</div>
              <span className="dq-ws-label">Pending</span>
            </div>
            <div className="dq-ws-card">
              <div className="dq-ws-num">{releasedCount}</div>
              <span className="dq-ws-label">Released</span>
            </div>
          </div>
        </section>

        {/* ALERTS */}
        {actionMessage && (
          <div className="dq-alert dq-alert-success" role="status">
            <span className="dq-alert-icon">
              <CheckIcon width={20} height={20} />
            </span>
            <div>{actionMessage}</div>
          </div>
        )}

        {error && (
          <div className="dq-alert dq-alert-error" role="alert">
            <span className="dq-alert-icon">
              <AlertIcon width={20} height={20} />
            </span>
            <div>{error}</div>
          </div>
        )}

        {!error && (
          <>

            {/* STATISTICS */}
            <section>
              <div className="dq-stats">
                <div className="dq-stat total" style={{ '--d': '.05s' }}>
                  <div className="dq-stat-icon"><StackIcon /></div>
                  <span className="dq-stat-label">Total Requests</span>
                  <div className="dq-stat-num">{requests.length}</div>
                </div>

                <div className="dq-stat pending" style={{ '--d': '.1s' }}>
                  <div className="dq-stat-icon"><ClockIcon /></div>
                  <span className="dq-stat-label">Pending</span>
                  <div className="dq-stat-num">{pendingCount}</div>
                </div>

                <div className="dq-stat processing" style={{ '--d': '.15s' }}>
                  <div className="dq-stat-icon"><GearIcon /></div>
                  <span className="dq-stat-label">Processing</span>
                  <div className="dq-stat-num">{processingCount}</div>
                </div>

                <div className="dq-stat ready" style={{ '--d': '.2s' }}>
                  <div className="dq-stat-icon"><InboxIcon /></div>
                  <span className="dq-stat-label">Ready</span>
                  <div className="dq-stat-num">{readyCount}</div>
                </div>

                <div className="dq-stat released" style={{ '--d': '.25s' }}>
                  <div className="dq-stat-icon"><SendIcon /></div>
                  <span className="dq-stat-label">Released</span>
                  <div className="dq-stat-num">{releasedCount}</div>
                </div>

                <div className="dq-stat rejected" style={{ '--d': '.3s' }}>
                  <div className="dq-stat-icon"><XIcon /></div>
                  <span className="dq-stat-label">Rejected</span>
                  <div className="dq-stat-num">{rejectedCount}</div>
                </div>
              </div>
            </section>

            {/* SEARCH & FILTER */}
            <section>
              <div className="dq-filter-card">
                <div className="dq-filter-head">
                  <div>
                    <div className="dq-filter-title">Search &amp; Filter Requests</div>
                    <p className="dq-filter-subtitle">
                      Find requests by student, request ID, document, or status.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setSearchTerm('')
                      setStatusFilter('ALL')
                      setDocumentFilter('ALL')
                    }}
                    className="dq-btn dq-btn-outline"
                  >
                    <RefreshIcon width={15} height={15} />
                    Clear Filters
                  </button>
                </div>

                <div className="dq-filter-grid">
                  <div className="dq-filter-field">
                    <label className="dq-filter-label">
                      <span className="dq-filter-label-icon">
                        <SearchIcon width={14} height={14} /> Search
                      </span>
                    </label>
                    <input
                      type="text"
                      className="dq-input"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Name, Student ID, email, or Request ID..."
                    />
                  </div>

                  <div className="dq-filter-field">
                    <label className="dq-filter-label">
                      <span className="dq-filter-label-icon">
                        <FilterIcon width={14} height={14} /> Status
                      </span>
                    </label>
                    <select
                      className="dq-select"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                    >
                      <option value="ALL">All Statuses</option>
                      <option value="PENDING">Pending</option>
                      <option value="APPROVED">Approved</option>
                      <option value="PROCESSING">Processing</option>
                      <option value="READY">Ready</option>
                      <option value="RELEASED">Released</option>
                      <option value="REJECTED">Rejected</option>
                    </select>
                  </div>

                  <div className="dq-filter-field">
                    <label className="dq-filter-label">
                      <span className="dq-filter-label-icon">
                        <FolderIcon width={14} height={14} /> Document Type
                      </span>
                    </label>
                    <select
                      className="dq-select"
                      value={documentFilter}
                      onChange={(e) => setDocumentFilter(e.target.value)}
                    >
                      <option value="ALL">All Documents</option>
                      {documentOptions.map((documentName) => (
                        <option
                          key={documentName}
                          value={documentName}
                        >
                          {documentName}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="dq-result-count">
                  <div>
                    Showing <strong>{filteredRequests.length}</strong> of <strong>{requests.length}</strong> requests
                  </div>
                  <div>
                    {isSuper && <span className="dq-role-badge"><ZapIcon width={12} height={12} /> Super Admin Access</span>}
                    {!isSuper && <span className="dq-status dq-status-approved dq-status-sm"><span className="dq-status-dot" /> Standard Admin</span>}
                  </div>
                </div>
              </div>
            </section>

            {/* REQUEST LIST SECTION HEAD */}
            <div className="dq-section-head">
              <h2>Document Requests</h2>
            </div>

            {/* REQUEST LIST */}
            {requests.length === 0 ? (
              <div className="dq-empty">
                <div className="dq-empty-icon">
                  <InboxIcon />
                </div>
                <h2>No Document Requests</h2>
                <p>There are currently no student document requests in the system.</p>
              </div>
            ) : filteredRequests.length === 0 ? (
              <div className="dq-empty">
                <div className="dq-empty-icon">
                  <SearchIcon />
                </div>
                <h2>No Matching Requests</h2>
                <p>No document requests match your current search or filters.</p>
                <button
                  type="button"
                  className="dq-btn dq-btn-primary"
                  onClick={() => {
                    setSearchTerm('')
                    setStatusFilter('ALL')
                    setDocumentFilter('ALL')
                  }}
                >
                  <RefreshIcon width={16} height={16} />
                  Clear Search &amp; Filters
                </button>
              </div>
            ) : (
              <div className="dq-request-list">
                {filteredRequests.map((request, idx) => (
                  <article
                    key={request.id}
                    className="dq-req"
                    style={{ '--d': `${0.05 + idx * 0.04}s` }}
                  >
                    {/* CARD HEADER */}
                    <div className="dq-req-head">
                      <div>
                        <div className="dq-req-doc">
                          {request.document_types?.name || 'Document'}
                        </div>
                        <div className="dq-req-id">
                          Request <strong>#{request.id}</strong>
                        </div>
                      </div>
                      <span className={getStatusClass(request.status)}>
                        <span className="dq-status-dot" />
                        {request.status}
                      </span>
                    </div>

                    {/* CARD BODY */}
                    <div className="dq-req-body">

                      {/* STUDENT INFORMATION */}
                      <div className="dq-req-section">
                        <div className="dq-req-section-title">
                          <UserIcon width={16} height={16} />
                          Student Information
                        </div>
                        <div className="dq-info-grid">
                          <div className="dq-info-item">
                            <span className="dq-info-label">Name</span>
                            <div className="dq-info-value">
                              {getStudentFullName(request.profiles)}
                            </div>
                          </div>
                          <div className="dq-info-item">
                            <span className="dq-info-label">Student ID</span>
                            <div className="dq-info-value">
                              {request.profiles?.student_id || '—'}
                            </div>
                          </div>
                          <div className="dq-info-item">
                            <span className="dq-info-label">Course</span>
                            <div className="dq-info-value">
                              {request.profiles?.course || '—'}
                            </div>
                          </div>
                          <div className="dq-info-item">
                            <span className="dq-info-label">Email</span>
                            <div className="dq-info-value">
                              {request.profiles?.email || '—'}
                            </div>
                          </div>
                          <div className="dq-info-item">
                            <span className="dq-info-label">Phone</span>
                            <div className="dq-info-value">
                              {request.profiles?.phone || '—'}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* REQUEST INFORMATION */}
                      <div className="dq-req-section">
                        <div className="dq-req-section-title">
                          <DocIcon width={16} height={16} />
                          Request Information
                        </div>
                        <div className="dq-info-grid">
                          <div className="dq-info-item">
                            <span className="dq-info-label">Quantity</span>
                            <div className="dq-info-value">{request.quantity}</div>
                          </div>
                          <div className="dq-info-item">
                            <span className="dq-info-label">Unit Price</span>
                            <div className="dq-info-value">
                              ₱{Number(request.document_types?.price || 0).toFixed(2)}
                            </div>
                          </div>
                          <div className="dq-info-item">
                            <span className="dq-info-label">Total Amount</span>
                            <div className="dq-info-value dq-info-value-strong">
                              ₱{Number(request.total_amount || 0).toFixed(2)}
                            </div>
                          </div>
                          <div className="dq-info-item">
                            <span className="dq-info-label">Payment</span>
                            <div className="dq-info-value">{request.payment_status}</div>
                          </div>
                          <div className="dq-info-item">
                            <span className="dq-info-label">Date Requested</span>
                            <div className="dq-info-value">{formatDate(request.date_requested)}</div>
                          </div>
                          <div className="dq-info-item">
                            <span className="dq-info-label">Purpose</span>
                            <div className="dq-info-value">{request.purpose}</div>
                          </div>
                        </div>
                      </div>

                      {/* ADDITIONAL DETAILS */}
                      {request.additional_details && (
                        <div className="dq-additional">
                          <span className="dq-additional-title">Additional Details</span>
                          <p>{request.additional_details}</p>
                        </div>
                      )}

                      {/* TIMELINE */}
                      <div className="dq-req-section">
                        <div className="dq-req-section-title">
                          <CalendarIcon width={16} height={16} />
                          Timeline
                        </div>
                        <div className="dq-timeline">
                          <div className="dq-tl-list">
                            <div className="dq-tl-item">
                              <span className="dq-tl-label">
                                <FileIcon width={14} height={14} /> Requested
                              </span>
                              <span className="dq-tl-date">{formatDate(request.date_requested)}</span>
                            </div>
                            {request.date_approved && (
                              <div className="dq-tl-item">
                                <span className="dq-tl-label">
                                  <CheckIcon width={14} height={14} /> Approved
                                </span>
                                <span className="dq-tl-date">{formatDate(request.date_approved)}</span>
                              </div>
                            )}
                            {request.date_processing && (
                              <div className="dq-tl-item">
                                <span className="dq-tl-label">
                                  <GearIcon width={14} height={14} /> Processing
                                </span>
                                <span className="dq-tl-date">{formatDate(request.date_processing)}</span>
                              </div>
                            )}
                            {request.date_ready && (
                              <div className="dq-tl-item">
                                <span className="dq-tl-label">
                                  <InboxIcon width={14} height={14} /> Ready for Pickup
                                </span>
                                <span className="dq-tl-date">{formatDate(request.date_ready)}</span>
                              </div>
                            )}
                            {request.date_released && (
                              <div className="dq-tl-item">
                                <span className="dq-tl-label">
                                  <SendIcon width={14} height={14} /> Released
                                </span>
                                <span className="dq-tl-date">{formatDate(request.date_released)}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                    </div>

                    {/* ADMIN ACTIONS */}
                    {renderActionButtons(request)}
                  </article>
                ))}
              </div>
            )}

          </>
        )}

      </main>
    </div>
  )
}

export default AdminDashboard
