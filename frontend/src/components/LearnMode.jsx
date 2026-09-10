import React, { useState } from 'react';
import { GraduationCap, CheckCircle, BookOpen, Sparkles, ChevronRight, Award } from 'lucide-react';
import { markSignLearned, addXP } from '../utils/storage';

const MODULES = [
  {
    id: 'alphabet',
    title: 'Module 1: SASL Manual Alphabet & Fingerspelling',
    description: 'Master manual letterforms A-Z essential for spelling names, technical terms, and South African cities.',
    level: 'Beginner',
    signs: [
      { id: 'letter_a', word: 'Letter A', gloss: 'A', icon: '🅰️', desc: 'Fist with thumb resting firmly against the side of the index finger.' },
      { id: 'letter_b', word: 'Letter B', gloss: 'B', icon: '🔤', desc: 'Four fingers extended together upwards with thumb folded across the palm.' },
      { id: 'letter_c', word: 'Letter C', gloss: 'C', icon: '🔤', desc: 'Curved hand resembling the shape of the letter C.' },
      { id: 'letter_l', word: 'Letter L', gloss: 'L', icon: '🔤', desc: 'Index finger pointing up, thumb sticking straight out sideways.' },
      { id: 'letter_y', word: 'Letter Y', gloss: 'Y', icon: '🤙', desc: 'Thumb and pinky extended wide, middle three fingers folded tight.' },
      { id: 'letter_v', word: 'Letter V', gloss: 'V', icon: '✌️', desc: 'Index and middle fingers extended apart in a V-shape.' }
    ]
  },
  {
    id: 'greetings',
    title: 'Module 2: Daily Greetings & Etiquette',
    description: 'Polite everyday phrases to communicate smoothly with Deaf community members across South Africa.',
    level: 'Beginner',
    signs: [
      { id: 'hello', word: 'Hello', gloss: 'HELLO', icon: '👋', desc: 'Open flat hand near temple waving outward warmly.' },
      { id: 'thank_you', word: 'Thank You', gloss: 'THANK YOU', icon: '🙏', desc: 'Fingertips to chin, moving forward and outward.' },
      { id: 'please', word: 'Please', gloss: 'PLEASE', icon: '🤲', desc: 'Open palm rubbing chest in a smooth circular clockwise path.' },
      { id: 'sorry', word: 'Sorry', gloss: 'SORRY', icon: '😔', desc: 'Closed fist rubbed over center of chest in a circular motion.' },
      { id: 'good', word: 'Good', gloss: 'GOOD', icon: '🌟', desc: 'Touch fingertips to chin and bring hand down flat onto open palm.' }
    ]
  },
  {
    id: 'emergency',
    title: 'Module 3: Emergency & Urgent First-Response',
    description: 'Crucial life-saving SASL signs for medical alerts, fire, police, and rapid distress assistance.',
    level: 'Intermediate',
    signs: [
      { id: 'help', word: 'Help', gloss: 'HELP', icon: '🆘', desc: 'Fist with thumb up placed on flat palm and lifted upwards together.' },
      { id: 'water', word: 'Water', gloss: 'WATER', icon: '💧', desc: 'W-handshape tapping against chin twice.' },
      { id: 'need', word: 'Need / Must', gloss: 'NEED', icon: '⚠️', desc: 'Hooked index finger moving downward with emphasis.' },
      { id: 'stop', word: 'Stop / Wait', gloss: 'STOP', icon: '✊', desc: 'Firm closed fist held stationary in front of body.' },
      { id: 'where', word: 'Where?', gloss: 'WHERE', icon: '❓', desc: 'Both palms held face up, tilting side to side inquiringly.' }
    ]
  }
];

export default function LearnMode({ onInspectSign }) {
  const [activeModuleId, setActiveModuleId] = useState('alphabet');
  const [completedSigns, setCompletedSigns] = useState(() => {
    const p = getProgress();
    return Array.from(new Set([...(p.learnedSigns || []), 'letter_a', 'hello']));
  });

  const activeModule = MODULES.find(m => m.id === activeModuleId) || MODULES[0];

  const handleCompleteSign = (sign) => {
    if (!completedSigns.includes(sign.id)) {
      setCompletedSigns(prev => [...prev, sign.id]);
      markSignLearned(sign.id, sign.word);
    }
  };

  return (
    <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'var(--mint-badge)', color: 'var(--primary-emerald)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <GraduationCap size={22} />
          </div>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-main)' }}>SASL Guided Learning Academy</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Interactive curriculum aligned with South African Sign Language standards</p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 14px', borderRadius: '20px', background: 'var(--bg-card-subtle)', border: '1px solid var(--border-light)', fontSize: '13px', fontWeight: '700' }}>
          <Sparkles size={16} color="#EAB308" />
          <span>{completedSigns.length} / {MODULES.reduce((acc, m) => acc + m.signs.length, 0)} Signs Mastered</span>
        </div>
      </div>

      {/* Module Selector Tabs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
        {MODULES.map(module => {
          const isActive = activeModuleId === module.id;
          return (
            <button
              key={module.id}
              onClick={() => setActiveModuleId(module.id)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                padding: '14px',
                borderRadius: '14px',
                border: `2px solid ${isActive ? 'var(--primary-emerald)' : 'var(--border-light)'}`,
                background: isActive ? 'var(--mint-badge)' : 'var(--bg-card)',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.15s ease'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: '4px' }}>
                <span style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', color: isActive ? 'var(--mint-text)' : 'var(--text-muted)' }}>
                  {module.level}
                </span>
                <span style={{ fontSize: '11px', fontWeight: '700', color: isActive ? 'var(--primary-emerald)' : 'var(--text-muted)' }}>
                  {module.signs.length} signs
                </span>
              </div>
              <div style={{ fontSize: '14px', fontWeight: '700', color: isActive ? 'var(--mint-text)' : 'var(--text-main)', marginBottom: '4px' }}>
                {module.title}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: '1.3' }}>
                {module.description}
              </div>
            </button>
          );
        })}
      </div>

      {/* Signs Cards in Active Module */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <h4 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-main)' }}>
          Signs in this Module:
        </h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '14px' }}>
          {activeModule.signs.map(sign => {
            const isDone = completedSigns.includes(sign.id);
            return (
              <div
                key={sign.id}
                className="clickable-card"
                style={{
                  padding: '16px',
                  background: 'var(--bg-card)',
                  borderRadius: '14px',
                  border: '1px solid var(--border-light)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: '28px' }}>{sign.icon}</div>
                  <button
                    onClick={() => handleCompleteSign(sign)}
                    style={{
                      border: 'none',
                      background: isDone ? '#D1FAE5' : 'var(--bg-card-subtle)',
                      color: isDone ? '#047857' : 'var(--text-muted)',
                      padding: '4px 10px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    {isDone ? <CheckCircle size={14} color="#10B981" /> : null}
                    {isDone ? 'Mastered (+25 XP)' : 'Mark Learned'}
                  </button>
                </div>

                <div>
                  <div style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-main)' }}>{sign.word}</div>
                  <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--primary-emerald)' }}>GLOSS: {sign.gloss}</div>
                </div>

                <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                  {sign.desc}
                </p>

                <button
                  className="btn-outline"
                  style={{ width: '100%', justifyContent: 'center', padding: '8px', fontSize: '13px', marginTop: 'auto' }}
                  onClick={() => onInspectSign && onInspectSign(sign)}
                >
                  <BookOpen size={14} /> Practice Sign View
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
