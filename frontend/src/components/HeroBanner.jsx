import React from 'react';
import { HandMetal, Sparkles, Cpu, Layers, Radio, Globe, ShieldCheck } from 'lucide-react';

export default function HeroBanner() {
  const pills = [
    { label: 'Competition-Ready', icon: '🏆' },
    { label: 'Python 3.9+', icon: '🐍' },
    { label: 'Flask', icon: '⚡' },
    { label: 'React 18 + Vite', icon: '⚛️' },
    { label: 'MediaPipe', icon: '🖐️' },
    { label: 'PWA', icon: '📱' },
    { label: 'SASL', icon: '🇿🇦' }
  ];

  return (
    <div
      className="glass-card"
      style={{
        padding: '16px 24px',
        borderRadius: '18px',
        background: 'linear-gradient(135deg, #2D848A 0%, #2D898B 45%, #3587A4 100%)',
        color: '#FFFFFF',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px',
        boxShadow: '0 8px 24px rgba(45, 137, 139, 0.18)',
        border: '1px solid rgba(255, 255, 255, 0.15)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
        <div
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.18)',
            border: '2px solid rgba(255, 255, 255, 0.35)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            flexShrink: 0,
            boxShadow: '0 4px 14px rgba(0, 0, 0, 0.12)'
          }}
        >
          <HandMetal size={30} />
        </div>

        <div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
            <h1 style={{ fontSize: '24px', fontWeight: '800', fontFamily: 'var(--font-heading)', letterSpacing: '-0.4px', margin: 0, color: '#FFFFFF' }}>
              SignVision SA
            </h1>
            <span style={{ fontSize: '15px', fontWeight: '700', color: '#C1DFF0' }}>
              SignBridge
            </span>
          </div>

          <p style={{ fontSize: '12.5px', color: 'rgba(255, 255, 255, 0.92)', margin: '3px 0 8px 0', lineHeight: '1.35', maxWidth: '620px' }}>
            Real-Time Two-Way South African Sign Language (SASL) <br />
            AI Translator, ML Sequence Engine & Gamified STEM Learning Platform
          </p>

          {/* Rounded Pill Tech Badges */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {pills.map((pill) => (
              <span
                key={pill.label}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '4px 11px',
                  borderRadius: '9999px',
                  fontSize: '11px',
                  fontWeight: '700',
                  background: 'rgba(255, 255, 255, 0.16)',
                  color: '#FFFFFF',
                  border: '1px solid rgba(255, 255, 255, 0.28)',
                  backdropFilter: 'blur(4px)'
                }}
              >
                <span>{pill.icon}</span>
                <span>{pill.label}</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side Quote */}
      <div
        style={{
          borderLeft: '2px solid rgba(193, 223, 240, 0.4)',
          paddingLeft: '18px',
          textAlign: 'left'
        }}
      >
        <div style={{ fontSize: '13px', fontStyle: 'italic', fontWeight: '500', color: 'rgba(255, 255, 255, 0.95)', lineHeight: '1.4' }}>
          Inclusive<br />
          Technology<br />
          for a Brighter<br />
          Tomorrow
        </div>
        <div style={{ width: '28px', height: '3px', background: '#88CCF1', marginTop: '8px', borderRadius: '2px' }} />
      </div>
    </div>
  );
}
