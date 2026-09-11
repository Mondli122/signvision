import React, { useState, useEffect } from 'react';
import { Download, User, Menu, HandMetal, AlertTriangle, Video, Moon, Sun, Settings, HelpCircle } from 'lucide-react';
import DialectSelector from './DialectSelector';
import { getTheme, setTheme } from '../utils/storage';

export default function Header({
  currentProvince,
  onSelectProvince,
  onOpenEmergency,
  onOpenWebRTC,
  onOpenSettings,
  onOpenOnboarding,
  currentUser,
  onOpenAuth,
  onSignOut,
  onOpenProfile,
  isSidebarOpen,
  onToggleSidebar
}) {
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
        padding: '10px 18px',
        borderRadius: '4px',
        background: 'var(--bg-card)',
        boxShadow: '0 2px 6px rgba(45, 137, 139, 0.05)',
        border: '1px solid #C1DFF0'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
        
        {/* Left: Sidebar Toggle + Logo & Subnav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* Menu Toggle Button */}
          <button
            onClick={onToggleSidebar}
            title={isSidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
            aria-label="Toggle navigation sidebar"
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '3px',
              background: 'var(--bg-card-subtle)',
              border: '1px solid #C1DFF0',
              color: '#2D898B',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            <Menu size={18} />
          </button>

          {/* Brand Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '3px',
                background: 'linear-gradient(135deg, #2D898B 0%, #3587A4 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
                boxShadow: '0 2px 6px rgba(45, 137, 139, 0.2)'
              }}
            >
              <HandMetal size={20} />
            </div>
            <div>
              <span style={{ fontSize: '18px', fontWeight: '800', color: '#2D898B', fontFamily: 'var(--font-heading)', letterSpacing: '-0.3px' }}>
                SignVision SA
              </span>
              <span style={{ fontSize: '11px', fontWeight: '700', color: '#5C7B8A', marginLeft: '6px' }}>
                SignBridge
              </span>
            </div>
          </div>

          {/* Top Sub-Navigation Links */}
          <div className="header-actions-desktop" style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '13px', fontWeight: '600', color: '#5C7B8A', borderLeft: '1px solid #C1DFF0', paddingLeft: '18px' }}>
            <span style={{ cursor: 'pointer', color: '#2D898B', fontWeight: '700' }}>Translate</span>
            <span style={{ color: '#C1DFF0' }}>|</span>
            <span style={{ cursor: 'pointer', transition: 'color 0.15s' }} onMouseEnter={(e) => e.target.style.color = '#2D898B'} onMouseLeave={(e) => e.target.style.color = '#5C7B8A'} onClick={onOpenWebRTC}>Connect</span>
            <span style={{ color: '#C1DFF0' }}>|</span>
            <span style={{ cursor: 'pointer', transition: 'color 0.15s' }} onMouseEnter={(e) => e.target.style.color = '#2D898B'} onMouseLeave={(e) => e.target.style.color = '#5C7B8A'}>Learn</span>
            <span style={{ color: '#C1DFF0' }}>|</span>
            <span style={{ cursor: 'pointer', transition: 'color 0.15s' }} onMouseEnter={(e) => e.target.style.color = '#2D898B'} onMouseLeave={(e) => e.target.style.color = '#5C7B8A'}>Empower</span>
          </div>
        </div>

        {/* Right: Dialect Selector, Quick SOS, Theme, Settings, User Profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
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
                gap: '5px',
                background: '#FEE2E2',
                border: '1px solid #FCA5A5',
                color: '#DC2626',
                padding: '6px 10px',
                borderRadius: '3px',
                cursor: 'pointer',
                fontWeight: '700',
                fontSize: '0.78rem',
                transition: 'all 0.15s'
              }}
            >
              <AlertTriangle size={13} />
              <span>SOS</span>
            </button>
          </div>

          {/* Theme Switcher Button */}
          <button
            onClick={handleToggleTheme}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '3px',
              border: '1px solid #C1DFF0',
              background: 'var(--bg-card-subtle)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            title="Toggle Theme"
          >
            {theme === 'dark' ? <Sun size={15} color="#88CCF1" /> : <Moon size={15} color="#2D848A" />}
          </button>

          {/* Tour Button */}
          <button
            onClick={onOpenOnboarding}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '3px',
              border: '1px solid #C1DFF0',
              background: 'var(--bg-card-subtle)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            title="Welcome Guide"
          >
            <HelpCircle size={15} color="#3587A4" />
          </button>

          {/* Settings Button */}
          <button
            onClick={onOpenSettings}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '3px',
              border: '1px solid #C1DFF0',
              background: 'var(--bg-card-subtle)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            title="Open Settings"
          >
            <Settings size={15} color="#5C7B8A" />
          </button>

          {/* Boxy User Profile Widget */}
          <div
            onClick={currentUser ? onOpenProfile : onOpenAuth}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '4px 10px 4px 6px',
              borderRadius: '3px',
              background: 'var(--bg-card-subtle)',
              border: '1px solid #C1DFF0',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
            title={currentUser ? 'View My Profile & XP' : 'Click to Sign In'}
          >
            <div
              style={{
                width: '26px',
                height: '26px',
                borderRadius: '2px',
                background: 'linear-gradient(135deg, #3587A4 0%, #2D898B 100%)',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                fontWeight: '800'
              }}
            >
              {currentUser?.email ? currentUser.email.charAt(0).toUpperCase() : '👨‍🎓'}
            </div>
            <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '12px', fontWeight: '800', color: '#133340', lineHeight: '1.2' }}>
                {currentUser?.user_metadata?.full_name || (currentUser?.email ? currentUser.email.split('@')[0] : 'Mondli Nkuna')}
              </span>
              <span style={{ fontSize: '9.5px', color: '#5C7B8A', fontWeight: '600' }}>
                {currentUser ? 'Active Learner' : 'Student'}
              </span>
            </div>
          </div>
        </div>

      </div>
    </header>
  );
}



