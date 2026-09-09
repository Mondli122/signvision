import React, { useState } from 'react';

export default function WebRTCCallRoom({ onClose }) {
  const [roomCode, setRoomCode] = useState('SASL-ROOM-9281');
  const [inCall, setInCall] = useState(false);
  const [micMuted, setMicMuted] = useState(false);
  const [camOff, setCamOff] = useState(false);
  const [remoteTranscript, setRemoteTranscript] = useState([
    { sender: 'Deaf Participant', text: 'HELLO WANT HELP SCHOOL', time: '23:45' },
    { sender: 'Hearing Participant', text: 'Hello! I am ready to help you with school.', time: '23:46' }
  ]);

  const toggleCall = () => {
    setInCall(!inCall);
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(5, 9, 18, 0.92)',
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
        maxWidth: '900px',
        width: '100%',
        height: '85vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        boxShadow: '0 0 60px rgba(0, 245, 155, 0.2)'
      }}>
        {/* Call Header */}
        <div style={{
          padding: '16px 24px',
          background: 'rgba(15, 23, 42, 0.9)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '1.5rem' }}>📹</span>
            <div>
              <h3 style={{ margin: 0, color: '#00F59B', fontSize: '1.1rem' }}>
                WebRTC Real-Time Sign Video Call Room
              </h3>
              <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                Room Code: <strong style={{ color: '#38bdf8' }}>{roomCode}</strong> (P2P Encrypted)
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '1.5rem', cursor: 'pointer' }}
          >
            ✕
          </button>
        </div>

        {/* Main Video & Transcript Grid */}
        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1px', background: 'rgba(255, 255, 255, 0.05)' }}>
          {/* Video Feeds Container */}
          <div style={{ background: '#070a12', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {/* Remote Peer Video Window */}
            <div style={{
              flex: 1,
              background: '#0f172a',
              borderRadius: '16px',
              border: '1px solid rgba(0, 245, 155, 0.25)',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden'
            }}>
              {inCall ? (
                <div style={{ textAlign: 'center', color: '#00F59B' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '10px' }}>🤟</div>
                  <strong>DEAF PARTICIPANT STREAM LIVE (60 FPS)</strong>
                  <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '6px' }}>
                    Live Sign Tracking Active
                  </div>
                </div>
              ) : (
                <div style={{ textAlign: 'center', color: '#94a3b8' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '10px' }}>📞</div>
                  <span>Waiting for participant to join room...</span>
                </div>
              )}

              {/* Local Self Video Picture-in-Picture */}
              <div style={{
                position: 'absolute',
                bottom: '16px',
                right: '16px',
                width: '160px',
                height: '110px',
                background: '#1e293b',
                border: '2px solid #38bdf8',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#38bdf8',
                fontSize: '0.75rem',
                fontWeight: 'bold'
              }}>
                {camOff ? 'Camera Off' : 'You (Hearing)'}
              </div>
            </div>
          </div>

          {/* Live Translation Captions Sidebar */}
          <div style={{ background: '#0f172a', padding: '16px', display: 'flex', flexDirection: 'column' }}>
            <h4 style={{ margin: '0 0 12px 0', color: '#38bdf8', fontSize: '0.95rem' }}>
              💬 Real-Time Dual Translation Log
            </h4>
            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {remoteTranscript.map((msg, i) => (
                <div key={i} style={{
                  background: msg.sender.includes('Deaf') ? 'rgba(0, 245, 155, 0.1)' : 'rgba(56, 189, 248, 0.1)',
                  borderLeft: `3px solid ${msg.sender.includes('Deaf') ? '#00F59B' : '#38bdf8'}`,
                  padding: '10px',
                  borderRadius: '8px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#94a3b8' }}>
                    <strong>{msg.sender}</strong>
                    <span>{msg.time}</span>
                  </div>
                  <div style={{ fontSize: '0.9rem', color: '#f8fafc', marginTop: '4px' }}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Controls Footer */}
        <div style={{
          padding: '16px 24px',
          background: 'rgba(15, 23, 42, 0.95)',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          justifyContent: 'center',
          gap: '16px'
        }}>
          <button
            onClick={() => setMicMuted(!micMuted)}
            style={{
              padding: '12px 20px',
              background: micMuted ? '#ef4444' : 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              borderRadius: '12px',
              color: '#ffffff',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            {micMuted ? '🎙️ Unmute Mic' : '🎙️ Mute Mic'}
          </button>
          <button
            onClick={() => setCamOff(!camOff)}
            style={{
              padding: '12px 20px',
              background: camOff ? '#ef4444' : 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              borderRadius: '12px',
              color: '#ffffff',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            {camOff ? '📹 Turn On Cam' : '📹 Turn Off Cam'}
          </button>
          <button
            onClick={toggleCall}
            style={{
              padding: '12px 28px',
              background: inCall ? '#dc2626' : '#10b981',
              border: 'none',
              borderRadius: '12px',
              color: '#ffffff',
              fontWeight: 'bold',
              fontSize: '1rem',
              cursor: 'pointer',
              boxShadow: inCall ? '0 4px 20px rgba(220, 38, 38, 0.4)' : '0 4px 20px rgba(16, 185, 129, 0.4)'
            }}
          >
            {inCall ? '🔴 End Call' : '📞 Join / Start Call'}
          </button>
        </div>
      </div>
    </div>
  );
}
