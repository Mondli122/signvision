import React from 'react';
import { Download, User, Menu, HandMetal } from 'lucide-react';

export default function Header() {
  return (
    <header className="glass-card" style={{ padding: '12px 24px', borderRadius: '18px', position: 'relative', overflow: 'hidden' }}>
      {/* Decorative top colored accent line matching South African rainbow gradient */}
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: 'linear-gradient(90deg, #00A884 0%, #0284C7 25%, #EAB308 50%, #DC2626 75%, #059669 100%)'
        }} 
      />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        
        {/* Left Logo & Tagline */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, #00A884 0%, #059669 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            boxShadow: '0 4px 12px rgba(0, 168, 132, 0.3)'
          }}>
            <HandMetal size={28} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
              <span style={{ fontSize: '24px', fontWeight: '800', color: '#00A884', fontFamily: 'var(--font-heading)', letterSpacing: '-0.5px' }}>
                SignVision
              </span>
              <span style={{ fontSize: '13px', fontWeight: '700', color: '#334155', fontFamily: 'var(--font-heading)' }}>
                SignBridge SA
              </span>
            </div>
            <p style={{ fontSize: '12px', color: '#64748B', fontWeight: '500' }}>
              Bridging Communication. Building a More Inclusive SA.
            </p>
          </div>
        </div>

        {/* Center: Install App CTA */}
        <div>
          <button className="btn-primary" style={{ borderRadius: '12px', padding: '9px 18px', fontSize: '13px' }}>
            <Download size={16} />
            Install App
          </button>
        </div>

        {/* Right: Status, User, Menu */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div className="status-pill">
            <span className="status-dot"></span>
            Online
          </div>

          <button style={{
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            background: '#F1F5F9',
            border: '1px solid #E2E8F0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#334155',
            cursor: 'pointer',
            transition: 'background 0.2s'
          }}>
            <User size={18} />
          </button>

          <button style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            background: '#FFFFFF',
            border: '1px solid #E2E8F0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#334155',
            cursor: 'pointer'
          }}>
            <Menu size={20} />
          </button>
        </div>

      </div>
    </header>
  );
}
