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
        padding: '14px 20px',
        borderRadius: '4px',
        background: 'linear-gradient(135deg, #2D898B 0%, #2D848A 50%, #3587A4 100%)',
        color: '#FFFFFF',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '14px',
        boxShadow: '0 2px 8px rgba(45, 137, 139, 0.15)',
        border: '1px solid #3587A4'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div
          style={{
            width: '42px',
            height: '42px',
            borderRadius: '3px',
            background: 'rgba(255, 255, 255, 0.15)',
            border: '1px solid rgba(193, 223, 240, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            flexShrink: 0
          }}
        >
          <HandMetal size={24} />
        </div>

        <div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '800', fontFamily: 'var(--font-heading)', letterSpacing: '-0.3px', margin: 0 }}>
              SignVision SA
            </h2>
            <span style={{ fontSize: '12px', fontWeight: '700', color: '#C1DFF0' }}>
              SignBridge
            </span>
          </div>

          <p style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.92)', marginTop: '2px', margin: '2px 0 6px 0', lineHeight: '1.3' }}>
            Real-Time Two-Way South African Sign Language (SASL) AI Translator & STEM Learning Platform
          </p>

          {/* Boxy Tech Tags */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
            {pills.map((pill) => (
              <span
                key={pill.label}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '2px 7px',
                  borderRadius: '2px',
                  fontSize: '10.5px',
                  fontWeight: '700',
                  background: 'rgba(255, 255, 255, 0.15)',
                  color: '#FFFFFF',
                  border: '1px solid rgba(193, 223, 240, 0.3)'
                }}
              >
                <span>{pill.icon}</span>
                <span>{pill.label}</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side Motto */}
      <div
        style={{
          textAlign: 'right',
          borderLeft: '1px solid rgba(193, 223, 240, 0.3)',
          paddingLeft: '16px'
        }}
      >
        <div style={{ fontSize: '12px', fontWeight: '800', color: '#C1DFF0', letterSpacing: '0.4px' }}>
          Inclusive Technology
        </div>
        <div style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.85)', marginTop: '2px' }}>
          For a Brighter Tomorrow
        </div>
      </div>
    </div>
  );
}
