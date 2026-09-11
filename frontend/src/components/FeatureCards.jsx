import React from 'react';
import { Wifi, Hand, Cpu, Globe, Lock } from 'lucide-react';

export default function FeatureCards({ onSelectFeature }) {
  const cards = [
    {
      id: 'pwa',
      title: 'Offline Ready',
      subtitle: '100% PWA',
      icon: Wifi,
      iconBg: '#C1DFF0',
      iconColor: '#3587A4'
    },
    {
      id: 'dualhand',
      title: 'Dual Hand Tracking',
      subtitle: '42 3D Landmarks',
      icon: Hand,
      iconBg: '#C1DFF0',
      iconColor: '#2D848A'
    },
    {
      id: 'ml',
      title: 'ML Sequence Engine',
      subtitle: 'RandomForestClassifier',
      icon: Cpu,
      iconBg: '#C1DFF0',
      iconColor: '#2D898B'
    },
    {
      id: 'multilang',
      title: 'Multi-language',
      subtitle: 'EN / ZU / XH / AF / SS',
      icon: Globe,
      iconBg: '#C1DFF0',
      iconColor: '#3587A4'
    },
    {
      id: 'auth',
      title: 'Secure Auth',
      subtitle: 'Supabase',
      icon: Lock,
      iconBg: '#C1DFF0',
      iconColor: '#2D848A'
    }
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '10px', marginTop: '10px' }}>
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.id}
            onClick={() => onSelectFeature && onSelectFeature(card.id)}
            style={{
              background: '#FFFFFF',
              borderRadius: '14px',
              padding: '10px 14px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              border: '1px solid rgba(136, 204, 241, 0.4)',
              boxShadow: '0 2px 8px rgba(45, 137, 139, 0.04)',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#2D848A';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(136, 204, 241, 0.4)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <div
              style={{
                width: '36px',
                height: '36px',
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
              <div style={{ fontSize: '12px', fontWeight: '800', color: '#133340', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {card.title}
              </div>
              <div style={{ fontSize: '10.5px', color: '#5C7B8A', marginTop: '1px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {card.subtitle}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
