import React, { useState, useEffect, useRef } from 'react';
import { Menu, HandMetal, Moon, Sun, Bell, ChevronDown, HelpCircle, Settings, LogIn, UserPlus, KeyRound, User, LogOut, Sparkles } from 'lucide-react';
import { getTheme, setTheme } from '../utils/storage';

export default function Header({
  currentUser,
  onOpenAuth,
  onSignOut,
  onOpenProfile,
  onOpenSettings,
  onOpenOnboarding,
  onOpenWebRTC,
  isSidebarOpen,
  onToggleSidebar
}) {
  const [theme, setCurrentTheme] = useState(getTheme());
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleThemeChange = () => setCurrentTheme(getTheme());
    window.addEventListener('signvision_theme_changed', handleThemeChange);
    return () => window.removeEventListener('signvision_theme_changed', handleThemeChange);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowUserDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setCurrentTheme(next);
    setTheme(next);
  };

  const dropdownItemStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '9px 12px',
    borderRadius: '8px',
    border: 'none',
    background: 'transparent',
    color: '#133340',
    fontSize: '12.5px',
    fontWeight: '700',
    cursor: 'pointer',
    width: '100%',
    textAlign: 'left',
    transition: 'background 0.15s ease'
  };

  return (
    <header
      className="glass-card"
      style={{
        padding: '10px 20px',
        borderRadius: '16px',
        background: '#FFFFFF',
        boxShadow: '0 4px 16px rgba(45, 137, 139, 0.06)',
        border: '1px solid rgba(136, 204, 241, 0.4)',
        position: 'relative',
        zIndex: 100
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
        
        {/* Left: Sidebar Toggle + Logo & Slogan Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* Menu Toggle Button */}
          <button
            onClick={onToggleSidebar}
            title={isSidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
            aria-label="Toggle navigation sidebar"
            style={{
              background: '#F0F7FB',
              border: '1px solid #C1DFF0',
              borderRadius: '8px',
              padding: '6px 8px',
              cursor: 'pointer',
              color: '#2D848A',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.15s'
            }}
          >
            <Menu size={18} />
          </button>

          {/* Logo Brand */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: '#2D848A',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(45, 132, 138, 0.25)'
              }}
            >
              <HandMetal size={22} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                <span style={{ fontSize: '19px', fontWeight: '800', color: '#2D848A', fontFamily: 'var(--font-heading)', letterSpacing: '-0.3px' }}>
                  SignVision SA
                </span>
                <span style={{ fontSize: '12px', fontWeight: '700', color: '#3587A4' }}>
                  SignBridge
                </span>
              </div>
            </div>
          </div>

          {/* Top Slogan Bar */}
          <div className="header-actions-desktop" style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '13px', fontWeight: '600', color: '#5C7B8A', borderLeft: '1px solid #C1DFF0', paddingLeft: '18px' }}>
            <span style={{ cursor: 'pointer', transition: 'color 0.15s' }} onMouseEnter={(e) => e.target.style.color = '#2D848A'} onMouseLeave={(e) => e.target.style.color = '#5C7B8A'} onClick={onOpenWebRTC}>Connect</span>
            <span style={{ color: '#C1DFF0' }}>|</span>
            <span style={{ cursor: 'pointer', color: '#2D848A', fontWeight: '700' }}>Translate</span>
            <span style={{ color: '#C1DFF0' }}>|</span>
            <span style={{ cursor: 'pointer', transition: 'color 0.15s' }} onMouseEnter={(e) => e.target.style.color = '#2D848A'} onMouseLeave={(e) => e.target.style.color = '#5C7B8A'} onClick={onOpenOnboarding}>Guide</span>
          </div>
        </div>

        {/* Right: Theme Toggle, Notifications, User Profile Pill with Dropdown Menu */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          
          {/* Theme Switcher */}
          <button
            onClick={handleToggleTheme}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              border: '1px solid #C1DFF0',
              background: '#F0F7FB',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.15s'
            }}
            title="Toggle Theme"
          >
            {theme === 'dark' ? <Sun size={17} color="#88CCF1" /> : <Sun size={17} color="#2D848A" />}
          </button>

          {/* Guide / Notification Bell */}
          <button
            onClick={onOpenOnboarding}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              border: '1px solid #C1DFF0',
              background: '#F0F7FB',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              transition: 'all 0.15s'
            }}
            title="Notifications & Welcome Guide"
          >
            <Bell size={17} color="#2D848A" />
            <span
              style={{
                position: 'absolute',
                top: '7px',
                right: '7px',
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                background: '#2D848A'
              }}
            />
          </button>

          {/* User Profile Pill with Dropdown Menu */}
          <div ref={dropdownRef} style={{ position: 'relative' }}>
            <div
              id="user-profile-menu-button"
              onClick={() => setShowUserDropdown((prev) => !prev)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '4px 14px 4px 6px',
                borderRadius: '28px',
                background: showUserDropdown ? '#E6F4FA' : '#F0F7FB',
                border: `1px solid ${showUserDropdown ? '#2D848A' : '#C1DFF0'}`,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                userSelect: 'none'
              }}
              title="Click for Sign In, Register, and Account options"
            >
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #3587A4 0%, #2D898B 100%)',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '13px',
                  fontWeight: '800'
                }}
              >
                {currentUser?.email ? currentUser.email.charAt(0).toUpperCase() : '👨‍🎓'}
              </div>
              <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '13px', fontWeight: '800', color: '#133340', lineHeight: '1.2' }}>
                  {currentUser?.user_metadata?.full_name || (currentUser?.email ? currentUser.email.split('@')[0] : 'Guest / Sign In')}
                </span>
                <span style={{ fontSize: '10px', color: '#5C7B8A', fontWeight: '600' }}>
                  {currentUser ? 'Active Scholar' : 'Click for Menu'}
                </span>
              </div>
              <ChevronDown
                size={14}
                color="#5C7B8A"
                style={{
                  marginLeft: '4px',
                  transform: showUserDropdown ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.15s ease'
                }}
              />
            </div>

            {/* Dropdown Menu */}
            {showUserDropdown && (
              <div
                id="user-profile-dropdown"
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 8px)',
                  right: 0,
                  width: '260px',
                  background: '#FFFFFF',
                  border: '1px solid #C1DFF0',
                  borderRadius: '16px',
                  boxShadow: '0 10px 30px rgba(45, 137, 139, 0.18)',
                  padding: '10px',
                  zIndex: 2000,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px'
                }}
              >
                {/* User Header Info in Dropdown */}
                <div style={{ padding: '8px 10px 10px 10px', borderBottom: '1px solid #E6F4FA', marginBottom: '4px' }}>
                  <div style={{ fontSize: '13px', fontWeight: '800', color: '#133340' }}>
                    {currentUser?.user_metadata?.full_name || (currentUser?.email ? currentUser.email.split('@')[0] : 'Guest Explorer')}
                  </div>
                  <div style={{ fontSize: '11px', color: '#5C7B8A', marginTop: '2px' }}>
                    {currentUser?.email || 'Not signed in • Local device session'}
                  </div>
                </div>

                {/* Dropdown Options */}
                {!currentUser ? (
                  <>
                    <button
                      id="menu-sign-in"
                      onClick={() => {
                        setShowUserDropdown(false);
                        onOpenAuth && onOpenAuth('login');
                      }}
                      style={dropdownItemStyle}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#F0F7FB'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      <LogIn size={16} color="#2D848A" />
                      <span>Sign In (Login)</span>
                    </button>

                    <button
                      id="menu-register"
                      onClick={() => {
                        setShowUserDropdown(false);
                        onOpenAuth && onOpenAuth('signup');
                      }}
                      style={dropdownItemStyle}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#F0F7FB'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      <UserPlus size={16} color="#2D848A" />
                      <span>Register New Account</span>
                    </button>

                    <button
                      id="menu-forgot-password"
                      onClick={() => {
                        setShowUserDropdown(false);
                        onOpenAuth && onOpenAuth('forgot');
                      }}
                      style={dropdownItemStyle}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#F0F7FB'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      <KeyRound size={16} color="#3587A4" />
                      <span>Forgot Password?</span>
                    </button>

                    <div style={{ height: '1px', background: '#E6F4FA', margin: '4px 0' }} />

                    <button
                      onClick={() => {
                        setShowUserDropdown(false);
                        onOpenProfile && onOpenProfile();
                      }}
                      style={dropdownItemStyle}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#F0F7FB'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      <User size={16} color="#5C7B8A" />
                      <span>View Profile & Badges</span>
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setShowUserDropdown(false);
                        onOpenProfile && onOpenProfile();
                      }}
                      style={dropdownItemStyle}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#F0F7FB'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      <User size={16} color="#2D848A" />
                      <span>My Profile & Streaks</span>
                    </button>

                    <button
                      onClick={() => {
                        setShowUserDropdown(false);
                        onOpenSettings && onOpenSettings();
                      }}
                      style={dropdownItemStyle}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#F0F7FB'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      <Settings size={16} color="#5C7B8A" />
                      <span>Accessibility & Settings</span>
                    </button>

                    <button
                      onClick={() => {
                        setShowUserDropdown(false);
                        onOpenAuth && onOpenAuth('signup');
                      }}
                      style={dropdownItemStyle}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#F0F7FB'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      <UserPlus size={16} color="#5C7B8A" />
                      <span>Switch / Register New</span>
                    </button>

                    <div style={{ height: '1px', background: '#E6F4FA', margin: '4px 0' }} />

                    <button
                      onClick={() => {
                        setShowUserDropdown(false);
                        onSignOut && onSignOut();
                      }}
                      style={{ ...dropdownItemStyle, color: '#DC2626' }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#FEF2F2'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      <LogOut size={16} color="#DC2626" />
                      <span>Sign Out</span>
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

        </div>

      </div>
    </header>
  );
}
