import React from 'react';
import { HandMetal, Sparkles, Cpu, Layers, Radio, Globe, ShieldCheck } from 'lucide-react';

export default function HeroBanner() {
  const pills = [
    { label: 'Competition-Ready', icon: '🏆', color: '#2D898B' },
    { label: 'Python 3.9+', icon: '🐍', color: '#3587A4' },
    { label: 'Flask', icon: '⚡', color: '#2D848A' },
    { label: 'React 18 + Vite', icon: '⚛️', color: '#88CCF1' },
    { label: 'MediaPipe', icon: '🖐️', color: '#3587A4' },
    { label: 'PWA', icon: '📱', color: '#2D898B' },
    { label: 'SASL', icon: '🇿🇦', color: '#2D848A' }
  ];

  return (
    <div
      className="glass-card"
      style={{
        padding: '24px 28px',
        borderRadius: '20px',
        background: 'linear-gradient(135deg, #2D898B 0%, #2D848A 50%, #3587A4 100%)',
        color: '#FFFFFF',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '20px',
        boxShadow: '0 10px 30px rgba(45, 137, 139, 0.25)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Decorative wave glow in corner */}
      <div
        style={{
          position: 'absolute',
          top: '-50px',
          right: '-50px',
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(136, 204, 241, 0.25) 0%, transparent 70%)',
          pointerEvents: 'none'
        }}
      />

      <div style={{ display: 'flex', alignItems: 'center', gap: '20px', zIndex: 1 }}>
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '18px',
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(8px)',
            border: '1.5px solid rgba(193, 223, 240, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)'
          }}
        >
          <HandMetal size={34} />
        </div>

        <div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <h2 style={{ fontSize: '26px', fontWeight: '800', fontFamily: 'var(--font-heading)', letterSpacing: '-0.5px' }}>
              SignVision SA
            </h2>
            <span style={{ fontSize: '15px', fontWeight: '600', color: '#C1DFF0', fontFamily: 'var(--font-heading)' }}>
              SignBridge
            </span>
          </div>

          <p style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.9)', marginTop: '4px', maxWidth: '620px', lineHeight: '1.4' }}>
            Real-Time Two-Way South African Sign Language (SASL) AI Translator, ML Sequence Engine & Gamified STEM Learning Platform
          </p>

          {/* Tech Badges Row */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '14px' }}>
            {pills.map((pill) => (
              <span
                key={pill.label}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '4px 10px',
                  borderRadius: '20px',
                  fontSize: '11px',
                  fontWeight: '700',
                  background: 'rgba(255, 255, 255, 0.18)',
                  backdropFilter: 'blur(6px)',
                  border: '1px solid rgba(255, 255, 255, 0.25)',
                  color: '#FFFFFF'
                }}
              >
                <span>{pill.icon}</span>
                <span>{pill.label}</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Right Tagline quote pill */}
      <div
        style={{
          borderLeft: '2px solid rgba(193, 223, 240, 0.4)',
          paddingLeft: '18px',
          maxWidth: '180px',
          zIndex: 1
        }}
      >
        <span style={{ fontSize: '13px', fontStyle: 'italic', fontWeight: '600', color: '#C1DFF0', lineHeight: '1.35', display: 'block' }}>
          Inclusive Technology for a Brighter Tomorrow
        </span>
        <div style={{ width: '32px', height: '3px', background: '#88CCF1', borderRadius: '2px', marginTop: '8px' }} />
      </div>
    </div>
  );
}
