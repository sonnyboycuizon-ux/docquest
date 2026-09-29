import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&display=swap');

  :root {
    --dq-navy: #000435;
    --dq-navy-mid: #0A0E52;
    --dq-navy-light: #1A1F6B;
    --dq-blue: #2563EB;
    --dq-blue-light: #3B82F6;
    --dq-blue-soft: #DBEAFE;
    --dq-gold: #F4B400;
    --dq-gold-light: #FACC15;
    --dq-gold-soft: #FEF3C7;
    --dq-gold-glow: rgba(244, 180, 0, 0.35);
    --dq-ink: #0F172A;
    --dq-bg: #F1F5F9;
    --dq-card: #FFFFFF;
    --dq-slate: #64748B;
    --dq-slate-light: #94A3B8;
    --dq-border: #E2E8F0;
    --dq-border-soft: #F1F5F9;
    --dq-danger: #EF4444;
    --dq-danger-bg: #FEF2F2;
    --dq-success: #10B981;
    --dq-success-bg: #ECFDF5;
  }

  * { box-sizing: border-box; }

  body { margin: 0; font-family: 'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif; }

  /* ========== KEN BURNS BACKDROP WITH ORBS ========== */
  .dq-page {
    position: relative;
    min-height: 100vh;
    background: var(--dq-bg);
    font-family: 'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif;
    color: var(--dq-ink);
    padding-bottom: 80px;
    overflow: hidden;
  }

  .dq-page::before {
    content: '';
    position: fixed;
    inset: 0;
    background:
      radial-gradient(ellipse at 20% 20%, rgba(37, 99, 235, 0.12) 0%, transparent 50%),
      radial-gradient(ellipse at 80% 80%, rgba(244, 180, 0, 0.10) 0%, transparent 50%),
      linear-gradient(180deg, #EEF2FF 0%, #F8FAFC 40%, #FFFBEB 100%);
    z-index: -3;
    animation: dq-kenburns 30s ease-in-out infinite alternate;
    background-size: 120% 120%;
  }

  @keyframes dq-kenburns {
    0% { background-position: 0% 0%, 100% 100%, 0% 0%; }
    50% { background-position: 30% 20%, 70% 80%, 50% 50%; }
    100% { background-position: 10% 40%, 90% 60%, 0% 100%; }
  }

  .dq-orb {
    position: fixed;
    border-radius: 50%;
    filter: blur(80px);
    opacity: 0.55;
    z-index: -2;
    pointer-events: none;
  }

  .dq-orb-1 {
    width: 420px; height: 420px;
    background: radial-gradient(circle, rgba(37, 99, 235, 0.45) 0%, transparent 70%);
    top: -120px; left: -80px;
    animation: dq-float1 18s ease-in-out infinite;
  }

  .dq-orb-2 {
    width: 380px; height: 380px;
    background: radial-gradient(circle, rgba(244, 180, 0, 0.40) 0%, transparent 70%);
    top: 40%; right: -100px;
    animation: dq-float2 22s ease-in-out infinite;
  }

  .dq-orb-3 {
    width: 340px; height: 340px;
    background: radial-gradient(circle, rgba(0, 4, 53, 0.30) 0%, transparent 70%);
    bottom: -100px; left: 30%;
    animation: dq-float3 26s ease-in-out infinite;
  }

  @keyframes dq-float1 {
    0%, 100% { transform: translate(0, 0) scale(1); }
    33% { transform: translate(40px, 30px) scale(1.05); }
    66% { transform: translate(-20px, 50px) scale(0.98); }
  }
  @keyframes dq-float2 {
    0%, 100% { transform: translate(0, 0) scale(1); }
    50% { transform: translate(-50px, -40px) scale(1.08); }
  }
  @keyframes dq-float3 {
    0%, 100% { transform: translate(0, 0) scale(1); }
    50% { transform: translate(30px, -60px) scale(1.06); }
  }

  /* ========== STICKY GLASS NAVBAR ========== */
  .dq-nav-wrap {
    position: sticky;
    top: 0;
    z-index: 100;
    backdrop-filter: blur(18px) saturate(180%);
    -webkit-backdrop-filter: blur(18px) saturate(180%);
    background: rgba(255, 255, 255, 0.72);
    border-bottom: 1px solid rgba(255, 255, 255, 0.6);
    box-shadow: 0 4px 20px rgba(0, 4, 53, 0.06);
  }

  .dq-nav-wrap::after {
    content: '';
    position: absolute;
    left: 0; right: 0; bottom: 0;
    height: 2px;
    background: linear-gradient(90deg,
      transparent 0%,
      var(--dq-blue) 25%,
      var(--dq-gold) 50%,
      var(--dq-navy) 75%,
      transparent 100%
    );
    opacity: 0.9;
  }

  .dq-nav-inner {
    max-width: 1080px;
    margin: 0 auto;
    padding: 14px 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }

  .dq-back-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: rgba(255, 255, 255, 0.85);
    border: 1px solid var(--dq-border);
    border-radius: 10px;
    padding: 9px 16px;
    font-size: 13.5px;
    font-weight: 600;
    color: var(--dq-navy);
    cursor: pointer;
    font-family: inherit;
    transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  }
  .dq-back-btn:hover {
    transform: translateY(-1px);
    border-color: var(--dq-blue);
    color: var(--dq-blue);
    box-shadow: 0 6px 14px rgba(37, 99, 235, 0.12);
    background: #fff;
  }
  .dq-back-btn:active { transform: translateY(0); }

  .dq-nav-logo {
    display: flex;
    align-items: center;
    gap: 10px;
    font-weight: 800;
    font-size: 15px;
    color: var(--dq-navy);
    letter-spacing: -0.02em;
  }
  .dq-nav-logo-mark {
    width: 32px; height: 32px;
    border-radius: 9px;
    background: linear-gradient(135deg, var(--dq-navy) 0%, var(--dq-blue) 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--dq-gold);
    font-size: 15px;
    box-shadow: 0 4px 10px rgba(0, 4, 53, 0.25);
  }

  /* ========== MAIN CONTAINER ========== */
  .dq-container {
    max-width: 1080px;
    margin: 0 auto;
    padding: 28px 20px 0 20px;
    position: relative;
    z-index: 1;
  }

  /* ========== GRADIENT WELCOME BANNER ========== */
  .dq-hero {
    position: relative;
    overflow: hidden;
    border-radius: 22px;
    padding: 36px 38px;
    margin-bottom: 28px;
    background:
      linear-gradient(135deg, var(--dq-navy) 0%, var(--dq-navy-mid) 45%, var(--dq-navy-light) 100%);
    box-shadow:
      0 20px 45px -12px rgba(0, 4, 53, 0.35),
      0 0 0 1px rgba(255, 255, 255, 0.06) inset;
  }

  .dq-hero::before {
    content: '';
    position: absolute;
    top: -80px; right: -60px;
    width: 320px; height: 320px;
    border-radius: 50%;
    background: radial-gradient(circle, var(--dq-gold-glow) 0%, transparent 65%);
    animation: dq-pulse-gold 5s ease-in-out infinite;
  }
  .dq-hero::after {
    content: '';
    position: absolute;
    bottom: -100px; left: -40px;
    width: 260px; height: 260px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(37, 99, 235, 0.35) 0%, transparent 65%);
    animation: dq-pulse-blue 6s ease-in-out infinite;
  }
  @keyframes dq-pulse-gold { 0%,100% { opacity: 0.8; transform: scale(1); } 50% { opacity: 1; transform: scale(1.08); } }
  @keyframes dq-pulse-blue { 0%,100% { opacity: 0.7; transform: scale(1); } 50% { opacity: 0.95; transform: scale(1.06); } }

  .dq-hero-inner { position: relative; z-index: 2; }

  .dq-hero-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: rgba(244, 180, 0, 0.18);
    color: var(--dq-gold-light);
    border: 1px solid rgba(244, 180, 0, 0.3);
    font-size: 11.5px;
    font-weight: 700;
    padding: 5px 13px;
    border-radius: 999px;
    margin-bottom: 14px;
    letter-spacing: 0.03em;
    text-transform: uppercase;
    backdrop-filter: blur(10px);
  }

  .dq-hero-title {
    font-size: 30px;
    font-weight: 800;
    color: #fff;
    margin: 0 0 8px 0;
    line-height: 1.15;
    letter-spacing: -0.02em;
  }
  .dq-hero-title em {
    font-style: normal;
    background: linear-gradient(135deg, var(--dq-gold-light) 0%, #FEF08A 100%);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  .dq-hero-desc {
    font-size: 14px;
    color: #94A3B8;
    margin: 0;
    max-width: 560px;
    line-height: 1.6;
  }

  /* ========== WARNING / INFO BANNERS ========== */
  .dq-warn-banner {
    background: linear-gradient(135deg, var(--dq-gold-soft) 0%, #FEF9C3 100%);
    border: 1px solid rgba(244, 180, 0, 0.45);
    border-radius: 16px;
    padding: 16px 20px;
    margin-bottom: 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
    flex-wrap: wrap;
    box-shadow: 0 4px 14px rgba(244, 180, 0, 0.08);
  }
  .dq-warn-left { display: flex; gap: 14px; align-items: center; }
  .dq-warn-icon {
    width: 36px; height: 36px;
    border-radius: 10px;
    background: linear-gradient(135deg, var(--dq-gold) 0%, var(--dq-gold-light) 100%);
    color: #fff;
    display: flex; align-items: center; justify-content: center;
    font-weight: 800;
    font-size: 16px;
    flex-shrink: 0;
    box-shadow: 0 4px 10px rgba(244, 180, 0, 0.3);
  }
  .dq-warn-title { font-size: 14px; font-weight: 700; color: var(--dq-navy); margin: 0 0 2px 0; }
  .dq-warn-text { font-size: 12.5px; color: var(--dq-navy); margin: 0; opacity: 0.82; line-height: 1.5; }

  .dq-warn-action {
    background: linear-gradient(135deg, var(--dq-blue) 0%, var(--dq-blue-light) 100%);
    color: #fff;
    border: none;
    padding: 9px 16px;
    border-radius: 10px;
    font-size: 12.5px;
    font-weight: 700;
    cursor: pointer;
    font-family: inherit;
    transition: all 0.2s ease;
    box-shadow: 0 4px 10px rgba(37, 99, 235, 0.25);
    white-space: nowrap;
  }
  .dq-warn-action:hover { transform: translateY(-1px); box-shadow: 0 7px 16px rgba(37, 99, 235, 0.35); }
  .dq-warn-action:active { transform: translateY(0); }

  .dq-alert-error {
    background: linear-gradient(135deg, var(--dq-danger-bg) 0%, #FEE2E2 100%);
    border: 1px solid rgba(239, 68, 68, 0.3);
    color: #991B1B;
    padding: 14px 18px;
    border-radius: 14px;
    font-size: 13.5px;
    margin-bottom: 24px;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 10px;
    box-shadow: 0 4px 12px rgba(239, 68, 68, 0.08);
  }
  .dq-alert-error::before {
    content: '⚠';
    color: var(--dq-danger);
    font-weight: 800;
    font-size: 16px;
    flex-shrink: 0;
  }

  .dq-alert-success {
    background: linear-gradient(135deg, var(--dq-success-bg) 0%, #D1FAE5 100%);
    border: 1px solid rgba(16, 185, 129, 0.3);
    color: #065F46;
    padding: 14px 18px;
    border-radius: 14px;
    font-size: 13.5px;
    margin-bottom: 24px;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  /* ========== SECTION HEADINGS ========== */
  .dq-section-head {
    display: flex;
    align-items: center;
    gap: 14px;
    margin-bottom: 22px;
  }
  .dq-step-badge {
    width: 34px; height: 34px;
    border-radius: 11px;
    background: linear-gradient(135deg, var(--dq-navy) 0%, var(--dq-blue) 100%);
    color: #fff;
    font-size: 14px;
    font-weight: 800;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
    box-shadow: 0 4px 10px rgba(0, 4, 53, 0.22);
  }
  .dq-section-title { font-size: 18.5px; font-weight: 800; color: var(--dq-navy); margin: 0 0 3px 0; letter-spacing: -0.01em; }
  .dq-section-sub { font-size: 12.5px; color: var(--dq-slate); margin: 0; }

  /* ========== DOCUMENT SELECTION CARDS ========== */
  .dq-doc-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 18px;
    margin-bottom: 32px;
  }
  .dq-doc-card {
    position: relative;
    background: #fff;
    border: 1.5px solid var(--dq-border);
    border-radius: 18px;
    padding: 24px;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    transition: all 0.32s cubic-bezier(0.16, 1, 0.3, 1);
    overflow: hidden;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.03);
  }
  .dq-doc-card::before {
    content: '';
    position: absolute;
    top: 0; left: -100%;
    width: 100%; height: 100%;
    background: linear-gradient(
      120deg,
      transparent 0%,
      rgba(244, 180, 0, 0.08) 45%,
      rgba(244, 180, 0, 0.18) 50%,
      rgba(244, 180, 0, 0.08) 55%,
      transparent 100%
    );
    transition: left 0s;
    pointer-events: none;
  }
  .dq-doc-card:hover::before { left: 100%; transition: left 0.7s ease; }

  .dq-doc-card:hover {
    transform: translateY(-6px) scale(1.01);
    border-color: var(--dq-blue);
    box-shadow:
      0 18px 36px -10px rgba(37, 99, 235, 0.22),
      0 0 0 1px rgba(37, 99, 235, 0.12);
  }

  .dq-doc-card.selected {
    border-color: var(--dq-gold);
    box-shadow:
      0 16px 32px -8px var(--dq-gold-glow),
      0 0 0 2px rgba(244, 180, 0, 0.25);
    transform: translateY(-3px);
  }
  .dq-doc-card.selected::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 18px;
    pointer-events: none;
    background: linear-gradient(135deg, rgba(244, 180, 0, 0.05) 0%, transparent 60%);
  }
  .dq-doc-card.selected::before {
    left: 100%;
    animation: dq-gold-sweep 2.5s ease-in-out infinite;
  }
  @keyframes dq-gold-sweep {
    0% { left: -100%; }
    60%, 100% { left: 100%; }
  }

  .dq-doc-head {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 16px;
  }
  .dq-doc-icon {
    width: 46px; height: 46px;
    border-radius: 12px;
    background: linear-gradient(135deg, var(--dq-blue-soft) 0%, #EFF6FF 100%);
    border: 1px solid rgba(37, 99, 235, 0.15);
    display: flex; align-items: center; justify-content: center;
    font-size: 22px;
  }
  .dq-doc-price {
    font-weight: 800;
    font-size: 14px;
    color: var(--dq-blue);
    background: linear-gradient(135deg, var(--dq-blue-soft) 0%, #EFF6FF 100%);
    padding: 5px 11px;
    border-radius: 999px;
    border: 1px solid rgba(37, 99, 235, 0.12);
    white-space: nowrap;
  }
  .dq-doc-name {
    font-size: 16.5px;
    font-weight: 700;
    color: var(--dq-navy);
    margin: 0 0 6px 0;
    line-height: 1.3;
  }
  .dq-doc-desc {
    font-size: 13px;
    color: var(--dq-slate);
    line-height: 1.55;
    margin: 0 0 18px 0;
    flex-grow: 1;
  }
  .dq-doc-foot {
    border-top: 1px dashed var(--dq-border);
    padding-top: 14px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .dq-doc-select-txt {
    font-size: 12.5px;
    font-weight: 700;
    color: var(--dq-blue);
    display: inline-flex;
    align-items: center;
    gap: 4px;
  }
  .dq-doc-card:hover .dq-doc-select-txt { color: var(--dq-navy); }
  .dq-doc-card:hover .dq-doc-select-txt::after { content: '→'; margin-left: 2px; }

  /* ========== REQUEST LAYOUT ========== */
  .dq-req-layout {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
    gap: 24px;
    align-items: start;
  }

  /* ========== FORM CARD ========== */
  .dq-form-card {
    background: #fff;
    border-radius: 20px;
    border: 1px solid var(--dq-border);
    padding: 30px 28px;
    box-shadow:
      0 6px 18px rgba(0, 0, 0, 0.04),
      0 0 0 1px rgba(255, 255, 255, 0.6) inset;
    position: relative;
    overflow: hidden;
  }
  .dq-form-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 3px;
    background: linear-gradient(90deg, var(--dq-blue), var(--dq-gold), var(--dq-navy));
  }

  /* ========== FLOATING LABEL INPUTS ========== */
  .dq-field {
    margin-bottom: 22px;
    position: relative;
  }
  .dq-field-label {
    display: block;
    font-size: 13px;
    font-weight: 700;
    color: var(--dq-navy);
    margin-bottom: 7px;
  }
  .dq-field-label .dq-req { color: var(--dq-danger); margin-left: 2px; }

  .dq-float-wrap { position: relative; }
  .dq-float-input,
  .dq-float-textarea {
    width: 100%;
    padding: 16px 14px 10px 14px;
    border-radius: 12px;
    border: 1.5px solid var(--dq-border);
    font-size: 14.5px;
    font-family: inherit;
    background: #FCFDFF;
    transition: all 0.2s ease;
    color: var(--dq-ink);
  }
  .dq-float-textarea {
    min-height: 108px;
    resize: vertical;
    padding-top: 20px;
    line-height: 1.5;
  }
  .dq-float-input.small { padding: 14px 14px 8px 14px; }
  .dq-float-wrap textarea.dq-float-input { resize: vertical; min-height: 100px; line-height: 1.5; }

  .dq-float-label {
    position: absolute;
    left: 14px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 14px;
    color: var(--dq-slate-light);
    pointer-events: none;
    transition: all 0.18s cubic-bezier(0.16, 1, 0.3, 1);
    background: transparent;
    padding: 0 4px;
  }
  .dq-float-wrap.textarea-wrap .dq-float-label {
    top: 18px;
    transform: none;
  }
  .dq-float-input:focus,
  .dq-float-textarea:focus {
    outline: none;
    border-color: var(--dq-blue);
    box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.10), 0 2px 8px rgba(37, 99, 235, 0.06);
    background: #fff;
  }
  .dq-float-input:focus + .dq-float-label,
  .dq-float-textarea:focus + .dq-float-label,
  .dq-float-input:not(:placeholder-shown) + .dq-float-label,
  .dq-float-textarea:not(:placeholder-shown) + .dq-float-label {
    top: 0;
    transform: translateY(-50%) scale(0.85);
    left: 10px;
    color: var(--dq-blue);
    font-weight: 600;
    background: #fff;
    border-radius: 4px;
  }
  .dq-float-wrap.textarea-wrap .dq-float-input:focus + .dq-float-label,
  .dq-float-wrap.textarea-wrap .dq-float-input:not(:placeholder-shown) + .dq-float-label,
  .dq-float-wrap.textarea-wrap .dq-float-textarea:focus + .dq-float-label,
  .dq-float-wrap.textarea-wrap .dq-float-textarea:not(:placeholder-shown) + .dq-float-label {
    top: 0;
  }

  .dq-hint {
    font-size: 11.5px;
    color: var(--dq-slate);
    margin-top: 6px;
    display: block;
    padding-left: 4px;
  }

  /* ========== GOLD GRADIENT CTA WITH SHIMMER ========== */
  .dq-cta {
    position: relative;
    width: 100%;
    border: none;
    border-radius: 14px;
    padding: 15px 20px;
    font-size: 14.5px;
    font-weight: 800;
    color: var(--dq-navy);
    cursor: pointer;
    font-family: inherit;
    background: linear-gradient(135deg,
      var(--dq-gold) 0%,
      var(--dq-gold-light) 40%,
      #FEF08A 70%,
      var(--dq-gold) 100%
    );
    background-size: 200% 200%;
    box-shadow:
      0 8px 24px rgba(244, 180, 0, 0.35),
      0 0 0 1px rgba(255, 255, 255, 0.5) inset,
      0 2px 0 rgba(244, 180, 0, 0.5);
    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    overflow: hidden;
    letter-spacing: -0.01em;
    animation: dq-cta-shimmer-bg 4s ease-in-out infinite;
  }
  .dq-cta::before {
    content: '';
    position: absolute;
    top: 0; left: -120%;
    width: 60%; height: 100%;
    background: linear-gradient(
      100deg,
      transparent 0%,
      rgba(255, 255, 255, 0.55) 45%,
      rgba(255, 255, 255, 0.85) 50%,
      rgba(255, 255, 255, 0.55) 55%,
      transparent 100%
    );
    animation: dq-shimmer 3s ease-in-out infinite;
    pointer-events: none;
  }
  @keyframes dq-cta-shimmer-bg {
    0%, 100% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
  }
  @keyframes dq-shimmer {
    0% { left: -120%; }
    55%, 100% { left: 130%; }
  }
  .dq-cta:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow:
      0 14px 32px rgba(244, 180, 0, 0.45),
      0 0 0 1px rgba(255, 255, 255, 0.6) inset,
      0 3px 0 rgba(244, 180, 0, 0.6);
  }
  .dq-cta:active:not(:disabled) { transform: translateY(0); }
  .dq-cta:disabled {
    opacity: 0.55;
    cursor: not-allowed;
    filter: grayscale(20%);
    animation: none;
  }
  .dq-cta:disabled::before { animation: none; }

  /* ========== SUMMARY SIDEBAR ========== */
  .dq-summary-wrap {
    position: sticky;
    top: 84px;
  }
  .dq-summary-card {
    background: #fff;
    border-radius: 20px;
    border: 1px solid var(--dq-border);
    padding: 26px 24px;
    box-shadow:
      0 8px 24px rgba(0, 0, 0, 0.05),
      0 0 0 1px rgba(255, 255, 255, 0.6) inset;
    position: relative;
    overflow: hidden;
  }
  .dq-summary-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 3px;
    background: linear-gradient(90deg, var(--dq-gold), var(--dq-blue));
  }

  .dq-summary-title {
    font-size: 11.5px;
    font-weight: 800;
    color: var(--dq-slate);
    margin: 0 0 16px 0;
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  .dq-selected-doc {
    display: flex;
    align-items: center;
    gap: 13px;
    background: linear-gradient(135deg, #EFF6FF 0%, #FEF3C7 100%);
    border: 1px solid rgba(37, 99, 235, 0.12);
    padding: 14px;
    border-radius: 14px;
    margin-bottom: 12px;
  }
  .dq-selected-icon {
    width: 42px; height: 42px;
    border-radius: 11px;
    background: linear-gradient(135deg, var(--dq-blue) 0%, var(--dq-blue-light) 100%);
    color: #fff;
    display: flex; align-items: center; justify-content: center;
    font-size: 19px;
    flex-shrink: 0;
    box-shadow: 0 4px 10px rgba(37, 99, 235, 0.3);
  }
  .dq-selected-name { font-weight: 700; color: var(--dq-navy); font-size: 14.5px; margin: 0 0 2px 0; }
  .dq-selected-price { font-size: 12px; color: var(--dq-slate); margin: 0; }

  .dq-change-btn {
    width: 100%;
    background: transparent;
    border: 1px dashed var(--dq-border);
    color: var(--dq-slate);
    border-radius: 10px;
    padding: 8px;
    font-size: 11.5px;
    font-weight: 600;
    cursor: pointer;
    font-family: inherit;
    margin-bottom: 20px;
    transition: all 0.2s ease;
  }
  .dq-change-btn:hover {
    color: var(--dq-blue);
    border-color: var(--dq-blue);
    background: var(--dq-blue-soft);
  }

  .dq-divider {
    border: none;
    border-top: 1px dashed var(--dq-border);
    margin: 16px 0;
  }

  .dq-break-row {
    display: flex;
    justify-content: space-between;
    font-size: 13.5px;
    color: var(--dq-slate);
    margin-bottom: 9px;
  }
  .dq-total-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 14px;
    padding-top: 14px;
    border-top: 1.5px solid var(--dq-border-soft);
  }
  .dq-total-label { font-weight: 700; color: var(--dq-navy); font-size: 14px; }
  .dq-total-amount {
    font-size: 24px;
    font-weight: 800;
    background: linear-gradient(135deg, var(--dq-blue) 0%, var(--dq-navy) 100%);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    letter-spacing: -0.02em;
  }

  /* ========== 3 INFO SUMMARY CARDS ========== */
  .dq-info-cards {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
    margin-top: 20px;
  }
  .dq-info-card {
    border-radius: 12px;
    padding: 12px 10px;
    text-align: center;
    transition: all 0.25s ease;
  }
  .dq-info-card:hover { transform: translateY(-2px); }
  .dq-info-card.fee {
    background: linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%);
    border: 1px solid rgba(16, 185, 129, 0.2);
  }
  .dq-info-card.time {
    background: linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%);
    border: 1px solid rgba(37, 99, 235, 0.2);
  }
  .dq-info-card.delivery {
    background: linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%);
    border: 1px solid rgba(244, 180, 0, 0.2);
  }
  .dq-info-icon { font-size: 18px; margin-bottom: 4px; }
  .dq-info-label {
    font-size: 9.5px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--dq-slate);
    margin: 0 0 2px 0;
  }
  .dq-info-value {
    font-size: 12px;
    font-weight: 800;
    color: var(--dq-navy);
    margin: 0;
    line-height: 1.2;
  }
  .dq-info-card.fee .dq-info-value { color: #059669; }
  .dq-info-card.time .dq-info-value { color: var(--dq-blue); }
  .dq-info-card.delivery .dq-info-value { color: #B45309; }

  .dq-pay-box {
    background: linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 100%);
    border-radius: 12px;
    padding: 14px;
    margin-top: 18px;
    border: 1px solid var(--dq-border);
  }
  .dq-pay-title {
    font-size: 11.5px;
    font-weight: 800;
    color: var(--dq-navy);
    margin: 0 0 5px 0;
    display: flex;
    align-items: center;
    gap: 5px;
  }
  .dq-pay-text {
    font-size: 11.5px;
    color: var(--dq-slate);
    margin: 0;
    line-height: 1.5;
  }

  /* ========== CENTER PAGES (LOADING / ERROR) ========== */
  .dq-center-wrap {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    font-family: 'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif;
    position: relative;
    overflow: hidden;
  }
  .dq-center-wrap::before {
    content: '';
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse at 30% 20%, rgba(37, 99, 235, 0.10) 0%, transparent 50%),
      radial-gradient(ellipse at 70% 80%, rgba(244, 180, 0, 0.08) 0%, transparent 50%),
      linear-gradient(180deg, #EEF2FF 0%, #F8FAFC 100%);
    z-index: -1;
  }
  @keyframes dq-spin { to { transform: rotate(360deg); } }

  .dq-loader {
    width: 52px; height: 52px;
    border-radius: 50%;
    border: 4px solid var(--dq-blue-soft);
    border-top: 4px solid var(--dq-blue);
    border-right: 4px solid var(--dq-gold);
    animation: dq-spin 0.85s cubic-bezier(0.4, 0, 0.2, 1) infinite;
    margin: 0 auto 18px auto;
  }
  .dq-load-title { font-size: 16px; font-weight: 700; color: var(--dq-navy); margin: 0 0 4px 0; }
  .dq-load-sub { font-size: 13px; color: var(--dq-slate); margin: 0; }

  .dq-load-card { text-align: center; padding: 30px; }

  .dq-err-card {
    background: #fff;
    border-radius: 20px;
    border: 1px solid var(--dq-border);
    padding: 34px 30px;
    max-width: 420px;
    width: 100%;
    text-align: center;
    box-shadow: 0 16px 40px rgba(0, 0, 0, 0.08);
  }
  .dq-err-badge {
    width: 58px; height: 58px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--dq-danger-bg) 0%, #FEE2E2 100%);
    color: var(--dq-danger);
    font-size: 28px;
    font-weight: 800;
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 18px auto;
    border: 2px solid rgba(239, 68, 68, 0.2);
    box-shadow: 0 6px 16px rgba(239, 68, 68, 0.15);
  }
  .dq-err-title { font-size: 18.5px; font-weight: 800; color: var(--dq-navy); margin: 0 0 8px 0; letter-spacing: -0.01em; }
  .dq-err-text { font-size: 13.5px; color: var(--dq-slate); margin: 0 0 22px 0; line-height: 1.55; }
  .dq-err-actions { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }

  /* ========== BUTTONS (PRIMARY / SECONDARY) ========== */
  .dq-btn-pri {
    background: linear-gradient(135deg, var(--dq-blue) 0%, var(--dq-blue-light) 100%);
    color: #fff;
    border: none;
    border-radius: 11px;
    padding: 11px 20px;
    font-size: 13.5px;
    font-weight: 700;
    cursor: pointer;
    font-family: inherit;
    transition: all 0.22s ease;
    box-shadow: 0 4px 12px rgba(37, 99, 235, 0.28);
  }
  .dq-btn-pri:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 8px 18px rgba(37, 99, 235, 0.36); }
  .dq-btn-pri:active:not(:disabled) { transform: translateY(0); }
  .dq-btn-pri:disabled { opacity: 0.6; cursor: not-allowed; }

  .dq-btn-sec {
    background: #fff;
    color: var(--dq-slate);
    border: 1.5px solid var(--dq-border);
    border-radius: 11px;
    padding: 11px 20px;
    font-size: 13.5px;
    font-weight: 600;
    cursor: pointer;
    font-family: inherit;
    transition: all 0.22s ease;
  }
  .dq-btn-sec:hover:not(:disabled) {
    border-color: var(--dq-slate-light);
    color: var(--dq-navy);
    transform: translateY(-1px);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.06);
  }
  .dq-btn-sec:active:not(:disabled) { transform: translateY(0); }
  .dq-btn-sec:disabled { opacity: 0.5; cursor: not-allowed; }

  /* ========== MODAL OVERLAY ========== */
  .dq-modal-bg {
    position: fixed;
    inset: 0;
    background: rgba(0, 4, 53, 0.55);
    backdrop-filter: blur(8px) saturate(140%);
    -webkit-backdrop-filter: blur(8px) saturate(140%);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2000;
    padding: 20px;
    animation: dq-fade-in 0.2s ease-out;
  }
  @keyframes dq-fade-in { from { opacity: 0; } to { opacity: 1; } }
  @keyframes dq-pop-in {
    from { opacity: 0; transform: scale(0.92) translateY(10px); }
    to { opacity: 1; transform: scale(1) translateY(0); }
  }

  .dq-modal {
    position: relative;
    background: #fff;
    border-radius: 22px;
    padding: 30px 28px;
    max-width: 440px;
    width: 100%;
    box-shadow:
      0 30px 60px -15px rgba(0, 4, 53, 0.35),
      0 0 0 1px rgba(255, 255, 255, 0.5) inset;
    animation: dq-pop-in 0.28s cubic-bezier(0.16, 1, 0.3, 1);
    overflow: hidden;
  }
  .dq-modal.wide { max-width: 540px; }
  .dq-modal::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 4px;
  }
  .dq-modal.m-email::before { background: linear-gradient(90deg, #EA4335, #FBBC05, #34A853, #4285F4); }
  .dq-modal.m-tor::before { background: linear-gradient(90deg, var(--dq-navy), var(--dq-blue), var(--dq-gold)); }
  .dq-modal.m-irregular::before { background: linear-gradient(90deg, var(--dq-gold), #F97316); }
  .dq-modal.m-claim::before { background: linear-gradient(90deg, var(--dq-blue), #8B5CF6); }

  .dq-modal-icon {
    width: 66px; height: 66px;
    border-radius: 20px;
    display: flex; align-items: center; justify-content: center;
    font-size: 32px;
    margin: 0 auto 18px auto;
    position: relative;
  }
  .dq-modal-icon.email {
    background: linear-gradient(135deg, #FEE2E2 0%, #FEF3C7 50%, #D1FAE5 100%);
    box-shadow: 0 8px 22px rgba(234, 67, 53, 0.18);
  }
  .dq-modal-icon.tor {
    background: linear-gradient(135deg, #DBEAFE 0%, #C7D2FE 50%, #FEF3C7 100%);
    box-shadow: 0 8px 22px rgba(37, 99, 235, 0.22);
  }
  .dq-modal-icon.irregular {
    background: linear-gradient(135deg, #FEF3C7 0%, #FED7AA 100%);
    box-shadow: 0 8px 22px rgba(244, 180, 0, 0.25);
  }
  .dq-modal-icon.claim {
    background: linear-gradient(135deg, #DBEAFE 0%, #EDE9FE 100%);
    box-shadow: 0 8px 22px rgba(139, 92, 246, 0.22);
    margin: 0 0 16px 0;
  }

  .dq-modal-center { text-align: center; }
  .dq-modal-title {
    font-size: 19px;
    font-weight: 800;
    color: var(--dq-navy);
    margin: 0 0 7px 0;
    letter-spacing: -0.01em;
    line-height: 1.25;
  }
  .dq-modal-sub {
    font-size: 13.5px;
    color: var(--dq-slate);
    margin: 0 0 22px 0;
    line-height: 1.55;
  }
  .dq-modal-title-left {
    font-size: 18.5px;
    font-weight: 800;
    color: var(--dq-navy);
    margin: 0 0 5px 0;
    letter-spacing: -0.01em;
  }
  .dq-modal-sub-left {
    font-size: 13px;
    color: var(--dq-slate);
    margin: 0 0 20px 0;
    line-height: 1.55;
  }

  .dq-modal-actions {
    display: flex;
    gap: 12px;
    justify-content: flex-end;
    flex-wrap: wrap;
  }
  .dq-modal-actions.center { justify-content: center; }
  .dq-modal-actions > * { flex: 1; min-width: 130px; }

  .dq-opt-list { display: flex; flex-direction: column; gap: 12px; margin-bottom: 6px; }
  .dq-opt-btn {
    width: 100%;
    background: linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 100%);
    border: 1.5px solid var(--dq-border);
    border-radius: 14px;
    padding: 16px 18px;
    text-align: left;
    cursor: pointer;
    font-family: inherit;
    transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
    position: relative;
    overflow: hidden;
  }
  .dq-opt-btn::after {
    content: '→';
    position: absolute;
    right: 18px;
    top: 50%;
    transform: translateY(-50%);
    color: var(--dq-slate-light);
    font-size: 18px;
    font-weight: 700;
    opacity: 0;
    transition: all 0.25s ease;
  }
  .dq-opt-btn:hover {
    border-color: var(--dq-blue);
    background: linear-gradient(135deg, #EFF6FF 0%, #FEF3C7 100%);
    transform: translateX(3px);
    box-shadow: 0 8px 18px rgba(37, 99, 235, 0.10);
  }
  .dq-opt-btn:hover::after { opacity: 1; right: 16px; color: var(--dq-blue); }
  .dq-opt-title { display: block; font-size: 14.5px; font-weight: 700; color: var(--dq-navy); margin-bottom: 3px; }
  .dq-opt-text { font-size: 12px; color: var(--dq-slate); line-height: 1.4; }

  .dq-info-callout {
    background: linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%);
    border: 1px solid rgba(37, 99, 235, 0.2);
    border-radius: 14px;
    padding: 16px;
    margin-bottom: 22px;
    position: relative;
    padding-left: 50px;
  }
  .dq-info-callout::before {
    content: '➡';
    position: absolute;
    left: 16px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 18px;
    color: var(--dq-blue);
  }
  .dq-callout-title {
    display: block;
    font-size: 12.5px;
    font-weight: 800;
    color: var(--dq-blue);
    margin-bottom: 4px;
    text-transform: uppercase;
    letter-spacing: 0.03em;
  }
  .dq-callout-text { font-size: 13px; color: var(--dq-navy); margin: 0; line-height: 1.5; }

  .dq-req-list-wrap { display: flex; flex-direction: column; gap: 12px; margin-bottom: 24px; }
  .dq-req-card {
    background: linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 100%);
    border: 1px solid var(--dq-border);
    border-radius: 14px;
    padding: 14px 16px;
    transition: all 0.2s ease;
  }
  .dq-req-card:hover { border-color: var(--dq-blue-light); box-shadow: 0 4px 10px rgba(37, 99, 235, 0.06); }
  .dq-req-card-title {
    font-size: 13.5px;
    font-weight: 800;
    color: var(--dq-navy);
    margin: 0 0 5px 0;
    display: flex;
    align-items: center;
    gap: 7px;
  }
  .dq-req-card-title::before {
    content: '';
    width: 6px; height: 6px;
    border-radius: 50%;
    background: var(--dq-blue);
  }
  .dq-req-card-text { font-size: 12.5px; color: var(--dq-slate); margin: 0; line-height: 1.5; }
  .dq-req-list-items {
    font-size: 12.5px;
    color: var(--dq-slate);
    margin: 7px 0 0 0;
    padding-left: 18px;
    line-height: 1.65;
  }
  .dq-req-list-items li { margin-bottom: 1px; }

  /* ========== RESPONSIVE ========== */
  @media (max-width: 720px) {
    .dq-hero { padding: 28px 22px; border-radius: 18px; }
    .dq-hero-title { font-size: 24px; }
    .dq-container { padding: 20px 16px 0 16px; }
    .dq-nav-inner { padding: 12px 16px; }
    .dq-nav-logo span { display: none; }
    .dq-warn-banner { flex-direction: column; align-items: flex-start; }
    .dq-warn-action { width: 100%; }
    .dq-req-layout { grid-template-columns: 1fr; gap: 20px; }
    .dq-summary-wrap { position: static; }
    .dq-form-card { padding: 24px 20px; }
    .dq-summary-card { padding: 22px 20px; }
    .dq-doc-grid { grid-template-columns: 1fr; }
    .dq-info-cards { grid-template-columns: repeat(3, 1fr); gap: 8px; }
    .dq-info-card { padding: 10px 6px; }
    .dq-info-label { font-size: 9px; }
    .dq-info-value { font-size: 11px; }
    .dq-modal { padding: 26px 22px; border-radius: 18px; }
    .dq-modal-icon { width: 56px; height: 56px; font-size: 26px; }
    .dq-modal-actions > * { flex: 1 1 100%; }
    .dq-btn-pri, .dq-btn-sec { width: 100%; }
    .dq-err-actions { flex-direction: column; }
    .dq-err-actions > * { width: 100%; }
  }

  @media (max-width: 420px) {
    .dq-hero-title { font-size: 21px; }
    .dq-section-title { font-size: 16.5px; }
    .dq-step-badge { width: 30px; height: 30px; font-size: 13px; border-radius: 9px; }
    .dq-cta { padding: 14px 18px; font-size: 13.5px; }
    .dq-info-cards { grid-template-columns: 1fr; }
  }
`

function RequestDocument() {
  const navigate = useNavigate()

  const [documents, setDocuments] = useState([])
  const [selectedDocument, setSelectedDocument] = useState(null)
  const [pendingTorDocument, setPendingTorDocument] = useState(null)

  const [quantity, setQuantity] = useState(1)
  const [purpose, setPurpose] = useState('')
  const [additionalDetails, setAdditionalDetails] = useState('')

  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [emailVerified, setEmailVerified] = useState(false)

  // Modals
  const [showEmailVerificationModal, setShowEmailVerificationModal] = useState(false)
  const [showStudentTypeModal, setShowStudentTypeModal] = useState(false)
  const [showIrregularTorReminder, setShowIrregularTorReminder] = useState(false)
  const [showClaimingReminder, setShowClaimingReminder] = useState(false)

  useEffect(() => {
    if (document.getElementById('dq-request-styles')) return
    const style = document.createElement('style')
    style.id = 'dq-request-styles'
    style.textContent = css
    document.head.appendChild(style)
    return () => {
      const s = document.getElementById('dq-request-styles')
      if (s) s.remove()
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
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

      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id, email_verified')
        .eq('id', user.id)
        .single()

      if (profileError) throw profileError

      setEmailVerified(profileData?.email_verified === true)

      const { data: documentData, error: documentError } = await supabase
        .from('document_types')
        .select('id, name, price, description, requires_quantity, is_available')
        .eq('is_available', true)
        .order('id', { ascending: true })

      if (documentError) throw documentError

      setDocuments(documentData || [])
    } catch (error) {
      console.error('Request Document error:', error)
      setError(error?.message || 'Unable to load document request information.')
    } finally {
      setLoading(false)
    }
  }

  const isTorDocument = (document) => {
    return document?.name?.toLowerCase().includes('tor')
  }

  const handleDocumentSelect = (document) => {
    setError('')

    if (isTorDocument(document)) {
      setPendingTorDocument(document)
      setShowStudentTypeModal(true)
      return
    }

    setSelectedDocument(document)
    setQuantity(1)
    setPurpose('')
    setAdditionalDetails('')
  }

  const handleRegularStudent = () => {
    if (!pendingTorDocument) {
      setShowStudentTypeModal(false)
      return
    }

    setSelectedDocument(pendingTorDocument)
    setQuantity(1)
    setPurpose('')
    setAdditionalDetails('')
    setError('')

    setPendingTorDocument(null)
    setShowStudentTypeModal(false)
  }

  const handleIrregularStudent = () => {
    setSelectedDocument(null)
    setPendingTorDocument(null)

    setQuantity(1)
    setPurpose('')
    setAdditionalDetails('')
    setError('')

    setShowStudentTypeModal(false)
    setShowIrregularTorReminder(true)
  }

  const calculateTotal = () => {
    if (!selectedDocument) return 0
    return Number(selectedDocument.price) * Number(quantity)
  }

  const checkEmailVerification = async (userId) => {
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('email_verified')
      .eq('id', userId)
      .single()

    if (profileError) throw profileError

    const verified = profileData?.email_verified === true
    setEmailVerified(verified)
    return verified
  }

  const handleContinue = async (e) => {
    e.preventDefault()
    setError('')

    if (!selectedDocument) {
      setError('Please select a document type first.')
      return
    }

    if (!purpose.trim()) {
      setError('Please enter the purpose of your request.')
      return
    }

    if (!quantity || Number(quantity) < 1) {
      setError('Quantity must be at least 1.')
      return
    }

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError) {
      setError(userError.message)
      return
    }

    if (!user) {
      navigate('/login', { replace: true })
      return
    }

    try {
      const verified = await checkEmailVerification(user.id)
      if (!verified) {
        setShowEmailVerificationModal(true)
        return
      }
    } catch (verificationError) {
      console.error('Email verification check error:', verificationError)
      setError('Unable to check your Gmail verification status. Please try again.')
      return
    }

    setShowClaimingReminder(true)
  }

  const handleConfirmRequest = async () => {
    setError('')

    try {
      setSubmitting(true)

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()

      if (userError) throw userError

      if (!user) {
        navigate('/login', { replace: true })
        return
      }

      const verified = await checkEmailVerification(user.id)

      if (!verified) {
        setShowClaimingReminder(false)
        setShowEmailVerificationModal(true)
        return
      }

      const totalAmount = Number(selectedDocument.price) * Number(quantity)

      const { error: requestError } = await supabase
        .from('document_requests')
        .insert({
          user_id: user.id,
          document_type_id: selectedDocument.id,
          quantity: Number(quantity),
          purpose: purpose.trim(),
          additional_details: additionalDetails.trim() || null,
          total_amount: totalAmount,
          payment_status: 'UNPAID',
          status: 'PENDING',
        })
        .select()
        .single()

      if (requestError) throw requestError

      setShowClaimingReminder(false)

      navigate('/dashboard', {
        replace: true,
        state: {
          requestSuccess: true,
          message: 'Your document request has been submitted successfully.',
        },
      })
    } catch (error) {
      console.error('Submit request error:', error)

      if (error?.message?.includes('You can only submit 2 document requests per day')) {
        setShowClaimingReminder(false)
        setError('You have already submitted 2 document requests today. Please try again tomorrow.')
      } else if (
        error?.message?.toLowerCase().includes('verified users can create their own requests')
      ) {
        setShowClaimingReminder(false)
        setEmailVerified(false)
        setShowEmailVerificationModal(true)
      } else {
        setShowClaimingReminder(false)
        setError(error?.message || 'Unable to submit your document request. Please try again.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="dq-center-wrap">
        <div className="dq-load-card">
          <div className="dq-loader"></div>
          <h2 className="dq-load-title">Preparing portal</h2>
          <p className="dq-load-sub">Fetching document catalog…</p>
        </div>
      </div>
    )
  }

  if (error && !documents.length) {
    return (
      <div className="dq-center-wrap">
        <div className="dq-err-card">
          <div className="dq-err-badge">!</div>
          <h2 className="dq-err-title">We couldn't load this page</h2>
          <p className="dq-err-text">{error}</p>
          <div className="dq-err-actions">
            <button onClick={loadData} className="dq-btn-pri">
              Try again
            </button>
            <button onClick={() => navigate('/dashboard')} className="dq-btn-sec">
              Back to dashboard
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="dq-page">
      <div className="dq-orb dq-orb-1"></div>
      <div className="dq-orb dq-orb-2"></div>
      <div className="dq-orb dq-orb-3"></div>

      <div className="dq-nav-wrap">
        <div className="dq-nav-inner">
          <button onClick={() => navigate('/dashboard')} className="dq-back-btn">
            <span>←</span>
            <span>Back to dashboard</span>
          </button>
          <div className="dq-nav-logo">
            <div className="dq-nav-logo-mark">📜</div>
            <span>DocQuest</span>
          </div>
        </div>
      </div>

      <main className="dq-container">
        <div className="dq-hero">
          <div className="dq-hero-inner">
            <span className="dq-hero-badge">✦ Official Portal</span>
            <h2 className="dq-hero-title">
              Request an <em>Official Document</em>
            </h2>
            <p className="dq-hero-desc">
              Select your required document, specify details, and submit for official Registrar verification.
            </p>
          </div>
        </div>

        {!emailVerified && (
          <div className="dq-warn-banner">
            <div className="dq-warn-left">
              <div className="dq-warn-icon">!</div>
              <div>
                <h4 className="dq-warn-title">Gmail Verification Required</h4>
                <p className="dq-warn-text">
                  Please verify your Gmail account in your profile before requesting official documents.
                </p>
              </div>
            </div>
            <button onClick={() => navigate('/profile')} className="dq-warn-action">
              Verify Email Now
            </button>
          </div>
        )}

        {error && <div className="dq-alert-error">{error}</div>}

        {!selectedDocument ? (
          <section>
            <div className="dq-section-head">
              <span className="dq-step-badge">1</span>
              <div>
                <h3 className="dq-section-title">Select Document Type</h3>
                <p className="dq-section-sub">Choose from our available official academic records</p>
              </div>
            </div>

            <div className="dq-doc-grid">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  onClick={() => handleDocumentSelect(doc)}
                  className={'dq-doc-card' + (selectedDocument?.id === doc.id ? ' selected' : '')}
                >
                  <div className="dq-doc-head">
                    <div className="dq-doc-icon">📜</div>
                    <span className="dq-doc-price">₱{Number(doc.price).toFixed(2)}</span>
                  </div>
                  <h4 className="dq-doc-name">{doc.name}</h4>
                  <p className="dq-doc-desc">{doc.description || 'No description available for this document.'}</p>
                  <div className="dq-doc-foot">
                    <span className="dq-doc-select-txt">Click to select</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : (
          <section className="dq-req-layout">
            <div className="dq-form-card">
              <div className="dq-section-head">
                <span className="dq-step-badge">2</span>
                <div>
                  <h3 className="dq-section-title">Request Details</h3>
                  <p className="dq-section-sub">Fill out the necessary information below</p>
                </div>
              </div>

              <form onSubmit={handleContinue}>
                {selectedDocument.requires_quantity && (
                  <div className="dq-field">
                    <label className="dq-field-label">
                      Quantity (Copies)<span className="dq-req">*</span>
                    </label>
                    <div className="dq-float-wrap">
                      <input
                        type="number"
                        min="1"
                        placeholder=" "
                        value={quantity}
                        onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                        className="dq-float-input small"
                      />
                      <span className="dq-float-label">Number of copies</span>
                    </div>
                    <small className="dq-hint">Price multiplies per requested copy.</small>
                  </div>
                )}

                <div className="dq-field">
                  <label className="dq-field-label">
                    Purpose of Request<span className="dq-req">*</span>
                  </label>
                  <div className="dq-float-wrap textarea-wrap">
                    <textarea
                      value={purpose}
                      onChange={(e) => setPurpose(e.target.value)}
                      placeholder=" "
                      rows="4"
                      className="dq-float-textarea"
                      required
                    ></textarea>
                    <span className="dq-float-label">e.g., Employment, Board Examination, Scholarship Application…</span>
                  </div>
                </div>

                <div className="dq-field">
                  <label className="dq-field-label">Additional Details (Optional)</label>
                  <div className="dq-float-wrap textarea-wrap">
                    <textarea
                      value={additionalDetails}
                      onChange={(e) => setAdditionalDetails(e.target.value)}
                      placeholder=" "
                      rows="3"
                      className="dq-float-textarea"
                    ></textarea>
                    <span className="dq-float-label">Specify special notes or attachments if applicable…</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={!emailVerified || submitting}
                  className="dq-cta"
                >
                  {submitting ? '⏳ Processing…' : 'Continue to Confirmation →'}
                </button>
              </form>
            </div>

            <div className="dq-summary-wrap">
              <div className="dq-summary-card">
                <h4 className="dq-summary-title">Order Summary</h4>

                <div className="dq-selected-doc">
                  <div className="dq-selected-icon">📄</div>
                  <div>
                    <p className="dq-selected-name">{selectedDocument.name}</p>
                    <p className="dq-selected-price">₱{Number(selectedDocument.price).toFixed(2)} / copy</p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedDocument(null)}
                  className="dq-change-btn"
                  type="button"
                >
                  ↻ Change Document Selection
                </button>

                <hr className="dq-divider" />

                <div className="dq-break-row">
                  <span>Base Price</span>
                  <span>₱{Number(selectedDocument.price).toFixed(2)}</span>
                </div>
                <div className="dq-break-row">
                  <span>Quantity</span>
                  <span>× {quantity}</span>
                </div>

                <div className="dq-total-row">
                  <span className="dq-total-label">Total Amount</span>
                  <span className="dq-total-amount">₱{calculateTotal().toFixed(2)}</span>
                </div>

                <div className="dq-info-cards">
                  <div className="dq-info-card fee">
                    <div className="dq-info-icon">💵</div>
                    <p className="dq-info-label">Est. Fee</p>
                    <p className="dq-info-value">₱{calculateTotal().toFixed(2)}</p>
                  </div>
                  <div className="dq-info-card time">
                    <div className="dq-info-icon">⏱</div>
                    <p className="dq-info-label">Processing</p>
                    <p className="dq-info-value">3–5 Days</p>
                  </div>
                  <div className="dq-info-card delivery">
                    <div className="dq-info-icon">🏢</div>
                    <p className="dq-info-label">Pickup</p>
                    <p className="dq-info-value">Registrar</p>
                  </div>
                </div>

                <div className="dq-pay-box">
                  <p className="dq-pay-title">📌 Payment Instructions</p>
                  <p className="dq-pay-text">
                    Payments must be settled directly at the <strong>Treasurer's Office</strong> prior to processing.
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Gmail Verification Modal */}
      {showEmailVerificationModal && (
        <div className="dq-modal-bg">
          <div className="dq-modal m-email">
            <div className="dq-modal-center">
              <div className="dq-modal-icon email">📧</div>
              <h3 className="dq-modal-title">Gmail Verification Required</h3>
              <p className="dq-modal-sub">
                Please verify your registered email in your profile settings before making official requests.
              </p>
            </div>
            <div className="dq-modal-actions">
              <button onClick={() => setShowEmailVerificationModal(false)} className="dq-btn-sec">
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowEmailVerificationModal(false)
                  navigate('/profile')
                }}
                className="dq-btn-pri"
              >
                Go to Profile →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TOR Student Type Modal */}
      {showStudentTypeModal && (
        <div className="dq-modal-bg">
          <div className="dq-modal m-tor">
            <div className="dq-modal-center" style={{ marginBottom: '18px' }}>
              <div className="dq-modal-icon tor">🎓</div>
              <h3 className="dq-modal-title">Transcript of Records</h3>
              <p className="dq-modal-sub">Please specify your current student classification.</p>
            </div>

            <div className="dq-opt-list">
              <button onClick={handleRegularStudent} className="dq-opt-btn">
                <strong className="dq-opt-title">✓ Regular Student</strong>
                <span className="dq-opt-text">Process request directly through the online portal</span>
              </button>

              <button onClick={handleIrregularStudent} className="dq-opt-btn">
                <strong className="dq-opt-title">📋 Irregular Student</strong>
                <span className="dq-opt-text">Requires manual evaluation at the Registrar's Office</span>
              </button>
            </div>

            <div className="dq-modal-actions" style={{ marginTop: '18px' }}>
              <button
                onClick={() => {
                  setShowStudentTypeModal(false)
                  setPendingTorDocument(null)
                }}
                className="dq-btn-sec"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Irregular TOR Reminder Modal */}
      {showIrregularTorReminder && (
        <div className="dq-modal-bg">
          <div className="dq-modal m-irregular">
            <div className="dq-modal-center" style={{ marginBottom: '14px' }}>
              <div className="dq-modal-icon irregular">🏢</div>
              <h3 className="dq-modal-title">In-Person Visit Required</h3>
              <p className="dq-modal-sub">
                TOR requests for irregular students require manual grade evaluation.
              </p>
            </div>

            <div className="dq-info-callout">
              <strong className="dq-callout-title">Next Step</strong>
              <p className="dq-callout-text">
                Please visit the Registrar's Office window directly with your Student Evaluation Form.
              </p>
            </div>

            <div className="dq-modal-actions center">
              <button onClick={() => setShowIrregularTorReminder(false)} className="dq-btn-pri">
                Understood ✓
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Claiming Requirements Modal */}
      {showClaimingReminder && (
        <div className="dq-modal-bg">
          <div className="dq-modal m-claim wide">
            <div>
              <div className="dq-modal-icon claim">📋</div>
              <h3 className="dq-modal-title-left">Claiming Requirements Reminder</h3>
              <p className="dq-modal-sub-left">Ensure you bring the following when collecting your document:</p>
            </div>

            <div className="dq-req-list-wrap">
              <div className="dq-req-card">
                <h4 className="dq-req-card-title">Self-Claiming</h4>
                <p className="dq-req-card-text">Present your <strong>Student ID</strong> or any valid Government ID.</p>
              </div>

              <div className="dq-req-card">
                <h4 className="dq-req-card-title">Representative Claiming</h4>
                <p className="dq-req-card-text">Your representative must present:</p>
                <ul className="dq-req-list-items">
                  <li>Signed Authorization Letter</li>
                  <li>Representative's Valid ID</li>
                  <li>Your Student ID / Valid ID</li>
                </ul>
              </div>
            </div>

            <div className="dq-modal-actions">
              <button onClick={() => setShowClaimingReminder(false)} disabled={submitting} className="dq-btn-sec">
                Back
              </button>
              <button onClick={handleConfirmRequest} disabled={submitting} className="dq-btn-pri">
                {submitting ? '⏳ Submitting…' : 'Pay at Treasurer Office'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default RequestDocument
