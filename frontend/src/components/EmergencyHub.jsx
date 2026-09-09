import React, { useState } from 'react';

export default function EmergencyHub({ onClose }) {
  const [selectedCategory, setSelectedCategory] = useState('medical');
  const [additionalDetails, setAdditionalDetails] = useState('');
  const [broadcasting, setBroadcasting] = useState(false);
  const [alertPayload, setAlertPayload] = useState(null);
  const [sirenActive, setSirenActive] = useState(false);

  const categories = [
    { id: 'medical', title: 'Medical Emergency', icon: '🚑', color: '#ef4444', desc: 'Ambulance, Injury, Cardiac, Allergic Reaction' },
    { id: 'police', title: 'Police / Security', icon: '🚔', color: '#3b82f6', desc: 'Crime, Intruder, Danger, Violence' },
    { id: 'fire', title: 'Fire & Rescue', icon: '🚒', color: '#f97316', desc: 'Fire, Smoke, Gas Leak, Structural Hazard' },
    { id: 'disaster', title: 'Evacuation & Disaster', icon: '🆘', color: '#a855f7', desc: 'Flood, Storm, Trapped, General SOS' },
  ];

  const toggleSiren = () => {
    if (!sirenActive) {
      setSirenActive(true);
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const msg = new SpeechSynthesisUtterance("ATTENTION EMERGENCY ALERT! DEAF PERSON REQUESTS IMMEDIATE SOS ASSISTANCE!");
        msg.rate = 1.2;
        msg.pitch = 1.3;
        msg.volume = 1.0;
        window.speechSynthesis.speak(msg);
      }
    } else {
      setSirenActive(false);
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    }
  };

  const sendEmergencyAlert = async () => {
    setBroadcasting(true);
    let lat = null, lng = null;

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          lat = pos.coords.latitude.toFixed(4);
          lng = pos.coords.longitude.toFixed(4);
          dispatchPayload(lat, lng);
        },
        () => {
          dispatchPayload(null, null);
        }
      );
    } else {
      dispatchPayload(null, null);
    }
  };

  const dispatchPayload = async (lat, lng) => {
    try {
      const res = await fetch('/api/emergency-assist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: selectedCategory,
          details: additionalDetails,
          latitude: lat,
          longitude: lng
        })
      });
      const data = await res.json();
      setAlertPayload(data);

      // Speak official broadcast message
      if ('speechSynthesis' in window && data?.broadcast_message) {
        window.speechSynthesis.cancel();
        const msg = new SpeechSynthesisUtterance(data.broadcast_message);
        msg.rate = 1.1;
        msg.pitch = 1.2;
        window.speechSynthesis.speak(msg);
      }
    } catch (err) {
      console.error('Emergency dispatch error:', err);
    } finally {
      setBroadcasting(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(5, 9, 18, 0.85)',
      backdropFilter: 'blur(12px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '20px'
    }}>
      <div style={{
        background: '#0b0f19',
        border: '2px solid #ef4444',
        borderRadius: '20px',
        maxWidth: '560px',
        width: '100%',
        padding: '28px',
        color: '#f8fafc',
        boxShadow: '0 0 50px rgba(239, 68, 68, 0.4)',
        position: 'relative'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '2rem' }}>🚨</span>
            <div>
              <h2 style={{ margin: 0, color: '#ef4444', fontSize: '1.4rem', fontWeight: '800' }}>
                DEAF EMERGENCY SOS DISPATCH
              </h2>
              <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Instant 1-Tap First Responder Alert Broadcast</span>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#94a3b8',
              fontSize: '1.5rem',
              cursor: 'pointer'
            }}
          >
            ✕
          </button>
        </div>

        {/* Siren Beacon Toggle */}
        <button
          onClick={toggleSiren}
          style={{
            width: '100%',
            padding: '14px',
            background: sirenActive ? '#ef4444' : 'rgba(239, 68, 68, 0.15)',
            border: '1px solid #ef4444',
            color: sirenActive ? '#ffffff' : '#ef4444',
            borderRadius: '12px',
            fontWeight: 'bold',
            fontSize: '1rem',
            marginBottom: '20px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px'
          }}
        >
          <span>🔊</span> {sirenActive ? 'STOP AUDIO EMERGENCY SIREN BEACON' : 'ACTIVATE HIGH-DECIBEL AUDIO SIREN BEACON'}
        </button>

        {/* Category Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              style={{
                background: selectedCategory === cat.id ? `${cat.color}22` : 'rgba(255, 255, 255, 0.04)',
                border: `2px solid ${selectedCategory === cat.id ? cat.color : 'rgba(255, 255, 255, 0.1)'}`,
                borderRadius: '12px',
                padding: '14px',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ fontSize: '1.8rem', marginBottom: '6px' }}>{cat.icon}</div>
              <strong style={{ display: 'block', color: cat.color, fontSize: '0.98rem' }}>{cat.title}</strong>
              <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>{cat.desc}</span>
            </div>
          ))}
        </div>

        {/* Additional Details */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '6px' }}>
            Optional Details / Patient Notes:
          </label>
          <input
            type="text"
            placeholder="e.g., Asthma attack, cannot speak, near gate 2..."
            value={additionalDetails}
            onChange={(e) => setAdditionalDetails(e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '8px',
              color: '#ffffff',
              fontSize: '0.9rem',
              boxSizing: 'border-box'
            }}
          />
        </div>

        {/* Broadcast Trigger Button */}
        <button
          onClick={sendEmergencyAlert}
          disabled={broadcasting}
          style={{
            width: '100%',
            padding: '16px',
            background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
            border: 'none',
            borderRadius: '12px',
            color: '#ffffff',
            fontWeight: 'bold',
            fontSize: '1.1rem',
            cursor: 'pointer',
            boxShadow: '0 4px 20px rgba(239, 68, 68, 0.5)'
          }}
        >
          {broadcasting ? 'DISPATCHING EMERGENCY BROADCAST...' : '🚨 BROADCAST IMMEDIATE SOS ALERT NOW'}
        </button>

        {/* Dispatch Result Card */}
        {alertPayload && (
          <div style={{
            marginTop: '20px',
            background: 'rgba(0, 245, 155, 0.1)',
            border: '1px solid #00F59B',
            borderRadius: '12px',
            padding: '16px'
          }}>
            <div style={{ color: '#00F59B', fontWeight: 'bold', marginBottom: '6px' }}>
              ✓ SOS Alert Active & Dispatched ({alertPayload.timestamp})
            </div>
            <p style={{ margin: 0, fontSize: '0.9rem', color: '#e2e8f0', lineHeight: '1.4' }}>
              {alertPayload.broadcast_message}
            </p>
            <div style={{ marginTop: '8px', fontSize: '0.8rem', color: '#94a3b8' }}>
              📍 Location: {alertPayload.location}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
