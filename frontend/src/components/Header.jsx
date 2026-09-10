import React, { useState, useEffect } from 'react';
import { Download, User, Menu, HandMetal, AlertTriangle, Video, Moon, Sun, Settings, HelpCircle } from 'lucide-react';
import DialectSelector from './DialectSelector';
import { getTheme, setTheme } from '../utils/storage';

export default function Header({ currentProvince, onSelectProvince, onOpenEmergency, onOpenWebRTC, onOpenSettings, onOpenOnboarding, currentUser, onOpenAuth, onSignOut, onOpenProfile }) {
  const [theme, setCurrentTheme] = useState(getTheme());

  useEffect(() => {
    const handleThemeChange = () => setCurrentTheme(getTheme());
    window.addEventListener('signvision_theme_changed', handleThemeChange);
    return () => window.removeEventListener('signvision_theme_changed', handleThemeChange);
  }, []);

  const handleToggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setCurrentTheme(next);
    setTheme(next);
  };

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
              <span style={{ fontSize: '24px', fontWeight: '800', color: 'var(--primary-emerald)', fontFamily: 'var(--font-heading)', letterSpacing: '-0.5px' }}>
                SignVision
              </span>
              <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-main)', fontFamily: 'var(--font-heading)' }}>
                SignBridge SA
              </span>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '500' }}>
              Bridging Communication. Building a More Inclusive SA.
            </p>
          </div>
        </div>

        {/* Center: SASL Dialect Selector & Quick Launchers */}
        <div className="header-actions-desktop" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
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
              color: '#0284c7',
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

        {/* Right: Theme Toggle, Settings, Onboarding, Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Theme Switcher Button */}
          <button
            onClick={handleToggleTheme}
            style={{
              padding: '8px',
              borderRadius: '10px',
              border: '1px solid var(--border-light)',
              background: 'var(--bg-card-subtle)',
              color: 'var(--text-main)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            title="Toggle Light / Dark Theme"
          >
            {theme === 'dark' ? <Sun size={18} color="#EAB308" /> : <Moon size={18} color="var(--text-main)" />}
          </button>

          {/* Tour / Guide Button */}
          <button
            onClick={onOpenOnboarding}
            style={{
              padding: '8px',
              borderRadius: '10px',
              border: '1px solid var(--border-light)',
              background: 'var(--bg-card-subtle)',
              color: 'var(--text-main)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            title="Welcome Guide"
          >
            <HelpCircle size={18} color="var(--primary-emerald)" />
          </button>

          {/* Settings Trigger Button */}
          <button
            onClick={onOpenSettings}
            style={{
              padding: '8px',
              borderRadius: '10px',
              border: '1px solid var(--border-light)',
              background: 'var(--bg-card-subtle)',
              color: 'var(--text-main)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            title="Open Settings"
          >
            <Settings size={18} color="var(--text-main)" />
          </button>

          {/* User Auth Profile Button / Chip */}
          {currentUser ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div
                onClick={onOpenProfile}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '6px 12px',
                  borderRadius: '12px',
                  background: 'var(--mint-badge)',
                  border: '1px solid var(--border-emerald)',
                  color: 'var(--mint-text)',
                  fontSize: '13px',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
                title="View Profile & XP"
              >
                <User size={16} />
                <span>{currentUser.user_metadata?.full_name || currentUser.email?.split('@')[0]}</span>
              </div>
              <button
                onClick={onSignOut}
                style={{
                  padding: '6px 10px',
                  borderRadius: '10px',
                  border: '1px solid var(--border-light)',
                  background: 'var(--bg-card-subtle)',
                  color: 'var(--text-muted)',
                  fontSize: '11px',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
                title="Sign Out"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="btn-primary"
              style={{ padding: '8px 14px', borderRadius: '10px', fontSize: '13px' }}
            >
              <User size={15} /> Sign In
            </button>
          )}

          <div className="status-pill">
            <span className="status-dot"></span>
            AI Live
          </div>
        </div>

      </div>
    </header>
  );
}



