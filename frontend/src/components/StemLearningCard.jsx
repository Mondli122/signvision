import React from 'react';
import { Gamepad2, ArrowRight, GraduationCap, Cog } from 'lucide-react';

export default function StemLearningCard({ onPlayNow }) {
  return (
    <div
      className="glass-card"
      style={{
        padding: '22px',
        borderRadius: '18px',
        background: 'linear-gradient(135deg, #C1DFF0 0%, #EAF3F8 100%)',
        border: '1.5px solid #88CCF1',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div style={{ zIndex: 1, maxWidth: '280px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: '#2D848A',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Gamepad2 size={20} />
          </div>
          <div>
            <h4 style={{ fontSize: '17px', fontWeight: '800', color: '#133340', fontFamily: 'var(--font-heading)' }}>
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
            marginTop: '12px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '9px 18px',
            borderRadius: '24px',
            background: 'linear-gradient(135deg, #2D898B 0%, #3587A4 100%)',
            color: '#FFFFFF',
            border: 'none',
            fontSize: '13px',
            fontWeight: '700',
            fontFamily: 'var(--font-heading)',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(45, 137, 139, 0.25)',
            transition: 'all 0.18s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <span>Play Now</span>
          <ArrowRight size={15} />
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
