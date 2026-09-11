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
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '8px', marginTop: '12px' }}>
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.id}
            onClick={() => onSelectFeature && onSelectFeature(card.id)}
            style={{
              background: '#FFFFFF',
              borderRadius: '3px',
              padding: '8px 12px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              border: '1px solid #C1DFF0',
              boxShadow: '0 1px 3px rgba(45, 132, 138, 0.04)',
              cursor: 'pointer',
              transition: 'border-color 0.12s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#3587A4';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#C1DFF0';
            }}
          >
            <div
              style={{
                width: '30px',
                height: '30px',
                borderRadius: '2px',
                background: card.iconBg,
                color: card.iconColor,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              <Icon size={16} />
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '11.5px', fontWeight: '800', color: '#133340', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {card.title}
              </div>
              <div style={{ fontSize: '10px', color: '#5C7B8A', marginTop: '1px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {card.subtitle}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
