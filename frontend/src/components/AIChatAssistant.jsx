import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, Bot, User, Sparkles, X, Lightbulb } from 'lucide-react';

export default function AIChatAssistant({ onClose }) {
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: 'Sawubona! I am your AI South African Sign Language Tutor. Ask me how to sign any word, cultural etiquette, or provincial dialect differences in SASL!'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = async (textToSend) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    const userMsg = { sender: 'user', text };
    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    try {
      const res = await fetch('/api/ai-tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text })
      });
      const data = await res.json();
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: data.response || "In SASL, precision in finger configuration and movement path is key! Practice with the live camera vision."
        }
      ]);
    } catch (e) {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: "To sign that in SASL: Keep your hand shape relaxed and follow the sign trajectory shown in the SASL Dictionary tab!"
        }
      ]);
    }
  };

  const samplePrompts = [
    "How do I sign 'Help'?",
    "Difference between Western Cape & Gauteng SASL?",
    "Why is facial expression important in SASL?",
    "How do I fingerspell my name?"
  ];

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        left: '24px',
        zIndex: 1050,
        width: '380px',
        maxWidth: 'calc(100% - 48px)',
        height: '520px',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '20px',
        overflow: 'hidden',
        boxShadow: '0 12px 40px rgba(0, 0, 0, 0.28)',
        background: 'var(--bg-card, #FFFFFF)',
        border: '1px solid var(--border-light, #E2E8F0)'
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '16px',
          background: 'linear-gradient(135deg, #00A884 0%, #059669 100%)',
          color: '#FFFFFF',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'rgba(255, 255, 255, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Bot size={20} />
          </div>
          <div>
            <div style={{ fontSize: '15px', fontWeight: '800' }}>SASL AI Tutor</div>
            <div style={{ fontSize: '11px', opacity: 0.9 }}>Deaf Culture & Sign Guidance</div>
          </div>
        </div>

        <button
          onClick={onClose}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#FFFFFF',
            cursor: 'pointer',
            padding: '4px'
          }}
        >
          <X size={20} />
        </button>
      </div>

      {/* Messages List */}
      <div
        style={{
          flex: 1,
          padding: '16px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}
      >
        {messages.map((m, i) => (
          <div
            key={i}
            style={{
              alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '85%',
              display: 'flex',
              gap: '8px',
              alignItems: 'flex-start'
            }}
          >
            {m.sender === 'ai' && (
              <div
                style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '50%',
                  background: 'var(--mint-badge)',
                  color: 'var(--primary-emerald)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  fontSize: '12px'
                }}
              >
                🤖
              </div>
            )}
            <div
              style={{
                padding: '10px 14px',
                borderRadius: '14px',
                background: m.sender === 'user' ? 'var(--primary-emerald)' : 'var(--bg-card-subtle)',
                color: m.sender === 'user' ? '#FFFFFF' : 'var(--text-main)',
                fontSize: '13px',
                lineHeight: '1.4',
                border: m.sender === 'user' ? 'none' : '1px solid var(--border-light)'
              }}
            >
              {m.text}
            </div>
          </div>
        ))}

        {isTyping && (
          <div style={{ alignSelf: 'flex-start', padding: '8px 12px', background: 'var(--bg-card-subtle)', borderRadius: '12px', fontSize: '12px', color: 'var(--text-muted)' }}>
            AI Tutor is typing...
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Suggested Quick Prompts */}
      <div style={{ padding: '8px 12px', display: 'flex', gap: '6px', overflowX: 'auto', background: 'var(--bg-card-subtle)', borderTop: '1px solid var(--border-light)' }}>
        {samplePrompts.map((p, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(p)}
            style={{
              whiteSpace: 'nowrap',
              fontSize: '11px',
              padding: '4px 10px',
              borderRadius: '12px',
              border: '1px solid var(--border-light)',
              background: 'var(--bg-card)',
              color: 'var(--text-main)',
              cursor: 'pointer'
            }}
          >
            {p}
          </button>
        ))}
      </div>

      {/* Input Group */}
      <div style={{ padding: '12px', borderTop: '1px solid var(--border-light)', display: 'flex', gap: '8px', background: 'var(--bg-card)' }}>
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Ask how to sign anything in SASL..."
          style={{
            flex: 1,
            padding: '10px 14px',
            borderRadius: '10px',
            border: '1px solid var(--border-light)',
            background: 'var(--bg-card-subtle)',
            color: 'var(--text-main)',
            fontSize: '13px',
            outline: 'none'
          }}
        />
        <button
          onClick={() => handleSendMessage()}
          disabled={!inputText.trim()}
          style={{
            padding: '10px 14px',
            borderRadius: '10px',
            border: 'none',
            background: 'var(--primary-emerald)',
            color: '#FFFFFF',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Send size={15} />
        </button>
      </div>
    </div>
  );
}
