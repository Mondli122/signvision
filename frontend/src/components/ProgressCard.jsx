import React, { useState, useEffect } from 'react';
import { Brain, Flame, Star } from 'lucide-react';
import { getProgress } from '../utils/storage';

export default function ProgressCard() {
  const [prog, setProg] = useState(getProgress());

  useEffect(() => {
    const handleUpdate = () => setProg(getProgress());
    window.addEventListener('signvision_progress_updated', handleUpdate);
    return () => window.removeEventListener('signvision_progress_updated', handleUpdate);
  }, []);

  const level = prog.level || 1;
  const streak = prog.streak || 1;
  const score = prog.highScore || 0;
  const currentPts = prog.xp || 0;
  const totalPts = level * 150;
  const percentage = Math.min(100, Math.round((currentPts / totalPts) * 100));

  return (
    <div className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px', height: '100%' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{
          width: '38px',
          height: '38px',
          borderRadius: '10px',
          background: '#E0F2FE',
          color: '#0284C7',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Brain size={20} />
        </div>
        <div>
          <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#0F172A' }}>
            Learning Progress
          </h3>
          <p style={{ fontSize: '12px', color: '#64748B' }}>
            Keep going, you're doing great!
          </p>
        </div>
      </div>

      {/* Main Content: Ring Chart & Stats side-by-side */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', gap: '16px', my: '6px' }}>
        
        {/* Ring Chart */}
        <div style={{ position: 'relative', width: '100px', height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="100" height="100" viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)' }}>
            {/* Background Ring */}
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="#E2E8F0"
              strokeWidth="8"
              fill="transparent"
            />
            {/* Emerald Progress Ring */}
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="#00A884"
              strokeWidth="8"
              strokeDasharray="251.2"
              strokeDashoffset={251.2 - (251.2 * percentage) / 100}
              strokeLinecap="round"
              fill="transparent"
              style={{ transition: 'stroke-dashoffset 0.6s ease' }}
            />
          </svg>

          {/* Level Center Label */}
          <div style={{ position: 'absolute', textAlign: 'center' }}>
            <span style={{ fontSize: '10px', textTransform: 'uppercase', color: '#64748B', fontWeight: '700', letterSpacing: '0.5px' }}>
              Level
            </span>
            <div style={{ fontSize: '22px', fontWeight: '800', color: '#0F172A', fontFamily: 'var(--font-heading)', lineHeight: '1' }}>
              {level}
            </div>
          </div>
        </div>

        {/* Stats List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Flame size={18} color="#F97316" fill="#F97316" />
            <span style={{ fontSize: '14px', fontWeight: '700', color: '#0F172A' }}>
              Streak: <span style={{ color: '#F97316' }}>{streak}</span>
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Star size={18} color="#EAB308" fill="#EAB308" />
            <span style={{ fontSize: '14px', fontWeight: '700', color: '#0F172A' }}>
              Score: <span style={{ color: '#EAB308' }}>+{score} PTS</span>
            </span>
          </div>
        </div>

      </div>

      {/* Progress Bar Footer */}
      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: '600', color: '#64748B' }}>
          <span>Next Level</span>
          <span><b>{currentPts}</b> / {totalPts} PTS</span>
        </div>
        <div style={{ width: '100%', height: '8px', background: '#F1F5F9', borderRadius: '4px', overflow: 'hidden' }}>
          <div style={{ width: `${percentage}%`, height: '100%', background: 'linear-gradient(90deg, #00A884 0%, #10B981 100%)', borderRadius: '4px' }} />
        </div>
      </div>

    </div>
  );
}
