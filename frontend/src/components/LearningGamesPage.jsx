import React, { useState } from 'react';
import LearnMode from './LearnMode';
import QuizGame from './QuizGame';
import DatasetRecorder from './DatasetRecorder';
import { GraduationCap, Gamepad2, Database, Sparkles } from 'lucide-react';

export default function LearningGamesPage({ onInspectSign }) {
  const [subTab, setSubTab] = useState('academy'); // 'academy' | 'quiz' | 'recorder'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', width: '100%' }}>
      {/* Top Learning Switcher Bar */}
      <div
        className="glass-card"
        style={{
          padding: '14px 20px',
          borderRadius: '16px',
          background: '#FFFFFF',
          border: '1px solid rgba(136, 204, 241, 0.4)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          boxShadow: '0 4px 16px rgba(45, 137, 139, 0.06)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            background: '#E6F4FA',
            color: '#2D848A',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Gamepad2 size={20} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '800', color: '#133340' }}>
              Learning & Gamified Practice Hub
            </h3>
            <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#5C7B8A' }}>
              Master South African Sign Language through structured courses and interactive games
            </p>
          </div>
        </div>

        {/* Tab Buttons */}
        <div style={{ display: 'flex', background: '#F0F7FB', borderRadius: '10px', padding: '3px', border: '1px solid #C1DFF0' }}>
          <button
            onClick={() => setSubTab('academy')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '7px 14px',
              borderRadius: '8px',
              border: 'none',
              background: subTab === 'academy' ? '#2D848A' : 'transparent',
              color: subTab === 'academy' ? '#FFFFFF' : '#5C7B8A',
              fontSize: '12.5px',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            <GraduationCap size={15} /> Guided Academy
          </button>
          <button
            onClick={() => setSubTab('quiz')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '7px 14px',
              borderRadius: '8px',
              border: 'none',
              background: subTab === 'quiz' ? '#2D848A' : 'transparent',
              color: subTab === 'quiz' ? '#FFFFFF' : '#5C7B8A',
              fontSize: '12.5px',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            <Sparkles size={15} /> Speed Quiz Game
          </button>
          <button
            onClick={() => setSubTab('recorder')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '7px 14px',
              borderRadius: '8px',
              border: 'none',
              background: subTab === 'recorder' ? '#2D848A' : 'transparent',
              color: subTab === 'recorder' ? '#FFFFFF' : '#5C7B8A',
              fontSize: '12.5px',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            <Database size={15} /> Community Sign Studio
          </button>
        </div>
      </div>

      {/* Render Sub Tab */}
      {subTab === 'academy' && (
        <LearnMode onInspectSign={onInspectSign} />
      )}

      {subTab === 'quiz' && (
        <QuizGame onBackToHome={() => setSubTab('academy')} />
      )}

      {subTab === 'recorder' && (
        <DatasetRecorder />
      )}
    </div>
  );
}
