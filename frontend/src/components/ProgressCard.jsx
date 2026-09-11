import React, { useState, useEffect } from 'react';
import { BarChart3, Flame, Award, BookOpen, Trophy } from 'lucide-react';
import { getProgress } from '../utils/storage';

export default function ProgressCard() {
  const [prog, setProg] = useState(getProgress());

  useEffect(() => {
    const handleUpdate = () => setProg(getProgress());
    window.addEventListener('signvision_progress_updated', handleUpdate);
    return () => window.removeEventListener('signvision_progress_updated', handleUpdate);
  }, []);

  const level = prog.level || 5;
  const streak = prog.streak || 12;
  const currentPts = prog.xp || 420;
  const totalPts = Math.max(currentPts + 180, level * 150);
  const percentage = Math.min(100, Math.round((currentPts / totalPts) * 100));
  const learnedCount = (prog.learnedSigns || []).length || 3;

  const statBoxes = [
    { label: 'Day Streak', value: streak, icon: Flame, color: '#2D898B', bg: '#C1DFF0' },
    { label: 'Badges', value: 5, icon: Award, color: '#3587A4', bg: '#C1DFF0' },
    { label: 'Skills', value: Math.max(3, learnedCount), icon: BookOpen, color: '#2D848A', bg: '#C1DFF0' },
    { label: 'Leaderboard', value: '#8', icon: Trophy, color: '#2D898B', bg: '#C1DFF0' }
  ];

  return (
    <div className="glass-card" style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: '12px', height: '100%' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '2px',
              background: '#C1DFF0',
              color: '#2D848A',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <BarChart3 size={18} />
          </div>
          <div>
            <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#133340', fontFamily: 'var(--font-heading)', margin: 0 }}>
              Your Progress
            </h3>
            <p style={{ fontSize: '11px', color: '#5C7B8A', margin: 0 }}>
              Keep going! You're doing great!
            </p>
          </div>
        </div>

        <div
          style={{
            padding: '3px 8px',
            borderRadius: '2px',
            background: 'linear-gradient(135deg, #2D848A 0%, #3587A4 100%)',
            color: '#FFFFFF',
            fontSize: '11px',
            fontWeight: '800',
            fontFamily: 'var(--font-heading)'
          }}
        >
          Level {level}
        </div>
      </div>

      {/* Progress Bar & XP indicator */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <div style={{ width: '100%', height: '8px', background: '#E2EFF7', borderRadius: '2px', overflow: 'hidden' }}>
          <div
            style={{
              width: `${percentage}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #88CCF1 0%, #2D898B 100%)',
              borderRadius: '2px',
              transition: 'width 0.4s ease'
            }}
          />
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', fontSize: '11px', fontWeight: '700', color: '#5C7B8A' }}>
          <span>{currentPts} / {totalPts} XP</span>
        </div>
      </div>

      {/* 4 Boxy Stat Boxes */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px', marginTop: 'auto' }}>
        {statBoxes.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              style={{
                padding: '8px 4px',
                borderRadius: '2px',
                background: '#F5F9FC',
                border: '1px solid #C1DFF0',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                gap: '2px'
              }}
            >
              <div
                style={{
                  width: '22px',
                  height: '22px',
                  borderRadius: '2px',
                  background: stat.bg,
                  color: stat.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1px'
                }}
              >
                <Icon size={13} />
              </div>
              <span style={{ fontSize: '14px', fontWeight: '800', color: '#133340', fontFamily: 'var(--font-heading)', lineHeight: '1.1' }}>
                {stat.value}
              </span>
              <span style={{ fontSize: '9.5px', color: '#5C7B8A', fontWeight: '600' }}>
                {stat.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
