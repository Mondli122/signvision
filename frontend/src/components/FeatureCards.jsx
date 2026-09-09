import React from 'react';
import { Camera, Hand, Gamepad2, Smartphone, ChevronRight } from 'lucide-react';

export default function FeatureCards({ onSelectFeature }) {
  const cards = [
    {
      id: 'realtime',
      title: 'Real-Time Translation',
      subtitle: 'Convert sign language to text and speech (and vice versa).',
      icon: Camera,
      iconBg: '#D1FAE5',
      iconColor: '#00A884'
    },
    {
      id: 'alphabet',
      title: 'A-Z Manual Alphabet',
      subtitle: 'Learn & practice fingerspelling from A to Z.',
      icon: Hand,
      iconBg: '#DCFCE7',
      iconColor: '#16A34A'
    },
    {
      id: 'quiz',
      title: 'SASL Speed Quiz',
      subtitle: 'Test your skills. Earn points. Build your streak!',
      icon: Gamepad2,
      iconBg: '#F3E8FF',
      iconColor: '#9333EA'
    },
    {
      id: 'pwa',
      title: 'Offline PWA',
      subtitle: 'Works without internet. Install on your device.',
      icon: Smartphone,
      iconBg: '#E0F2FE',
      iconColor: '#0284C7'
    }
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.id}
            className="glass-card clickable-card"
            onClick={() => onSelectFeature && onSelectFeature(card.id)}
            style={{
              padding: '16px 18px',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '14px'
            }}
          >
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: card.iconBg,
              color: card.iconColor,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <Icon size={22} />
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '4px' }}>
                <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#0F172A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {card.title}
                </h4>
                <ChevronRight size={16} color="#94A3B8" />
              </div>
              <p style={{ fontSize: '12px', color: '#64748B', lineHeight: '1.3', marginTop: '2px' }}>
                {card.subtitle}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
