import React, { useState } from 'react';
import { Volume2, Play, Pause, Trash2, Bookmark, Repeat, Mic, Hand } from 'lucide-react';

export default function TranslationPanel({
  glossSequence = ['HELLO', 'HOW', 'ARE', 'YOU'],
  translatedText = 'Hello! How are you?',
  onClear,
  onSave,
  onTranslate
}) {
  const [activeTab, setActiveTab] = useState('signToText');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const handlePlayAudio = () => {
    if ('speechSynthesis' in window) {
      if (isPlayingAudio) {
        window.speechSynthesis.cancel();
        setIsPlayingAudio(false);
      } else {
        const utterance = new SpeechSynthesisUtterance(translatedText);
        utterance.onend = () => setIsPlayingAudio(false);
        utterance.onerror = () => setIsPlayingAudio(false);
        setIsPlayingAudio(true);
        window.speechSynthesis.speak(utterance);
      }
    }
  };

  return (
    <div className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px', height: '100%' }}>
      
      {/* Mode Switcher Tabs */}
      <div style={{ display: 'flex', gap: '8px', background: '#F1F5F9', padding: '4px', borderRadius: '12px' }}>
        <button
          onClick={() => setActiveTab('signToText')}
          style={{
            flex: 1,
            padding: '8px 12px',
            borderRadius: '10px',
            border: 'none',
            background: activeTab === 'signToText' ? '#00A884' : 'transparent',
            color: activeTab === 'signToText' ? '#FFFFFF' : '#475569',
            fontWeight: '600',
            fontSize: '13px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            transition: 'all 0.2s'
          }}
        >
          <Hand size={15} />
          Sign → Text / Speech
        </button>

        <button
          onClick={() => setActiveTab('textToSign')}
          style={{
            flex: 1,
            padding: '8px 12px',
            borderRadius: '10px',
            border: 'none',
            background: activeTab === 'textToSign' ? '#00A884' : 'transparent',
            color: activeTab === 'textToSign' ? '#FFFFFF' : '#475569',
            fontWeight: '600',
            fontSize: '13px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            transition: 'all 0.2s'
          }}
        >
          <Mic size={15} />
          Text / Speech → Sign
        </button>
      </div>

      {/* Main Translation Output Card */}
      <div style={{
        background: '#F8FAFC',
        border: '1px solid #E2E8F0',
        borderRadius: '16px',
        padding: '16px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            background: '#D1FAE5',
            color: '#00A884',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Hand size={24} />
          </div>

          <div style={{ flex: 1 }}>
            <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#0F172A', fontFamily: 'var(--font-heading)', lineHeight: '1.1' }}>
              {glossSequence.length > 0 ? glossSequence[0] : 'READY'}
            </h2>
            <p style={{ fontSize: '14px', color: '#475569', fontWeight: '500', fontStyle: 'italic', marginTop: '2px' }}>
              "{translatedText}"
            </p>
          </div>
        </div>

        {/* Speech Audio Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          background: '#FFFFFF',
          padding: '8px 14px',
          borderRadius: '9999px',
          border: '1px solid #E2E8F0',
          marginTop: '4px'
        }}>
          <button
            onClick={handlePlayAudio}
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              background: '#00A884',
              border: 'none',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            {isPlayingAudio ? <Pause size={14} /> : <Play size={14} style={{ marginLeft: '1px' }} />}
          </button>

          {/* Audio Wave Line Bar */}
          <div style={{ flex: 1, height: '6px', background: '#E2E8F0', borderRadius: '3px', position: 'relative', overflow: 'hidden' }}>
            <div style={{
              width: isPlayingAudio ? '100%' : '60%',
              height: '100%',
              background: '#00A884',
              borderRadius: '3px',
              transition: isPlayingAudio ? 'width 2.5s linear' : 'width 0.3s'
            }} />
          </div>

          <Volume2 size={18} color="#64748B" />
        </div>
      </div>

      {/* Gloss Sequence Chips */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <span style={{ fontSize: '13px', fontWeight: '700', color: '#334155', fontFamily: 'var(--font-heading)' }}>
          Gloss Sequence
        </span>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', minHeight: '38px', alignItems: 'center' }}>
          {glossSequence.map((gloss, idx) => (
            <span
              key={idx}
              style={{
                background: '#EFF6FF',
                color: '#1D4ED8',
                border: '1px solid #BFDBFE',
                padding: '6px 14px',
                borderRadius: '10px',
                fontSize: '12px',
                fontWeight: '700',
                fontFamily: 'var(--font-heading)',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)'
              }}
            >
              {gloss}
            </span>
          ))}
        </div>
      </div>

      {/* Action Buttons Bar */}
      <div style={{ display: 'flex', gap: '10px', marginTop: 'auto' }}>
        <button className="btn-outline" onClick={onClear} style={{ flex: 1, justifyContent: 'center', padding: '9px 12px', fontSize: '13px' }}>
          <Trash2 size={15} />
          Clear
        </button>

        <button className="btn-outline" onClick={onSave} style={{ flex: 1, justifyContent: 'center', padding: '9px 12px', fontSize: '13px' }}>
          <Bookmark size={15} />
          Save
        </button>

        <button className="btn-primary" onClick={onTranslate} style={{ flex: 1.2, justifyContent: 'center', padding: '9px 14px', fontSize: '13px' }}>
          <Repeat size={15} />
          Translate
        </button>
      </div>

    </div>
  );
}
