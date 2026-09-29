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

  .dq-prof {
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
  .dq-prof *, .dq-prof *::before, .dq-prof *::after { box-sizing: border-box; }
  .dq-prof :where(h1, h2, h3, h4, p) { margin: 0; }
  .dq-prof > *:not(.dq-bg):not(.dq-orb) { position: relative; z-index: 2; }
  .dq-prof :focus-visible { outline: 3px solid rgba(96, 165, 250, .7); outline-offset: 2px; }

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
  @keyframes dq-shake { 0%,100% { transform: translateX(0); } 20%,60% { transform: translateX(-6px); } 40%,80% { transform: translateX(6px); } }
  @keyframes dq-pulse-ring { 0% { box-shadow: 0 0 0 0 rgba(37,99,235,.45); } 100% { box-shadow: 0 0 0 10px rgba(37,99,235,0); } }

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
    display: inline-block;
    width: 18px; height: 18px; border-radius: 50%;
    border: 2.5px solid rgba(255,255,255,.38); border-top-color: #fff;
    animation: dq-spin .75s linear infinite;
  }
  .dq-spinner-dark {
    display: inline-block;
    width: 18px; height: 18px; border-radius: 50%;
    border: 2.5px solid #DBEAFE; border-top-color: var(--secondary);
    animation: dq-spin .75s linear infinite;
  }
  .dq-state-spinner {
    width: 52px; height: 52px; margin: 0 auto 18px; border-radius: 50%;
    border: 4px solid #DBEAFE; border-top-color: var(--secondary); animation: dq-spin .8s linear infinite;
  }
  .dq-state h2 { font-size: 18px; font-weight: 800; color: var(--primary); margin-bottom: 6px; }
  .dq-state p { font-size: 14px; line-height: 1.6; color: var(--muted); }

  /* ---------- BUTTONS ---------- */
  .dq-btn {
    display: inline-flex; align-items: center; justify-content: center; gap: 8px;
    padding: 11px 20px; border-radius: 12px; border: 1px solid transparent;
    font-size: 14px; font-weight: 700; font-family: inherit; cursor: pointer; white-space: nowrap;
    transition: background .2s ease, border-color .2s ease, box-shadow .2s ease, transform .2s ease, opacity .2s ease;
    position: relative; overflow: hidden;
  }
  .dq-btn:disabled { cursor: not-allowed; opacity: .65; }
  .dq-btn:not(:disabled):hover { transform: translateY(-2px); }
  .dq-btn:not(:disabled):active { transform: scale(.97); }
  .dq-btn-primary { background: var(--secondary); color: #fff; box-shadow: 0 8px 20px rgba(37, 99, 235, .35); }
  .dq-btn-primary:not(:disabled):hover { background: var(--primary-2); }
  .dq-btn-outline { background: #fff; color: var(--text); border-color: #CBD5E1; }
  .dq-btn-outline:not(:disabled):hover { background: #F1F5F9; border-color: #94A3B8; }
  .dq-btn-gold { background: var(--accent); color: var(--primary); box-shadow: 0 8px 20px rgba(244, 180, 0, .35); }
  .dq-btn-gold::after {
    content: ''; position: absolute; top: 0; left: 0; width: 40%; height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, .55), transparent);
    animation: dq-sweep 3.2s ease-in-out 1.2s infinite;
  }
  .dq-btn-gold:not(:disabled):hover { background: #FFC61A; }
  .dq-btn-success { background: var(--success); color: #fff; box-shadow: 0 8px 20px rgba(22, 163, 74, .32); }
  .dq-btn-success:not(:disabled):hover { background: #15803d; }
  .dq-btn-link {
    background: transparent; border: 0; padding: 6px 2px;
    color: var(--secondary); font-size: 13px; font-weight: 700; cursor: pointer;
    text-decoration: underline; text-underline-offset: 3px;
  }
  .dq-btn-link:not(:disabled):hover { color: var(--primary-2); }

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
  .dq-nav-inner { display: flex; align-items: center; justify-content: space-between; gap: 16px; width: 100%; max-width: 1200px; margin: 0 auto; padding: 0 32px; height: 68px; }
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
  .dq-user { display: flex; align-items: center; gap: 10px; padding-right: 14px; border-right: 1px solid var(--border); }
  .dq-avatar-sm {
    position: relative; width: 38px; height: 38px; flex-shrink: 0; display: flex; align-items: center; justify-content: center;
    border-radius: 50%; background: linear-gradient(135deg, #DBEAFE, #EFF6FF); color: var(--secondary); font-size: 13px; font-weight: 800;
  }
  .dq-user-name { font-size: 13.5px; font-weight: 700; color: var(--text); line-height: 1.2; max-width: 170px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .dq-user-role { font-size: 12px; color: var(--muted); }

  /* ---------- MAIN ---------- */
  .dq-main { width: 100%; max-width: 1000px; margin: 0 auto; padding: 32px 32px 64px; flex: 1; }

  /* ---------- PAGE HEADER ---------- */
  .dq-pagehead {
    display: flex; align-items: center; justify-content: space-between; gap: 20px; flex-wrap: wrap;
    margin-bottom: 28px; animation: dq-rise .7s var(--ease) backwards;
  }
  .dq-pagehead-left h1 {
    font-size: clamp(24px, 3.2vw, 32px); font-weight: 800; letter-spacing: -.6px;
    color: #fff !important; display: flex; align-items: center; gap: 12px;
  }
  .dq-pagehead-left h1 svg { color: var(--accent); }
  .dq-pagehead-sub { margin-top: 6px; font-size: 14px; color: rgba(255,255,255,.75); line-height: 1.6; max-width: 55ch; }

  /* ---------- ALERTS ---------- */
  .dq-alert {
    display: flex; align-items: flex-start; gap: 14px;
    padding: 16px 18px; border-radius: 14px; margin-bottom: 18px;
    border: 1px solid; animation: dq-pop .45s var(--ease);
    backdrop-filter: blur(4px);
  }
  .dq-alert-icon {
    width: 28px; height: 28px; flex-shrink: 0; display: flex; align-items: center; justify-content: center;
    border-radius: 50%;
  }
  .dq-alert-body { flex: 1; min-width: 0; }
  .dq-alert-body p { font-size: 14px; line-height: 1.55; font-weight: 500; }
  .dq-alert-error {
    background: rgba(254, 242, 242, .96); border-color: #FECACA; color: #991B1B;
  }
  .dq-alert-error .dq-alert-icon { background: #FEE2E2; color: var(--error); }
  .dq-alert-success {
    background: rgba(240, 253, 244, .96); border-color: #BBF7D0; color: #166534;
  }
  .dq-alert-success .dq-alert-icon { background: #DCFCE7; color: var(--success); }
  .dq-alert-warning {
    background: rgba(255, 251, 235, .96); border-color: #FDE68A; color: #78560B;
  }
  .dq-alert-warning .dq-alert-icon { background: #FEF3C7; color: #B45309; animation: dq-ring 2.2s ease-out infinite; }

  /* ---------- PROFILE CARD ---------- */
  .dq-card {
    background: rgba(255, 255, 255, .96); border: 1px solid rgba(255, 255, 255, .7);
    border-radius: 24px; box-shadow: 0 30px 70px rgba(0, 0, 0, .32);
    backdrop-filter: blur(10px); overflow: hidden; animation: dq-rise .7s var(--ease) backwards;
  }

  /* ---------- PROFILE HERO ---------- */
  .dq-hero {
    position: relative;
    padding: 36px 32px 28px; text-align: center;
    background:
      linear-gradient(135deg, var(--primary) 0%, var(--primary-2) 45%, #1B3F8F 100%);
    color: #fff; overflow: hidden;
  }
  .dq-hero::before {
    content: ''; position: absolute; width: 320px; height: 320px;
    top: -140px; right: -80px; border-radius: 50%;
    background: radial-gradient(circle, rgba(244,180,0,.22), transparent 65%);
    animation: dq-bob 8s ease-in-out infinite;
  }
  .dq-hero::after {
    content: ''; position: absolute; width: 260px; height: 260px;
    bottom: -140px; left: -60px; border-radius: 50%;
    background: radial-gradient(circle, rgba(59,130,246,.25), transparent 65%);
    animation: dq-bob 10s ease-in-out 1.5s infinite reverse;
  }
  .dq-hero > * { position: relative; z-index: 1; }

  .dq-avatar {
    width: 92px; height: 92px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 16px;
    background: linear-gradient(135deg, var(--accent), #FFD84D);
    color: var(--primary); font-size: 36px; font-weight: 800;
    border: 4px solid rgba(255,255,255,.25);
    box-shadow: 0 12px 30px rgba(244, 180, 0, .35);
    animation: dq-pop .6s var(--ease) .1s backwards;
  }
  .dq-hero-name {
    font-size: 24px; font-weight: 800; letter-spacing: -.3px;
    animation: dq-rise .6s var(--ease) .2s backwards;
  }
  .dq-hero-role {
    display: inline-flex; align-items: center; gap: 8px; margin-top: 8px;
    padding: 5px 14px; border-radius: 999px;
    background: rgba(255,255,255,.12); border: 1px solid rgba(255,255,255,.22);
    font-size: 12.5px; font-weight: 700; color: var(--accent);
    animation: dq-rise .6s var(--ease) .3s backwards;
  }
  .dq-hero-role::before {
    content: ''; width: 7px; height: 7px; border-radius: 50%;
    background: #4ADE80; box-shadow: 0 0 0 3px rgba(74,222,128,.25);
  }

  /* ---------- CARD SECTIONS ---------- */
  .dq-section-pad { padding: 28px 32px 32px; }

  .dq-section-title {
    display: flex; align-items: center; gap: 10px; margin-bottom: 18px;
    font-size: 16px; font-weight: 800; color: var(--primary); letter-spacing: -.2px;
  }
  .dq-section-title::before {
    content: ''; width: 4px; height: 18px; border-radius: 4px;
    background: linear-gradient(180deg, var(--secondary), var(--accent));
  }

  /* ---------- VERIFICATION CARD ---------- */
  .dq-verifycard {
    display: flex; align-items: stretch; gap: 16px; flex-wrap: wrap;
    padding: 22px; border-radius: 18px; margin-bottom: 28px;
    background: linear-gradient(135deg, #F8FAFC 0%, #EFF6FF 100%);
    border: 1px solid #DBEAFE; position: relative; overflow: hidden;
  }
  .dq-verifycard::after {
    content: ''; position: absolute; top: 0; left: 0; width: 4px; height: 100%;
    background: linear-gradient(180deg, var(--secondary), var(--accent));
  }
  .dq-verify-left { flex: 1; min-width: 260px; }
  .dq-verify-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; flex-wrap: wrap; margin-bottom: 10px; }
  .dq-verify-title { display: flex; align-items: center; gap: 10px; font-size: 15px; font-weight: 800; color: var(--primary); }
  .dq-verify-title svg { color: var(--secondary); }
  .dq-badge {
    display: inline-flex; align-items: center; gap: 7px; flex-shrink: 0;
    padding: 6px 14px; border-radius: 999px;
    font-size: 12.5px; font-weight: 700; border: 1px solid;
  }
  .dq-badge__dot { width: 7px; height: 7px; border-radius: 50%; background: currentColor; }
  .dq-badge-verified {
    background: #DCFCE7; color: #166534; border-color: #BBF7D0;
  }
  .dq-badge-verified .dq-badge__dot { box-shadow: 0 0 0 3px rgba(34,197,94,.2); animation: dq-live 2.2s ease-out infinite; }
  .dq-badge-pending {
    background: #FEF3C7; color: #92400e; border-color: #FDE68A;
  }
  .dq-badge-pending .dq-badge__dot { animation: dq-pulse-ring 1.8s ease-out infinite; }

  .dq-verify-text { font-size: 14px; line-height: 1.6; color: #475569; margin-bottom: 6px; }
  .dq-verify-email {
    display: inline-flex; align-items: center; gap: 8px;
    font-size: 13.5px; font-weight: 600; color: var(--primary-2);
    padding: 6px 12px; border-radius: 8px;
    background: #fff; border: 1px solid var(--border);
  }
  .dq-verify-email svg { color: var(--secondary); }

  .dq-verif-buttons { margin-top: 14px; display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }

  .dq-codebox {
    margin-top: 16px; padding: 16px 18px; border-radius: 14px;
    background: #fff; border: 1px solid var(--border);
    box-shadow: 0 4px 14px rgba(0, 0, 0, .04);
    animation: dq-pop .4s var(--ease);
  }
  .dq-codebox-label {
    display: flex; align-items: center; gap: 8px;
    font-size: 13px; font-weight: 600; color: var(--text); margin-bottom: 10px;
  }
  .dq-codebox-label svg { color: var(--accent); }
  .dq-code-input-row { display: flex; gap: 10px; flex-wrap: wrap; align-items: center; }
  .dq-code-input {
    flex: 1; min-width: 200px; max-width: 280px;
    padding: 12px 14px; border-radius: 11px;
    border: 2px solid #CBD5E1; background: #fff;
    font-size: 20px; font-weight: 700; letter-spacing: 6px;
    color: var(--primary); text-align: center; font-family: 'SF Mono', Menlo, Consolas, monospace;
    transition: border-color .2s ease, box-shadow .2s ease;
  }
  .dq-code-input:focus {
    outline: none; border-color: var(--secondary);
    box-shadow: 0 0 0 4px rgba(37,99,235,.15);
  }
  .dq-code-resend-row { margin-top: 10px; }

  .dq-msg {
    margin-top: 14px; padding: 10px 14px; border-radius: 10px;
    font-size: 13.5px; line-height: 1.55; font-weight: 500;
    display: flex; align-items: flex-start; gap: 10px;
  }
  .dq-msg svg { flex-shrink: 0; margin-top: 1px; }
  .dq-msg-success { background: #DCFCE7; color: #166534; border: 1px solid #BBF7D0; }
  .dq-msg-success svg { color: var(--success); }
  .dq-msg-error { background: #FEE2E2; color: #991B1B; border: 1px solid #FECACA; }
  .dq-msg-error svg { color: var(--error); }
  .dq-msg-error.shake { animation: dq-shake .45s ease; }

  /* ---------- INFO GRID ---------- */
  .dq-infogrid {
    display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 14px; margin-bottom: 8px;
  }
  .dq-infoitem {
    padding: 16px 18px; border-radius: 14px;
    background: #F8FAFC; border: 1px solid var(--border);
    transition: transform .2s ease, box-shadow .2s ease, border-color .2s ease;
  }
  .dq-infoitem:hover {
    transform: translateY(-2px);
    border-color: #BFDBFE;
    box-shadow: 0 10px 22px rgba(15, 23, 42, .06);
  }
  .dq-label {
    display: block; font-size: 12px; font-weight: 700;
    color: var(--muted); text-transform: uppercase; letter-spacing: .5px;
    margin-bottom: 6px;
  }
  .dq-label .dq-opt { color: #94A3B8; font-weight: 500; text-transform: none; letter-spacing: 0; margin-left: 2px; }
  .dq-value {
    font-size: 15px; font-weight: 700; color: var(--text);
    word-break: break-word; line-height: 1.4;
  }
  .dq-value.cap { text-transform: capitalize; }

  /* ---------- FORM INPUT ---------- */
  .dq-input-wrap { position: relative; margin-top: 4px; }
  .dq-input {
    width: 100%; padding: 12px 14px; border-radius: 11px;
    border: 2px solid #CBD5E1; background: #fff;
    font-size: 15px; font-weight: 600; color: var(--text); font-family: inherit;
    transition: border-color .2s ease, box-shadow .2s ease;
  }
  .dq-input::placeholder { color: #94A3B8; font-weight: 500; }
  .dq-input:focus {
    outline: none; border-color: var(--secondary);
    box-shadow: 0 0 0 4px rgba(37,99,235,.15);
  }

  /* ---------- SAVE BAR ---------- */
  .dq-savebar {
    display: flex; justify-content: flex-end; gap: 12px; flex-wrap: wrap;
    margin-top: 26px; padding-top: 22px;
    border-top: 1px solid var(--border);
  }
  .dq-btn-lg { padding: 13px 26px; font-size: 14.5px; border-radius: 13px; }

  .dq-min-w-0 { min-width: 0; }
  .dq-value-sm { font-size: 14px; }

  /* ---------- WARNING BANNER ---------- */
  .dq-warnbanner {
    margin-top: 26px; padding: 20px 22px; border-radius: 16px;
    display: flex; align-items: flex-start; gap: 14px;
    background: linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%);
    border: 1px solid #FDE68A; border-left: 5px solid var(--accent);
    position: relative; overflow: hidden;
    animation: dq-pop .5s var(--ease);
  }
  .dq-warnbanner::after {
    content: ''; position: absolute; top: 0; left: 0; width: 30%; height: 100%; pointer-events: none;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, .6), transparent);
    animation: dq-sweep 4.5s ease-in-out 1.5s infinite;
  }
  .dq-warn-icon {
    width: 44px; height: 44px; flex-shrink: 0; display: flex; align-items: center; justify-content: center;
    border-radius: 13px; background: #fff; color: #B45309; position: relative; z-index: 1;
    box-shadow: 0 4px 12px rgba(180, 83, 9, .18);
    animation: dq-ring 2.2s ease-out infinite;
  }
  .dq-warn-body { flex: 1; min-width: 0; position: relative; z-index: 1; }
  .dq-warn-body h3 { font-size: 15.5px; font-weight: 800; color: var(--primary); margin-bottom: 5px; }
  .dq-warn-body p { font-size: 13.5px; line-height: 1.6; color: #78560B; }
  .dq-warn-body p + p { margin-top: 6px; }

  /* ---------- RESPONSIVE ---------- */
  @media (max-width: 720px) {
    .dq-nav-inner { padding: 0 16px; height: 62px; }
    .dq-brand-sub { display: none; }
    .dq-logo { width: 38px; height: 38px; }
    .dq-brand-name { font-size: 18px; }
    .dq-nav-right .dq-btn-label { display: none; }
    .dq-user-text { display: none; }
    .dq-user { padding-right: 0; border-right: none; }
    .dq-main { padding: 20px 16px 48px; }
    .dq-hero { padding: 28px 20px 22px; }
    .dq-avatar { width: 78px; height: 78px; font-size: 30px; }
    .dq-hero-name { font-size: 20px; }
    .dq-section-pad { padding: 22px 20px 26px; }
    .dq-verifycard { padding: 18px 16px; }
    .dq-code-input { font-size: 18px; letter-spacing: 5px; }
    .dq-infogrid { gap: 12px; }
    .dq-savebar .dq-btn { flex: 1; }
    .dq-orb { opacity: .18; }
  }

  @media (prefers-reduced-motion: reduce) {
    .dq-prof *, .dq-prof *::before, .dq-prof *::after { animation: none !important; transition: none !important; }
    .dq-spinner, .dq-spinner-dark, .dq-state-spinner { animation: dq-spin 1.5s linear infinite !important; }
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

const UserIcon = () => (
  <svg {...ico}><circle cx="12" cy="8" r="4" /><path d="M4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1" /></svg>
)
const MailIcon = ({ size = 22 }) => (
  <svg {...ico} width={size} height={size}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></svg>
)
const LogoutIcon = () => (
  <svg {...ico} width={17} height={17}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" /></svg>
)
const ArrowLeftIcon = (p) => (
  <svg {...ico} width={18} height={18}><path d="M19 12H5" /><path d="m12 19-7-7 7-7" /></svg>
)
const ShieldIcon = () => (
  <svg {...ico}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="m9 12 2 2 4-4" /></svg>
)
const CheckCircleIcon = ({ size = 20 }) => (
  <svg {...ico} width={size} height={size}><circle cx="12" cy="12" r="9" /><path d="m8 12.5 3 3 5-6" /></svg>
)
const AlertCircleIcon = ({ size = 20 }) => (
  <svg {...ico} width={size} height={size}><circle cx="12" cy="12" r="9" /><path d="M12 8v4.5" /><path d="M12 16h.01" /></svg>
)
const WarningIcon = ({ size = 26 }) => (
  <svg {...ico} width={size} height={size}><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" /><path d="M12 9v4M12 17h.01" /></svg>
)
const IdIcon = () => (
  <svg {...ico} width={14} height={14}><rect x="3" y="5" width="18" height="14" rx="2" /><circle cx="9" cy="11" r="2" /><path d="M14 10h4M14 14h3M6 16c.5-1.5 5.5-1.5 6 0" /></svg>
)
const LockIcon = () => (
  <svg {...ico} width={16} height={16}><rect x="4" y="11" width="16" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></svg>
)
const KeyIcon = () => (
  <svg {...ico} width={16} height={16}><circle cx="8" cy="15" r="3" /><path d="M10.5 12.5 22 1M16 7l6-6" /></svg>
)

function Profile() {
  const navigate = useNavigate()

  const [profile, setProfile] = useState(null)
  const [emailVerified, setEmailVerified] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [middleInitial, setMiddleInitial] = useState('')

  const [verificationCode, setVerificationCode] = useState('')
  const [verificationMessage, setVerificationMessage] = useState('')
  const [verificationError, setVerificationError] = useState('')
  const [sendingCode, setSendingCode] = useState(false)
  const [verifyingCode, setVerifyingCode] = useState(false)
  const [showCodeInput, setShowCodeInput] = useState(false)
  const [logoFailed, setLogoFailed] = useState(false)
  const [errorShake, setErrorShake] = useState(false)

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
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

      const { data, error: profileError } =
        await supabase
          .from('profiles')
          .select(`
            id,
            first_name,
            middle_initial,
            last_name,
            student_id,
            course,
            student_status,
            email,
            phone,
            email_verified
          `)
          .eq('id', user.id)
          .single()

      if (profileError) {
        throw profileError
      }

      setProfile(data)
      setMiddleInitial(data.middle_initial || '')
      setEmailVerified(data.email_verified === true)

      if (data.email_verified === true) {
        setShowCodeInput(false)
        setVerificationCode('')
        setVerificationMessage('')
        setVerificationError('')
      }
    } catch (error) {
      console.error('Profile error:', error)
      setError(
        error?.message ||
          'Unable to load your profile.'
      )
    } finally {
      setLoading(false)
    }
  }

  const handleSendVerificationCode = async () => {
    setVerificationMessage('')
    setVerificationError('')
    setVerificationCode('')
    setSendingCode(true)

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
          'send-email-verification-code',
          {
            headers: {
              Authorization: `Bearer ${session.access_token}`,
            },
          }
        )

      if (error) {
        throw error
      }

      if (!data?.success) {
        throw new Error(
          data?.message ||
            data?.error ||
            'Failed to send verification code.'
        )
      }

      setShowCodeInput(true)
      setVerificationMessage(
        'Verification code sent to your Gmail. Please check your inbox.'
      )
    } catch (err) {
      console.error(
        'Send verification code error:',
        err
      )
      setVerificationError(
        err?.message ||
          'Failed to send verification code.'
      )
      setErrorShake(true)
      setTimeout(() => setErrorShake(false), 500)
    } finally {
      setSendingCode(false)
    }
  }

  const handleVerifyEmailCode = async () => {
    setVerificationMessage('')
    setVerificationError('')

    const cleanCode = verificationCode.trim()

    if (!/^\d{6}$/.test(cleanCode)) {
      setVerificationError(
        'Please enter the 6-digit verification code.'
      )
      setErrorShake(true)
      setTimeout(() => setErrorShake(false), 500)
      return
    }

    setVerifyingCode(true)

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        throw new Error(
          'Your session has expired. Please log in again.'
        )
      }

      const { data, error } =
        await supabase.functions.invoke(
          'verify-email-code',
          {
            body: {
              code: cleanCode,
            },
            headers: {
              Authorization: `Bearer ${session.access_token}`,
            },
          }
        )

      if (error) {
        throw error
      }

      if (!data?.success) {
        throw new Error(
          data?.message ||
            'Invalid verification code.'
        )
      }

      setEmailVerified(true)
      setProfile((currentProfile) => {
        if (!currentProfile) {
          return currentProfile
        }
        return {
          ...currentProfile,
          email_verified: true,
        }
      })
      setVerificationCode('')
      setShowCodeInput(false)
      setVerificationError('')
      setVerificationMessage(
        'Your Gmail account has been verified successfully.'
      )
    } catch (err) {
      console.error(err)
      setVerificationError(
        err.message ||
          'Failed to verify the Gmail account.'
      )
      setErrorShake(true)
      setTimeout(() => setErrorShake(false), 500)
    } finally {
      setVerifyingCode(false)
    }
  }

  const handleSaveProfile = async (e) => {
    e.preventDefault()

    try {
      setSaving(true)
      setError('')
      setSuccess('')

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

      const cleanedMiddleInitial =
        middleInitial.trim()

      const { data, error: updateError } =
        await supabase
          .from('profiles')
          .update({
            middle_initial:
              cleanedMiddleInitial || null,
            updated_at: new Date().toISOString(),
          })
          .eq('id', user.id)
          .select(`
            id,
            first_name,
            middle_initial,
            last_name,
            student_id,
            course,
            student_status,
            email,
            phone,
            email_verified
          `)
          .single()

      if (updateError) {
        throw updateError
      }

      setProfile(data)
      setMiddleInitial(
        data.middle_initial || ''
      )
      setEmailVerified(
        data.email_verified === true
      )
      setSuccess(
        'Profile updated successfully.'
      )
      setTimeout(() => {
        setSuccess('')
      }, 3000)
    } catch (error) {
      console.error(
        'Update profile error:',
        error
      )
      setError(
        error?.message ||
          'Unable to update your profile.'
      )
    } finally {
      setSaving(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/login', { replace: true })
  }

  const fullName = [profile?.first_name, profile?.middle_initial, profile?.last_name]
    .filter(Boolean)
    .join(' ')

  const initials =
    `${profile?.first_name?.[0] || ''}${profile?.last_name?.[0] || ''}`.toUpperCase() || 'DQ'

  const avatarInitial = (profile?.first_name?.charAt(0) || 'S').toUpperCase()

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
      <div className="dq-prof">
        <style>{css}</style>
        <Backdrop />
        <div className="dq-center">
          <div className="dq-state" role="status">
            <div className="dq-state-spinner" />
            <h2>Loading profile</h2>
            <p>Fetching your profile information...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="dq-prof">
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
            </div>

            <button
              className="dq-btn dq-btn-outline"
              onClick={() => navigate('/dashboard')}
              aria-label="Back to dashboard"
            >
              <ArrowLeftIcon />
              <span className="dq-btn-label">Dashboard</span>
            </button>

            <button
              className="dq-btn dq-btn-outline"
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
        {/* PAGE HEADER */}
        <div className="dq-pagehead" style={{ '--d': '.05s' }}>
          <div className="dq-pagehead-left">
            <h1>
              <UserIcon />
              My Profile
            </h1>
            <p className="dq-pagehead-sub">
              View and update your registered student information and manage your Gmail verification status.
            </p>
          </div>
        </div>

        {/* ALERTS */}
        {error && (
          <div className="dq-alert dq-alert-error" role="alert">
            <div className="dq-alert-icon"><AlertCircleIcon size={18} /></div>
            <div className="dq-alert-body"><p>{error}</p></div>
          </div>
        )}

        {success && (
          <div className="dq-alert dq-alert-success" role="status">
            <div className="dq-alert-icon"><CheckCircleIcon size={18} /></div>
            <div className="dq-alert-body"><p>{success}</p></div>
          </div>
        )}

        {profile && (
          <div className="dq-card" style={{ '--d': '.15s' }}>
            {/* PROFILE HERO */}
            <div className="dq-hero">
              <div className="dq-avatar">{avatarInitial}</div>
              <div className="dq-hero-name">
                {profile.first_name}{' '}
                {middleInitial ? `${middleInitial} ` : ''}
                {profile.last_name}
              </div>
              <div className="dq-hero-role">
                Student Account
              </div>
            </div>

            <div className="dq-section-pad">
              {/* GMAIL VERIFICATION SECTION */}
              <div className="dq-section-title">
                <ShieldIcon /> Gmail Verification
              </div>

              <div className="dq-verifycard">
                <div className="dq-verify-left">
                  <div className="dq-verify-head">
                    <div className="dq-verify-title">
                      <MailIcon size={18} /> Account Status
                    </div>
                    {emailVerified ? (
                      <span className="dq-badge dq-badge-verified">
                        <span className="dq-badge__dot" /> Verified
                      </span>
                    ) : (
                      <span className="dq-badge dq-badge-pending">
                        <span className="dq-badge__dot" /> Not Verified
                      </span>
                    )}
                  </div>

                  <p className="dq-verify-text">
                    {emailVerified
                      ? 'Your Gmail account is verified. You can now submit document requests.'
                      : 'Your Gmail account is not yet verified. Please verify it to unlock document requests.'}
                  </p>

                  <div className="dq-verify-email">
                    <MailIcon size={14} />
                    {profile.email || '—'}
                  </div>

                  {!emailVerified && (
                    <div className="dq-verif-buttons">
                      <button
                        type="button"
                        onClick={handleSendVerificationCode}
                        disabled={sendingCode}
                        className="dq-btn dq-btn-gold"
                      >
                        {sendingCode ? (
                          <>
                            <span className="dq-spinner-dark" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <LockIcon /> Get Verification Code
                          </>
                        )}
                      </button>
                    </div>
                  )}

                  {showCodeInput && !emailVerified && (
                    <div className="dq-codebox">
                      <div className="dq-codebox-label">
                        <KeyIcon /> Enter the 6-digit code sent to your Gmail
                      </div>
                      <div className="dq-code-input-row">
                        <input
                          type="text"
                          inputMode="numeric"
                          autoComplete="one-time-code"
                          maxLength={6}
                          value={verificationCode}
                          onChange={(e) =>
                            setVerificationCode(
                              e.target.value.replace(/\D/g, '')
                            )
                          }
                          placeholder="000000"
                          className="dq-code-input"
                        />
                        <button
                          type="button"
                          onClick={handleVerifyEmailCode}
                          disabled={
                            verifyingCode ||
                            verificationCode.length !== 6
                          }
                          className="dq-btn dq-btn-success"
                        >
                          {verifyingCode ? (
                            <>
                              <span className="dq-spinner" />
                              Verifying...
                            </>
                          ) : (
                            <>
                              <CheckCircleIcon size={16} /> Verify & Save
                            </>
                          )}
                        </button>
                      </div>
                      <div className="dq-code-resend-row">
                        <button
                          type="button"
                          onClick={handleSendVerificationCode}
                          disabled={sendingCode}
                          className="dq-btn-link"
                        >
                          {sendingCode
                            ? 'Sending new code...'
                            : "Didn't receive a code? Resend"}
                        </button>
                      </div>
                    </div>
                  )}

                  {verificationMessage && (
                    <div className="dq-msg dq-msg-success" role="status">
                      <CheckCircleIcon size={16} />
                      {verificationMessage}
                    </div>
                  )}

                  {verificationError && (
                    <div
                      className={`dq-msg dq-msg-error${errorShake ? ' shake' : ''}`}
                      role="alert"
                    >
                      <AlertCircleIcon size={16} />
                      {verificationError}
                    </div>
                  )}
                </div>
              </div>

              {/* PERSONAL INFO SECTION */}
              <div className="dq-section-title">
                <IdIcon /> Student Information
              </div>

              <form onSubmit={handleSaveProfile}>
                <div className="dq-infogrid">
                  <div className="dq-infoitem">
                    <span className="dq-label">First Name</span>
                    <div className="dq-value">
                      {profile.first_name || '—'}
                    </div>
                  </div>

                  <div className="dq-infoitem">
                    <label className="dq-label" htmlFor="middle-initial">
                      Middle Initial<span className="dq-opt">(Optional)</span>
                    </label>
                    <div className="dq-input-wrap">
                      <input
                        id="middle-initial"
                        type="text"
                        value={middleInitial}
                        onChange={(e) =>
                          setMiddleInitial(e.target.value)
                        }
                        placeholder="Enter middle initial"
                        maxLength={10}
                        className="dq-input"
                      />
                    </div>
                  </div>

                  <div className="dq-infoitem">
                    <span className="dq-label">Last Name</span>
                    <div className="dq-value">
                      {profile.last_name || '—'}
                    </div>
                  </div>

                  <div className="dq-infoitem">
                    <span className="dq-label">Student ID</span>
                    <div className="dq-value">
                      {profile.student_id || '—'}
                    </div>
                  </div>

                  <div className="dq-infoitem">
                    <span className="dq-label">Course</span>
                    <div className="dq-value">
                      {profile.course || '—'}
                    </div>
                  </div>

                  <div className="dq-infoitem">
                    <span className="dq-label">Student Status</span>
                    <div className="dq-value cap">
                      {profile.student_status || '—'}
                    </div>
                  </div>

                  <div className="dq-infoitem">
                    <span className="dq-label">Email / Gmail</span>
                    <div className="dq-value dq-value-sm">
                      {profile.email || '—'}
                    </div>
                  </div>

                  <div className="dq-infoitem">
                    <span className="dq-label">Phone Number</span>
                    <div className="dq-value">
                      {profile.phone || '—'}
                    </div>
                  </div>
                </div>

                <div className="dq-savebar">
                  <button
                    type="button"
                    className="dq-btn dq-btn-outline dq-btn-lg"
                    onClick={() => navigate('/dashboard')}
                  >
                    <ArrowLeftIcon /> Back
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="dq-btn dq-btn-primary dq-btn-lg"
                  >
                    {saving ? (
                      <>
                        <span className="dq-spinner" />
                        Saving Changes...
                      </>
                    ) : (
                      <>
                        <CheckCircleIcon size={16} /> Save Changes
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* WARNING BANNER */}
              {!emailVerified && (
                <div className="dq-warnbanner" role="alert">
                  <div className="dq-warn-icon">
                    <WarningIcon size={24} />
                  </div>
                  <div className="dq-warn-body">
                    <h3>Gmail Verification Required</h3>
                    <p>
                      Please verify your Gmail account before submitting a document request.
                    </p>
                    <p>
                      Click <strong>Get Verification Code</strong> above to receive your
                      6-digit verification code through Gmail.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default Profile
