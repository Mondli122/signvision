import React from 'react';
import { Trophy, ChevronRight } from 'lucide-react';

export default function MiniLeaderboardCard({ onViewAll }) {
  const topLearners = [
    { rank: 1, name: 'Thabo Mokoena', province: 'Gauteng', xp: '12,480' },
    { rank: 2, name: 'Lerato Dlamini', province: 'KZN', xp: '11,920' },
    { rank: 3, name: 'Sipho Ndlovu', province: 'Western Cape', xp: '11,430' },
    { rank: 4, name: 'Ayesha Khan', province: 'Gauteng', xp: '10,870' },
    { rank: 5, name: 'Kabelo Mthembu', province: 'Limpopo', xp: '10,520' }
  ];

  const currentUser = { rank: 8, name: 'Mondli Nkuna', province: 'Mpumalanga', xp: '8,760' };

  return (
    <div
      className="glass-card"
      style={{
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
        height: '100%'
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: '#C1DFF0',
              color: '#2D848A',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Trophy size={18} />
          </div>
          <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#133340', fontFamily: 'var(--font-heading)' }}>
            National Leaderboard
          </h3>
        </div>

        <button
          onClick={onViewAll}
          style={{
            background: 'none',
            border: 'none',
            color: '#2D848A',
            fontSize: '12px',
            fontWeight: '700',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '3px'
          }}
        >
          View All <ChevronRight size={14} />
        </button>
      </div>

      {/* Filter Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '6px',
          background: '#F0F7FB',
          padding: '4px',
          borderRadius: '10px',
          border: '1px solid #D0E5F0'
        }}
      >
        <button
          style={{
            flex: 1,
            padding: '5px 8px',
            borderRadius: '8px',
            border: 'none',
            background: '#2D848A',
            color: '#FFFFFF',
            fontSize: '11px',
            fontWeight: '700',
            cursor: 'pointer'
          }}
        >
          All Provinces
        </button>
        <button
          style={{
            flex: 1,
            padding: '5px 8px',
            borderRadius: '8px',
            border: 'none',
            background: 'transparent',
            color: '#5C7B8A',
            fontSize: '11px',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          Schools
        </button>
        <button
          style={{
            flex: 1,
            padding: '5px 8px',
            borderRadius: '8px',
            border: 'none',
            background: 'transparent',
            color: '#5C7B8A',
            fontSize: '11px',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          Top Learners
        </button>
      </div>

      {/* Table Header */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '28px 1.5fr 1fr 1fr',
          fontSize: '11px',
          fontWeight: '700',
          color: '#5C7B8A',
          padding: '4px 8px',
          borderBottom: '1px solid #D0E5F0'
        }}
      >
        <span>#</span>
        <span>Student</span>
        <span>Province</span>
        <span style={{ textAlign: 'right' }}>XP</span>
      </div>

      {/* Rows */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {topLearners.map((item) => (
          <div
            key={item.rank}
            style={{
              display: 'grid',
              gridTemplateColumns: '28px 1.5fr 1fr 1fr',
              fontSize: '12px',
              padding: '7px 8px',
              borderRadius: '8px',
              color: '#133340',
              fontWeight: '600',
              alignItems: 'center'
            }}
          >
            <span style={{ color: item.rank <= 3 ? '#2D898B' : '#5C7B8A', fontWeight: '800' }}>{item.rank}</span>
            <span style={{ fontWeight: '700' }}>{item.name}</span>
            <span style={{ color: '#5C7B8A', fontSize: '11px' }}>{item.province}</span>
            <span style={{ textAlign: 'right', fontWeight: '700', color: '#2D848A' }}>{item.xp}</span>
          </div>
        ))}

        {/* Current User Row Highlight (Matching #8 in design mockup) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '28px 1.5fr 1fr 1fr',
            fontSize: '12px',
            padding: '8px',
            borderRadius: '10px',
            background: 'linear-gradient(90deg, rgba(193, 223, 240, 0.7) 0%, rgba(136, 204, 241, 0.3) 100%)',
            border: '1.5px solid #88CCF1',
            color: '#133340',
            fontWeight: '800',
            alignItems: 'center',
            marginTop: '4px'
          }}
        >
          <div
            style={{
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              background: '#2D898B',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '10px',
              fontWeight: '800'
            }}
          >
            {currentUser.rank}
          </div>
          <span>{currentUser.name}</span>
          <span style={{ color: '#2D848A', fontSize: '11px' }}>{currentUser.province}</span>
          <span style={{ textAlign: 'right', color: '#2D898B' }}>{currentUser.xp} ↑</span>
        </div>
      </div>
    </div>
  );
}
