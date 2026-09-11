import React from 'react';
import { Gamepad2, ArrowRight, GraduationCap, Cog } from 'lucide-react';

export default function StemLearningCard({ onPlayNow }) {
  return (
    <div
      className="glass-card"
      style={{
        padding: '16px 20px',
        borderRadius: '16px',
        background: 'linear-gradient(135deg, #D5EBF8 0%, #FFFFFF 100%)',
        border: '1px solid rgba(136, 204, 241, 0.5)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 4px 16px rgba(45, 137, 139, 0.06)'
      }}
    >
      <div style={{ zIndex: 1, maxWidth: '280px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: '#2D848A',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Gamepad2 size={19} />
          </div>
          <div>
            <h4 style={{ fontSize: '16px', fontWeight: '800', color: '#133340', fontFamily: 'var(--font-heading)', margin: 0 }}>
              STEM Learning
            </h4>
            <span style={{ fontSize: '11px', color: '#5C7B8A' }}>
              Learn Robotics, AI & SASL together!
            </span>
          </div>
        </div>

        <button
          onClick={onPlayNow}
          style={{
            marginTop: '8px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 20px',
            borderRadius: '9999px',
            background: '#2D848A',
            color: '#FFFFFF',
            border: 'none',
            fontSize: '12.5px',
            fontWeight: '700',
            fontFamily: 'var(--font-heading)',
            cursor: 'pointer',
            boxShadow: '0 3px 10px rgba(45, 137, 139, 0.25)',
            transition: 'all 0.15s'
          }}
        >
          <span>Play Now</span>
          <ArrowRight size={14} />
        </button>
      </div>

      {/* Decorative STEM Graduation Cap and Gear Icons from Mockup */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '6px',
          color: '#3587A4',
          opacity: 0.85
        }}
      >
        <GraduationCap size={56} strokeWidth={1.5} color="#2D848A" />
        <Cog size={28} strokeWidth={2} color="#3587A4" style={{ animation: 'spin 12s linear infinite' }} />
      </div>
    </div>
  );
}
