import React from 'react';
import { Bell, Repeat, Gamepad2, Database, PlusCircle } from 'lucide-react';

export default function RecentActivityCard() {
  const activities = [
    {
      id: 1,
      title: 'Sign translated',
      detail: 'HELLO',
      time: '2s ago',
      icon: Repeat,
      color: '#10B981',
      bg: '#D1FAE5'
    },
    {
      id: 2,
      title: 'Quiz completed',
      detail: 'Basic Greetings - 100%',
      time: '5m ago',
      icon: Gamepad2,
      color: '#9333EA',
      bg: '#F3E8FF'
    },
    {
      id: 3,
      title: 'New sign recorded',
      detail: 'FAMILY',
      time: '12m ago',
      icon: PlusCircle,
      color: '#0284C7',
      bg: '#E0F2FE'
    },
    {
      id: 4,
      title: 'Dataset updated',
      detail: '30 frames - 1 class',
      time: '25m ago',
      icon: Database,
      color: '#059669',
      bg: '#D1FAE5'
    }
  ];

  return (
    <div className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px', height: '100%' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{
          width: '38px',
          height: '38px',
          borderRadius: '10px',
          background: '#FEF3C7',
          color: '#D97706',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Bell size={20} />
        </div>
        <div>
          <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#0F172A' }}>
            Recent Activity
          </h3>
        </div>
      </div>

      {/* Activity Timeline Items */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '4px' }}>
        {activities.map((act) => {
          const Icon = act.icon;
          return (
            <div key={act.id} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: act.bg,
                color: act.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Icon size={16} />
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '12px', fontWeight: '600', color: '#64748B' }}>
                  {act.title}
                </div>
                <div style={{ fontSize: '13px', fontWeight: '700', color: '#0F172A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {act.detail}
                </div>
              </div>

              <div style={{ fontSize: '11px', color: '#94A3B8', whiteSpace: 'nowrap' }}>
                {act.time}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
