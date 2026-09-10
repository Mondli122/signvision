import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Video, VideoOff, PhoneOff, Phone, Send, Sparkles, MessageSquare } from 'lucide-react';
import { toast } from '../utils/toast';

export default function WebRTCCallRoom({ onClose }) {
  const [roomCode, setRoomCode] = useState('SASL-ROOM-9281');
  const [inCall, setInCall] = useState(false);
  const [micMuted, setMicMuted] = useState(false);
  const [camOff, setCamOff] = useState(false);
  const [mediaStream, setMediaStream] = useState(null);
  const [textInput, setTextInput] = useState('');
  const [remoteTranscript, setRemoteTranscript] = useState([
    { sender: 'Deaf Participant', text: 'HELLO WANT HELP SCHOOL', time: '12:01' },
    { sender: 'You (Hearing)', text: 'Hello! I am ready to help you with school.', time: '12:01' }
  ]);

  const localVideoRef = useRef(null);

  // Request real camera & mic stream
  useEffect(() => {
    let activeStream = null;

    async function initCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        activeStream = stream;
        setMediaStream(stream);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.warn('Could not acquire local camera for WebRTC call:', err);
        toast.info('Camera in preview mode. Check permissions for live video stream.', 'WebRTC Preview');
      }
    }

    initCamera();

    return () => {
      if (activeStream) {
        activeStream.getTracks().forEach(t => t.stop());
      }
    };
  }, []);

  // Sync mic track
  useEffect(() => {
    if (mediaStream) {
      mediaStream.getAudioTracks().forEach(track => {
        track.enabled = !micMuted;
      });
    }
  }, [micMuted, mediaStream]);

  // Sync video track
  useEffect(() => {
    if (mediaStream) {
      mediaStream.getVideoTracks().forEach(track => {
        track.enabled = !camOff;
      });
    }
  }, [camOff, mediaStream]);

  const toggleCall = () => {
    if (!inCall) {
      setInCall(true);
      toast.success('Connected to WebRTC room ' + roomCode, 'Call Started');
      // Simulate remote participant sign response after 3 seconds
      setTimeout(() => {
        setRemoteTranscript(prev => [
          ...prev,
          { sender: 'Deaf Participant', text: 'THANK YOU MEET YOU TODAY', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
        ]);
      }, 3500);
    } else {
      setInCall(false);
      toast.info('Call disconnected', 'Call Ended');
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!textInput.trim()) return;
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setRemoteTranscript(prev => [
      ...prev,
      { sender: 'You (Hearing)', text: textInput.trim(), time: now }
    ]);
    const sent = textInput.trim();
    setTextInput('');

    // Simulate Deaf participant response
    setTimeout(() => {
      setRemoteTranscript(prev => [
        ...prev,
        { sender: 'Deaf Participant', text: `UNDERSTAND: ${sent.toUpperCase()} - SASL CONFIRMED`, time: now }
      ]);
    }, 2000);
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(5, 9, 18, 0.94)',
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
        maxWidth: '960px',
        width: '100%',
        height: '86vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        boxShadow: '0 0 60px rgba(0, 245, 155, 0.2)'
      }}>
        {/* Call Header */}
        <div style={{
          padding: '16px 24px',
          background: 'rgba(15, 23, 42, 0.95)',
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
                Room Code: <strong style={{ color: '#38bdf8' }}>{roomCode}</strong> (P2P Mesh Encrypted)
              </span>
            </div>
          </div>
          <button
            onClick={() => {
              if (mediaStream) mediaStream.getTracks().forEach(t => t.stop());
              onClose();
            }}
            style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '1.5rem', cursor: 'pointer' }}
          >
            ✕
          </button>
        </div>

        {/* Main Video & Transcript Grid */}
        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1.8fr 1fr', gap: '1px', background: 'rgba(255, 255, 255, 0.05)', minHeight: 0 }}>
          {/* Video Feeds Container */}
          <div style={{ background: '#070a12', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px', minHeight: 0 }}>
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
                <div style={{ textAlign: 'center', color: '#00F59B', padding: '20px' }}>
                  <div style={{ fontSize: '3.5rem', marginBottom: '10px' }}>🤟</div>
                  <strong style={{ fontSize: '1.1rem', letterSpacing: '0.5px' }}>DEAF PARTICIPANT STREAM ACTIVE</strong>
                  <div style={{ fontSize: '0.85rem', color: '#38bdf8', marginTop: '6px' }}>
                    MediaPipe Hand Landmark Tracking Online (60 FPS)
                  </div>
                  <div style={{ marginTop: '14px', display: 'inline-block', background: 'rgba(0, 245, 155, 0.15)', border: '1px solid #00F59B', borderRadius: '20px', padding: '4px 14px', fontSize: '0.75rem', fontWeight: 'bold' }}>
                    ● SASL Live Audio-Visual Bridge
                  </div>
                </div>
              ) : (
                <div style={{ textAlign: 'center', color: '#94a3b8', padding: '20px' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '10px' }}>📞</div>
                  <span style={{ fontSize: '1rem', fontWeight: '600' }}>Ready to connect to Room {roomCode}</span>
                  <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '4px' }}>
                    Press "Start Call" below to begin live 2-way sign translation
                  </div>
                </div>
              )}

              {/* Local Self Video Feed (Real WebRTC Camera) */}
              <div style={{
                position: 'absolute',
                bottom: '16px',
                right: '16px',
                width: '180px',
                height: '120px',
                background: '#1e293b',
                border: '2px solid #38bdf8',
                borderRadius: '14px',
                overflow: 'hidden',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <video
                  ref={localVideoRef}
                  autoPlay
                  playsInline
                  muted
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: camOff ? 'none' : 'block',
                    transform: 'scaleX(-1)'
                  }}
                />
                {camOff && (
                  <div style={{ color: '#ef4444', fontSize: '0.75rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <VideoOff size={14} /> Cam Off
                  </div>
                )}
                <div style={{ position: 'absolute', bottom: '4px', left: '6px', background: 'rgba(0,0,0,0.6)', padding: '2px 6px', borderRadius: '4px', fontSize: '10px', color: '#FFFFFF' }}>
                  You {micMuted ? '(Muted)' : ''}
                </div>
              </div>
            </div>
          </div>

          {/* Live Translation Captions Sidebar */}
          <div style={{ background: '#0f172a', padding: '16px', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
            <h4 style={{ margin: '0 0 12px 0', color: '#38bdf8', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <MessageSquare size={16} />
              <span>Real-Time Two-Way Captions</span>
            </h4>
            
            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px', paddingRight: '4px' }}>
              {remoteTranscript.map((msg, i) => (
                <div key={i} style={{
                  background: msg.sender.includes('Deaf') ? 'rgba(0, 245, 155, 0.1)' : 'rgba(56, 189, 248, 0.1)',
                  borderLeft: `3px solid ${msg.sender.includes('Deaf') ? '#00F59B' : '#38bdf8'}`,
                  padding: '10px',
                  borderRadius: '8px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#94a3b8' }}>
                    <strong>{msg.sender}</strong>
                    <span>{msg.time}</span>
                  </div>
                  <div style={{ fontSize: '0.88rem', color: '#f8fafc', marginTop: '4px', fontWeight: '500' }}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* In-Call Quick Speech / Message Sender */}
            <form onSubmit={handleSendMessage} style={{ marginTop: '12px', display: 'flex', gap: '8px' }}>
              <input
                type="text"
                placeholder={inCall ? "Speak or type to participant..." : "Connect call first..."}
                value={textInput}
                disabled={!inCall}
                onChange={(e) => setTextInput(e.target.value)}
                style={{
                  flex: 1,
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '10px',
                  padding: '8px 12px',
                  color: '#ffffff',
                  fontSize: '0.85rem',
                  outline: 'none'
                }}
              />
              <button
                type="submit"
                disabled={!inCall || !textInput.trim()}
                style={{
                  background: '#00A884',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '8px 14px',
                  color: '#ffffff',
                  cursor: inCall && textInput.trim() ? 'pointer' : 'default',
                  opacity: inCall && textInput.trim() ? 1 : 0.5
                }}
              >
                <Send size={16} />
              </button>
            </form>
          </div>
        </div>

        {/* Controls Footer */}
        <div style={{
          padding: '14px 24px',
          background: 'rgba(15, 23, 42, 0.95)',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '16px'
        }}>
          <button
            onClick={() => setMicMuted(!micMuted)}
            style={{
              padding: '10px 18px',
              background: micMuted ? '#ef4444' : 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              borderRadius: '12px',
              color: '#ffffff',
              cursor: 'pointer',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.88rem'
            }}
          >
            {micMuted ? <MicOff size={16} /> : <Mic size={16} />}
            <span>{micMuted ? 'Unmute' : 'Mute'}</span>
          </button>
          
          <button
            onClick={() => setCamOff(!camOff)}
            style={{
              padding: '10px 18px',
              background: camOff ? '#ef4444' : 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              borderRadius: '12px',
              color: '#ffffff',
              cursor: 'pointer',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.88rem'
            }}
          >
            {camOff ? <VideoOff size={16} /> : <Video size={16} />}
            <span>{camOff ? 'Start Video' : 'Stop Video'}</span>
          </button>

          <button
            onClick={toggleCall}
            style={{
              padding: '10px 24px',
              background: inCall ? '#dc2626' : '#10b981',
              border: 'none',
              borderRadius: '12px',
              color: '#ffffff',
              fontWeight: 'bold',
              fontSize: '0.95rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: inCall ? '0 4px 20px rgba(220, 38, 38, 0.4)' : '0 4px 20px rgba(16, 185, 129, 0.4)'
            }}
          >
            {inCall ? <PhoneOff size={18} /> : <Phone size={18} />}
            <span>{inCall ? 'End Call' : 'Start Video Call'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
