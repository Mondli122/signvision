import React, { useState } from 'react';
import { Mic, MicOff, Send, Sparkles, Volume2, ArrowRight } from 'lucide-react';

export default function ReverseTranslator({ onPlayAvatar }) {
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [resultGlosses, setResultGlosses] = useState([]);
  const [resultCards, setResultCards] = useState([]);

  const handleSpeechInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech Recognition is not supported in this browser. Please use Google Chrome or type text directly.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-ZA';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInputText(transcript);
      triggerReverseTranslation(transcript);
    };

    recognition.start();
  };

  const triggerReverseTranslation = (textToTranslate) => {
    const query = textToTranslate || inputText;
    if (!query.trim()) return;

    setIsTranslating(true);
    fetch('/api/translate-text', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: query })
    })
      .then(res => res.json())
      .then(data => {
        setIsTranslating(false);
        setResultGlosses(data.glosses || []);
        setResultCards(data.cards || []);
      })
      .catch(err => {
        setIsTranslating(false);
        console.warn('Reverse translation error:', err);
      });
  };

  return (
    <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#E0F2FE', color: '#0284C7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Volume2 size={22} />
          </div>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-main)' }}>Speech & Text to Sign Language</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Speak into your microphone or type English phrases to convert into visual SASL signs</p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 14px', borderRadius: '20px', background: 'var(--bg-card-subtle)', border: '1px solid var(--border-light)', fontSize: '13px', fontWeight: '700' }}>
          <Sparkles size={16} color="#0284C7" />
          <span>Bi-Directional Bridge</span>
        </div>
      </div>

      {/* Input Area */}
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && triggerReverseTranslation()}
          placeholder="Speak or type: 'Hello I need water and help please'..."
          style={{
            flex: 1,
            padding: '14px 18px',
            borderRadius: '14px',
            border: '1px solid var(--border-light)',
            background: 'var(--bg-card-subtle)',
            color: 'var(--text-main)',
            fontSize: '15px',
            fontWeight: '600',
            outline: 'none'
          }}
        />

        <button
          onClick={handleSpeechInput}
          style={{
            padding: '14px',
            borderRadius: '14px',
            border: 'none',
            background: isListening ? '#EF4444' : '#E0F2FE',
            color: isListening ? '#FFF' : '#0284C7',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s ease'
          }}
          title="Speak into Microphone"
        >
          {isListening ? <MicOff size={20} /> : <Mic size={20} />}
        </button>

        <button
          className="btn-primary"
          onClick={() => triggerReverseTranslation()}
          disabled={isTranslating}
          style={{ padding: '14px 22px' }}
        >
          <Send size={16} /> {isTranslating ? 'Translating...' : 'Convert to Signs'}
        </button>
      </div>

      {/* Gloss Sequence Chips */}
      {resultGlosses.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <span style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--primary-emerald)', letterSpacing: '0.5px' }}>
            Generated SASL Gloss Stream:
          </span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {resultGlosses.map((gloss, idx) => (
              <span
                key={idx}
                style={{
                  padding: '6px 14px',
                  borderRadius: '20px',
                  background: 'var(--mint-badge)',
                  color: 'var(--mint-text)',
                  fontSize: '13px',
                  fontWeight: '800',
                  border: '1px solid var(--border-emerald)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                {gloss}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Matched Visual Sign Cards */}
      {resultCards.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <span style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.5px' }}>
            Visual Sign Cards:
          </span>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '14px' }}>
            {resultCards.map(card => (
              <div
                key={card.id}
                className="clickable-card"
                style={{
                  padding: '16px',
                  background: 'var(--bg-card)',
                  borderRadius: '14px',
                  border: '1px solid var(--border-light)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}
              >
                <div style={{ fontSize: '32px' }}>{card.icon}</div>
                <div style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-main)' }}>{card.word}</div>
                <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--primary-emerald)' }}>GLOSS: {card.gloss}</div>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: '1.4' }}>{card.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
