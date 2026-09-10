import React from 'react';
import { Home, Repeat, GraduationCap, BookOpen, Gamepad2, Database, Settings, Heart, Trophy, Mic, User, Users } from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab }) {
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
        gap: '16px',
        width: '230px',
        flexShrink: 0,
        background: 'linear-gradient(180deg, #2D848A 0%, #205E63 100%)',
        padding: '16px 12px',
        borderRadius: '22px',
        boxShadow: '0 10px 30px rgba(45, 132, 138, 0.25)',
        color: '#FFFFFF'
      }}
    >
      {/* Navigation Card */}
      <nav aria-label="Main Navigation" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id || (item.id === 'reverse' && activeTab === 'reverse');
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              aria-label={item.label}
              aria-current={isActive ? 'page' : undefined}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                width: '100%',
                padding: '11px 16px',
                borderRadius: '12px',
                border: 'none',
                background: isActive ? '#FFFFFF' : 'transparent',
                color: isActive ? '#2D848A' : 'rgba(255, 255, 255, 0.88)',
                fontWeight: isActive ? '800' : '600',
                fontSize: '13.5px',
                fontFamily: 'var(--font-heading)',
                cursor: 'pointer',
                transition: 'all 0.18s ease',
                textAlign: 'left',
                boxShadow: isActive ? '0 4px 14px rgba(0, 0, 0, 0.12)' : 'none'
              }}
            >
              <Icon size={18} color={isActive ? '#2D848A' : 'rgba(255, 255, 255, 0.85)'} aria-hidden="true" />
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* SA SASL Official Language Promo Card (matches bottom left mockup) */}
      <div
        style={{
          marginTop: 'auto',
          padding: '18px 14px',
          borderRadius: '16px',
          background: 'rgba(0, 0, 0, 0.18)',
          border: '1px solid rgba(193, 223, 240, 0.25)',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: '#88CCF1',
              color: '#2D848A',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '800',
              fontSize: '16px'
            }}
          >
            🇿🇦
          </div>
          <div>
            <div style={{ fontSize: '12px', fontWeight: '800', color: '#FFFFFF' }}>SASL</div>
            <div style={{ fontSize: '10px', color: '#C1DFF0' }}>12th Official Language</div>
          </div>
        </div>

        <div style={{ fontSize: '11px', color: '#C1DFF0', lineHeight: '1.3', fontStyle: 'italic' }}>
          Communication has no barriers
        </div>
      </div>
    </aside>
  );
}
