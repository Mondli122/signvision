import React from 'react';
import { Trophy, ShieldCheck, Heart, Sparkles, Globe } from 'lucide-react';

export default function Footer() {
  return (
    <footer
      className="glass-card"
      style={{
        padding: '18px 24px',
        borderRadius: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        fontSize: '12px',
        color: 'var(--text-muted)',
        marginTop: '12px'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
        {/* Left Brand info & SA official language notice */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <span style={{ fontWeight: '800', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>🇿🇦</span> SignVision (SignBridge SA)
          </span>
          <span style={{ color: 'var(--border-light)' }}>|</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: 'var(--mint-badge)', color: 'var(--primary-emerald)', padding: '2px 8px', borderRadius: '12px', fontWeight: '700', fontSize: '11px' }}>
            <Globe size={12} /> South African 12th Official Language
          </span>
          <span style={{ color: 'var(--border-light)' }}>|</span>
          <span>Offline PWA Ready</span>
        </div>

        {/* Right Competition Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#D97706', fontWeight: '700' }}>
          <div style={{ width: '24px', height: '24px', borderRadius: '6px', background: '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Trophy size={14} color="#D97706" />
          </div>
          <span>Robo Rumble Technomania STEM & Innovation Competition 2026</span>
        </div>
      </div>

      {/* Subline with tech stack and inclusion statement */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '10px',
        paddingTop: '10px',
        borderTop: '1px solid var(--border-light)',
        fontSize: '11px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span>Powered by MediaPipe Hand Tracking, OpenRouter AI, Supabase Backend & React Vite</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--primary-emerald)', fontWeight: '600' }}>
          <span>Connecting Hearing & Deaf Communities with Pride</span>
          <Heart size={12} fill="var(--primary-emerald)" />
        </div>
      </div>
    </footer>
  );
}
