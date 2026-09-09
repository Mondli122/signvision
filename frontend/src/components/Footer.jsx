import React from 'react';
import { Trophy } from 'lucide-react';

export default function Footer() {
  return (
    <footer
      className="glass-card"
      style={{
        padding: '12px 24px',
        borderRadius: '14px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        fontSize: '12px',
        color: '#64748B',
        fontWeight: '500'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
        <span style={{ fontWeight: '700', color: '#0F172A' }}>📷 SignVision (SignBridge SA)</span>
        <span>|</span>
        <span>Real-Time Two-Way Sign Language Translator</span>
        <span>|</span>
        <span>ML Sequence Engine</span>
        <span>|</span>
        <span>Gamified Learning Platform</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#D97706', fontWeight: '700' }}>
        <Trophy size={16} />
        Built for the Robo Rumble Technomania STEM & Innovation Competition
      </div>
    </footer>
  );
}
