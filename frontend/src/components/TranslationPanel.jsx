import React, { useState } from 'react';
import { Volume2, Play, Pause, Trash2, Bookmark, Repeat, Mic, Hand, Globe, ChevronDown } from 'lucide-react';
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
    <div className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px', height: '100%' }}>
      
      {/* Mode Switcher Tabs */}
      <div style={{ display: 'flex', gap: '8px', background: '#F0F7FB', padding: '4px', borderRadius: '12px', border: '1px solid #D0E5F0' }}>
        <button
          onClick={() => setActiveTab('signToText')}
          style={{
            flex: 1,
            padding: '8px 12px',
            borderRadius: '10px',
            border: 'none',
            background: activeTab === 'signToText' ? '#2D848A' : 'transparent',
            color: activeTab === 'signToText' ? '#FFFFFF' : '#5C7B8A',
            fontWeight: '700',
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
            background: activeTab === 'textToSign' ? '#2D848A' : 'transparent',
            color: activeTab === 'textToSign' ? '#FFFFFF' : '#5C7B8A',
            fontWeight: '700',
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
          Voice / Text → Sign
        </button>
      </div>

      {/* From Language <-> To Language Interactive Selection Bar (From Design Mockup) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr auto 1fr auto',
          alignItems: 'center',
          gap: '12px',
          background: '#F0F7FB',
          padding: '10px 14px',
          borderRadius: '16px',
          border: '1px solid #D0E5F0'
        }}
      >
        {/* From Box */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: '#C1DFF0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2D848A' }}>
              <Hand size={11} />
            </div>
            <span style={{ fontSize: '11px', fontWeight: '800', color: '#3587A4' }}>
              From SASL <span style={{ fontSize: '9.5px', color: '#64748B', fontWeight: '600' }}>(Sign Language)</span>
            </span>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: '#FFFFFF',
              border: '1px solid #C1DFF0',
              borderRadius: '10px',
              padding: '6px 10px',
              gap: '6px'
            }}
          >
            <span style={{ fontSize: '12px', fontWeight: '700', color: '#133340' }}>Detect from camera</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <ChevronDown size={14} color="#5C7B8A" />
              <button
                onClick={handleToggleMic}
                style={{
                  background: isListening ? '#FEE2E2' : '#E0F2FE',
                  border: 'none',
                  borderRadius: '50%',
                  width: '22px',
                  height: '22px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: isListening ? '#EF4444' : '#2D848A',
                  marginLeft: '4px'
                }}
                title={isListening ? 'Listening...' : 'Use microphone'}
              >
                <Mic size={12} />
              </button>
            </div>
          </div>
        </div>

        {/* Swap Arrow Icon */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '16px' }}>
          <div
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              background: '#FFFFFF',
              border: '1px solid #C1DFF0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#2D848A',
              boxShadow: '0 1px 4px rgba(45, 132, 138, 0.1)'
            }}
          >
            <Repeat size={13} />
          </div>
        </div>

        {/* To Box */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: '#C1DFF0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2D848A' }}>
              <Globe size={11} />
            </div>
            <span style={{ fontSize: '11px', fontWeight: '800', color: '#3587A4' }}>
              To Language
            </span>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              background: '#FFFFFF',
              border: '1px solid #C1DFF0',
              borderRadius: '10px',
              padding: '2px 8px'
            }}
          >
            <select
              value={targetLanguage}
              onChange={(e) => onSelectLanguage && onSelectLanguage(e.target.value)}
              style={{
                width: '100%',
                border: 'none',
                background: 'transparent',
                outline: 'none',
                padding: '5px 0',
                fontSize: '12px',
                fontWeight: '700',
                color: '#133340',
                cursor: 'pointer'
              }}
            >
              {languages.map((lang) => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Translate Button */}
        <div style={{ marginTop: '16px' }}>
          <button
            onClick={onTranslate}
            className="btn-primary"
            style={{
              padding: '7px 14px',
              borderRadius: '10px',
              fontSize: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              whiteSpace: 'nowrap'
            }}
          >
            <Repeat size={13} />
            <span>Translate</span>
          </button>
        </div>
      </div>

      {/* Live Translation Output & Quick Signs 2-Column Section (From Mockup) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 1fr)', gap: '12px', alignItems: 'stretch' }}>
        
        {/* Left: Live Output Speech Bubble */}
        <div
          style={{
            background: '#FFFFFF',
            border: '1.5px solid #C1DFF0',
            borderRadius: '16px',
            padding: '14px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            boxShadow: '0 2px 10px rgba(45, 137, 139, 0.05)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', fontWeight: '700', color: '#5C7B8A', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#2D898B' }} />
              Live Translation Output
            </span>
            <span style={{ fontSize: '11px', fontWeight: '700', color: '#2D848A', background: '#C1DFF0', padding: '2px 8px', borderRadius: '10px' }}>
              {targetLanguage}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#133340', lineHeight: '1.3' }}>
              "{translatedText}"
            </h3>
            <button
              onClick={handlePlayAudio}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: '#C1DFF0',
                border: 'none',
                color: '#2D848A',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                flexShrink: 0
              }}
              title="Speak translated text"
            >
              <Volume2 size={16} />
            </button>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '6px', marginTop: 'auto', paddingTop: '6px', borderTop: '1px solid #EAF3F8' }}>
            <span style={{ fontSize: '10px', color: '#5C7B8A' }}>Other languages:</span>
            {languages.slice(1).map((l) => (
              <span
                key={l}
                onClick={() => onSelectLanguage && onSelectLanguage(l)}
                style={{
                  fontSize: '10px',
                  fontWeight: '600',
                  padding: '2px 6px',
                  borderRadius: '6px',
                  background: '#F0F7FB',
                  color: '#2D848A',
                  cursor: 'pointer'
                }}
              >
                {l}
              </span>
            ))}
          </div>
        </div>

        {/* Right: Quick Signs (Hello, Help, Water, Thank You, Emergency) */}
        <div
          style={{
            background: '#FFFFFF',
            border: '1.5px solid #C1DFF0',
            borderRadius: '16px',
            padding: '14px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', fontWeight: '700', color: '#133340' }}>⭐ Quick Signs</span>
            <span style={{ fontSize: '10px', color: '#5C7B8A' }}>Popular SASL</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '4px' }}>
            {[
              { gloss: 'HELLO', label: 'Hello', icon: '👋', bg: '#C1DFF0', color: '#2D848A' },
              { gloss: 'HELP', label: 'Help', icon: '🆘', bg: '#C1DFF0', color: '#2D848A' },
              { gloss: 'WATER', label: 'Water', icon: '💧', bg: '#C1DFF0', color: '#2D848A' },
              { gloss: 'THANK YOU', label: 'Thank You', icon: '🙏', bg: '#C1DFF0', color: '#2D848A' },
              { gloss: 'EMERGENCY', label: 'Emergency', icon: '🚨', bg: '#FEE2E2', color: '#DC2626' },
            ].map((qs) => (
              <button
                key={qs.label}
                onClick={() => {
                  fetch('/api/translate-text', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ text: qs.label })
                  })
                    .then(res => res.json())
                    .then(d => {
                      if (d.glosses) onTranslate(d.glosses, qs.label);
                    });
                }}
                style={{
                  padding: '6px 2px',
                  borderRadius: '10px',
                  border: '1px solid #D0E5F0',
                  background: qs.bg,
                  color: qs.color,
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '2px',
                  fontSize: '9.5px',
                  fontWeight: '700'
                }}
              >
                <span style={{ fontSize: '16px' }}>{qs.icon}</span>
                <span>{qs.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Live Gloss Sequence Stream */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '12px', fontWeight: '700', color: '#133340', fontFamily: 'var(--font-heading)' }}>
            Gloss Sequence Stream
          </span>
          <span style={{ fontSize: '11px', color: '#2D898B', fontWeight: '700' }}>
            ● Active MediaPipe Multi-Hand
          </span>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', minHeight: '34px', alignItems: 'center' }}>
          {glossSequence.map((gloss, idx) => (
            <span
              key={idx}
              style={{
                background: '#C1DFF0',
                color: '#2D848A',
                border: '1px solid #88CCF1',
                padding: '4px 10px',
                borderRadius: '8px',
                fontSize: '11.5px',
                fontWeight: '800',
                fontFamily: 'var(--font-heading)'
              }}
            >
              {gloss}
            </span>
          ))}
        </div>
      </div>

      {/* Action Buttons Bar */}
      <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
        <button className="btn-outline" onClick={onClear} style={{ flex: 1, justifyContent: 'center', padding: '8px', fontSize: '12.5px' }}>
          <Trash2 size={14} /> Clear
        </button>
        <button className="btn-outline" onClick={onSave} style={{ flex: 1, justifyContent: 'center', padding: '8px', fontSize: '12.5px' }}>
          <Bookmark size={14} /> Save
        </button>
        <button className="btn-primary" onClick={onTranslate} style={{ flex: 1.2, justifyContent: 'center', padding: '8px', fontSize: '12.5px' }}>
          <Repeat size={14} /> Translate
        </button>
      </div>

    </div>
  );
}
