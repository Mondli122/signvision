import React, { useState } from 'react';
import { AlertTriangle, ShieldAlert, PhoneCall, Volume2, VolumeX, MapPin, Send, CheckCircle2, Siren } from 'lucide-react';
import { toast } from '../utils/toast';

export default function EmergencyHub({ onClose = () => {}, isInline = false }) {
  const [selectedCategory, setSelectedCategory] = useState('medical');
  const [additionalDetails, setAdditionalDetails] = useState('');
  const [broadcasting, setBroadcasting] = useState(false);
  const [alertPayload, setAlertPayload] = useState(null);
  const [sirenActive, setSirenActive] = useState(false);

  const categories = [
    { id: 'medical', title: 'Medical Emergency', icon: '🚑', color: '#EF4444', desc: 'Ambulance, Injury, Cardiac, Unresponsive, Allergic Reaction' },
    { id: 'police', title: 'Police / Security', icon: '🚔', color: '#3587A4', desc: 'Crime in progress, Intruder, Danger, Violence, Theft' },
    { id: 'fire', title: 'Fire & Rescue', icon: '🚒', color: '#F97316', desc: 'Active Fire, Heavy Smoke, Gas Leak, Structural Collapse' },
    { id: 'disaster', title: 'Evacuation & SOS', icon: '🆘', color: '#2D848A', desc: 'Severe Flood, Power Grid Trap, Community Distress' },
  ];

  const emergencyContacts = [
    { name: 'National Emergency (Cellular)', number: '112', type: 'Toll-free / Free call' },
    { name: 'SAPS Police Flying Squad', number: '10111', type: 'Nationwide Police' },
    { name: 'Ambulance & Fire Dispatch', number: '10177', type: 'Medical & Metro Fire' },
    { name: 'Deaf Emergency SMS Relay', number: '082 055 5555', type: 'SMS / Text Only' },
  ];

  const toggleSiren = () => {
    if (!sirenActive) {
      setSirenActive(true);
      toast.error('High-decibel emergency audio beacon activated!', 'Siren Active');
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const msg = new SpeechSynthesisUtterance("ATTENTION EMERGENCY ALERT! DEAF PERSON REQUESTS IMMEDIATE SOS ASSISTANCE! PLEASE ASSIST IMMEDIATELY!");
        msg.rate = 1.1;
        msg.pitch = 1.3;
        msg.volume = 1.0;
        window.speechSynthesis.speak(msg);
      }
    } else {
      setSirenActive(false);
      toast.info('Emergency audio siren stopped.', 'Siren Silenced');
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
      toast.success('Emergency SOS broadcast dispatched to first responders!', 'SOS Dispatched');

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
      toast.error('Network dispatch failed. Please dial 112 directly.', 'Dispatch Warning');
    } finally {
      setBroadcasting(false);
    }
  };

  const content = (
    <div style={{
      background: '#FFFFFF',
      border: '1px solid rgba(239, 68, 68, 0.4)',
      borderRadius: '16px',
      width: '100%',
      minHeight: isInline ? '82vh' : 'auto',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      padding: '24px',
      boxShadow: '0 8px 30px rgba(239, 68, 68, 0.12)',
      boxSizing: 'border-box'
    }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '12px',
            background: '#FEE2E2',
            color: '#DC2626',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px'
          }}>
            <ShieldAlert size={26} />
          </div>
          <div>
            <h2 style={{ margin: 0, color: '#DC2626', fontSize: '20px', fontWeight: '800' }}>
              Deaf Emergency SOS Crisis Dispatch
            </h2>
            <p style={{ margin: '2px 0 0 0', fontSize: '13px', color: '#5C7B8A' }}>
              Instant 1-Tap First Responder Alert Broadcast & Geolocation Relay
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{
            padding: '5px 12px',
            borderRadius: '9999px',
            background: '#FEE2E2',
            color: '#DC2626',
            fontSize: '12px',
            fontWeight: '800',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#DC2626', display: 'inline-block' }} />
            Priority Line
          </span>
          {!isInline && (
            <button
              onClick={onClose}
              style={{
                background: '#F0F7FB',
                border: '1px solid #C1DFF0',
                borderRadius: '8px',
                width: '32px',
                height: '32px',
                cursor: 'pointer',
                color: '#5C7B8A',
                fontSize: '16px',
                fontWeight: '700'
              }}
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Audio Siren Banner */}
      <button
        onClick={toggleSiren}
        style={{
          width: '100%',
          padding: '12px 18px',
          background: sirenActive ? '#DC2626' : '#FEF2F2',
          border: '2px solid #DC2626',
          color: sirenActive ? '#FFFFFF' : '#DC2626',
          borderRadius: '12px',
          fontWeight: '800',
          fontSize: '14px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
          transition: 'all 0.15s ease'
        }}
      >
        {sirenActive ? <VolumeX size={20} /> : <Volume2 size={20} />}
        <span>{sirenActive ? 'STOP AUDIO EMERGENCY SIREN BEACON' : 'ACTIVATE HIGH-DECIBEL AUDIO SIREN BEACON'}</span>
      </button>

      {/* South Africa National Hotlines Banner */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '10px',
        padding: '14px',
        background: '#F8FBFC',
        borderRadius: '12px',
        border: '1px solid #C1DFF0'
      }}>
        {emergencyContacts.map((contact, idx) => (
          <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: '#E6F4FA',
              color: '#2D848A',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <PhoneCall size={16} />
            </div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: '800', color: '#133340' }}>{contact.number}</div>
              <div style={{ fontSize: '11px', color: '#5C7B8A' }}>{contact.name}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Emergency Category Selector */}
      <div>
        <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#133340', marginBottom: '8px' }}>
          Select Emergency Incident Type:
        </label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <div
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                style={{
                  background: isSelected ? '#F0F9FB' : '#FFFFFF',
                  border: `2px solid ${isSelected ? cat.color : '#C1DFF0'}`,
                  borderRadius: '12px',
                  padding: '14px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  boxShadow: isSelected ? `0 4px 14px ${cat.color}22` : 'none'
                }}
              >
                <div style={{ fontSize: '24px', marginBottom: '6px' }}>{cat.icon}</div>
                <strong style={{ display: 'block', color: cat.color, fontSize: '14px', fontWeight: '800' }}>{cat.title}</strong>
                <span style={{ fontSize: '11.5px', color: '#5C7B8A', marginTop: '2px', display: 'block' }}>{cat.desc}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Incident Details Input */}
      <div>
        <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#133340', marginBottom: '6px' }}>
          Additional Situation Details (Optional):
        </label>
        <input
          type="text"
          placeholder="e.g. Asthma attack, cannot speak, near school main gate..."
          value={additionalDetails}
          onChange={(e) => setAdditionalDetails(e.target.value)}
          style={{
            width: '100%',
            padding: '11px 14px',
            background: '#F0F7FB',
            border: '1px solid #C1DFF0',
            borderRadius: '10px',
            color: '#133340',
            fontSize: '13.5px',
            outline: 'none',
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
          padding: '14px 20px',
          background: 'linear-gradient(135deg, #DC2626 0%, #B91C1C 100%)',
          border: 'none',
          borderRadius: '12px',
          color: '#ffffff',
          fontWeight: '800',
          fontSize: '15px',
          cursor: broadcasting ? 'wait' : 'pointer',
          boxShadow: '0 4px 16px rgba(220, 38, 38, 0.35)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px'
        }}
      >
        <AlertTriangle size={18} />
        <span>{broadcasting ? 'DISPATCHING GEOLOCATION RELAY...' : '🚨 BROADCAST IMMEDIATE SOS ALERT NOW'}</span>
      </button>

      {/* Dispatch Result Card */}
      {alertPayload && (
        <div style={{
          background: '#F0FDF4',
          border: '1px solid #86EFAC',
          borderRadius: '12px',
          padding: '14px 18px',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px'
        }}>
          <div style={{ color: '#16A34A', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px' }}>
            <CheckCircle2 size={18} /> SOS Alert Dispatched Successfully ({alertPayload.timestamp})
          </div>
          <p style={{ margin: 0, fontSize: '13px', color: '#166534', lineHeight: '1.4' }}>
            {alertPayload.broadcast_message}
          </p>
          <div style={{ fontSize: '11.5px', color: '#15803D', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
            <MapPin size={13} /> Coordinates: {alertPayload.location}
          </div>
        </div>
      )}
    </div>
  );

  if (isInline) {
    return content;
  }

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
      <div style={{ maxWidth: '680px', width: '100%' }}>
        {content}
      </div>
    </div>
  );
}
