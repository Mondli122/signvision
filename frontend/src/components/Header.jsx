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
    <header
      className="glass-card"
      style={{
        padding: '14px 28px',
        borderRadius: '20px',
        position: 'relative',
        overflow: 'hidden',
        background: 'var(--bg-card)',
        boxShadow: '0 4px 24px rgba(45, 137, 139, 0.08)',
        border: '1px solid var(--border-light)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        
        {/* Left: Logo & Nav Links (Connect | Translate | Learn | Empower) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '28px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '13px',
                background: 'linear-gradient(135deg, #2D898B 0%, #3587A4 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
                boxShadow: '0 4px 14px rgba(45, 137, 139, 0.3)'
              }}
            >
              <HandMetal size={26} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                <span style={{ fontSize: '22px', fontWeight: '800', color: '#2D898B', fontFamily: 'var(--font-heading)', letterSpacing: '-0.5px' }}>
                  SignVision SA
                </span>
              </div>
              <div style={{ fontSize: '11px', fontWeight: '700', color: '#5C7B8A', letterSpacing: '0.4px', marginTop: '-2px' }}>
                SignBridge
              </div>
            </div>
          </div>

          {/* Top Sub-Navigation Links */}
          <div className="header-actions-desktop" style={{ display: 'flex', alignItems: 'center', gap: '18px', fontSize: '13.5px', fontWeight: '600', color: '#5C7B8A', borderLeft: '1.5px solid #D0E5F0', paddingLeft: '24px' }}>
            <span style={{ cursor: 'pointer', transition: 'color 0.15s' }} onMouseEnter={(e) => e.target.style.color = '#2D898B'} onMouseLeave={(e) => e.target.style.color = '#5C7B8A'} onClick={onOpenWebRTC}>Connect</span>
            <span style={{ color: '#D0E5F0' }}>|</span>
            <span style={{ cursor: 'pointer', color: '#2D898B', fontWeight: '700' }}>Translate</span>
            <span style={{ color: '#D0E5F0' }}>|</span>
            <span style={{ cursor: 'pointer', transition: 'color 0.15s' }} onMouseEnter={(e) => e.target.style.color = '#2D898B'} onMouseLeave={(e) => e.target.style.color = '#5C7B8A'}>Learn</span>
            <span style={{ color: '#D0E5F0' }}>|</span>
            <span style={{ cursor: 'pointer', transition: 'color 0.15s' }} onMouseEnter={(e) => e.target.style.color = '#2D898B'} onMouseLeave={(e) => e.target.style.color = '#5C7B8A'}>Empower</span>
          </div>
        </div>

        {/* Center/Right: Dialect Selector, Quick Emergency, Icons, User Pill */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div className="header-actions-desktop" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <DialectSelector
              currentProvince={currentProvince || 'Gauteng'}
              onSelectProvince={onSelectProvince}
            />

            <button
              onClick={onOpenEmergency}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: '#FEE2E2',
                border: '1px solid #FCA5A5',
                color: '#DC2626',
                padding: '7px 12px',
                borderRadius: '10px',
                cursor: 'pointer',
                fontWeight: '700',
                fontSize: '0.8rem',
                transition: 'all 0.15s'
              }}
            >
              <AlertTriangle size={14} />
              <span>SOS</span>
            </button>
          </div>

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
            {theme === 'dark' ? <Sun size={17} color="#88CCF1" /> : <Moon size={17} color="#2D848A" />}
          </button>

          {/* Tour Button */}
          <button
            onClick={onOpenOnboarding}
            style={{
              padding: '8px',
              borderRadius: '10px',
              border: '1px solid var(--border-light)',
              background: 'var(--bg-card-subtle)',
              color: '#3587A4',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            title="Welcome Guide"
          >
            <HelpCircle size={17} color="#3587A4" />
          </button>

          {/* Settings Button */}
          <button
            onClick={onOpenSettings}
            style={{
              padding: '8px',
              borderRadius: '10px',
              border: '1px solid var(--border-light)',
              background: 'var(--bg-card-subtle)',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            title="Open Settings"
          >
            <Settings size={17} color="#5C7B8A" />
          </button>

          {/* User Auth Profile / Student Avatar Pill (Matches Top Right of Design Mockup) */}
          <div
            onClick={currentUser ? onOpenProfile : onOpenAuth}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '5px 14px 5px 6px',
              borderRadius: '24px',
              background: 'var(--bg-card-subtle)',
              border: '1.5px solid #C1DFF0',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: '0 2px 8px rgba(45, 137, 139, 0.08)'
            }}
            title={currentUser ? 'View My Profile & XP' : 'Click to Sign In'}
          >
            <div
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #3587A4 0%, #2D898B 100%)',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px',
                fontWeight: '800',
                border: '2px solid #FFFFFF'
              }}
            >
              {currentUser?.email ? currentUser.email.charAt(0).toUpperCase() : '👨‍🎓'}
            </div>
            <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '13px', fontWeight: '800', color: '#133340', lineHeight: '1.2' }}>
                {currentUser?.user_metadata?.full_name || (currentUser?.email ? currentUser.email.split('@')[0] : 'Mondli Nkuna')}
              </span>
              <span style={{ fontSize: '10.5px', color: '#5C7B8A', fontWeight: '600' }}>
                {currentUser ? 'Active Learner' : 'Student'}
              </span>
            </div>
          </div>
        </div>

      </div>
    </header>
  );
}



