import React, { useState } from 'react';
import { Volume2, Play, Pause, Trash2, Bookmark, Repeat, Mic, Hand, Globe } from 'lucide-react';
import AudioVisualizer from './AudioVisualizer';
import { toast } from '../utils/toast';

export default function TranslationPanel({
  glossSequence = ['HELLO', 'WHERE', 'HELP'],
  translatedText = 'Hello! Where is it? I need help.',
  targetLanguage = 'English',
  onSelectLanguage,
  onClear,
  onSave,
  onTranslate
}) {
  const [activeTab, setActiveTab] = useState('signToText');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const languages = ['English', 'isiZulu', 'isiXhosa', 'Afrikaans', 'Sesotho'];


  const handleToggleMic = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      toast.warning('Speech recognition is supported in Chrome, Edge, and Safari.', 'Speech Recognition');
      return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;

    if (!isListening) {
      setIsListening(true);
      recognition.start();
      recognition.onresult = (event) => {
        const spokenText = event.results[0][0].transcript;
        fetch('/api/translate-text', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: spokenText })
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.glosses) {
              onTranslate(data.glosses, spokenText);
            }
          });
        setIsListening(false);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
    } else {
      setIsListening(false);
    }
  };


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

      {/* Multilingual SA Target Language Selector Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0, 168, 132, 0.08)', padding: '8px 14px', borderRadius: '10px', border: '1px solid rgba(0, 168, 132, 0.2)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 'bold', color: '#00A884' }}>
          <Globe size={16} />
          <span>Output SA Language:</span>
        </div>
        <select
          value={targetLanguage}
          onChange={(e) => onSelectLanguage && onSelectLanguage(e.target.value)}
          style={{
            background: '#FFFFFF',
            border: '1px solid #00A884',
            borderRadius: '8px',
            padding: '4px 10px',
            fontSize: '0.85rem',
            fontWeight: 'bold',
            color: '#0F172A',
            cursor: 'pointer'
          }}
        >
          {languages.map((lang) => (
            <option key={lang} value={lang}>
              {lang}
            </option>
          ))}
        </select>
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

          <button
            onClick={handleToggleMic}
            style={{
              background: isListening ? '#ef4444' : 'none',
              border: 'none',
              color: isListening ? '#FFFFFF' : '#64748B',
              padding: '4px',
              borderRadius: '50%',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Mic size={18} />
          </button>
          <Volume2 size={18} color="#64748B" />
        </div>

        {/* Live Microphone Audio Frequency Waveform Visualizer */}
        <AudioVisualizer isListening={isListening} />
      </div>

      {/* Gloss Sequence Chips with Sign-to-Emoji Mapper */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-main)', fontFamily: 'var(--font-heading)' }}>
            Gloss Sequence Stream
          </span>
          <span style={{ fontSize: '11px', color: 'var(--primary-emerald)', fontWeight: '700' }}>
            ⚡ Live Sign-to-Emoji
          </span>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', minHeight: '38px', alignItems: 'center' }}>
          {glossSequence.map((gloss, idx) => {
            const emojiMap = {
              'HELLO': '👋',
              'THANK YOU': '🙏',
              'HELP': '🆘',
              'WATER': '💧',
              'I LOVE YOU': '🤟',
              'YES': '👍',
              'NO': '🙅‍♂️',
              'WHERE': '❓',
              'PLEASE': '🤲',
              'SORRY': '😔',
              'FOOD': '🍲',
              'DRINK': '🥤',
              'FAMILY': '👨‍👩‍👧‍👦',
              'FRIEND': '🧑‍🤝‍🧑',
              'SCHOOL': '🏫'
            };
            const emoji = emojiMap[gloss.toUpperCase()] || '✋';
            return (
              <span
                key={idx}
                style={{
                  background: 'var(--mint-badge)',
                  color: 'var(--mint-text)',
                  border: '1px solid var(--border-emerald)',
                  padding: '6px 14px',
                  borderRadius: '10px',
                  fontSize: '12px',
                  fontWeight: '700',
                  fontFamily: 'var(--font-heading)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
                }}
              >
                <span>{emoji}</span>
                <span>{gloss}</span>
              </span>
            );
          })}
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
