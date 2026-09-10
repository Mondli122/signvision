import React from 'react';
import { Wifi, Hand, Cpu, Globe, Lock } from 'lucide-react';

export default function FeatureCards({ onSelectFeature }) {
  const cards = [
    {
      id: 'pwa',
      title: 'Offline Ready',
      subtitle: '100% PWA',
      icon: Wifi,
      iconBg: '#E0F2FE',
      iconColor: '#3587A4'
    },
    {
      id: 'dualhand',
      title: 'Dual Hand Tracking',
      subtitle: '42 3D Landmarks',
      icon: Hand,
      iconBg: '#CCFBF1',
      iconColor: '#2D848A'
    },
    {
      id: 'ml',
      title: 'ML Sequence Engine',
      subtitle: 'RandomForestClassifier',
      icon: Cpu,
      iconBg: '#EDE9FE',
      iconColor: '#6366F1'
    },
    {
      id: 'multilang',
      title: 'Multi-language',
      subtitle: 'EN / ZU / XH / AF / SS',
      icon: Globe,
      iconBg: '#E0F2FE',
      iconColor: '#2D898B'
    },
    {
      id: 'auth',
      title: 'Secure Auth',
      subtitle: 'Supabase',
      icon: Lock,
      iconBg: '#FEF3C7',
      iconColor: '#D97706'
    }
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginTop: '16px' }}>
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.id}
            onClick={() => onSelectFeature && onSelectFeature(card.id)}
            style={{
              background: '#FFFFFF',
              borderRadius: '16px',
              padding: '12px 14px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              border: '1px solid rgba(193, 223, 240, 0.6)',
              boxShadow: '0 2px 8px rgba(45, 132, 138, 0.04)',
              cursor: 'pointer',
              transition: 'transform 0.15s ease, box-shadow 0.15s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 14px rgba(45, 132, 138, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(45, 132, 138, 0.04)';
            }}
          >
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: card.iconBg,
                color: card.iconColor,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              <Icon size={18} />
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '12px', fontWeight: '800', color: '#0F172A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {card.title}
              </div>
              <div style={{ fontSize: '10.5px', color: '#64748B', marginTop: '1px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {card.subtitle}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
