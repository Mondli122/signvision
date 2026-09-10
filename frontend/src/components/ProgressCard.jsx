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
    <div className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px', height: '100%' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: '#C1DFF0',
              color: '#2D848A',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <BarChart3 size={22} />
          </div>
          <div>
            <h3 style={{ fontSize: '17px', fontWeight: '800', color: '#133340', fontFamily: 'var(--font-heading)' }}>
              Your Progress
            </h3>
            <p style={{ fontSize: '12px', color: '#5C7B8A' }}>
              Keep going! You're doing great!
            </p>
          </div>
        </div>

        <div
          style={{
            padding: '4px 12px',
            borderRadius: '20px',
            background: 'linear-gradient(135deg, #2D848A 0%, #3587A4 100%)',
            color: '#FFFFFF',
            fontSize: '12px',
            fontWeight: '800',
            fontFamily: 'var(--font-heading)'
          }}
        >
          Level {level}
        </div>
      </div>

      {/* Progress Bar & XP indicator */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <div style={{ width: '100%', height: '10px', background: '#D0E5F0', borderRadius: '6px', overflow: 'hidden' }}>
          <div
            style={{
              width: `${percentage}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #88CCF1 0%, #2D898B 100%)',
              borderRadius: '6px',
              transition: 'width 0.4s ease'
            }}
          />
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', fontSize: '12px', fontWeight: '700', color: '#5C7B8A' }}>
          <span>{currentPts} / {totalPts} XP</span>
        </div>
      </div>

      {/* 4 Stat Boxes (Day Streak, Badges, Skills, Leaderboard) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginTop: 'auto' }}>
        {statBoxes.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              style={{
                padding: '12px 6px',
                borderRadius: '14px',
                background: '#F0F7FB',
                border: '1px solid #D0E5F0',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                gap: '4px'
              }}
            >
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: stat.bg,
                  color: stat.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '2px'
                }}
              >
                <Icon size={15} />
              </div>
              <span style={{ fontSize: '16px', fontWeight: '800', color: '#133340', fontFamily: 'var(--font-heading)', lineHeight: '1.1' }}>
                {stat.value}
              </span>
              <span style={{ fontSize: '10px', color: '#5C7B8A', fontWeight: '600' }}>
                {stat.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
