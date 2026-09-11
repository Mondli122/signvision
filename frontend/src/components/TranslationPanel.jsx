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
    <div className="glass-card" style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: '12px', height: '100%', borderRadius: '16px', background: '#FFFFFF', border: '1px solid rgba(136, 204, 241, 0.4)', boxShadow: '0 4px 16px rgba(45, 137, 139, 0.06)' }}>
      
      {/* Mode Switcher Tabs */}
      <div style={{ display: 'flex', gap: '8px', background: '#F0F7FB', padding: '4px', borderRadius: '12px', border: '1px solid #C1DFF0' }}>
        <button
          onClick={() => setActiveTab('signToText')}
          style={{
            flex: 1,
            padding: '8px 14px',
            borderRadius: '10px',
            border: 'none',
            background: activeTab === 'signToText' ? '#2D848A' : 'transparent',
            color: activeTab === 'signToText' ? '#FFFFFF' : '#5C7B8A',
            fontWeight: '700',
            fontSize: '12.5px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            transition: 'all 0.15s',
            boxShadow: activeTab === 'signToText' ? '0 2px 6px rgba(45, 132, 138, 0.25)' : 'none'
          }}
        >
          <Hand size={14} />
          Sign → Text / Speech
        </button>

        <button
          onClick={() => setActiveTab('textToSign')}
          style={{
            flex: 1,
            padding: '8px 14px',
            borderRadius: '10px',
            border: 'none',
            background: activeTab === 'textToSign' ? '#2D848A' : 'transparent',
            color: activeTab === 'textToSign' ? '#FFFFFF' : '#5C7B8A',
            fontWeight: '700',
            fontSize: '12.5px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            transition: 'all 0.15s',
            boxShadow: activeTab === 'textToSign' ? '0 2px 6px rgba(45, 132, 138, 0.25)' : 'none'
          }}
        >
          <Mic size={14} />
          Voice / Text → Sign
        </button>
      </div>

      {/* From Language <-> To Language Interactive Selection Bar */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr auto 1fr auto',
          alignItems: 'center',
          gap: '12px',
          background: '#F0F7FB',
          padding: '10px 14px',
          borderRadius: '14px',
          border: '1px solid #C1DFF0'
        }}
      >
        {/* From Box */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: '#C1DFF0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2D848A' }}>
              <Hand size={11} />
            </div>
            <span style={{ fontSize: '11px', fontWeight: '800', color: '#2D848A' }}>
              From SASL <span style={{ fontSize: '9.5px', color: '#5C7B8A', fontWeight: '600' }}>(Sign Language)</span>
            </span>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: '#FFFFFF',
              border: '1px solid #C1DFF0',
              borderRadius: '8px',
              padding: '6px 10px',
              gap: '8px'
            }}
          >
            <span style={{ fontSize: '12px', fontWeight: '700', color: '#133340' }}>Detect from camera</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <ChevronDown size={14} color="#5C7B8A" />
              <button
                onClick={handleToggleMic}
                style={{
                  background: isListening ? '#FEE2E2' : '#C1DFF0',
                  border: 'none',
                  borderRadius: '6px',
                  width: '24px',
                  height: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: isListening ? '#DC2626' : '#2D848A',
                  marginLeft: '4px'
                }}
                title={isListening ? 'Listening...' : 'Use microphone'}
              >
                <Mic size={13} />
              </button>
            </div>
          </div>
        </div>

        {/* Swap Arrow Icon */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '16px' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: '#FFFFFF',
              border: '1px solid #C1DFF0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#2D848A',
              boxShadow: '0 2px 6px rgba(45, 132, 138, 0.1)'
            }}
          >
            <Repeat size={14} />
          </div>
        </div>

        {/* To Box */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: '#C1DFF0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2D848A' }}>
              <Globe size={11} />
            </div>
            <span style={{ fontSize: '11px', fontWeight: '800', color: '#2D848A' }}>
              To Language
            </span>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              background: '#FFFFFF',
              border: '1px solid #C1DFF0',
              borderRadius: '8px',
              padding: '2px 10px'
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
                padding: '6px 0',
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
              padding: '8px 16px',
              borderRadius: '8px',
              fontSize: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              whiteSpace: 'nowrap',
              background: '#2D848A'
            }}
          >
            <Repeat size={13} />
            <span>Translate</span>
          </button>
        </div>
      </div>

      {/* Live Translation Output & Quick Signs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.25fr) minmax(0, 1fr)', gap: '12px', alignItems: 'stretch' }}>
        
        {/* Left: Live Output Box */}
        <div
          style={{
            background: '#FFFFFF',
            border: '1px solid #C1DFF0',
            borderRadius: '14px',
            padding: '14px 16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            boxShadow: '0 2px 8px rgba(45, 137, 139, 0.04)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '11.5px', fontWeight: '800', color: '#2D848A', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#2D898B' }} />
              Live Translation Output
            </span>
            <span style={{ fontSize: '11px', fontWeight: '700', color: '#2D848A', background: '#C1DFF0', padding: '3px 8px', borderRadius: '9999px' }}>
              {targetLanguage}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
            <h3 style={{ fontSize: '17px', fontWeight: '800', color: '#133340', lineHeight: '1.3', margin: 0 }}>
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

          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '6px', marginTop: 'auto', paddingTop: '6px', borderTop: '1px solid #F0F7FB' }}>
            <span style={{ fontSize: '10.5px', color: '#5C7B8A' }}>Other languages:</span>
            {languages.slice(1).map((l) => (
              <span
                key={l}
                onClick={() => onSelectLanguage && onSelectLanguage(l)}
                style={{
                  fontSize: '10px',
                  fontWeight: '700',
                  padding: '3px 8px',
                  borderRadius: '9999px',
                  background: '#F0F7FB',
                  color: '#2D848A',
                  cursor: 'pointer',
                  border: '1px solid #C1DFF0'
                }}
              >
                {l}
              </span>
            ))}
          </div>
        </div>

        {/* Right: Quick Signs */}
        <div
          style={{
            background: '#FFFFFF',
            border: '1px solid #C1DFF0',
            borderRadius: '14px',
            padding: '14px 16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            boxShadow: '0 2px 8px rgba(45, 137, 139, 0.04)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '11.5px', fontWeight: '800', color: '#133340' }}>⭐ Quick Signs</span>
            <span style={{ fontSize: '10.5px', color: '#5C7B8A' }}>Popular SASL signs</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '6px' }}>
            {[
              { gloss: 'HELLO', label: 'Hello', icon: '👋', bg: '#DDF2FB', color: '#2D848A' },
              { gloss: 'HELP', label: 'Help', icon: '🆘', bg: '#D5F0EC', color: '#2D848A' },
              { gloss: 'WATER', label: 'Water', icon: '💧', bg: '#E2EBF8', color: '#2D848A' },
              { gloss: 'THANK YOU', label: 'Thank You', icon: '🙏', bg: '#EAE5F8', color: '#2D848A' },
              { gloss: 'EMERGENCY', label: 'SOS', icon: '🚨', bg: '#FCEAE6', color: '#DC2626' },
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
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '8px 4px',
                  borderRadius: '10px',
                  background: qs.bg,
                  border: '1px solid rgba(45, 132, 138, 0.12)',
                  color: qs.color,
                  cursor: 'pointer',
                  fontSize: '10.5px',
                  fontWeight: '700',
                  gap: '4px',
                  transition: 'transform 0.15s ease'
                }}
              >
                <span style={{ fontSize: '16px' }}>{qs.icon}</span>
                <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%' }}>{qs.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Live Gloss Sequence Stream */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '12px', fontWeight: '800', color: '#133340', fontFamily: 'var(--font-heading)' }}>
            Gloss Sequence Stream
          </span>
          <span style={{ fontSize: '11px', color: '#2D848A', fontWeight: '700' }}>
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
                fontWeight: '800'
              }}
            >
              {gloss}
            </span>
          ))}
          {glossSequence.length === 0 && (
            <span style={{ fontSize: '12px', color: '#5C7B8A', fontStyle: 'italic' }}>
              Perform a gesture in front of the camera to translate...
            </span>
          )}
        </div>
      </div>

      {/* Action Buttons Bar */}
      <div style={{ display: 'flex', gap: '10px', marginTop: 'auto' }}>
        <button className="btn-outline" onClick={onClear} style={{ flex: 1, justifyContent: 'center', padding: '9px', fontSize: '13px', borderRadius: '10px' }}>
          <Trash2 size={15} /> Clear
        </button>
        <button className="btn-outline" onClick={onSave} style={{ flex: 1, justifyContent: 'center', padding: '9px', fontSize: '13px', borderRadius: '10px' }}>
          <Bookmark size={15} /> Save
        </button>
        <button className="btn-primary" onClick={onTranslate} style={{ flex: 1.2, justifyContent: 'center', padding: '9px', fontSize: '13px', borderRadius: '10px' }}>
          <Repeat size={15} /> Translate
        </button>
      </div>

    </div>
  );
}
