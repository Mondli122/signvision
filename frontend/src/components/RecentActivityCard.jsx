import React, { useState, useEffect } from 'react';
import { Bell, Repeat, Gamepad2, Award, Sparkles, CheckCircle2, Trophy } from 'lucide-react';
import { getActivityLog } from '../utils/storage';

function formatTimeAgo(timestamp) {
  if (!timestamp) return 'Just now';
  const diffSec = Math.floor((Date.now() - timestamp) / 1000);
  if (diffSec < 10) return 'Just now';
  if (diffSec < 60) return `${diffSec}s ago`;
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour}h ago`;
  const diffDay = Math.floor(diffHour / 24);
  return `${diffDay}d ago`;
}

export default function RecentActivityCard() {
  const [activities, setActivities] = useState(getActivityLog());

  useEffect(() => {
    const handleUpdate = () => setActivities(getActivityLog());
    window.addEventListener('signvision_activity_updated', handleUpdate);
    return () => window.removeEventListener('signvision_activity_updated', handleUpdate);
  }, []);

  const getIconConfig = (type) => {
    switch (type) {
      case 'quiz':
        return { icon: Gamepad2, color: '#9333EA', bg: '#F3E8FF' };
      case 'level_up':
        return { icon: Trophy, color: '#D97706', bg: '#FEF3C7' };
      case 'sign_learned':
        return { icon: Award, color: '#10B981', bg: '#D1FAE5' };
      case 'translate':
        return { icon: Repeat, color: '#0284C7', bg: '#E0F2FE' };
      default:
        return { icon: Sparkles, color: '#00A884', bg: '#D1FAE5' };
    }
  };

  return (
    <div className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px', height: '100%' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
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
            <span style={{ fontSize: '11px', color: '#64748B' }}>Live action stream</span>
          </div>
        </div>
        <span style={{ fontSize: '11px', fontWeight: '700', color: '#00A884', background: '#D1FAE5', padding: '3px 8px', borderRadius: '12px' }}>
          Live
        </span>
      </div>

      {/* Activity Timeline Items */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '4px', overflowY: 'auto', maxHeight: '230px' }}>
        {activities.slice(0, 5).map((act) => {
          const { icon: Icon, color, bg } = getIconConfig(act.type);
          return (
            <div key={act.id} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: bg,
                color: color,
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
                {formatTimeAgo(act.timestamp)}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
