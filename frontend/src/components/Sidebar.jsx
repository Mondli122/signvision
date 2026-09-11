import React from 'react';
import { Home, Repeat, GraduationCap, BookOpen, Gamepad2, Database, Settings, Trophy, Mic, User, Users, ChevronLeft, ChevronRight, Menu } from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, isOpen = true, onToggle }) {
  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'translator', label: 'Translator', icon: Repeat },
    { id: 'reverse', label: 'Live Call Room', icon: Mic },
    { id: 'learn', label: 'Learning & Games', icon: GraduationCap },
    { id: 'classroom', label: 'Leaderboard', icon: Trophy },
    { id: 'dictionary', label: 'Dictionary', icon: BookOpen },
    { id: 'quiz', label: 'AI Coach', icon: Gamepad2 },
    { id: 'recorder', label: 'Dataset Recorder', icon: Database },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'community', label: 'Community', icon: Users },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside
      className="app-sidebar"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        width: isOpen ? '210px' : '58px',
        minWidth: isOpen ? '210px' : '58px',
        flexShrink: 0,
        background: 'linear-gradient(180deg, #2D848A 0%, #205E63 100%)',
        padding: isOpen ? '12px 10px' : '12px 6px',
        borderRadius: '4px',
        border: '1px solid #3587A4',
        boxShadow: '0 2px 8px rgba(45, 132, 138, 0.15)',
        color: '#FFFFFF',
        transition: 'width 0.2s ease, min-width 0.2s ease, padding 0.2s ease',
        overflow: 'hidden'
      }}
    >
      {/* Sidebar Top Header & Toggle Button */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: isOpen ? 'space-between' : 'center',
          paddingBottom: '8px',
          borderBottom: '1px solid rgba(193, 223, 240, 0.2)',
          marginBottom: '2px'
        }}
      >
        {isOpen && (
          <span style={{ fontSize: '11px', fontWeight: '800', color: '#88CCF1', letterSpacing: '0.8px', textTransform: 'uppercase' }}>
            Menu
          </span>
        )}
        <button
          onClick={onToggle}
          title={isOpen ? 'Collapse Sidebar' : 'Expand Sidebar'}
          aria-label={isOpen ? 'Collapse Sidebar' : 'Expand Sidebar'}
          style={{
            background: 'rgba(255, 255, 255, 0.12)',
            border: '1px solid rgba(193, 223, 240, 0.3)',
            borderRadius: '3px',
            color: '#FFFFFF',
            width: '28px',
            height: '28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
        >
          {isOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
        </button>
      </div>

      {/* Navigation Links */}
      <nav aria-label="Main Navigation" style={{ display: 'flex', flexDirection: 'column', gap: '3px', flex: 1 }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id || (item.id === 'reverse' && activeTab === 'reverse');
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              aria-label={item.label}
              aria-current={isActive ? 'page' : undefined}
              title={item.label}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: isOpen ? 'flex-start' : 'center',
                gap: isOpen ? '10px' : '0',
                width: '100%',
                padding: isOpen ? '9px 12px' : '9px 0',
                borderRadius: '3px',
                border: 'none',
                borderLeft: isActive ? '3px solid #88CCF1' : '3px solid transparent',
                background: isActive ? '#FFFFFF' : 'transparent',
                color: isActive ? '#2D848A' : 'rgba(255, 255, 255, 0.9)',
                fontWeight: isActive ? '800' : '600',
                fontSize: '13px',
                fontFamily: 'var(--font-heading)',
                cursor: 'pointer',
                transition: 'background 0.12s ease, color 0.12s ease',
                textAlign: 'left'
              }}
            >
              <Icon size={17} color={isActive ? '#2D848A' : 'rgba(255, 255, 255, 0.9)'} aria-hidden="true" style={{ flexShrink: 0 }} />
              {isOpen && <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Boxy SASL Language Badge */}
      <div
        style={{
          marginTop: 'auto',
          padding: isOpen ? '10px' : '8px 4px',
          borderRadius: '3px',
          background: 'rgba(0, 0, 0, 0.18)',
          border: '1px solid rgba(193, 223, 240, 0.25)',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
          textAlign: isOpen ? 'left' : 'center'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: isOpen ? 'flex-start' : 'center', gap: '6px' }}>
          <span style={{ fontSize: '14px' }}>🇿🇦</span>
          {isOpen && (
            <div>
              <div style={{ fontSize: '11.5px', fontWeight: '800', color: '#FFFFFF', lineHeight: 1 }}>SASL</div>
              <div style={{ fontSize: '9.5px', color: '#C1DFF0', marginTop: '1px' }}>12th Official Lang</div>
            </div>
          )}
        </div>
        {isOpen && (
          <div style={{ fontSize: '10px', color: '#C1DFF0', lineHeight: '1.2' }}>
            Communication has no barriers
          </div>
        )}
      </div>
    </aside>
  );
}
