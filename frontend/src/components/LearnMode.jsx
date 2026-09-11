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
    return ['letter_a', 'hello'];
  });

  const activeModule = MODULES.find(m => m.id === activeModuleId) || MODULES[0];

  const handleCompleteSign = (sign) => {
    if (!completedSigns.includes(sign.id)) {
      setCompletedSigns(prev => [...prev, sign.id]);
      markSignLearned(sign.id, sign.word);
      addXP(25);
    }
  };

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
          <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: '#E6F4FA', color: '#2D848A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <GraduationCap size={22} />
          </div>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#133340', margin: 0 }}>SASL Guided Learning Academy</h3>
            <p style={{ fontSize: '12.5px', color: '#5C7B8A', margin: '2px 0 0 0' }}>Interactive curriculum aligned with South African Sign Language standards</p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 14px', borderRadius: '20px', background: '#F0F7FB', border: '1px solid #C1DFF0', fontSize: '12.5px', fontWeight: '700', color: '#133340' }}>
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
                borderRadius: '12px',
                border: `2px solid ${isActive ? '#2D848A' : '#C1DFF0'}`,
                background: isActive ? '#E6F4FA' : '#F8FBFC',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.15s ease'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: '4px' }}>
                <span style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', color: isActive ? '#2D848A' : '#5C7B8A' }}>
                  {module.level}
                </span>
                <span style={{ fontSize: '11px', fontWeight: '700', color: isActive ? '#2D848A' : '#5C7B8A' }}>
                  {module.signs.length} signs
                </span>
              </div>
              <div style={{ fontSize: '14px', fontWeight: '800', color: isActive ? '#2D848A' : '#133340', marginBottom: '4px' }}>
                {module.title}
              </div>
              <div style={{ fontSize: '12px', color: '#5C7B8A', lineHeight: '1.35' }}>
                {module.description}
              </div>
            </button>
          );
        })}
      </div>

      {/* Signs Cards in Active Module */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <h4 style={{ fontSize: '15px', fontWeight: '800', color: '#133340', margin: 0 }}>
          Signs in this Module:
        </h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '12px' }}>
          {activeModule.signs.map(sign => {
            const isDone = completedSigns.includes(sign.id);
            return (
              <div
                key={sign.id}
                style={{
                  padding: '16px',
                  background: '#FFFFFF',
                  borderRadius: '12px',
                  border: '1px solid #C1DFF0',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: '26px' }}>{sign.icon}</div>
                  <button
                    onClick={() => handleCompleteSign(sign)}
                    style={{
                      border: 'none',
                      background: isDone ? '#D1FAE5' : '#F0F7FB',
                      color: isDone ? '#065F46' : '#5C7B8A',
                      padding: '4px 10px',
                      borderRadius: '8px',
                      fontSize: '11.5px',
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
                  <div style={{ fontSize: '15px', fontWeight: '800', color: '#133340' }}>{sign.word}</div>
                  <div style={{ fontSize: '11.5px', fontWeight: '700', color: '#2D848A' }}>GLOSS: {sign.gloss}</div>
                </div>

                <p style={{ fontSize: '12px', color: '#5C7B8A', lineHeight: '1.4', margin: 0 }}>
                  {sign.desc}
                </p>

                <button
                  style={{
                    width: '100%',
                    padding: '8px',
                    fontSize: '12px',
                    fontWeight: '700',
                    marginTop: 'auto',
                    borderRadius: '8px',
                    border: '1px solid #C1DFF0',
                    background: '#F0F7FB',
                    color: '#2D848A',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
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
