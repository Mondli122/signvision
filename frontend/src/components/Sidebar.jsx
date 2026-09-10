import React from 'react';
import { Home, Repeat, GraduationCap, BookOpen, Gamepad2, Database, Settings, Heart, Trophy, Mic } from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab }) {
  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'translator', label: 'Translator', icon: Repeat },
    { id: 'reverse', label: 'Voice-to-Sign', icon: Mic },
    { id: 'learn', label: 'Learn', icon: GraduationCap },
    { id: 'dictionary', label: 'Dictionary', icon: BookOpen },
    { id: 'quiz', label: 'Quiz Game', icon: Gamepad2 },
    { id: 'classroom', label: 'Classroom & Rank', icon: Trophy },
    { id: 'recorder', label: 'Dataset Recorder', icon: Database },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="app-sidebar" style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '220px', flexShrink: 0 }}>
      {/* Navigation Card */}
      <div className="glass-card app-sidebar-nav" style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                width: '100%',
                padding: '11px 16px',
                borderRadius: '12px',
                border: 'none',
                background: isActive ? '#D1FAE5' : 'transparent',
                color: isActive ? '#00A884' : '#475569',
                fontWeight: isActive ? '700' : '500',
                fontSize: '14px',
                fontFamily: 'var(--font-heading)',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                textAlign: 'left'
              }}
            >
              <Icon size={18} color={isActive ? '#00A884' : '#64748B'} />
              {item.label}
            </button>
          );
        })}
      </div>

      {/* SA Promo Banner Card */}
      <div
        className="glass-card"
        style={{
          padding: '24px 18px',
          borderRadius: '18px',
          background: 'linear-gradient(180deg, #E0F2FE 0%, #F0FDF4 100%)',
          border: '1px solid #BAE6FD',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Ribbon visual accents */}
        <div style={{
          width: '120px',
          height: '60px',
          marginBottom: '12px',
          background: 'linear-gradient(135deg, #00A884 0%, #0284C7 50%, #EAB308 100%)',
          borderRadius: '12px 12px 50% 50%',
          opacity: 0.85,
          boxShadow: '0 4px 12px rgba(2, 132, 199, 0.2)'
        }} />

        <h4 style={{ fontSize: '18px', fontWeight: '800', color: '#0F172A', lineHeight: '1.25', marginBottom: '8px' }}>
          Same Language.<br />More Possibilities.
        </h4>
        <div style={{ color: '#00A884', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '14px', fontWeight: '600' }}>
          <Heart size={16} fill="#00A884" />
        </div>
      </div>
    </aside>
  );
}
