import React, { useState, useEffect } from 'react';
import { User, Award, Flame, Zap, ShieldCheck, Trophy, Calendar, CheckCircle2, Cloud, Sparkles, BookOpen, Share2, Printer } from 'lucide-react';
import { getProgress } from '../utils/storage';
import { toast } from '../utils/toast';

export default function ProfilePage({ currentUser, onOpenShare, onOpenAuth }) {
  const [progress, setProgress] = useState(getProgress());

  useEffect(() => {
    const handleProgressUpdate = () => setProgress(getProgress());
    window.addEventListener('signvision_progress_updated', handleProgressUpdate);
    return () => window.removeEventListener('signvision_progress_updated', handleProgressUpdate);
  }, []);

  const BADGES = [
    { id: 'first_sign', name: 'First Sign', icon: '🖐️', desc: 'Completed your first SASL translation', unlocked: true },
    { id: 'streak_5', name: '5-Day Flame', icon: '🔥', desc: 'Maintained a 5-day active signing streak', unlocked: progress.streak >= 5 },
    { id: 'quiz_master', name: 'Quiz Maestro', icon: '🏆', desc: 'Scored over 150 points in Speed Quiz', unlocked: (progress.highScore || 0) >= 150 },
    { id: 'vocabulary_10', name: 'Lexicon Builder', icon: '📚', desc: 'Mastered 5 or more SASL dictionary signs', unlocked: (progress.learnedSigns || []).length >= 5 },
    { id: 'bilingual_hero', name: 'Bridge Champion', icon: '🇿🇦', desc: 'Used Voice-to-Sign translator', unlocked: true },
    { id: 'classroom_champ', name: 'Class Leader', icon: '🌟', desc: 'Joined a provincial school room', unlocked: false }
  ];

  const currentLevel = progress.level || 1;
  const currentXP = progress.xp || 0;
  const xpForNextLevel = currentLevel * 150;
  const progressPercent = Math.min(100, Math.round((currentXP % 150) / 1.5));

  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
      
      {/* Profile Header Banner */}
      <div
        className="glass-card"
        style={{
          padding: '24px 28px',
          borderRadius: '16px',
          background: 'linear-gradient(135deg, rgba(45, 132, 138, 0.08) 0%, rgba(53, 135, 164, 0.08) 100%)',
          border: '1px solid rgba(136, 204, 241, 0.4)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          boxShadow: '0 4px 20px rgba(45, 137, 139, 0.06)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
          <div
            style={{
              width: '68px',
              height: '68px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #2D848A 0%, #205E63 100%)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '28px',
              boxShadow: '0 8px 24px rgba(45, 132, 138, 0.25)'
            }}
          >
            {currentUser?.email ? currentUser.email.charAt(0).toUpperCase() : '🇿🇦'}
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#133340', margin: 0 }}>
                {currentUser?.user_metadata?.full_name || (currentUser?.email ? currentUser.email.split('@')[0] : 'South African Signer')}
              </h2>
              <span
                style={{
                  background: '#E6F4FA',
                  color: '#2D848A',
                  padding: '4px 10px',
                  borderRadius: '20px',
                  fontSize: '11.5px',
                  fontWeight: '700'
                }}
              >
                Level {currentLevel} Scholar
              </span>
            </div>
            <p style={{ color: '#5C7B8A', fontSize: '13px', margin: '4px 0 0 0' }}>
              {currentUser?.email || 'Guest Explorer Account (Local Device Session)'}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            onClick={() => {
              window.print();
              toast.info('Opening print dialog for official SASL certificate...', 'Print / Export');
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 16px',
              borderRadius: '10px',
              border: '1px solid #C1DFF0',
              background: '#FFFFFF',
              color: '#133340',
              fontWeight: '700',
              fontSize: '13px',
              cursor: 'pointer'
            }}
          >
            <Printer size={16} color="#2D848A" /> Print / Export PDF
          </button>

          <button
            onClick={() => onOpenShare && onOpenShare()}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 18px',
              borderRadius: '10px',
              border: 'none',
              background: '#2D848A',
              color: '#FFFFFF',
              fontWeight: '700',
              fontSize: '13px',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(45, 132, 138, 0.25)'
            }}
          >
            <Share2 size={16} /> Share Achievement
          </button>

          {!currentUser && (
            <button
              onClick={() => onOpenAuth && onOpenAuth()}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 16px',
                borderRadius: '10px',
                border: '1px solid #C1DFF0',
                background: '#FFFFFF',
                color: '#133340',
                fontWeight: '700',
                fontSize: '13px',
                cursor: 'pointer'
              }}
            >
              <Cloud size={16} color="#2D848A" /> Connect Cloud Sync
            </button>
          )}
        </div>
      </div>

      {/* 4 Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
        
        <div className="glass-card" style={{ padding: '18px', background: '#FFFFFF', borderRadius: '14px', border: '1px solid rgba(136, 204, 241, 0.4)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', color: '#5C7B8A', fontWeight: '700', textTransform: 'uppercase' }}>Total XP</span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#E6F4FA', color: '#2D848A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Zap size={18} />
            </div>
          </div>
          <div style={{ fontSize: '26px', fontWeight: '800', color: '#133340' }}>{currentXP}</div>
          <div style={{ fontSize: '11.5px', color: '#5C7B8A', marginTop: '4px' }}>
            {xpForNextLevel - currentXP} XP until Level {currentLevel + 1}
          </div>
        </div>

        <div className="glass-card" style={{ padding: '18px', background: '#FFFFFF', borderRadius: '14px', border: '1px solid rgba(136, 204, 241, 0.4)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', color: '#5C7B8A', fontWeight: '700', textTransform: 'uppercase' }}>Sign Streak</span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#FEF2F2', color: '#EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Flame size={18} />
            </div>
          </div>
          <div style={{ fontSize: '26px', fontWeight: '800', color: '#EF4444' }}>{progress.streak || 1} Days</div>
          <div style={{ fontSize: '11.5px', color: '#5C7B8A', marginTop: '4px' }}>
            Active daily practice streak
          </div>
        </div>

        <div className="glass-card" style={{ padding: '18px', background: '#FFFFFF', borderRadius: '14px', border: '1px solid rgba(136, 204, 241, 0.4)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', color: '#5C7B8A', fontWeight: '700', textTransform: 'uppercase' }}>Quiz High Score</span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#FEF3C7', color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Trophy size={18} />
            </div>
          </div>
          <div style={{ fontSize: '26px', fontWeight: '800', color: '#D97706' }}>{progress.highScore || 0} pts</div>
          <div style={{ fontSize: '11.5px', color: '#5C7B8A', marginTop: '4px' }}>
            {progress.quizzesCompleted || 0} Quizzes completed
          </div>
        </div>

        <div className="glass-card" style={{ padding: '18px', background: '#FFFFFF', borderRadius: '14px', border: '1px solid rgba(136, 204, 241, 0.4)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', color: '#5C7B8A', fontWeight: '700', textTransform: 'uppercase' }}>Signs Mastered</span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#E6F4FA', color: '#3587A4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <BookOpen size={18} />
            </div>
          </div>
          <div style={{ fontSize: '26px', fontWeight: '800', color: '#3587A4' }}>
            {(progress.learnedSigns || []).length} / 25
          </div>
          <div style={{ fontSize: '11.5px', color: '#5C7B8A', marginTop: '4px' }}>
            SASL curriculum coverage
          </div>
        </div>

      </div>

      {/* Level Progress & Weekly Attendance Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.5fr) minmax(0, 1fr)', gap: '14px' }}>
        
        {/* Level Progression */}
        <div className="glass-card" style={{ padding: '20px', background: '#FFFFFF', borderRadius: '14px', border: '1px solid rgba(136, 204, 241, 0.4)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <h4 style={{ fontSize: '15px', fontWeight: '800', color: '#133340', margin: 0 }}>
              Mastery Tier & Level Progress
            </h4>
            <span style={{ fontSize: '12.5px', fontWeight: '700', color: '#2D848A' }}>
              {progressPercent}% to Level {currentLevel + 1}
            </span>
          </div>

          <div style={{ width: '100%', height: '10px', borderRadius: '6px', background: '#E6F4FA', overflow: 'hidden', marginBottom: '14px' }}>
            <div
              style={{
                width: `${progressPercent}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #3587A4 0%, #2D848A 100%)',
                borderRadius: '6px',
                transition: 'width 0.4s ease'
              }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', color: '#5C7B8A' }}>
            <span>Level {currentLevel} (Novice)</span>
            <span>Level {currentLevel + 1} (Proficient SASL Signer)</span>
          </div>
        </div>

        {/* 7-Day Active Signing Tracker */}
        <div className="glass-card" style={{ padding: '20px', background: '#FFFFFF', borderRadius: '14px', border: '1px solid rgba(136, 204, 241, 0.4)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <Calendar size={18} color="#2D848A" />
            <h4 style={{ fontSize: '15px', fontWeight: '800', color: '#133340', margin: 0 }}>Weekly Activity</h4>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px' }}>
            {daysOfWeek.map((day, idx) => {
              const todayDayIndex = (new Date().getDay() + 6) % 7;
              const streakDays = Math.max(1, Math.min(7, progress.streak || 1));
              const isToday = idx === todayDayIndex;
              const isActive = (idx <= todayDayIndex) && (todayDayIndex - idx < streakDays);
              
              return (
                <div key={day} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                  <div
                    style={{
                      width: '34px',
                      height: '34px',
                      borderRadius: '8px',
                      background: isActive ? '#E6F4FA' : '#F8FBFC',
                      border: `1.5px solid ${isToday ? '#2D848A' : (isActive ? '#88CCF1' : '#C1DFF0')}`,
                      color: isActive ? '#2D848A' : '#5C7B8A',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: '700',
                      fontSize: '12px',
                      position: 'relative'
                    }}
                  >
                    {isActive ? '✓' : '•'}
                    {isToday && (
                      <div style={{
                        position: 'absolute',
                        top: '-3px',
                        right: '-3px',
                        width: '7px',
                        height: '7px',
                        borderRadius: '50%',
                        background: '#2D848A'
                      }} />
                    )}
                  </div>
                  <span style={{ fontSize: '11px', fontWeight: isToday ? '800' : '500', color: isToday ? '#2D848A' : '#5C7B8A' }}>
                    {day}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Achievements / Badges Showcase */}
      <div className="glass-card" style={{ padding: '22px', background: '#FFFFFF', borderRadius: '14px', border: '1px solid rgba(136, 204, 241, 0.4)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h4 style={{ fontSize: '16px', fontWeight: '800', color: '#133340', margin: 0 }}>
              Badges & Honors
            </h4>
            <p style={{ fontSize: '12px', color: '#5C7B8A', margin: '2px 0 0 0' }}>
              Earn badges by learning vocabulary, maintaining streaks, and scoring in quizzes
            </p>
          </div>
          <span style={{ fontSize: '12.5px', fontWeight: '700', color: '#2D848A' }}>
            {BADGES.filter(b => b.unlocked).length} of {BADGES.length} Unlocked
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
          {BADGES.map((b) => (
            <div
              key={b.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px',
                borderRadius: '12px',
                background: b.unlocked ? '#F8FBFC' : '#FFFFFF',
                border: `1px solid ${b.unlocked ? '#C1DFF0' : 'rgba(193, 223, 240, 0.4)'}`,
                opacity: b.unlocked ? 1 : 0.55
              }}
            >
              <div
                style={{
                  fontSize: '24px',
                  width: '42px',
                  height: '42px',
                  borderRadius: '10px',
                  background: b.unlocked ? '#E6F4FA' : '#F0F7FB',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                {b.icon}
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '13.5px', fontWeight: '700', color: '#133340' }}>{b.name}</span>
                  {b.unlocked && <CheckCircle2 size={13} color="#2D848A" />}
                </div>
                <p style={{ fontSize: '11px', color: '#5C7B8A', margin: '2px 0 0 0', lineHeight: '1.3' }}>
                  {b.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
