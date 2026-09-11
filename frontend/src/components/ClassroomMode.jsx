import React, { useState, useEffect } from 'react';
import { Users, Trophy, School, Medal, Plus, LogIn, Flame, Sparkles, RefreshCw } from 'lucide-react';
import { getProgress } from '../utils/storage';
import { toast } from '../utils/toast';

export default function ClassroomMode() {
  const [roomCode, setRoomCode] = useState('SASL-5821');
  const [joinedRoom, setJoinedRoom] = useState(false);
  const [activeTab, setActiveTab] = useState('leaderboard'); // 'leaderboard' | 'room'
  const [loading, setLoading] = useState(true);
  const [leaderboard, setLeaderboard] = useState([]);
  const [userProgress, setUserProgress] = useState(getProgress());

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/leaderboard');
      const data = await res.json();
      if (data && Array.isArray(data.leaderboard)) {
        setLeaderboard(data.leaderboard);
      }
    } catch (err) {
      console.warn('Could not fetch leaderboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
    const handleProgressUpdate = () => setUserProgress(getProgress());
    window.addEventListener('signvision_progress_updated', handleProgressUpdate);
    return () => window.removeEventListener('signvision_progress_updated', handleProgressUpdate);
  }, []);

  const handleJoin = (e) => {
    e.preventDefault();
    if (roomCode.trim()) {
      setJoinedRoom(true);
      toast.success(`Connected to STEM Classroom: ${roomCode}`, 'Room Joined');
    }
  };

  // Dynamically place user in leaderboard based on their actual XP
  const userEntry = {
    name: "You (SignBridge Champion)",
    school: "Robo Rumble Technomania",
    province: "National",
    score: userProgress.xp || 0,
    streak: userProgress.streak || 1,
    badge: (userProgress.xp || 0) >= 1000 ? "🥇 Gold Signer" : (userProgress.xp || 0) >= 500 ? "🥈 Silver Signer" : "🚀 Explorer",
    isCurrentUser: true
  };

  const combinedList = [...leaderboard, userEntry]
    .sort((a, b) => b.score - a.score)
    .map((item, index) => ({
      ...item,
      rank: index + 1
    }));

  return (
    <div
      className="glass-card"
      style={{
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        background: '#FFFFFF',
        borderRadius: '16px',
        border: '1px solid rgba(136, 204, 241, 0.4)',
        boxShadow: '0 4px 20px rgba(45, 137, 139, 0.08)'
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: '#F0F7FB',
            border: '1px solid #C1DFF0',
            color: '#2D848A',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Trophy size={24} />
          </div>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#133340', margin: 0 }}>
              National SASL & Classroom Leaderboard
            </h3>
            <p style={{ fontSize: '12.5px', color: '#5C7B8A', margin: '2px 0 0 0' }}>
              Compete with learners across South Africa and challenge your STEM classroom
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ display: 'flex', background: '#F0F7FB', borderRadius: '10px', padding: '3px', border: '1px solid #C1DFF0' }}>
            <button
              onClick={() => setActiveTab('leaderboard')}
              style={{
                padding: '6px 14px',
                borderRadius: '8px',
                border: 'none',
                background: activeTab === 'leaderboard' ? '#2D848A' : 'transparent',
                color: activeTab === 'leaderboard' ? '#FFFFFF' : '#5C7B8A',
                fontSize: '12.5px',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              National Rankings
            </button>
            <button
              onClick={() => setActiveTab('room')}
              style={{
                padding: '6px 14px',
                borderRadius: '8px',
                border: 'none',
                background: activeTab === 'room' ? '#2D848A' : 'transparent',
                color: activeTab === 'room' ? '#FFFFFF' : '#5C7B8A',
                fontSize: '12.5px',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              Classroom Room
            </button>
          </div>

          <button
            onClick={fetchLeaderboard}
            title="Refresh rankings"
            style={{
              background: '#F0F7FB',
              border: '1px solid #C1DFF0',
              borderRadius: '8px',
              padding: '8px',
              cursor: 'pointer',
              color: '#2D848A',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <RefreshCw size={15} className={loading ? 'spin' : ''} />
          </button>
        </div>
      </div>

      {activeTab === 'leaderboard' ? (
        /* Leaderboard Table */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '60px 1.5fr 1fr 100px 100px',
            padding: '10px 16px',
            fontSize: '11.5px',
            fontWeight: '800',
            color: '#5C7B8A',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            <span>Rank</span>
            <span>Learner & School</span>
            <span>Province</span>
            <span>Streak</span>
            <span>Total XP</span>
          </div>

          {loading && combinedList.length <= 1 ? (
            /* Loading Skeleton */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[1, 2, 3, 4, 5].map(n => (
                <div key={n} style={{ height: '54px', borderRadius: '12px', background: '#F0F7FB' }} />
              ))}
            </div>
          ) : (
            combinedList.map((user) => {
              const isUser = user.isCurrentUser;
              return (
                <div
                  key={user.rank + '-' + user.name}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '60px 1.5fr 1fr 100px 100px',
                    alignItems: 'center',
                    padding: '14px 16px',
                    borderRadius: '12px',
                    background: isUser ? '#E6F4FA' : '#F8FBFC',
                    border: isUser ? '2px solid #2D848A' : '1px solid #C1DFF0',
                    transition: 'all 0.15s ease',
                    boxShadow: isUser ? '0 4px 14px rgba(45, 132, 138, 0.12)' : 'none'
                  }}
                >
                  <span style={{ fontSize: '16px', fontWeight: '800', color: user.rank <= 3 ? '#2D848A' : '#5C7B8A' }}>
                    #{user.rank}
                  </span>

                  <div>
                    <div style={{ fontSize: '14px', fontWeight: '700', color: '#133340', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {user.name}
                      {user.rank <= 3 && <Medal size={16} color="#2D848A" />}
                      {isUser && <span style={{ fontSize: '10px', background: '#2D848A', color: '#FFF', padding: '1px 6px', borderRadius: '6px', fontWeight: '800' }}>YOU</span>}
                    </div>
                    <div style={{ fontSize: '11.5px', color: '#5C7B8A' }}>{user.school}</div>
                  </div>

                  <span style={{ fontSize: '13px', fontWeight: '600', color: '#133340' }}>
                    {user.province}
                  </span>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', fontWeight: '700', color: '#EAB308' }}>
                    <Flame size={14} /> {user.streak}d
                  </div>

                  <span style={{ fontSize: '14px', fontWeight: '800', color: '#2D848A' }}>
                    {user.score} XP
                  </span>
                </div>
              );
            })
          )}
        </div>
      ) : (
        /* Classroom Challenge Room */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center', padding: '20px 0' }}>
          {!joinedRoom ? (
            <div style={{ width: '100%', maxWidth: '420px', padding: '24px', background: '#F8FBFC', borderRadius: '16px', border: '1px solid #C1DFF0', display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'center' }}>
              <div style={{ width: '50px', height: '50px', borderRadius: '12px', background: '#E6F4FA', color: '#2D848A', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}>
                <School size={28} />
              </div>
              <div>
                <h4 style={{ fontSize: '18px', fontWeight: '800', color: '#133340', marginBottom: '6px' }}>
                  Join STEM Classroom Room
                </h4>
                <p style={{ fontSize: '12.5px', color: '#5C7B8A', margin: 0 }}>
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
                  border: '1px solid #C1DFF0',
                  background: '#FFFFFF',
                  color: '#133340',
                  fontSize: '16px',
                  fontWeight: '800',
                  textAlign: 'center',
                  letterSpacing: '2px',
                  outline: 'none'
                }}
              />

              <button
                onClick={handleJoin}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '12px',
                  borderRadius: '10px',
                  border: 'none',
                  background: '#2D848A',
                  color: '#FFFFFF',
                  fontWeight: '700',
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
              >
                <LogIn size={16} /> Enter Classroom Room
              </button>
            </div>
          ) : (
            <div style={{ width: '100%', maxWidth: '520px', padding: '24px', background: '#F8FBFC', borderRadius: '16px', border: '1px solid #C1DFF0', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 10px', borderRadius: '9999px', background: '#E6F4FA', color: '#2D848A', fontSize: '12px', fontWeight: '700' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#2D898B' }} /> Connected to {roomCode}
                </span>
                <span style={{ fontSize: '13px', fontWeight: '700', color: '#2D848A' }}>
                  14 Students Active
                </span>
              </div>

              <div style={{ padding: '16px', background: '#FFFFFF', borderRadius: '12px', border: '1px solid #C1DFF0' }}>
                <h5 style={{ fontSize: '14px', fontWeight: '800', color: '#133340', marginBottom: '6px' }}>
                  Teacher's Live Prompt:
                </h5>
                <div style={{ fontSize: '13px', color: '#5C7B8A', lineHeight: '1.4' }}>
                  "Sign the phrase: <strong style={{ color: '#133340' }}>HELLO I NEED HELP</strong> with correct dominant hand posture and facial expression."
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    padding: '12px',
                    borderRadius: '10px',
                    border: 'none',
                    background: '#2D848A',
                    color: '#FFFFFF',
                    fontWeight: '700',
                    fontSize: '13.5px',
                    cursor: 'pointer'
                  }}
                  onClick={() => toast.success('Live STEM challenge round started! Perform the target sign in camera view.', 'Challenge Active')}
                >
                  Start Live Challenge Round
                </button>
                <button
                  onClick={() => setJoinedRoom(false)}
                  style={{
                    padding: '12px 18px',
                    borderRadius: '10px',
                    border: '1px solid #C1DFF0',
                    background: '#FFFFFF',
                    color: '#5C7B8A',
                    fontWeight: '700',
                    fontSize: '13.5px',
                    cursor: 'pointer'
                  }}
                >
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
