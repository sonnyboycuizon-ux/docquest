import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Pie } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js'
import { supabase } from '../lib/supabase'

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
)

const logoImage = '/cc.png'
const bgImage = '/conso.jpg'

const css = `
  html, body, #root {
    width: 100% !important;
    max-width: 100% !important;
    margin: 0 !important;
    padding: 0 !important;
  }

  .dq-analysis {
    --primary: #000435;
    --primary-2: #0a1050;
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
  .dq-analysis *, .dq-analysis *::before, .dq-analysis *::after { box-sizing: border-box; }

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
  @keyframes dq-count {
    from { opacity: 0; transform: translateY(10px) scale(.96); }
    to   { opacity: 1; transform: none; }
  }

  .dq-analysis { animation: dq-fade 0.45s ease; }

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
  .dq-btn-primary::after {
    content: '';
    position: absolute;
    top: 0; left: 0;
    width: 40%; height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    animation: dq-sweep 3.2s ease-in-out 1s infinite;
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
    max-width: 1280px;
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

  .dq-state-card {
    background: var(--surface);
    border-radius: var(--radius);
    padding: 46px 32px;
    text-align: center;
    box-shadow: var(--shadow-lg);
    border: 1px solid rgba(226, 232, 240, 0.8);
    animation: dq-rise 0.6s var(--ease);
  }
  .dq-state-loader {
    width: 48px; height: 48px;
    border-radius: 50%;
    border: 3.5px solid rgba(37, 99, 235, 0.18);
    border-top-color: var(--secondary);
    animation: dq-spin 0.8s linear infinite;
    margin: 0 auto 18px;
  }
  .dq-state-icon {
    width: 64px;
    height: 64px;
    border-radius: 20px;
    background: linear-gradient(135deg, rgba(37, 99, 235, 0.1), rgba(244, 180, 0, 0.15));
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text-soft);
    margin: 0 auto 18px;
    border: 1.5px dashed var(--border);
  }
  .dq-state-error {
    width: 64px;
    height: 64px;
    border-radius: 20px;
    background: var(--error-bg);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--error);
    margin: 0 auto 18px;
    border: 1.5px solid rgba(220, 38, 38, 0.3);
  }
  .dq-state-card h3 {
    margin: 0 0 8px 0;
    font-size: 18px;
    font-weight: 750;
    color: var(--primary);
  }
  .dq-state-card p {
    margin: 0 0 20px 0;
    font-size: 14px;
    color: var(--text-soft);
    line-height: 1.6;
    max-width: 50ch;
    margin-left: auto;
    margin-right: auto;
  }
  .dq-state-card p.dq-error-text {
    color: var(--error);
    font-weight: 600;
  }

  .dq-stat-hero {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    margin-bottom: 24px;
  }
  .dq-stat {
    position: relative;
    background: linear-gradient(135deg, var(--primary), var(--primary-2));
    color: #fff;
    border-radius: var(--radius);
    padding: 26px 28px;
    box-shadow: var(--shadow-lg);
    overflow: hidden;
    isolation: isolate;
    animation: dq-rise 0.65s var(--ease);
  }
  .dq-stat::before {
    content: '';
    position: absolute;
    inset: -40%;
    background:
      radial-gradient(circle at 90% 20%, rgba(244, 180, 0, 0.32) 0%, transparent 48%),
      radial-gradient(circle at 0% 90%, rgba(37, 99, 235, 0.28) 0%, transparent 50%);
    z-index: -1;
  }
  .dq-stat::after {
    content: '';
    position: absolute;
    left: 0; right: 0; bottom: 0;
    height: 3px;
    background: linear-gradient(90deg, var(--accent), #fff, var(--secondary));
    background-size: 200% 100%;
    animation: dq-flow 8s linear infinite;
  }
  .dq-stat-eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 5px 11px;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.12);
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: rgba(255, 255, 255, 0.88);
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.6px;
    text-transform: uppercase;
    margin-bottom: 14px;
  }
  .dq-stat-eyebrow span {
    width: 6px; height: 6px;
    border-radius: 50%;
    background: var(--accent);
    box-shadow: 0 0 0 3px rgba(244, 180, 0, 0.25);
  }
  .dq-stat-label {
    font-size: 13px;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.82);
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 8px;
  }
  .dq-stat-value {
    font-size: clamp(36px, 5.5vw, 52px);
    font-weight: 900;
    letter-spacing: -1.5px;
    line-height: 1;
    margin: 0 0 10px 0;
    color: #fff;
    animation: dq-count 0.8s var(--ease);
  }
  .dq-stat-hint {
    font-size: 13px;
    color: rgba(226, 232, 240, 0.88);
    margin: 0;
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }
  .dq-stat-hint b {
    color: var(--accent-2);
    font-weight: 800;
  }
  .dq-stat-secondary {
    background: linear-gradient(135deg, #fff, #FAFBFF);
    color: var(--text);
    border: 1px solid rgba(226, 232, 240, 0.9);
    box-shadow: var(--shadow-md);
  }
  .dq-stat-secondary::before {
    background:
      radial-gradient(circle at 90% 20%, rgba(244, 180, 0, 0.16) 0%, transparent 50%),
      radial-gradient(circle at 0% 90%, rgba(37, 99, 235, 0.12) 0%, transparent 52%);
  }
  .dq-stat-secondary::after {
    background: linear-gradient(90deg, var(--primary), var(--secondary), var(--accent), var(--secondary), var(--primary));
    background-size: 200% 100%;
    animation: dq-flow 8s linear infinite;
  }
  .dq-stat-secondary .dq-stat-eyebrow {
    background: linear-gradient(135deg, var(--accent-soft), rgba(37, 99, 235, 0.08));
    border: 1px solid rgba(244, 180, 0, 0.3);
    color: var(--primary);
  }
  .dq-stat-secondary .dq-stat-eyebrow span {
    background: var(--primary);
    box-shadow: 0 0 0 3px rgba(0, 4, 53, 0.12);
  }
  .dq-stat-secondary .dq-stat-label { color: var(--text-soft); }
  .dq-stat-secondary .dq-stat-value {
    color: var(--primary);
    background: linear-gradient(135deg, var(--primary), var(--secondary));
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  .dq-stat-secondary .dq-stat-hint { color: var(--text-soft); }

  .dq-grid {
    display: grid;
    grid-template-columns: minmax(300px, 1fr) minmax(320px, 1.05fr);
    gap: 24px;
    align-items: stretch;
  }

  .dq-card {
    background: var(--surface);
    border-radius: var(--radius);
    box-shadow: var(--shadow-lg);
    border: 1px solid rgba(226, 232, 240, 0.8);
    padding: 26px 26px 24px;
    display: flex;
    flex-direction: column;
    animation: dq-rise 0.7s var(--ease);
  }
  .dq-card-head {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 14px;
    margin-bottom: 18px;
    padding-bottom: 14px;
    border-bottom: 1px solid var(--border-soft);
  }
  .dq-card-head h3 {
    margin: 0;
    font-size: 17px;
    font-weight: 750;
    color: var(--primary);
    letter-spacing: -0.2px;
    line-height: 1.3;
  }
  .dq-card-head p {
    margin: 4px 0 0 0;
    font-size: 12.5px;
    color: var(--muted);
    line-height: 1.5;
  }
  .dq-chip {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 5px 11px;
    border-radius: 999px;
    background: linear-gradient(135deg, var(--accent-soft), rgba(37, 99, 235, 0.08));
    border: 1.5px solid rgba(244, 180, 0, 0.3);
    color: var(--primary);
    font-size: 12px;
    font-weight: 700;
    white-space: nowrap;
  }
  .dq-chip b {
    color: var(--secondary);
    font-weight: 800;
  }

  .dq-chart-wrap {
    flex: 1;
    position: relative;
    min-height: 400px;
    padding: 8px 4px;
  }

  .dq-table-wrap {
    flex: 1;
    overflow-x: auto;
    border-radius: 14px;
    border: 1px solid var(--border);
    background: linear-gradient(180deg, #FDFEFF, var(--surface));
  }
  .dq-table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
    min-width: 380px;
    font-size: 14px;
  }
  .dq-table thead tr {
    background: linear-gradient(90deg, #F8FAFC, #EFF6FF);
  }
  .dq-table th {
    padding: 13px 16px;
    font-size: 12px;
    font-weight: 700;
    color: var(--text-soft);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    border-bottom: 1.5px solid var(--border);
    white-space: nowrap;
  }
  .dq-table th:first-child { text-align: left; }
  .dq-table th:nth-child(2), .dq-table th:nth-child(3) { text-align: center; }
  .dq-table th:first-child { border-top-left-radius: 14px; }
  .dq-table th:last-child { border-top-right-radius: 14px; }

  .dq-table tbody tr { transition: background 0.15s ease; }
  .dq-table tbody tr:hover { background: #F8FAFC; }
  .dq-table tbody tr + tr td { border-top: 1px solid var(--border-soft); }
  .dq-table td {
    padding: 13px 16px;
    vertical-align: middle;
  }
  .dq-table td:nth-child(2), .dq-table td:nth-child(3) {
    text-align: center;
  }
  .dq-doc-name {
    display: flex;
    align-items: center;
    gap: 10px;
    font-weight: 600;
    color: var(--text);
  }
  .dq-doc-dot {
    width: 12px;
    height: 12px;
    border-radius: 4px;
    flex-shrink: 0;
    border: 1.5px solid rgba(255, 255, 255, 0.9);
    box-shadow: 0 1px 3px rgba(15, 23, 42, 0.18);
  }
  .dq-count-num {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 44px;
    padding: 4px 12px;
    border-radius: 999px;
    background: var(--border-soft);
    border: 1px solid var(--border);
    color: var(--primary);
    font-weight: 800;
    font-size: 13px;
    font-family: 'Inter', ui-monospace, monospace;
  }
  .dq-percent-cell {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
  }
  .dq-percent-val {
    font-weight: 800;
    color: var(--secondary);
    font-family: 'Inter', ui-monospace, monospace;
    font-size: 13.5px;
  }
  .dq-bar {
    width: 90%;
    max-width: 100px;
    height: 6px;
    border-radius: 999px;
    background: var(--border);
    overflow: hidden;
    position: relative;
  }
  .dq-bar-fill {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    background: linear-gradient(90deg, var(--primary), var(--secondary), var(--accent));
    border-radius: 999px;
  }

  .dq-table tfoot tr {
    background: linear-gradient(90deg, rgba(0, 4, 53, 0.04), rgba(37, 99, 235, 0.06));
  }
  .dq-table tfoot td {
    padding: 14px 16px;
    font-size: 14px;
    font-weight: 800;
    color: var(--primary);
    border-top: 1.5px solid var(--border);
  }
  .dq-table tfoot td:nth-child(2) {
    text-align: center;
  }
  .dq-table tfoot td:nth-child(3) {
    text-align: center;
  }
  .dq-table tfoot td:first-child {
    text-transform: uppercase;
    letter-spacing: 0.8px;
    font-size: 12.5px;
  }

  @media (max-width: 980px) {
    .dq-stat-hero { grid-template-columns: 1fr; }
    .dq-grid { grid-template-columns: 1fr; }
    .dq-chart-wrap { min-height: 360px; }
  }
  @media (max-width: 720px) {
    .dq-nav { padding: 12px 16px; }
    .dq-brand-sub { display: none; }
    .dq-nav-user { display: none; }
    .dq-body { padding: 24px 16px 40px; }
    .dq-welcome { padding: 22px 20px; border-radius: 16px; }
    .dq-welcome-icon { width: 48px; height: 48px; }
    .dq-stat { padding: 22px 20px; border-radius: 16px; }
    .dq-card { padding: 22px 18px 20px; border-radius: 16px; }
    .dq-chart-wrap { min-height: 320px; }
    .dq-state-card { padding: 40px 22px; border-radius: 16px; }
  }

  @media (prefers-reduced-motion: reduce) {
    .dq-analysis *, .dq-analysis *::before, .dq-analysis *::after {
      animation: none !important;
      transition: none !important;
    }
  }
`

const PieChartIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
    <path d="M22 12A10 10 0 0 0 12 2v10z" />
  </svg>
)

const RefreshIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M21 12a9 9 0 1 1-3-6.7" />
    <path d="M21 3v6h-6" />
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

const EmptyIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <path d="M14 2v6h6" />
    <path d="M9 13h6M9 17h6" />
  </svg>
)

const AlertIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 8v4M12 16h.01" />
  </svg>
)

const DocumentIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <path d="M14 2v6h6" />
  </svg>
)

function RequestAnalysis() {
  const navigate = useNavigate()

  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [logoFailed, setLogoFailed] = useState(false)
  const [userName, setUserName] = useState('Administrator')
  const [userRole, setUserRole] = useState('')

  useEffect(() => {
    loadRequests()
  }, [])

  async function loadRequests() {
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
        navigate('/login')
        return
      }

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role, first_name, last_name')
        .eq('id', user.id)
        .single()

      if (profileError) {
        throw profileError
      }

      setUserRole(profile.role)
      if (profile.first_name || profile.last_name) {
        setUserName(
          [profile.first_name, profile.last_name].filter(Boolean).join(' ')
        )
      }

      if (!['admin', 'super_admin'].includes(profile.role)) {
        navigate('/dashboard')
        return
      }

      const { data, error: requestsError } = await supabase
        .from('document_requests')
        .select(`
          id,
          status,
          document_type_id,
          document_types (
            id,
            name,
            price
          )
        `)
        .neq('status', 'CANCEL')

      if (requestsError) {
        throw requestsError
      }

      setRequests(data || [])
    } catch (err) {
      console.error('Request analysis error:', err)
      setError(err.message || 'Failed to load request analysis.')
    } finally {
      setLoading(false)
    }
  }

  const analysis = useMemo(() => {
    const counts = {}

    requests.forEach((request) => {
      const documentName =
        request.document_types?.name || 'Unknown Document'

      if (!counts[documentName]) {
        counts[documentName] = 0
      }

      counts[documentName] += 1
    })

    return Object.entries(counts)
      .map(([name, count]) => ({
        name,
        count,
        percentage:
          requests.length > 0
            ? ((count / requests.length) * 100).toFixed(1)
            : '0.0',
      }))
      .sort((a, b) => b.count - a.count)
  }, [requests])

  const chartColors = [
    '#000435',
    '#2563EB',
    '#F4B400',
    '#059669',
    '#DB2777',
    '#7C3AED',
    '#0891B2',
    '#EA580C',
    '#1E40AF',
    '#92400E',
    '#0F766E',
    '#7C2D12',
  ]

  const chartData = {
    labels: analysis.map((item) => item.name),
    datasets: [
      {
        label: 'Document Requests',
        data: analysis.map((item) => item.count),
        backgroundColor: analysis.map((_, i) => chartColors[i % chartColors.length]),
        borderColor: '#FFFFFF',
        borderWidth: 3,
        hoverOffset: 10,
        hoverBorderColor: '#F4B400',
        hoverBorderWidth: 4,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '60%',
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 18,
          usePointStyle: true,
          pointStyle: 'circle',
          boxWidth: 9,
          boxHeight: 9,
          font: {
            family: "'Inter', system-ui, sans-serif",
            size: 12.5,
            weight: '500',
          },
          color: '#475569',
          generateLabels: (chart) => {
            const ds = chart.data.datasets[0]
            return chart.data.labels.map((label, i) => ({
              text: `${label}`,
              fillStyle: ds.backgroundColor[i],
              strokeStyle: ds.borderColor,
              lineWidth: ds.borderWidth,
              pointStyle: 'circle',
              hidden: false,
              index: i,
            }))
          },
        },
      },
      tooltip: {
        backgroundColor: '#000435',
        titleColor: '#F4B400',
        bodyColor: '#F8FAFC',
        titleFont: {
          family: "'Inter', system-ui, sans-serif",
          size: 13,
          weight: '700',
        },
        bodyFont: {
          family: "'Inter', system-ui, sans-serif",
          size: 13,
        },
        padding: 12,
        cornerRadius: 10,
        borderColor: 'rgba(244, 180, 0, 0.35)',
        borderWidth: 1.5,
        boxPadding: 6,
        usePointStyle: true,
        callbacks: {
          label: function (context) {
            const item = analysis[context.dataIndex]

            return ` ${item.count} requests  ·  ${item.percentage}%`
          },
        },
      },
    },
    animation: {
      animateScale: true,
      animateRotate: true,
      duration: 900,
      easing: 'easeOutQuart',
    },
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

  const roleText =
    userRole === 'super_admin'
      ? 'Super Admin'
      : userRole === 'admin'
      ? 'Admin'
      : userRole

  const uniqueTypes = analysis.length

  return (
    <div className="dq-analysis">
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
            onClick={loadRequests}
          >
            <RefreshIcon />
            <span>Refresh</span>
          </button>

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
              <div className="dq-nav-user-name">{userName}</div>
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
                  Insights &amp; Analytics
                </span>
                <h1>Request Analysis</h1>
                <p>
                  Overview of document requests submitted by students, broken down
                  by type. Cancelled requests are excluded from this report.
                </p>
              </div>
              <div className="dq-welcome-icon" aria-hidden="true">
                <PieChartIcon />
              </div>
            </div>
          </div>

          {loading ? (
            <div className="dq-state-card">
              <div className="dq-state-loader" />
              <h3>Loading Analysis</h3>
              <p>Compiling document request statistics, please wait…</p>
            </div>
          ) : error ? (
            <div className="dq-state-card">
              <div className="dq-state-error"><AlertIcon /></div>
              <h3>Unable to Load Analysis</h3>
              <p className="dq-error-text">{error}</p>
              <button
                type="button"
                className="dq-btn dq-btn-primary"
                onClick={loadRequests}
                style={{ height: 44, padding: '0 22px' }}
              >
                <RefreshIcon />
                <span>Try Again</span>
              </button>
            </div>
          ) : (
            <>
              <div className="dq-stat-hero">
                <div className="dq-stat">
                  <div className="dq-stat-eyebrow">
                    <span />
                    Requests Processed
                  </div>
                  <p className="dq-stat-label">Total Document Requests</p>
                  <p className="dq-stat-value">{requests.length}</p>
                  <p className="dq-stat-hint">
                    <b>Live</b> overview · Cancelled requests excluded
                  </p>
                </div>

                <div className="dq-stat dq-stat-secondary">
                  <div className="dq-stat-eyebrow">
                    <span />
                    Document Variety
                  </div>
                  <p className="dq-stat-label">Unique Document Types</p>
                  <p className="dq-stat-value">{uniqueTypes}</p>
                  <p className="dq-stat-hint">
                    {uniqueTypes === 1
                      ? 'Across ' + requests.length + ' total request' + (requests.length === 1 ? '' : 's')
                      : uniqueTypes + ' different forms requested'}
                  </p>
                </div>
              </div>

              {requests.length === 0 ? (
                <div className="dq-state-card">
                  <div className="dq-state-icon"><EmptyIcon /></div>
                  <h3>No Document Requests Yet</h3>
                  <p>
                    Request statistics will appear here once students start
                    submitting document requests through DocQuest. Check back later.
                  </p>
                </div>
              ) : (
                <div className="dq-grid">
                  <div className="dq-card">
                    <div className="dq-card-head">
                      <div>
                        <h3>Document Request Distribution</h3>
                        <p>Share of each document type across all requests</p>
                      </div>
                      <span className="dq-chip">
                        <DocumentIcon />
                        <span><b>{uniqueTypes}</b> types</span>
                      </span>
                    </div>
                    <div className="dq-chart-wrap">
                      <Pie
                        data={chartData}
                        options={chartOptions}
                      />
                    </div>
                  </div>

                  <div className="dq-card">
                    <div className="dq-card-head">
                      <div>
                        <h3>Requests per Document Type</h3>
                        <p>Ranked by total count, highest to lowest</p>
                      </div>
                      <span className="dq-chip">
                        <b>{requests.length}</b> total
                      </span>
                    </div>
                    <div className="dq-table-wrap">
                      <table className="dq-table">
                        <thead>
                          <tr>
                            <th>Document Type</th>
                            <th>Count</th>
                            <th>Percentage</th>
                          </tr>
                        </thead>
                        <tbody>
                          {analysis.map((item, idx) => (
                            <tr key={item.name}>
                              <td>
                                <div className="dq-doc-name">
                                  <span
                                    className="dq-doc-dot"
                                    style={{
                                      background: chartColors[idx % chartColors.length],
                                    }}
                                    aria-hidden="true"
                                  />
                                  {item.name}
                                </div>
                              </td>
                              <td>
                                <span className="dq-count-num">{item.count}</span>
                              </td>
                              <td>
                                <div className="dq-percent-cell">
                                  <span className="dq-percent-val">{item.percentage}%</span>
                                  <div className="dq-bar" aria-hidden="true">
                                    <div
                                      className="dq-bar-fill"
                                      style={{ width: item.percentage + '%' }}
                                    />
                                  </div>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot>
                          <tr>
                            <td>Total</td>
                            <td>{requests.length}</td>
                            <td style={{ color: 'var(--secondary)', fontWeight: 800 }}>100%</td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default RequestAnalysis
