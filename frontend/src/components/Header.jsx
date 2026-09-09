import React from 'react';
import { Download, User, Menu, HandMetal, AlertTriangle, Video } from 'lucide-react';
import DialectSelector from './DialectSelector';


export default function Header({ currentProvince, onSelectProvince, onOpenEmergency, onOpenWebRTC }) {
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

        {/* Center: SASL Dialect Selector & Quick Launchers */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <DialectSelector
            currentProvince={currentProvince || 'Gauteng'}
            onSelectProvince={onSelectProvince}
          />

          <button
            onClick={onOpenWebRTC}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(56, 189, 248, 0.15)',
              border: '1px solid #38bdf8',
              color: '#38bdf8',
              padding: '8px 14px',
              borderRadius: '10px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '0.85rem'
            }}
          >
            <Video size={16} />
            <span>Video Call</span>
          </button>

          <button
            onClick={onOpenEmergency}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
              border: 'none',
              color: '#ffffff',
              padding: '8px 14px',
              borderRadius: '10px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '0.85rem',
              boxShadow: '0 2px 10px rgba(239, 68, 68, 0.4)'
            }}
          >
            <AlertTriangle size={16} />
            <span>Emergency SOS</span>
          </button>
        </div>

        {/* Right: Status, Install & User */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button className="btn-primary" style={{ borderRadius: '12px', padding: '9px 16px', fontSize: '13px' }}>
            <Download size={16} />
            Install PWA
          </button>

          <div className="status-pill">
            <span className="status-dot"></span>
            AI Live
          </div>
        </div>

      </div>
    </header>
  );
}

