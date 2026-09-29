import { useEffect, useMemo, useState } from 'react'
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

  .dq-manage-students {
    --primary: #000435;
    --primary-2: #0a1050;
    --primary-3: rgba(0, 4, 53, 0.92);
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
    --info: #0284C7;
    --info-bg: #E0F2FE;
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
  .dq-manage-students *, .dq-manage-students *::before, .dq-manage-students *::after { box-sizing: border-box; }

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
  @keyframes dq-fade { from { opacity: 0; } to { opacity: 1; } }
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
  @keyframes dq-slide {
    from { opacity: 0; transform: translateY(-6px); }
    to   { opacity: 1; transform: none; }
  }

  .dq-manage-students { animation: dq-fade 0.45s ease; }

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
    max-width: 1320px;
    animation: dq-rise 0.55s var(--ease);
  }

  .dq-welcome {
    padding: 24px 28px;
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
    gap: 18px;
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
    margin-bottom: 10px;
  }
  .dq-dot {
    width: 8px; height: 8px;
    border-radius: 50%;
    background: var(--accent);
    box-shadow: 0 0 0 4px rgba(244, 180, 0, 0.2);
    animation: dq-bob 2.2s ease-in-out infinite;
  }
  .dq-welcome h1 {
    font-size: clamp(22px, 2.6vw, 28px);
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
  }
  .dq-btn-outline-w:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.22);
    border-color: rgba(255, 255, 255, 0.6);
    transform: translateY(-1px);
  }

  .dq-alert-stack {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 22px;
  }
  .dq-alert {
    display: flex;
    gap: 12px;
    align-items: flex-start;
    justify-content: space-between;
    padding: 14px 16px 14px 17px;
    border-radius: 14px;
    font-size: 14px;
    line-height: 1.55;
    border-width: 1px;
    border-style: solid;
    border-left: 4px solid;
    box-shadow: var(--shadow-sm);
    animation: dq-slide 0.3s var(--ease);
  }
  .dq-alert-main { display: flex; gap: 12px; align-items: flex-start; min-width: 0; }
  .dq-alert-icon { flex-shrink: 0; margin-top: 1px; }
  .dq-alert strong { font-weight: 700; font-size: 14.5px; margin-right: 5px; }
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
  }
  .dq-alert-close {
    flex-shrink: 0;
    width: 30px;
    height: 30px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 9px;
    background: transparent;
    border: none;
    color: currentColor;
    opacity: 0.65;
    cursor: pointer;
    transition: background 0.12s ease, opacity 0.12s ease;
  }
  .dq-alert-close:hover {
    background: rgba(0, 0, 0, 0.06);
    opacity: 1;
  }

  .dq-filters {
    background: var(--surface);
    border-radius: var(--radius);
    box-shadow: var(--shadow-lg);
    border: 1px solid rgba(226, 232, 240, 0.8);
    padding: 22px 24px;
    margin-bottom: 22px;
    animation: dq-rise 0.65s var(--ease);
  }
  .dq-filter-grid {
    display: grid;
    grid-template-columns: 1.4fr 1fr;
    gap: 16px 20px;
    align-items: end;
  }
  .dq-field { display: flex; flex-direction: column; }

  .dq-label {
    display: block;
    margin-bottom: 7px;
    font-size: 12.5px;
    font-weight: 700;
    color: var(--text-soft);
    text-transform: uppercase;
    letter-spacing: 0.4px;
  }

  .dq-search-wrap {
    position: relative;
  }
  .dq-search-wrap svg {
    position: absolute;
    left: 14px;
    top: 50%;
    transform: translateY(-50%);
    pointer-events: none;
    color: var(--muted);
  }
  .dq-search-input {
    width: 100%;
    height: 48px;
    padding: 0 14px 0 44px;
    border: 1.5px solid var(--border);
    border-radius: 12px;
    background: var(--surface);
    color: var(--text);
    font-size: 14.5px;
    font-family: inherit;
    outline: none;
    transition: border-color 0.15s ease, box-shadow 0.15s ease, background 0.15s ease;
  }
  .dq-search-input::placeholder { color: var(--muted); }
  .dq-search-input:hover:not(:disabled) {
    border-color: var(--text-soft);
  }
  .dq-search-input:focus {
    border-color: var(--secondary);
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12);
    background: #FAFBFF;
  }

  .dq-select {
    width: 100%;
    height: 48px;
    padding: 0 44px 0 14px;
    border: 1.5px solid var(--border);
    border-radius: 12px;
    background-color: var(--surface);
    background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2394A3B8' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
    background-repeat: no-repeat;
    background-position: right 14px center;
    background-size: 17px 17px;
    appearance: none;
    color: var(--text);
    font-size: 14.5px;
    font-family: inherit;
    outline: none;
    cursor: pointer;
    transition: border-color 0.15s ease, box-shadow 0.15s ease, background 0.15s ease;
  }
  .dq-select:hover:not(:disabled) {
    border-color: var(--text-soft);
  }
  .dq-select:focus {
    border-color: var(--secondary);
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12);
    background-color: #FAFBFF;
  }
  .dq-select option { color: var(--text); background: var(--surface); }

  .dq-panel {
    background: var(--surface);
    border-radius: var(--radius);
    box-shadow: var(--shadow-lg);
    border: 1px solid rgba(226, 232, 240, 0.8);
    overflow: hidden;
    animation: dq-rise 0.65s var(--ease);
  }
  .dq-toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 14px;
    flex-wrap: wrap;
    padding: 18px 24px;
    background: linear-gradient(90deg, #F8FAFC, #F8FBFF);
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
    padding: 80px 20px;
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
    padding: 70px 20px;
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
    background: var(--surface);
  }
  .dq-table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
    min-width: 900px;
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
    padding: 14px 18px;
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
  .dq-avatar-a { background: linear-gradient(135deg, var(--secondary), var(--primary-2)); }
  .dq-avatar-b { background: linear-gradient(135deg, var(--accent), #F97316); color: var(--primary); }
  .dq-avatar-c { background: linear-gradient(135deg, #7C3AED, var(--secondary)); }
  .dq-avatar-d { background: linear-gradient(135deg, #059669, #0284C7); }
  .dq-avatar-e { background: linear-gradient(135deg, #DB2777, var(--primary-2)); }
  .dq-cell-meta { display: flex; flex-direction: column; line-height: 1.2; min-width: 0; }
  .dq-cell-meta b {
    font-size: 14.5px;
    font-weight: 700;
    color: var(--text);
  }
  .dq-cell-meta small {
    margin-top: 3px;
    font-size: 12px;
    color: var(--muted);
  }

  .dq-cell-std {
    font-size: 13.5px;
    color: var(--text-soft);
    font-weight: 500;
  }
  .dq-cell-muted {
    font-size: 13px;
    color: var(--muted);
    font-style: italic;
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
  .dq-badge-success {
    background: rgba(22, 163, 74, 0.08);
    color: var(--success);
    border-color: rgba(22, 163, 74, 0.28);
  }
  .dq-badge-error {
    background: var(--error-bg);
    color: var(--error);
    border-color: rgba(220, 38, 38, 0.28);
  }
  .dq-badge-info {
    background: var(--info-bg);
    color: var(--info);
    border-color: rgba(2, 132, 199, 0.28);
  }
  .dq-badge-warn {
    background: var(--warning-bg);
    color: var(--warning);
    border-color: rgba(180, 83, 9, 0.28);
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
  .dq-btn-activate {
    color: var(--success);
    border-color: rgba(22, 163, 74, 0.3);
  }
  .dq-btn-activate:hover:not(:disabled) {
    background: var(--success-bg);
    border-color: var(--success);
  }
  .dq-btn-suspend {
    color: var(--warning);
    border-color: rgba(180, 83, 9, 0.3);
  }
  .dq-btn-suspend:hover:not(:disabled) {
    background: var(--warning-bg);
    border-color: var(--warning);
  }
  .dq-btn-delete {
    color: var(--error);
    border-color: rgba(220, 38, 38, 0.3);
  }
  .dq-btn-delete:hover:not(:disabled) {
    background: var(--error-bg);
    border-color: var(--error);
  }

  .dq-spinner-sm {
    width: 12px; height: 12px;
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
    max-width: 720px;
    background: var(--surface);
    border-radius: 20px;
    box-shadow: var(--shadow-modal);
    border: 1px solid rgba(226, 232, 240, 0.9);
    overflow: hidden;
    animation: dq-pop 0.35s var(--ease);
    max-height: calc(100vh - 40px);
    display: flex;
    flex-direction: column;
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
    margin: 0 0 4px 0;
    font-size: 18px;
    font-weight: 750;
    color: var(--primary);
    letter-spacing: -0.2px;
  }
  .dq-modal-head small {
    font-size: 12.5px;
    color: var(--text-soft);
    font-weight: 500;
  }
  .dq-modal-head small b {
    color: var(--primary);
    font-weight: 700;
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
    padding: 24px 24px 8px;
    overflow-y: auto;
  }

  .dq-form-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px 20px;
  }
  .dq-form-field .dq-input, .dq-form-field .dq-select {
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
  .dq-form-field .dq-input::placeholder { color: var(--muted); }
  .dq-form-field .dq-input:hover:not(:disabled),
  .dq-form-field .dq-select:hover:not(:disabled) {
    border-color: var(--text-soft);
  }
  .dq-form-field .dq-input:focus,
  .dq-form-field .dq-select:focus {
    border-color: var(--secondary);
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12);
    background: #FAFBFF;
  }
  .dq-form-field .dq-input:disabled,
  .dq-form-field .dq-select:disabled {
    background: var(--border-soft);
    cursor: not-allowed;
    color: var(--muted);
  }
  .dq-form-field .dq-select {
    appearance: none;
    background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2394A3B8' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
    background-repeat: no-repeat;
    background-position: right 12px center;
    background-size: 17px 17px;
    padding-right: 40px;
    cursor: pointer;
  }
  .dq-form-field .dq-select:focus {
    background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%232563EB' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  }
  .dq-form-field .dq-select option { color: var(--text); background: var(--surface); }
  .dq-form-label {
    display: block;
    margin-bottom: 7px;
    font-size: 13px;
    font-weight: 650;
    color: var(--text-soft);
    letter-spacing: 0.2px;
  }

  .dq-form-info {
    display: flex;
    gap: 10px;
    align-items: flex-start;
    padding: 13px 14px;
    border-radius: 12px;
    margin: 18px 0 2px;
    background: linear-gradient(135deg, var(--info-bg), #EFF6FF);
    border: 1px solid #BAE6FD;
    border-left: 4px solid var(--info);
    font-size: 12.5px;
    line-height: 1.55;
    color: #0C4A6E;
  }
  .dq-form-info svg {
    flex-shrink: 0;
    margin-top: 1px;
    color: var(--info);
  }

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
    padding: 0 20px;
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
    padding: 0 20px;
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

  @media (max-width: 880px) {
    .dq-filter-grid { grid-template-columns: 1fr; }
    .dq-form-grid { grid-template-columns: 1fr; }
  }
  @media (max-width: 720px) {
    .dq-nav { padding: 12px 16px; }
    .dq-brand-sub { display: none; }
    .dq-nav-user { display: none; }
    .dq-body { padding: 24px 16px 40px; }
    .dq-welcome { padding: 22px 20px; border-radius: 16px; }
    .dq-filters { padding: 18px 18px; border-radius: 16px; }
    .dq-panel { border-radius: 16px; }
    .dq-toolbar { padding: 16px 18px; }
    .dq-welcome-icon { width: 48px; height: 48px; }
    .dq-modal-body { padding: 20px 20px 8px; }
    .dq-modal-head { padding: 20px 20px 16px; }
    .dq-modal-foot { padding: 16px 20px 20px; }
    .dq-table th, .dq-table td { padding: 12px 14px; }
  }

  @media (prefers-reduced-motion: reduce) {
    .dq-manage-students *, .dq-manage-students *::before, .dq-manage-students *::after {
      animation: none !important;
      transition: none !important;
    }
  }
`

const StudentsIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
    <path d="M6 12v5c3 3 9 3 12 0v-5" />
  </svg>
)

const AlertCircleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 8v4M12 16h.01" />
  </svg>
)

const CheckCircleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="10" />
    <path d="m8 12 3 3 5-6" />
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

const RefreshIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M21 12a9 9 0 1 1-3-6.7" />
    <path d="M21 3v6h-6" />
  </svg>
)

const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </svg>
)

const EditIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.12 2.12 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
  </svg>
)

const PlayIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="m5 3 14 9-14 9z" />
  </svg>
)

const PauseIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M6 4h4v16H6zM14 4h4v16h-4z" />
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
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
)

const EmptyIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
    <path d="M6 12v5c3 3 9 3 12 0v-5" />
  </svg>
)

const InfoIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 16v-4M12 8h.01" />
  </svg>
)

function ManageStudents() {
  const navigate = useNavigate()

  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const [currentUserRole, setCurrentUserRole] = useState('')
  const [currentUserName, setCurrentUserName] = useState('Administrator')
  const [editingStudent, setEditingStudent] = useState(null)

  const [studentNumber, setStudentNumber] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [course, setCourse] = useState('')
  const [phone, setPhone] = useState('')
  const [studentStatus, setStudentStatus] = useState('student')

  const [saving, setSaving] = useState(false)
  const [actionLoading, setActionLoading] = useState(null)
  const [logoFailed, setLogoFailed] = useState(false)

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
  const supabasePublishableKey =
    import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

  const getStudentFullName = (student) => {
    return [
      student.first_name,
      student.middle_initial,
      student.last_name,
    ]
      .filter(
        (part) =>
          typeof part === 'string' &&
          part.trim() !== ''
      )
      .join(' ')
  }

  const loadCurrentUser = async () => {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError) {
      throw userError
    }

    if (!user) {
      throw new Error('You must be logged in.')
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

    setCurrentUserRole(profile.role)

    if (profile.first_name || profile.last_name) {
      setCurrentUserName(
        [profile.first_name, profile.last_name]
          .filter(Boolean)
          .join(' ')
      )
    }
  }

  const loadStudents = async () => {
    setLoading(true)
    setError('')

    try {
      const { data, error: studentsError } =
        await supabase
          .from('profiles')
          .select(`
            id,
            first_name,
            middle_initial,
            last_name,
            email,
            student_id,
            course,
            phone,
            student_status,
            suspended,
            email_verified,
            created_at,
            updated_at
          `)
          .eq('role', 'student')
          .order('created_at', {
            ascending: false,
          })

      if (studentsError) {
        throw studentsError
      }

      setStudents(data || [])
    } catch (err) {
      console.error('Load students error:', err)
      setError(
        err.message ||
          'Unable to load student accounts.'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const initialize = async () => {
      try {
        await loadCurrentUser()
        await loadStudents()
      } catch (err) {
        console.error('Initialization error:', err)
        setError(
          err.message ||
            'Unable to load Manage Students.'
        )
        setLoading(false)
      }
    }

    initialize()
  }, [])

  const filteredStudents = useMemo(() => {
    const search = searchTerm
      .trim()
      .toLowerCase()

    return students.filter((student) => {
      const fullName =
        getStudentFullName(student).toLowerCase()

      const email =
        (student.email || '').toLowerCase()

      const studentId =
        (student.student_id || '').toLowerCase()

      const studentCourse =
        (student.course || '').toLowerCase()

      const matchesSearch =
        !search ||
        fullName.includes(search) ||
        email.includes(search) ||
        studentId.includes(search) ||
        studentCourse.includes(search)

      let matchesFilter = true

      if (statusFilter === 'active') {
        matchesFilter = !student.suspended
      }

      if (statusFilter === 'suspended') {
        matchesFilter = student.suspended
      }

      if (statusFilter === 'current') {
        matchesFilter =
          !student.suspended &&
          student.student_status === 'student'
      }

      if (statusFilter === 'graduated') {
        matchesFilter =
          !student.suspended &&
          student.student_status === 'graduated'
      }

      return matchesSearch && matchesFilter
    })
  }, [students, searchTerm, statusFilter])

  const handleEditStudent = (student) => {
    setEditingStudent(student)

    setStudentNumber(student.student_id || '')
    setFirstName(student.first_name || '')
    setLastName(student.last_name || '')
    setCourse(student.course || '')
    setPhone(student.phone || '')
    setStudentStatus(
      student.student_status || 'student'
    )

    setError('')
    setSuccess('')
  }

  const handleCloseModal = () => {
    if (saving) return

    setEditingStudent(null)

    setStudentNumber('')
    setFirstName('')
    setLastName('')
    setCourse('')
    setPhone('')
    setStudentStatus('student')
  }

  const handleSaveStudent = async (e) => {
    e.preventDefault()

    if (!editingStudent) {
      return
    }

    setSaving(true)
    setError('')
    setSuccess('')

    try {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession()

      if (sessionError) {
        throw sessionError
      }

      if (!session?.access_token) {
        throw new Error(
          'Your session has expired. Please log in again.'
        )
      }

      const response = await fetch(
        `${supabaseUrl}/functions/v1/update-student`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.access_token}`,
            apikey: supabasePublishableKey,
          },
          body: JSON.stringify({
            studentId: editingStudent.id,
            studentNumber:
              studentNumber.trim(),
            firstName:
              firstName.trim(),
            lastName:
              lastName.trim(),
            course:
              course.trim(),
            phone:
              phone.trim(),
            studentStatus,
          }),
        }
      )

      const result = await response.json()

      if (!response.ok) {
        throw new Error(
          result?.error ||
            'Unable to update student account.'
        )
      }

      setSuccess(
        'Student account updated successfully.'
      )

      setEditingStudent(null)

      setStudentNumber('')
      setFirstName('')
      setLastName('')
      setCourse('')
      setPhone('')
      setStudentStatus('student')

      await loadStudents()
    } catch (err) {
      console.error('Update student error:', err)
      setError(
        err.message ||
          'Unable to update student account.'
      )
    } finally {
      setSaving(false)
    }
  }

  const handleSuspendStudent = async (student) => {
    if (currentUserRole !== 'super_admin') {
      setError(
        'Only Super Admin can suspend student accounts.'
      )
      return
    }

    const confirmed = window.confirm(
      `Are you sure you want to suspend ${getStudentFullName(
        student
      )}?`
    )

    if (!confirmed) {
      return
    }

    setActionLoading(student.id)
    setError('')
    setSuccess('')

    try {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession()

      if (sessionError) {
        throw sessionError
      }

      if (!session?.access_token) {
        throw new Error(
          'Your session has expired. Please log in again.'
        )
      }

      const response = await fetch(
        `${supabaseUrl}/functions/v1/suspend-student`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.access_token}`,
            apikey: supabasePublishableKey,
          },
          body: JSON.stringify({
            studentId: student.id,
          }),
        }
      )

      const result = await response.json()

      if (!response.ok) {
        throw new Error(
          result?.error ||
            'Unable to suspend student account.'
        )
      }

      setSuccess(
        `${getStudentFullName(
          student
        )} has been suspended.`
      )

      await loadStudents()
    } catch (err) {
      console.error('Suspend student error:', err)
      setError(
        err.message ||
          'Unable to suspend student account.'
      )
    } finally {
      setActionLoading(null)
    }
  }

  const handleActivateStudent = async (student) => {
    if (currentUserRole !== 'super_admin') {
      setError(
        'Only Super Admin can activate student accounts.'
      )
      return
    }

    const confirmed = window.confirm(
      `Are you sure you want to activate ${getStudentFullName(
        student
      )}?`
    )

    if (!confirmed) {
      return
    }

    setActionLoading(student.id)
    setError('')
    setSuccess('')

    try {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession()

      if (sessionError) {
        throw sessionError
      }

      if (!session?.access_token) {
        throw new Error(
          'Your session has expired. Please log in again.'
        )
      }

      const response = await fetch(
        `${supabaseUrl}/functions/v1/activate-student`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.access_token}`,
            apikey: supabasePublishableKey,
          },
          body: JSON.stringify({
            studentId: student.id,
          }),
        }
      )

      const result = await response.json()

      if (!response.ok) {
        throw new Error(
          result?.error ||
            'Unable to activate student account.'
        )
      }

      setSuccess(
        `${getStudentFullName(
          student
        )} has been activated.`
      )

      await loadStudents()
    } catch (err) {
      console.error('Activate student error:', err)
      setError(
        err.message ||
          'Unable to activate student account.'
      )
    } finally {
      setActionLoading(null)
    }
  }

  const handleDeleteStudent = async (student) => {
    if (currentUserRole !== 'super_admin') {
      setError(
        'Only Super Admin can delete student accounts.'
      )
      return
    }

    const confirmed = window.confirm(
      `Are you sure you want to permanently delete ${getStudentFullName(
        student
      )}'s account?\n\nThis action cannot be undone.`
    )

    if (!confirmed) {
      return
    }

    setActionLoading(student.id)
    setError('')
    setSuccess('')

    try {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession()

      if (sessionError) {
        throw sessionError
      }

      if (!session?.access_token) {
        throw new Error(
          'Your session has expired. Please log in again.'
        )
      }

      const response = await fetch(
        `${supabaseUrl}/functions/v1/delete-student`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.access_token}`,
            apikey: supabasePublishableKey,
          },
          body: JSON.stringify({
            studentId: student.id,
          }),
        }
      )

      const result = await response.json()

      if (!response.ok) {
        throw new Error(
          result?.error ||
            'Unable to delete student account.'
        )
      }

      setSuccess(
        `${getStudentFullName(
          student
        )} has been permanently deleted.`
      )

      await loadStudents()
    } catch (err) {
      console.error('Delete student error:', err)
      setError(
        err.message ||
          'Unable to delete student account.'
      )
    } finally {
      setActionLoading(null)
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

  const initials = currentUserName
    .split(' ')
    .map((s) => s[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()

  const roleText =
    currentUserRole === 'super_admin'
      ? 'Super Admin'
      : currentUserRole === 'admin'
      ? 'Admin'
      : currentUserRole

  const getAvatarTone = (idx) => {
    const tones = ['dq-avatar-a', 'dq-avatar-b', 'dq-avatar-c', 'dq-avatar-d', 'dq-avatar-e']
    return tones[idx % tones.length]
  }

  const getInitials = (student) => {
    return [student.first_name, student.last_name]
      .filter(Boolean)
      .map((s) => s[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  if (loading) {
    return (
      <div className="dq-manage-students">
        <style>{css}</style>
        <div className="dq-bg" />
        <div className="dq-orb dq-orb-1" />
        <div className="dq-orb dq-orb-2" />
        <div className="dq-loading-wrap" style={{ position: 'relative', zIndex: 1, minHeight: '100vh' }}>
          <div className="dq-loader" />
          <p>Loading student accounts...</p>
        </div>
      </div>
    )
  }

  const colSpan = currentUserRole === 'super_admin' ? 7 : 6

  return (
    <div className="dq-manage-students">
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

          <div className="dq-nav-user" aria-label={`Signed in as ${roleText}`}>
            <div className="dq-nav-avatar">{initials || 'A'}</div>
            <div>
              <div className="dq-nav-user-name">{currentUserName}</div>
              <div className="dq-nav-user-role">{roleText}</div>
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
                  Student Records
                </span>
                <h1>Manage Students</h1>
                <p>
                  Search, review, and update student accounts enrolled in DocQuest.
                  Super Admins can edit status, suspend, or remove records.
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div className="dq-welcome-icon" aria-hidden="true">
                  <StudentsIcon />
                </div>
                <button
                  type="button"
                  className="dq-btn dq-btn-outline-w"
                  onClick={loadStudents}
                >
                  <RefreshIcon />
                  <span>Refresh List</span>
                </button>
              </div>
            </div>
          </div>

          <div className="dq-alert-stack">
            {error && (
              <div className="dq-alert dq-alert-error" role="alert">
                <div className="dq-alert-main">
                  <span className="dq-alert-icon"><AlertCircleIcon /></span>
                  <span><strong>Error:</strong>{error}</span>
                </div>
                <button
                  type="button"
                  className="dq-alert-close"
                  onClick={() => setError('')}
                  aria-label="Dismiss error"
                >
                  <CloseIcon />
                </button>
              </div>
            )}

            {success && (
              <div className="dq-alert dq-alert-success" role="status">
                <div className="dq-alert-main">
                  <span className="dq-alert-icon"><CheckCircleIcon /></span>
                  <span>{success}</span>
                </div>
                <button
                  type="button"
                  className="dq-alert-close"
                  onClick={() => setSuccess('')}
                  aria-label="Dismiss message"
                >
                  <CloseIcon />
                </button>
              </div>
            )}
          </div>

          <div className="dq-filters">
            <div className="dq-filter-grid">
              <div className="dq-field">
                <label htmlFor="studentSearch" className="dq-label">Search Students</label>
                <div className="dq-search-wrap">
                  <SearchIcon />
                  <input
                    id="studentSearch"
                    type="text"
                    className="dq-search-input"
                    placeholder="Search by name, email, student ID, or course..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="dq-field">
                <label htmlFor="statusFilter" className="dq-label">Status Filter</label>
                <select
                  id="statusFilter"
                  className="dq-select"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Students</option>
                  <option value="active">Active</option>
                  <option value="suspended">Suspended</option>
                  <option value="current">Current Students</option>
                  <option value="graduated">Graduated</option>
                </select>
              </div>
            </div>
          </div>

          <div className="dq-panel">
            <div className="dq-toolbar">
              <h3>Student Accounts</h3>
              <span className="dq-count-pill">
                <b>{filteredStudents.length}</b>
                <span>Matched</span>
                <span style={{ color: 'var(--muted)', fontWeight: 500 }}>
                  of {students.length} total
                </span>
              </span>
            </div>

            {filteredStudents.length === 0 ? (
              <div className="dq-empty">
                <div className="dq-empty-icon"><EmptyIcon /></div>
                <h4>No student accounts found</h4>
                <p>
                  {searchTerm || statusFilter !== 'all'
                    ? 'Try clearing the search or choosing a different status filter.'
                    : 'Student profiles will appear here once they sign up and are assigned a student role.'}
                </p>
              </div>
            ) : (
              <div className="dq-table-wrap">
                <table className="dq-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Student ID</th>
                      <th>Email</th>
                      <th>Course</th>
                      <th>Status</th>
                      <th>Account</th>
                      {currentUserRole === 'super_admin' && <th>Actions</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStudents.map((student, idx) => (
                      <tr key={student.id}>
                        <td>
                          <div className="dq-cell-name">
                            <div className={`dq-cell-avatar ${getAvatarTone(idx)}`}>
                              {getInitials(student) || 'S'}
                            </div>
                            <div className="dq-cell-meta">
                              <b>{getStudentFullName(student)}</b>
                              <small>Enrolled {new Date(student.created_at).toLocaleDateString('en-PH', { month: 'short', year: 'numeric' })}</small>
                            </div>
                          </div>
                        </td>
                        <td>
                          {student.student_id ? (
                            <span className="dq-cell-std" style={{ fontWeight: 600, color: 'var(--primary)', fontFamily: 'ui-monospace, monospace, monospace' }}>
                              {student.student_id}
                            </span>
                          ) : (
                            <span className="dq-cell-muted">Not provided</span>
                          )}
                        </td>
                        <td><span className="dq-cell-std">{student.email}</span></td>
                        <td>
                          {student.course ? (
                            <span className="dq-cell-std">{student.course}</span>
                          ) : (
                            <span className="dq-cell-muted">Not provided</span>
                          )}
                        </td>
                        <td>
                          {student.student_status === 'graduated' ? (
                            <span className="dq-badge dq-badge-info">
                              <span className="dq-badge-dot" />
                              Graduated
                            </span>
                          ) : (
                            <span className="dq-badge dq-badge-success">
                              <span className="dq-badge-dot" />
                              Student
                            </span>
                          )}
                        </td>
                        <td>
                          {student.suspended ? (
                            <span className="dq-badge dq-badge-error">
                              <span className="dq-badge-dot" />
                              Suspended
                            </span>
                          ) : (
                            <span className="dq-badge dq-badge-success">
                              <span className="dq-badge-dot" />
                              Active
                            </span>
                          )}
                        </td>
                        {currentUserRole === 'super_admin' && (
                          <td>
                            <div className="dq-cell-actions">
                              <button
                                type="button"
                                className="dq-btn-sm dq-btn-edit"
                                onClick={() => handleEditStudent(student)}
                                disabled={actionLoading === student.id}
                              >
                                <EditIcon />
                                <span>Edit</span>
                              </button>

                              {student.suspended ? (
                                <button
                                  type="button"
                                  className="dq-btn-sm dq-btn-activate"
                                  onClick={() => handleActivateStudent(student)}
                                  disabled={actionLoading === student.id}
                                >
                                  {actionLoading === student.id ? (
                                    <>
                                      <span className="dq-spinner-sm" />
                                      <span>Working…</span>
                                    </>
                                  ) : (
                                    <>
                                      <PlayIcon />
                                      <span>Activate</span>
                                    </>
                                  )}
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  className="dq-btn-sm dq-btn-suspend"
                                  onClick={() => handleSuspendStudent(student)}
                                  disabled={actionLoading === student.id}
                                >
                                  {actionLoading === student.id ? (
                                    <>
                                      <span className="dq-spinner-sm" />
                                      <span>Working…</span>
                                    </>
                                  ) : (
                                    <>
                                      <PauseIcon />
                                      <span>Suspend</span>
                                    </>
                                  )}
                                </button>
                              )}

                              <button
                                type="button"
                                className="dq-btn-sm dq-btn-delete"
                                onClick={() => handleDeleteStudent(student)}
                                disabled={actionLoading === student.id}
                              >
                                {actionLoading === student.id ? (
                                  <>
                                    <span className="dq-spinner-sm" />
                                    <span>Deleting…</span>
                                  </>
                                ) : (
                                  <>
                                    <TrashIcon />
                                    <span>Delete</span>
                                  </>
                                )}
                              </button>
                            </div>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {editingStudent && (
        <div className="dq-modal-backdrop" onClick={saving ? undefined : handleCloseModal}>
          <div className="dq-modal" onClick={(e) => e.stopPropagation()}>
            <div className="dq-modal-head">
              <div>
                <h3>Edit Student</h3>
                <small>
                  Student Name: <b>{getStudentFullName(editingStudent)}</b>
                </small>
              </div>
              <button
                type="button"
                className="dq-modal-close"
                onClick={handleCloseModal}
                disabled={saving}
                aria-label="Close dialog"
              >
                <CloseIcon />
              </button>
            </div>

            <form onSubmit={handleSaveStudent} noValidate>
              <div className="dq-modal-body">
                <div className="dq-form-grid">
                  <div className="dq-form-field">
                    <label htmlFor="ms-firstName" className="dq-form-label">First Name</label>
                    <input
                      id="ms-firstName"
                      type="text"
                      className="dq-input"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      disabled={saving}
                      required
                    />
                  </div>

                  <div className="dq-form-field">
                    <label htmlFor="ms-lastName" className="dq-form-label">Last Name</label>
                    <input
                      id="ms-lastName"
                      type="text"
                      className="dq-input"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      disabled={saving}
                      required
                    />
                  </div>

                  <div className="dq-form-field">
                    <label htmlFor="ms-studentId" className="dq-form-label">Student ID</label>
                    <input
                      id="ms-studentId"
                      type="text"
                      className="dq-input"
                      value={studentNumber}
                      onChange={(e) => setStudentNumber(e.target.value)}
                      placeholder="Enter student ID"
                      disabled={saving}
                    />
                  </div>

                  <div className="dq-form-field">
                    <label htmlFor="ms-course" className="dq-form-label">Course</label>
                    <input
                      id="ms-course"
                      type="text"
                      className="dq-input"
                      value={course}
                      onChange={(e) => setCourse(e.target.value)}
                      placeholder="Enter course"
                      disabled={saving}
                    />
                  </div>

                  <div className="dq-form-field">
                    <label htmlFor="ms-phone" className="dq-form-label">Phone Number</label>
                    <input
                      id="ms-phone"
                      type="text"
                      className="dq-input"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Enter phone number"
                      disabled={saving}
                    />
                  </div>

                  <div className="dq-form-field">
                    <label htmlFor="ms-status" className="dq-form-label">Student Status</label>
                    <select
                      id="ms-status"
                      className="dq-select"
                      value={studentStatus}
                      onChange={(e) => setStudentStatus(e.target.value)}
                      disabled={saving}
                    >
                      <option value="student">Student</option>
                      <option value="graduated">Graduated</option>
                    </select>
                  </div>
                </div>

                <div className="dq-form-info">
                  <InfoIcon />
                  <span>
                    The student's middle initial is managed by the student through their
                    own profile and cannot be edited by administrators.
                  </span>
                </div>
              </div>

              <div className="dq-modal-foot">
                <button
                  type="button"
                  className="dq-modal-cancel"
                  onClick={handleCloseModal}
                  disabled={saving}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="dq-modal-submit"
                  disabled={saving}
                >
                  {saving ? (
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

export default ManageStudents
