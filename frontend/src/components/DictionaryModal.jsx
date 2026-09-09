import React, { useState } from 'react';
import AvatarSigner from './AvatarSigner';

export default function DictionaryModal({ item, onClose }) {
  const [isPlayingAvatar, setIsPlayingAvatar] = useState(true);

  if (!item) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(5, 9, 18, 0.85)',
      backdropFilter: 'blur(16px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '20px'
    }}>
      <div style={{
        background: '#0b0f19',
        border: '1px solid rgba(0, 245, 155, 0.4)',
        borderRadius: '24px',
        maxWidth: '580px',
        width: '100%',
        padding: '28px',
        color: '#f8fafc',
        boxShadow: '0 0 50px rgba(0, 245, 155, 0.25)',
        position: 'relative'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '2.4rem' }}>{item.icon || '🤟'}</span>
            <div>
              <h2 style={{ margin: 0, color: '#00F59B', fontSize: '1.5rem', fontWeight: '800' }}>
                {item.word}
              </h2>
              <span style={{ fontSize: '0.85rem', color: '#38bdf8', fontWeight: '700' }}>
                Gloss: {item.gloss} • Category: {item.category}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '1.6rem', cursor: 'pointer' }}
          >
            ✕
          </button>
        </div>

        {/* 3D Visual Avatar Signer */}
        <AvatarSigner
          activeGloss={item.gloss}
          isPlaying={isPlayingAvatar}
          onFinish={() => setIsPlayingAvatar(false)}
        />

        <button
          onClick={() => setIsPlayingAvatar(true)}
          style={{
            width: '100%',
            marginTop: '10px',
            padding: '10px',
            background: 'rgba(0, 245, 155, 0.15)',
            border: '1px solid #00F59B',
            color: '#00F59B',
            borderRadius: '10px',
            fontWeight: 'bold',
            fontSize: '0.9rem',
            cursor: 'pointer'
          }}
        >
          ▶ Replay 3D Avatar Motion
        </button>

        {/* Description & Dialect Note */}
        <div style={{ marginTop: '18px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ background: 'rgba(255, 255, 255, 0.04)', padding: '14px', borderRadius: '12px' }}>
            <strong style={{ color: '#f8fafc', display: 'block', marginBottom: '4px' }}>📋 Motion & Execution Guide:</strong>
            <p style={{ margin: 0, fontSize: '0.92rem', color: '#cbd5e1', lineHeight: '1.4' }}>
              {item.description}
            </p>
          </div>

          <div style={{ background: 'rgba(56, 189, 248, 0.08)', borderLeft: '4px solid #38bdf8', padding: '14px', borderRadius: '8px' }}>
            <strong style={{ color: '#38bdf8', display: 'block', marginBottom: '4px' }}>🇿🇦 SASL Dialect Note:</strong>
            <p style={{ margin: 0, fontSize: '0.88rem', color: '#e2e8f0', lineHeight: '1.4' }}>
              {item.sasl_note || 'Standard South African Sign Language gesture.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
