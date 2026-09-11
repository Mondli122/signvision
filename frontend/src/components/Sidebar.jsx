import React from 'react';
import { Home, MessageSquare, Video, Gamepad2, Trophy, BookOpen, Brain, AlertTriangle, User, Settings, LogIn, ChevronLeft, ChevronRight } from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, isOpen = true, onToggle }) {
  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'translator', label: 'Translator', icon: MessageSquare },
    { id: 'call', label: 'Live Call Room', icon: Video },
    { id: 'learn', label: 'Learning & Games', icon: Gamepad2 },
    { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
    { id: 'dictionary', label: 'Dictionary', icon: BookOpen },
    { id: 'aicoach', label: 'AI Coach', icon: Brain },
    { id: 'emergency', label: 'Emergency SOS', icon: AlertTriangle },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside
      className="app-sidebar"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        width: isOpen ? '220px' : '64px',
        minWidth: isOpen ? '220px' : '64px',
        flexShrink: 0,
        background: 'linear-gradient(180deg, #2D848A 0%, #205E63 100%)',
        padding: isOpen ? '14px 12px' : '14px 8px',
        borderRadius: '18px',
        boxShadow: '0 8px 24px rgba(45, 132, 138, 0.2)',
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
          paddingBottom: '10px',
          borderBottom: '1px solid rgba(193, 223, 240, 0.2)',
          marginBottom: '4px'
        }}
      >
        {isOpen && (
          <span style={{ fontSize: '11px', fontWeight: '800', color: '#88CCF1', letterSpacing: '0.8px', textTransform: 'uppercase' }}>
            Navigation
          </span>
        )}
        <button
          onClick={onToggle}
          title={isOpen ? 'Collapse Sidebar' : 'Expand Sidebar'}
          aria-label={isOpen ? 'Collapse Sidebar' : 'Expand Sidebar'}
          style={{
            background: 'rgba(255, 255, 255, 0.15)',
            border: 'none',
            borderRadius: '8px',
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

      {/* Navigation Links with White Active Pills */}
      <nav aria-label="Main Navigation" style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
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
                gap: isOpen ? '12px' : '0',
                width: '100%',
                padding: isOpen ? '10px 14px' : '10px 0',
                borderRadius: '12px',
                border: 'none',
                background: isActive ? '#FFFFFF' : 'transparent',
                color: isActive ? '#2D848A' : 'rgba(255, 255, 255, 0.9)',
                fontWeight: isActive ? '800' : '600',
                fontSize: '13px',
                fontFamily: 'var(--font-heading)',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                textAlign: 'left',
                boxShadow: isActive ? '0 4px 12px rgba(0, 0, 0, 0.12)' : 'none'
              }}
            >
              <Icon size={18} color={isActive ? '#2D848A' : 'rgba(255, 255, 255, 0.9)'} aria-hidden="true" style={{ flexShrink: 0 }} />
              {isOpen && <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* SASL Official Language Card */}
      <div
        style={{
          marginTop: 'auto',
          padding: isOpen ? '12px' : '10px 4px',
          borderRadius: '14px',
          background: 'rgba(0, 0, 0, 0.16)',
          border: '1px solid rgba(193, 223, 240, 0.2)',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
          textAlign: isOpen ? 'left' : 'center'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: isOpen ? 'flex-start' : 'center', gap: '8px' }}>
          <span style={{ fontSize: '15px' }}>🇿🇦</span>
          {isOpen && (
            <div>
              <div style={{ fontSize: '12px', fontWeight: '800', color: '#FFFFFF', lineHeight: 1 }}>SASL</div>
              <div style={{ fontSize: '10px', color: '#C1DFF0', marginTop: '1px' }}>12th Official Lang</div>
            </div>
          )}
        </div>
        {isOpen && (
          <div style={{ fontSize: '10.5px', color: '#C1DFF0', lineHeight: '1.25', fontStyle: 'italic' }}>
            Communication has no barriers
          </div>
        )}
      </div>
    </aside>
  );
}
