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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Profile Header Banner */}
      <div
        className="glass-card"
        style={{
          padding: '28px',
          borderRadius: '20px',
          background: 'linear-gradient(135deg, rgba(0, 168, 132, 0.12) 0%, rgba(2, 132, 199, 0.12) 100%)',
          border: '1px solid var(--border-emerald)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
          <div
            style={{
              width: '72px',
              height: '72px',
              borderRadius: '20px',
              background: 'var(--emerald-gradient)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '32px',
              boxShadow: '0 8px 24px rgba(0, 168, 132, 0.35)'
            }}
          >
            {currentUser?.email ? currentUser.email.charAt(0).toUpperCase() : '🇿🇦'}
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--text-main)' }}>
                {currentUser?.user_metadata?.full_name || (currentUser?.email ? currentUser.email.split('@')[0] : 'South African Signer')}
              </h2>
              <span
                style={{
                  background: 'var(--mint-badge)',
                  color: 'var(--mint-text)',
                  padding: '4px 10px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: '700'
                }}
              >
                Level {currentLevel} Scholar
              </span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '4px' }}>
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
              padding: '10px 18px',
              borderRadius: '12px',
              border: '1px solid var(--border-light)',
              background: 'var(--bg-card)',
              color: 'var(--text-main)',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            <Printer size={16} color="var(--primary-emerald)" /> Print / Export PDF
          </button>

          <button
            onClick={() => onOpenShare && onOpenShare()}
            className="btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', borderRadius: '12px' }}
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
                padding: '10px 18px',
                borderRadius: '12px',
                border: '1px solid var(--border-light)',
                background: 'var(--bg-card)',
                color: 'var(--text-main)',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              <Cloud size={16} color="var(--primary-emerald)" /> Connect Cloud Sync
            </button>
          )}
        </div>
      </div>

      {/* 4 Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
        
        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '600' }}>Total XP</span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(0, 168, 132, 0.15)', color: 'var(--primary-emerald)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Zap size={18} />
            </div>
          </div>
          <div style={{ fontSize: '28px', fontWeight: '800', color: 'var(--text-main)' }}>{currentXP}</div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
            {xpForNextLevel - currentXP} XP until Level {currentLevel + 1}
          </div>
        </div>

        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '600' }}>Sign Streak</span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(239, 68, 68, 0.15)', color: '#EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Flame size={18} />
            </div>
          </div>
          <div style={{ fontSize: '28px', fontWeight: '800', color: '#EF4444' }}>{progress.streak || 1} Days</div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
            Active daily practice streak
          </div>
        </div>

        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '600' }}>Quiz High Score</span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(245, 158, 11, 0.15)', color: '#F59E0B', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Trophy size={18} />
            </div>
          </div>
          <div style={{ fontSize: '28px', fontWeight: '800', color: '#F59E0B' }}>{progress.highScore || 0} pts</div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
            {progress.quizzesCompleted || 0} Quizzes completed
          </div>
        </div>

        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '600' }}>Signs Mastered</span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(59, 130, 246, 0.15)', color: '#3B82F6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <BookOpen size={18} />
            </div>
          </div>
          <div style={{ fontSize: '28px', fontWeight: '800', color: '#3B82F6' }}>
            {(progress.learnedSigns || []).length} / 25
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
            SASL curriculum coverage
          </div>
        </div>

      </div>

      {/* Level Progress & Weekly Attendance Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.5fr) minmax(0, 1fr)', gap: '16px' }}>
        
        {/* Level Progression */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <h4 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-main)' }}>
              Mastery Tier & Level Progress
            </h4>
            <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--primary-emerald)' }}>
              {progressPercent}% to Level {currentLevel + 1}
            </span>
          </div>

          <div style={{ width: '100%', height: '12px', borderRadius: '8px', background: 'var(--border-light)', overflow: 'hidden', marginBottom: '16px' }}>
            <div
              style={{
                width: `${progressPercent}%`,
                height: '100%',
                background: 'var(--emerald-gradient)',
                borderRadius: '8px',
                transition: 'width 0.4s ease'
              }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-muted)' }}>
            <span>Level {currentLevel} (Novice)</span>
            <span>Level {currentLevel + 1} (Proficient SASL Signer)</span>
          </div>
        </div>

        {/* 7-Day Active Signing Tracker */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <Calendar size={18} color="var(--primary-emerald)" />
            <h4 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-main)' }}>Weekly Activity</h4>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px' }}>
            {daysOfWeek.map((day, idx) => {
              // Calculate day of week index where 0 is Monday and 6 is Sunday
              const todayDayIndex = (new Date().getDay() + 6) % 7; // Mon=0 .. Sun=6
              const streakDays = Math.max(1, Math.min(7, progress.streak || 1));
              const isToday = idx === todayDayIndex;
              // Active if it's within the recent streak window ending today
              const isActive = (idx <= todayDayIndex) && (todayDayIndex - idx < streakDays);
              
              return (
                <div key={day} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '10px',
                      background: isActive ? 'var(--mint-badge)' : 'var(--bg-card-subtle)',
                      border: `1.5px solid ${isToday ? 'var(--primary-emerald)' : (isActive ? 'var(--border-emerald)' : 'var(--border-light)')}`,
                      color: isActive ? 'var(--primary-emerald)' : 'var(--text-muted)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: '700',
                      fontSize: '13px',
                      position: 'relative'
                    }}
                  >
                    {isActive ? '✓' : '•'}
                    {isToday && (
                      <div style={{
                        position: 'absolute',
                        top: '-3px',
                        right: '-3px',
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: 'var(--primary-emerald)'
                      }} />
                    )}
                  </div>
                  <span style={{ fontSize: '11px', fontWeight: isToday ? '700' : '500', color: isToday ? 'var(--primary-emerald)' : 'var(--text-muted)' }}>
                    {day}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Achievements / Badges Showcase */}
      <div className="glass-card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <div>
            <h4 style={{ fontSize: '17px', fontWeight: '800', color: 'var(--text-main)' }}>
              Badges & Honors
            </h4>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Earn badges by learning vocabulary, maintaining streaks, and scoring in quizzes
            </p>
          </div>
          <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--primary-emerald)' }}>
            {BADGES.filter(b => b.unlocked).length} of {BADGES.length} Unlocked
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
          {BADGES.map((b) => (
            <div
              key={b.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '14px',
                borderRadius: '14px',
                background: b.unlocked ? 'var(--bg-card-subtle)' : 'transparent',
                border: `1px solid ${b.unlocked ? 'var(--border-emerald)' : 'var(--border-light)'}`,
                opacity: b.unlocked ? 1 : 0.55
              }}
            >
              <div
                style={{
                  fontSize: '26px',
                  width: '46px',
                  height: '46px',
                  borderRadius: '12px',
                  background: b.unlocked ? 'var(--mint-badge)' : 'var(--bg-card-subtle)',
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
                  <span style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-main)' }}>{b.name}</span>
                  {b.unlocked && <CheckCircle2 size={13} color="var(--primary-emerald)" />}
                </div>
                <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px', lineHeight: '1.3' }}>
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
