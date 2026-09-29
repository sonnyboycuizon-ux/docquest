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

  .dq-manage-admins {
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
    --warning: #B45309;
    --warning-bg: #FEF3C7;
    --shadow-sm: 0 1px 2px rgba(15, 23, 42, 0.06), 0 1px 3px rgba(15, 23, 42, 0.04);
    --shadow-md: 0 4px 12px rgba(15, 23, 42, 0.08), 0 2px 4px rgba(15, 23, 42, 0.06);
    --shadow-lg: 0 20px 50px rgba(15, 23, 42, 0.12), 0 8px 20px rgba(15, 23, 42, 0.08);
    --shadow-modal: 0 40px 90px rgba(15, 23, 42, 0.25), 0 20px 40px rgba(15, 23, 42, 0.18);
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
  .dq-manage-admins *, .dq-manage-admins *::before, .dq-manage-admins *::after { box-sizing: border-box; }

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
  @keyframes dq-pop {
    from { opacity: 0; transform: scale(.92) translateY(10px); }
    to   { opacity: 1; transform: none; }
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
  @keyframes dq-shimmer {
    0%   { background-position: -400px 0; }
    100% { background-position: 400px 0; }
  }

  .dq-manage-admins { animation: dq-fade 0.45s ease; }

  .dq-nav {
    position: sticky;
    top: 0;
    z-index: 3;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    padding: 14px 28px;
    background: rgba(255, 255, 255, 0.94);
    backdrop-filter: blur(16px) saturate(180%);
    -webkit-backdrop-filter: blur(16px) saturate(180%);
    border-bottom: 1px solid rgba(226, 232, 240, 0.7);
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

  .dq-btn-primary {
    background: linear-gradient(135deg, var(--primary), var(--primary-2));
    color: #fff;
    box-shadow: 0 8px 20px rgba(0, 4, 53, 0.24);
  }
  .dq-btn-primary:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 12px 28px rgba(0, 4, 53, 0.32);
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
    max-width: 1180px;
    animation: dq-rise 0.55s var(--ease);
  }

  .dq-welcome {
    padding: 26px 28px;
    border-radius: var(--radius);
    background:
      linear-gradient(135deg, rgba(0, 4, 53, 0.96) 0%, rgba(10, 16, 80, 0.94) 45%, rgba(37, 99, 235, 0.92) 100%);
    color: #fff;
    box-shadow: var(--shadow-lg);
    margin-bottom: 26px;
    position: relative;
    overflow: hidden;
    isolation: isolate;
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
    gap: 20px;
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
    margin-bottom: 12px;
  }
  .dq-dot {
    width: 8px; height: 8px;
    border-radius: 50%;
    background: var(--accent);
    box-shadow: 0 0 0 4px rgba(244, 180, 0, 0.2);
    animation: dq-bob 2.2s ease-in-out infinite;
  }
  .dq-welcome h1 {
    font-size: clamp(22px, 2.8vw, 28px);
    font-weight: 800;
    letter-spacing: -0.6px;
    line-height: 1.1;
    margin: 0 0 8px 0;
  }
  .dq-welcome p {
    font-size: 14px;
    line-height: 1.65;
    color: rgba(226, 232, 240, 0.92);
    max-width: 58ch;
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
  .dq-welcome-actions {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .dq-btn-outline-w {
    background: rgba(255, 255, 255, 0.12);
    backdrop-filter: blur(6px);
    color: #fff;
    border: 1.5px solid rgba(255, 255, 255, 0.3);
    height: 44px;
    padding: 0 18px;
    border-radius: 12px;
    font-size: 13.5px;
    font-weight: 600;
    box-shadow: none;
  }
  .dq-btn-outline-w:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.22);
    border-color: rgba(255, 255, 255, 0.6);
    transform: translateY(-1px);
  }
  .dq-btn-gold {
    background: linear-gradient(135deg, var(--accent), var(--accent-2));
    color: var(--primary);
    box-shadow: 0 10px 24px rgba(244, 180, 0, 0.38);
    height: 44px;
    padding: 0 18px;
    border-radius: 12px;
    font-size: 13.5px;
    font-weight: 750;
  }
  .dq-btn-gold:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 14px 32px rgba(244, 180, 0, 0.48);
  }
  .dq-btn-gold::after {
    content: '';
    position: absolute;
    top: 0; left: 0;
    width: 40%; height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.32), transparent);
    animation: dq-sweep 3.2s ease-in-out 1s infinite;
  }

  .dq-panel {
    background: var(--surface);
    border-radius: var(--radius);
    box-shadow: var(--shadow-lg);
    border: 1px solid rgba(226, 232, 240, 0.8);
    padding: 26px 28px 28px;
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
  .dq-alert-error {
    background: var(--error-bg);
    color: #991B1B;
    border-color: #FECACA;
    border-left-color: var(--error);
  }

  .dq-toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 14px;
    flex-wrap: wrap;
    margin-bottom: 18px;
    padding-bottom: 16px;
    border-bottom: 1px solid var(--border-soft);
  }
  .dq-toolbar h3 {
    margin: 0;
    font-size: 17px;
    font-weight: 750;
    color: var(--primary);
    letter-spacing: -0.2px;
  }
  .dq-count-pill {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 14px;
    border-radius: 999px;
    background: linear-gradient(135deg, var(--accent-soft), rgba(37, 99, 235, 0.08));
    border: 1.5px solid rgba(244, 180, 0, 0.3);
    font-size: 12.5px;
    font-weight: 700;
    color: var(--primary);
  }
  .dq-count-pill b {
    color: var(--secondary);
    font-weight: 800;
  }

  .dq-loading-wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 70px 20px;
  }
  .dq-loader {
    width: 48px; height: 48px;
    border-radius: 50%;
    border: 3.5px solid rgba(37, 99, 235, 0.18);
    border-top-color: var(--secondary);
    animation: dq-spin 0.8s linear infinite;
    margin-bottom: 18px;
  }
  .dq-loading-wrap p {
    font-size: 14px;
    color: var(--text-soft);
    margin: 0;
    font-weight: 500;
  }

  .dq-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 60px 20px;
    text-align: center;
  }
  .dq-empty-icon {
    width: 68px;
    height: 68px;
    border-radius: 20px;
    background: linear-gradient(135deg, rgba(37, 99, 235, 0.1), rgba(244, 180, 0, 0.15));
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text-soft);
    margin-bottom: 16px;
    border: 1.5px dashed var(--border);
  }
  .dq-empty h4 {
    margin: 0 0 6px 0;
    font-size: 16px;
    font-weight: 700;
    color: var(--primary);
  }
  .dq-empty p {
    margin: 0;
    font-size: 13.5px;
    color: var(--muted);
    max-width: 40ch;
    line-height: 1.55;
  }

  .dq-table-wrap {
    overflow-x: auto;
    border-radius: 14px;
    border: 1px solid var(--border);
    background: var(--surface);
  }
  .dq-table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
    min-width: 780px;
    font-size: 14px;
  }
  .dq-table thead tr {
    background: linear-gradient(90deg, #F8FAFC, #EFF6FF);
  }
  .dq-table th {
    padding: 14px 18px;
    text-align: left;
    font-size: 12px;
    font-weight: 700;
    color: var(--text-soft);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    border-bottom: 1.5px solid var(--border);
    white-space: nowrap;
  }
  .dq-table th:first-child { border-top-left-radius: 14px; }
  .dq-table th:last-child { border-top-right-radius: 14px; }

  .dq-table tbody tr {
    transition: background 0.15s ease;
  }
  .dq-table tbody tr:hover {
    background: #F8FAFC;
  }
  .dq-table tbody tr + tr td {
    border-top: 1px solid var(--border-soft);
  }
  .dq-table td {
    padding: 15px 18px;
    vertical-align: middle;
  }
  .dq-cell-name {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .dq-cell-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 14px;
    font-weight: 800;
    flex-shrink: 0;
    box-shadow: var(--shadow-sm);
  }
  .dq-avatar-primary { background: linear-gradient(135deg, var(--secondary), var(--primary-2)); }
  .dq-avatar-accent { background: linear-gradient(135deg, var(--accent), var(--accent-2)); color: var(--primary); }
  .dq-cell-meta { display: flex; flex-direction: column; line-height: 1.15; }
  .dq-cell-name b {
    font-size: 14.5px;
    font-weight: 700;
    color: var(--text);
    margin: 0;
  }
  .dq-cell-sub {
    font-size: 12px;
    color: var(--muted);
    margin-top: 3px;
  }

  .dq-cell-email {
    font-size: 13.5px;
    color: var(--text-soft);
    font-weight: 500;
  }

  .dq-cell-date {
    font-size: 13px;
    color: var(--text-soft);
    font-weight: 500;
    white-space: nowrap;
  }

  .dq-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 5px 10px;
    border-radius: 999px;
    font-size: 11.5px;
    font-weight: 700;
    letter-spacing: 0.3px;
    text-transform: uppercase;
    white-space: nowrap;
    border: 1.5px solid;
  }
  .dq-badge-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: currentColor;
    opacity: 0.9;
  }
  .dq-badge-super {
    background: linear-gradient(135deg, rgba(0, 4, 53, 0.08), rgba(37, 99, 235, 0.12));
    color: var(--primary);
    border-color: rgba(0, 4, 53, 0.22);
  }
  .dq-badge-admin {
    background: linear-gradient(135deg, rgba(37, 99, 235, 0.08), rgba(244, 180, 0, 0.1));
    color: var(--secondary);
    border-color: rgba(37, 99, 235, 0.22);
  }

  .dq-cell-actions {
    display: flex;
    align-items: center;
    gap: 6px;
    flex-wrap: wrap;
  }
  .dq-btn-sm {
    height: 32px;
    padding: 0 11px;
    border-radius: 8px;
    font-size: 12px;
    font-weight: 650;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    cursor: pointer;
    border: 1.5px solid;
    background: transparent;
    transition: transform 0.12s var(--ease), background 0.12s ease, border-color 0.12s ease, color 0.12s ease;
    font-family: inherit;
    white-space: nowrap;
  }
  .dq-btn-sm:focus-visible {
    outline: 2.5px solid rgba(37, 99, 235, 0.4);
    outline-offset: 1px;
  }
  .dq-btn-sm:active:not(:disabled) { transform: translateY(0); }
  .dq-btn-sm:hover:not(:disabled) { transform: translateY(-1px); }
  .dq-btn-sm:disabled { cursor: not-allowed; opacity: 0.55; }

  .dq-btn-edit {
    color: var(--secondary);
    border-color: rgba(37, 99, 235, 0.3);
  }
  .dq-btn-edit:hover:not(:disabled) {
    background: rgba(37, 99, 235, 0.08);
    border-color: var(--secondary);
  }
  .dq-btn-role {
    color: var(--warning);
    border-color: rgba(180, 83, 9, 0.28);
  }
  .dq-btn-role:hover:not(:disabled) {
    background: var(--warning-bg);
    border-color: var(--warning);
  }
  .dq-btn-remove {
    color: var(--error);
    border-color: rgba(220, 38, 38, 0.28);
  }
  .dq-btn-remove:hover:not(:disabled) {
    background: var(--error-bg);
    border-color: var(--error);
  }

  .dq-spinner-sm {
    width: 13px; height: 13px;
    border-radius: 50%;
    border: 2px solid currentColor;
    border-right-color: transparent;
    animation: dq-spin 0.7s linear infinite;
    opacity: 0.8;
  }

  .dq-modal-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(15, 23, 42, 0.6);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 50;
    padding: 20px;
    animation: dq-fade 0.2s ease;
  }

  .dq-modal {
    width: 100%;
    max-width: 500px;
    background: var(--surface);
    border-radius: 20px;
    box-shadow: var(--shadow-modal);
    border: 1px solid rgba(226, 232, 240, 0.9);
    overflow: hidden;
    animation: dq-pop 0.35s var(--ease);
  }
  .dq-modal-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 14px;
    padding: 22px 24px 18px;
    border-bottom: 1px solid var(--border-soft);
    position: relative;
  }
  .dq-modal-head::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 4px;
    background: linear-gradient(90deg, var(--primary), var(--secondary), var(--accent), var(--secondary), var(--primary));
    background-size: 200% 100%;
    animation: dq-flow 8s linear infinite;
  }
  .dq-modal-head h3 {
    margin: 0;
    font-size: 18px;
    font-weight: 750;
    color: var(--primary);
    letter-spacing: -0.2px;
  }
  .dq-modal-close {
    width: 36px;
    height: 36px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
    border: none;
    background: transparent;
    color: var(--muted);
    cursor: pointer;
    transition: background 0.12s ease, color 0.12s ease;
    flex-shrink: 0;
  }
  .dq-modal-close:hover:not(:disabled) {
    background: var(--border-soft);
    color: var(--text);
  }
  .dq-modal-close:disabled { opacity: 0.5; cursor: not-allowed; }

  .dq-modal-body {
    padding: 24px 24px 10px;
  }

  .dq-field { margin-bottom: 18px; }

  .dq-label {
    display: block;
    margin-bottom: 7px;
    font-size: 13px;
    font-weight: 650;
    color: var(--text-soft);
    letter-spacing: 0.2px;
  }
  .dq-label-required {
    color: var(--error);
    margin-left: 2px;
    font-weight: 700;
  }
  .dq-help {
    display: block;
    margin-top: 7px;
    font-size: 12px;
    color: var(--muted);
    line-height: 1.5;
  }

  .dq-input, .dq-select {
    width: 100%;
    height: 46px;
    padding: 0 13px;
    border: 1.5px solid var(--border);
    border-radius: 10px;
    background: var(--surface);
    color: var(--text);
    font-size: 14.5px;
    font-family: inherit;
    outline: none;
    transition: border-color 0.15s ease, box-shadow 0.15s ease, background 0.15s ease;
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
    background-position: right 12px center;
    background-size: 17px 17px;
    padding-right: 40px;
    cursor: pointer;
  }
  .dq-select:focus {
    background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%232563EB' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  }
  .dq-select option { color: var(--text); background: var(--surface); }

  .dq-modal-foot {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 10px;
    padding: 18px 24px 22px;
    border-top: 1px solid var(--border-soft);
    flex-wrap: wrap;
  }

  .dq-modal-submit {
    height: 44px;
    padding: 0 18px;
    border: none;
    border-radius: 11px;
    background: linear-gradient(135deg, var(--primary), var(--primary-2));
    color: #fff;
    font-family: inherit;
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;
    box-shadow: 0 10px 24px rgba(0, 4, 53, 0.28);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 9px;
    position: relative;
    overflow: hidden;
    transition: transform 0.15s var(--ease), box-shadow 0.15s var(--ease);
  }
  .dq-modal-submit:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 14px 32px rgba(0, 4, 53, 0.36);
  }
  .dq-modal-submit:active:not(:disabled) { transform: translateY(0); }
  .dq-modal-submit:focus-visible { outline: 3px solid rgba(37, 99, 235, 0.5); outline-offset: 3px; }
  .dq-modal-submit:disabled {
    background: var(--muted);
    box-shadow: none;
    cursor: not-allowed;
    transform: none;
  }
  .dq-modal-submit::after {
    content: '';
    position: absolute;
    top: 0; left: 0;
    width: 40%; height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    animation: dq-sweep 3.2s ease-in-out 1s infinite;
  }
  .dq-spinner {
    width: 16px; height: 16px;
    border-radius: 50%;
    border: 2.5px solid rgba(255, 255, 255, 0.4);
    border-top-color: #fff;
    animation: dq-spin 0.7s linear infinite;
  }

  .dq-modal-cancel {
    height: 44px;
    padding: 0 18px;
    border-radius: 11px;
    border: 1.5px solid var(--border);
    background: transparent;
    color: var(--text-soft);
    font-family: inherit;
    font-size: 14px;
    font-weight: 650;
    cursor: pointer;
    transition: background 0.12s ease, border-color 0.12s ease, color 0.12s ease, transform 0.12s var(--ease);
  }
  .dq-modal-cancel:hover:not(:disabled) {
    background: var(--border-soft);
    border-color: var(--text-soft);
    color: var(--primary);
    transform: translateY(-1px);
  }
  .dq-modal-cancel:disabled { opacity: 0.5; cursor: not-allowed; }

  @media (max-width: 720px) {
    .dq-nav { padding: 12px 16px; }
    .dq-brand-sub { display: none; }
    .dq-nav-user { display: none; }
    .dq-body { padding: 24px 16px 40px; }
    .dq-welcome { padding: 22px 20px; border-radius: 16px; }
    .dq-panel { padding: 22px 18px 22px; border-radius: 16px; }
    .dq-welcome-icon { width: 48px; height: 48px; }
    .dq-modal-body { padding: 20px 20px 8px; }
    .dq-modal-head { padding: 20px 20px 16px; }
    .dq-modal-foot { padding: 16px 20px 20px; }
    .dq-table th, .dq-table td { padding: 12px 14px; }
  }

  @media (prefers-reduced-motion: reduce) {
    .dq-manage-admins *, .dq-manage-admins *::before, .dq-manage-admins *::after {
      animation: none !important;
      transition: none !important;
    }
  }
`

const UsersIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
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

const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 5v14M5 12h14" />
  </svg>
)

const RefreshIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M21 12a9 9 0 1 1-3-6.7" />
    <path d="M21 3v6h-6" />
  </svg>
)

const EditIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.12 2.12 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
  </svg>
)

const ShieldSwapIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="m17 11 3-3-3-3" />
    <path d="M20 8h-5" />
    <path d="m7 13-3 3 3 3" />
    <path d="M4 16h5" />
  </svg>
)

const TrashIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M3 6h18" />
    <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
  </svg>
)

const CloseIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
)

const EmptyIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 11h-6M19 8v6" />
  </svg>
)

function ManageAdminAccounts() {
  const navigate = useNavigate()

  const [admins, setAdmins] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [editingAdmin, setEditingAdmin] = useState(null)
  const [editForm, setEditForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: 'admin',
  })

  const [savingEdit, setSavingEdit] = useState(false)
  const [removingAdminId, setRemovingAdminId] = useState(null)
  const [logoFailed, setLogoFailed] = useState(false)
  const [userName, setUserName] = useState('Super Admin')

  async function loadAdminAccounts() {
    setLoading(true)
    setError('')

    try {
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
          .select('role, first_name, last_name')
          .eq('id', user.id)
          .single()

      if (profileError) {
        throw profileError
      }

      if (profile.first_name || profile.last_name) {
        setUserName(
          [profile.first_name, profile.last_name].filter(Boolean).join(' ')
        )
      }

      if (profile.role !== 'super_admin') {
        navigate('/admin', { replace: true })
        return
      }

      const { data, error: adminError } =
        await supabase.rpc('get_admin_accounts')

      if (adminError) {
        throw adminError
      }

      setAdmins(data || [])
    } catch (err) {
      console.error(
        'Load admin accounts error:',
        err
      )

      setError(
        err.message ||
          'Failed to load administrator accounts.'
      )
    } finally {
      setLoading(false)
    }
  }

  function openEditModal(admin) {
    setError('')

    setEditingAdmin(admin)

    setEditForm({
      firstName: admin.first_name || '',
      lastName: admin.last_name || '',
      email: admin.email || '',
      role: admin.role || 'admin',
    })
  }

  function closeEditModal() {
    if (savingEdit) {
      return
    }

    setEditingAdmin(null)

    setEditForm({
      firstName: '',
      lastName: '',
      email: '',
      role: 'admin',
    })
  }

  async function handleEditSubmit(e) {
    e.preventDefault()

    setError('')

    if (!editingAdmin) {
      return
    }

    if (
      !editForm.firstName.trim() ||
      !editForm.lastName.trim() ||
      !editForm.email.trim()
    ) {
      setError(
        'First name, last name, and email are required.'
      )
      return
    }

    setSavingEdit(true)

    try {
      const {
        data: sessionData,
        error: sessionError,
      } = await supabase.auth.getSession()

      if (sessionError) {
        throw sessionError
      }

      const accessToken =
        sessionData.session?.access_token

      if (!accessToken) {
        navigate('/login', { replace: true })
        return
      }

      const { data, error: functionError } =
        await supabase.functions.invoke(
          'update-admin',
          {
            body: {
              adminId: editingAdmin.id,
              firstName:
                editForm.firstName.trim(),
              lastName:
                editForm.lastName.trim(),
              email:
                editForm.email.trim().toLowerCase(),
              role: editForm.role,
            },
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        )

      if (functionError) {
        throw functionError
      }

      if (!data?.success) {
        throw new Error(
          data?.error ||
            'Failed to update administrator account.'
        )
      }

      closeEditModal()

      await loadAdminAccounts()

      alert(
        'Administrator account updated successfully.'
      )
    } catch (err) {
      console.error(
        'Edit admin account error:',
        err
      )

      setError(
        err.message ||
          'Failed to update administrator account.'
      )
    } finally {
      setSavingEdit(false)
    }
  }

  async function handleChangeRole(admin) {
    const newRole =
      admin.role === 'super_admin'
        ? 'admin'
        : 'super_admin'

    const newRoleLabel =
      newRole === 'super_admin'
        ? 'Super Admin'
        : 'Standard Admin'

    const currentRoleLabel =
      admin.role === 'super_admin'
        ? 'Super Admin'
        : 'Standard Admin'

    const confirmed = window.confirm(
      `Change ${admin.first_name} ${admin.last_name}'s role?\n\n` +
        `Current role: ${currentRoleLabel}\n` +
        `New role: ${newRoleLabel}`
    )

    if (!confirmed) {
      return
    }

    setError('')

    try {
      const { error: roleError } =
        await supabase.rpc(
          'update_admin_role',
          {
            p_admin_id: admin.id,
            p_new_role: newRole,
          }
        )

      if (roleError) {
        throw roleError
      }

      await loadAdminAccounts()

      alert(
        `${admin.first_name} ${admin.last_name}'s role has been changed to ${newRoleLabel}.`
      )
    } catch (err) {
      console.error(
        'Change admin role error:',
        err
      )

      setError(
        err.message ||
          'Failed to change administrator role.'
      )
    }
  }

  async function handleRemoveAdmin(admin) {
    if (!admin) {
      return
    }

    setError('')

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError) {
      setError(
        userError.message ||
          'Unable to verify current user.'
      )
      return
    }

    if (user && user.id === admin.id) {
      alert(
        'You cannot remove your own administrator account.'
      )
      return
    }

    const roleLabel =
      admin.role === 'super_admin'
        ? 'Super Admin'
        : 'Standard Admin'

    const confirmed = window.confirm(
      `Remove administrator account?\n\n` +
        `Name: ${admin.first_name} ${admin.last_name}\n` +
        `Email: ${admin.email}\n` +
        `Role: ${roleLabel}\n\n` +
        `This will permanently remove this administrator account.\n\n` +
        `Are you sure you want to continue?`
    )

    if (!confirmed) {
      return
    }

    setRemovingAdminId(admin.id)

    try {
      const {
        data: sessionData,
        error: sessionError,
      } = await supabase.auth.getSession()

      if (sessionError) {
        throw sessionError
      }

      const accessToken =
        sessionData.session?.access_token

      if (!accessToken) {
        navigate('/login', { replace: true })
        return
      }

      const { data, error: functionError } =
        await supabase.functions.invoke(
          'remove-admin',
          {
            body: {
              adminId: admin.id,
            },
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        )

      if (functionError) {
        throw functionError
      }

      if (!data?.success) {
        throw new Error(
          data?.error ||
            'Failed to remove administrator account.'
        )
      }

      await loadAdminAccounts()

      alert(
        `${admin.first_name} ${admin.last_name}'s administrator account has been removed successfully.`
      )
    } catch (err) {
      console.error(
        'Remove admin account error:',
        err
      )

      setError(
        err.message ||
          'Failed to remove administrator account.'
      )
    } finally {
      setRemovingAdminId(null)
    }
  }

  useEffect(() => {
    loadAdminAccounts()
  }, [])

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

  const getInitials = (admin) => {
    return [admin.first_name, admin.last_name]
      .filter(Boolean)
      .map((s) => s[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div className="dq-manage-admins">
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
                <h1>Manage Admin Accounts</h1>
                <p>
                  Review, edit, promote, or remove DocQuest administrator accounts.
                  Only Super Admins can access this area.
                </p>
              </div>
              <div className="dq-welcome-actions">
                <div className="dq-welcome-icon" aria-hidden="true">
                  <UsersIcon />
                </div>
                <button
                  type="button"
                  className="dq-btn dq-btn-gold"
                  onClick={() => navigate('/admin/add-admin')}
                >
                  <PlusIcon />
                  <span>Add New Admin</span>
                </button>
              </div>
            </div>
          </div>

          {error && (
            <div className="dq-alert dq-alert-error" role="alert" style={{ marginBottom: 22 }}>
              <span className="dq-alert-icon"><AlertIcon /></span>
              <div>
                <strong>Error</strong>
                {error}
              </div>
            </div>
          )}

          <div className="dq-panel">
            <div className="dq-toolbar">
              <h3>Administrator Accounts</h3>
              <div className="dq-count-pill">
                <b>{admins.length}</b>
                <span>Account{admins.length !== 1 ? 's' : ''}</span>
                <button
                  type="button"
                  className="dq-btn-sm dq-btn-edit"
                  onClick={loadAdminAccounts}
                  style={{ height: 24, padding: '0 8px', marginLeft: 4 }}
                  title="Refresh list"
                >
                  <RefreshIcon />
                </button>
              </div>
            </div>

            {loading ? (
              <div className="dq-loading-wrap">
                <div className="dq-loader" />
                <p>Loading administrator accounts...</p>
              </div>
            ) : admins.length === 0 ? (
              <div className="dq-empty">
                <div className="dq-empty-icon"><EmptyIcon /></div>
                <h4>No administrator accounts found</h4>
                <p>
                  Invite the first admin using the &ldquo;Add New Admin&rdquo; button above
                  to start setting up your DocQuest team.
                </p>
              </div>
            ) : (
              <div className="dq-table-wrap">
                <table className="dq-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Created</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {admins.map((admin, idx) => (
                      <tr key={admin.id}>
                        <td>
                          <div className="dq-cell-name">
                            <div
                              className={`dq-cell-avatar ${idx % 2 === 0 ? 'dq-avatar-primary' : 'dq-avatar-accent'}`}
                            >
                              {getInitials(admin) || 'A'}
                            </div>
                            <div className="dq-cell-meta">
                              <b>{admin.first_name} {admin.last_name}</b>
                              <span className="dq-cell-sub">Admin ID: {admin.id.slice(0, 8)}...</span>
                            </div>
                          </div>
                        </td>
                        <td><span className="dq-cell-email">{admin.email}</span></td>
                        <td>
                          {admin.role === 'super_admin' ? (
                            <span className="dq-badge dq-badge-super">
                              <span className="dq-badge-dot" />
                              Super Admin
                            </span>
                          ) : (
                            <span className="dq-badge dq-badge-admin">
                              <span className="dq-badge-dot" />
                              Standard Admin
                            </span>
                          )}
                        </td>
                        <td>
                          <span className="dq-cell-date">
                            {new Date(admin.created_at).toLocaleDateString('en-PH', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </span>
                        </td>
                        <td>
                          <div className="dq-cell-actions">
                            <button
                              type="button"
                              className="dq-btn-sm dq-btn-edit"
                              onClick={() => openEditModal(admin)}
                              disabled={removingAdminId === admin.id}
                            >
                              <EditIcon />
                              <span>Edit</span>
                            </button>
                            <button
                              type="button"
                              className="dq-btn-sm dq-btn-role"
                              onClick={() => handleChangeRole(admin)}
                              disabled={removingAdminId === admin.id}
                            >
                              <ShieldSwapIcon />
                              <span>Change Role</span>
                            </button>
                            <button
                              type="button"
                              className="dq-btn-sm dq-btn-remove"
                              onClick={() => handleRemoveAdmin(admin)}
                              disabled={removingAdminId === admin.id}
                            >
                              {removingAdminId === admin.id ? (
                                <>
                                  <span className="dq-spinner-sm" />
                                  <span>Removing</span>
                                </>
                              ) : (
                                <>
                                  <TrashIcon />
                                  <span>Remove</span>
                                </>
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {editingAdmin && (
        <div className="dq-modal-backdrop" onClick={savingEdit ? undefined : closeEditModal}>
          <div className="dq-modal" onClick={(e) => e.stopPropagation()}>
            <div className="dq-modal-head">
              <h3>Edit Administrator Account</h3>
              <button
                type="button"
                className="dq-modal-close"
                onClick={closeEditModal}
                disabled={savingEdit}
                aria-label="Close dialog"
              >
                <CloseIcon />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} noValidate>
              <div className="dq-modal-body">
                <div className="dq-field">
                  <label htmlFor="edit-firstName" className="dq-label">
                    First Name<span className="dq-label-required">*</span>
                  </label>
                  <input
                    id="edit-firstName"
                    type="text"
                    className="dq-input"
                    value={editForm.firstName}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        firstName: e.target.value,
                      })
                    }
                    disabled={savingEdit}
                    required
                  />
                </div>

                <div className="dq-field">
                  <label htmlFor="edit-lastName" className="dq-label">
                    Last Name<span className="dq-label-required">*</span>
                  </label>
                  <input
                    id="edit-lastName"
                    type="text"
                    className="dq-input"
                    value={editForm.lastName}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        lastName: e.target.value,
                      })
                    }
                    disabled={savingEdit}
                    required
                  />
                </div>

                <div className="dq-field">
                  <label htmlFor="edit-email" className="dq-label">
                    Email<span className="dq-label-required">*</span>
                  </label>
                  <input
                    id="edit-email"
                    type="email"
                    className="dq-input"
                    value={editForm.email}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        email: e.target.value,
                      })
                    }
                    disabled={savingEdit}
                    required
                  />
                  <span className="dq-help">
                    Changing the email will update the administrator's
                    authentication email and profile email.
                  </span>
                </div>

                <div className="dq-field">
                  <label htmlFor="edit-role" className="dq-label">Administrator Role</label>
                  <select
                    id="edit-role"
                    className="dq-select"
                    value={editForm.role}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        role: e.target.value,
                      })
                    }
                    disabled={savingEdit}
                  >
                    <option value="admin">Standard Admin</option>
                    <option value="super_admin">Super Admin</option>
                  </select>
                </div>
              </div>

              <div className="dq-modal-foot">
                <button
                  type="button"
                  className="dq-modal-cancel"
                  onClick={closeEditModal}
                  disabled={savingEdit}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="dq-modal-submit"
                  disabled={savingEdit}
                >
                  {savingEdit ? (
                    <>
                      <span className="dq-spinner" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>Save Changes</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default ManageAdminAccounts
