import React from 'react';
import { Heart } from 'lucide-react';

export default function EmpowerPosterCard() {
  return (
    <div
      className="glass-card"
      style={{
        borderRadius: '18px',
        overflow: 'hidden',
        position: 'relative',
        height: '100%',
        minHeight: '220px',
        background: 'linear-gradient(135deg, #0284C7 0%, #0369A1 40%, #0F172A 100%)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '24px',
        color: '#FFFFFF',
        boxShadow: '0 8px 24px rgba(2, 132, 199, 0.25)'
      }}
    >
      {/* Decorative background sun & ribbon swoosh */}
      <div style={{
        position: 'absolute',
        top: '-40px',
        right: '-40px',
        width: '160px',
        height: '160px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(234, 179, 8, 0.4) 0%, rgba(239, 68, 68, 0.2) 60%, transparent 100%)',
        filter: 'blur(20px)'
      }} />

      <div style={{ position: 'relative', zIndex: 2 }}>
        <h2 style={{
          fontSize: '28px',
          fontWeight: '800',
          lineHeight: '1.15',
          letterSpacing: '-0.5px',
          fontFamily: 'var(--font-heading)',
          textShadow: '0 2px 8px rgba(0,0,0,0.3)'
        }}>
          Sign<br />Connect<br />Empower
        </h2>
        <div style={{ marginTop: '8px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <Heart size={20} fill="#10B981" color="#10B981" />
        </div>
      </div>

      {/* Table Mountain Silhouette Graphic Line */}
      <div style={{ position: 'relative', zIndex: 2, marginTop: 'auto' }}>
        <svg width="100%" height="40" viewBox="0 0 200 40" preserveAspectRatio="none" style={{ opacity: 0.4 }}>
          <path d="M0,40 L20,30 L40,25 L80,25 L100,28 L140,22 L170,25 L200,40 Z" fill="#FFFFFF" />
        </svg>
        <p style={{ fontSize: '11px', fontWeight: '600', color: 'rgba(255, 255, 255, 0.8)', textAlign: 'right' }}>
          Cape Town & Joburg Tech Hubs 🇿🇦
        </p>
      </div>
    </div>
  );
}
