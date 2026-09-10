import React, { useState } from 'react';
import { Users, Trophy, School, Medal, Plus, LogIn, Flame, Sparkles } from 'lucide-react';

const LEADERBOARD_USERS = [
  { rank: 1, name: "Thabo Mokoena", school: "Parktown High, JHB", province: "Gauteng", score: 1420, streak: 18, badge: "🥇 Gold Signer" },
  { rank: 2, name: "Zintle Khumalo", school: "Durban Girls College", province: "KwaZulu-Natal", score: 1290, streak: 14, badge: "🥈 Silver Signer" },
  { rank: 3, name: "Liam van der Merwe", school: "Rondebosch Boys, CT", province: "Western Cape", score: 1150, streak: 12, badge: "🥉 Bronze Signer" },
  { rank: 4, name: "Sipho Dlamini", school: "St. Andrews College", province: "Eastern Cape", score: 980, streak: 9, badge: "⭐ Rising Star" },
  { rank: 5, name: "Lerato Molefe", school: "Grey College, BFN", province: "Free State", score: 860, streak: 7, badge: "⭐ Rising Star" },
  { rank: 6, name: "You (SignBridge Champion)", school: "Robo Rumble Technomania", province: "National", score: 640, streak: 5, badge: "🚀 Explorer" }
];

export default function ClassroomMode() {
  const [roomCode, setRoomCode] = useState('SASL-5821');
  const [joinedRoom, setJoinedRoom] = useState(false);
  const [activeTab, setActiveTab] = useState('leaderboard'); // 'leaderboard' | 'room'

  const handleJoin = (e) => {
    e.preventDefault();
    if (roomCode.trim()) {
      setJoinedRoom(true);
    }
  };

  return (
    <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#FEF3C7', color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Trophy size={22} />
          </div>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-main)' }}>Classroom & National Leaderboard</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Compete with learners across South Africa and challenge your STEM classroom</p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div style={{ display: 'flex', background: 'var(--bg-card-subtle)', borderRadius: '12px', padding: '4px', border: '1px solid var(--border-light)' }}>
          <button
            onClick={() => setActiveTab('leaderboard')}
            style={{
              padding: '6px 14px',
              borderRadius: '8px',
              border: 'none',
              background: activeTab === 'leaderboard' ? 'var(--primary-emerald)' : 'transparent',
              color: activeTab === 'leaderboard' ? '#FFF' : 'var(--text-muted)',
              fontSize: '13px',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            National Leaderboard
          </button>
          <button
            onClick={() => setActiveTab('room')}
            style={{
              padding: '6px 14px',
              borderRadius: '8px',
              border: 'none',
              background: activeTab === 'room' ? 'var(--primary-emerald)' : 'transparent',
              color: activeTab === 'room' ? '#FFF' : 'var(--text-muted)',
              fontSize: '13px',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            Classroom Challenge Room
          </button>
        </div>
      </div>

      {activeTab === 'leaderboard' ? (
        /* Leaderboard Table */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '60px 1.5fr 1fr 100px 100px', padding: '10px 16px', fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            <span>Rank</span>
            <span>Learner & School</span>
            <span>Province</span>
            <span>Streak</span>
            <span>Total XP</span>
          </div>

          {LEADERBOARD_USERS.map((user) => {
            const isUser = user.name.includes("You");
            return (
              <div
                key={user.rank}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '60px 1.5fr 1fr 100px 100px',
                  alignItems: 'center',
                  padding: '14px 16px',
                  borderRadius: '12px',
                  background: isUser ? 'var(--mint-badge)' : 'var(--bg-card-subtle)',
                  border: isUser ? '2px solid var(--primary-emerald)' : '1px solid var(--border-light)',
                  transition: 'transform 0.1s ease'
                }}
              >
                <span style={{ fontSize: '16px', fontWeight: '800', color: user.rank <= 3 ? '#D97706' : 'var(--text-muted)' }}>
                  #{user.rank}
                </span>

                <div>
                  <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {user.name}
                    {user.rank <= 3 && <Medal size={16} color="#D97706" />}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{user.school}</div>
                </div>

                <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-main)' }}>
                  {user.province}
                </span>

                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', fontWeight: '700', color: '#F97316' }}>
                  <Flame size={14} /> {user.streak}d
                </div>

                <span style={{ fontSize: '14px', fontWeight: '800', color: 'var(--primary-emerald)' }}>
                  {user.score} XP
                </span>
              </div>
            );
          })}
        </div>
      ) : (
        /* Classroom Challenge Room */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center', padding: '20px 0' }}>
          {!joinedRoom ? (
            <div style={{ width: '100%', maxWidth: '420px', padding: '24px', background: 'var(--bg-card-subtle)', borderRadius: '16px', border: '1px solid var(--border-light)', display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'center' }}>
              <School size={40} color="var(--primary-emerald)" style={{ margin: '0 auto' }} />
              <div>
                <h4 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-main)', marginBottom: '6px' }}>
                  Join STEM Classroom Room
                </h4>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                  Enter your teacher or mentor's 6-character room code to join live peer sign speed matches.
                </p>
              </div>

              <input
                type="text"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                placeholder="e.g. SASL-5821"
                style={{
                  padding: '12px',
                  borderRadius: '10px',
                  border: '1px solid var(--border-light)',
                  background: 'var(--bg-card)',
                  color: 'var(--text-main)',
                  fontSize: '16px',
                  fontWeight: '800',
                  textAlign: 'center',
                  letterSpacing: '2px',
                  outline: 'none'
                }}
              />

              <button className="btn-primary" onClick={handleJoin} style={{ justifyContent: 'center' }}>
                <LogIn size={16} /> Enter Classroom Room
              </button>
            </div>
          ) : (
            <div style={{ width: '100%', maxWidth: '520px', padding: '24px', background: 'var(--bg-card-subtle)', borderRadius: '16px', border: '1px solid var(--border-light)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="status-pill">
                  <span className="status-dot" /> Connected to {roomCode}
                </span>
                <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--primary-emerald)' }}>
                  14 Students Active
                </span>
              </div>

              <div style={{ padding: '16px', background: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
                <h5 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-main)', marginBottom: '8px' }}>
                  Teacher's Live Prompt:
                </h5>
                <div style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                  "Sign the phrase: <b>HELLO I NEED HELP</b> with correct dominant hand posture and facial expression."
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button className="btn-primary" style={{ flex: 1, justifyContent: 'center' }} onClick={() => alert('Starting live match round!')}>
                  Start Live Challenge Round
                </button>
                <button className="btn-outline" onClick={() => setJoinedRoom(false)}>
                  Leave Room
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
