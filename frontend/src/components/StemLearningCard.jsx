import React from 'react';
import { Gamepad2, ArrowRight, GraduationCap, Cog } from 'lucide-react';

export default function StemLearningCard({ onPlayNow }) {
  return (
    <div
      className="glass-card"
      style={{
        padding: '14px 18px',
        borderRadius: '4px',
        background: 'linear-gradient(135deg, #C1DFF0 0%, #F0F6FA 100%)',
        border: '1px solid #88CCF1',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div style={{ zIndex: 1, maxWidth: '280px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <div
            style={{
              width: '30px',
              height: '30px',
              borderRadius: '2px',
              background: '#2D848A',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Gamepad2 size={17} />
          </div>
          <div>
            <h4 style={{ fontSize: '15px', fontWeight: '800', color: '#133340', fontFamily: 'var(--font-heading)', margin: 0 }}>
              STEM Learning
            </h4>
            <span style={{ fontSize: '10.5px', color: '#5C7B8A' }}>
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
            gap: '6px',
            padding: '6px 14px',
            borderRadius: '2px',
            background: 'linear-gradient(135deg, #2D898B 0%, #3587A4 100%)',
            color: '#FFFFFF',
            border: 'none',
            fontSize: '12px',
            fontWeight: '700',
            fontFamily: 'var(--font-heading)',
            cursor: 'pointer',
            boxShadow: '0 2px 6px rgba(45, 137, 139, 0.2)',
            transition: 'all 0.15s'
          }}
        >
          <span>Play Now</span>
          <ArrowRight size={13} />
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
