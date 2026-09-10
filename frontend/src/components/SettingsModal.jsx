import React, { useState, useEffect } from 'react';
import { Settings, Moon, Sun, Camera, Volume2, Globe, Shield, X, Check } from 'lucide-react';
import { getTheme, setTheme } from '../utils/storage';

export default function SettingsModal({ onClose }) {
  const [currentTheme, setCurrentThemeState] = useState(getTheme());
  const [cameras, setCameras] = useState([]);
  const [selectedCamera, setSelectedCamera] = useState('');
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const [highContrast, setHighContrast] = useState(false);
  const [defaultLanguage, setDefaultLanguage] = useState('English');
  const [savedAlert, setSavedAlert] = useState(false);

  useEffect(() => {
    // List available video input devices
    if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
      navigator.mediaDevices.enumerateDevices()
        .then(devices => {
          const videoInputs = devices.filter(d => d.kind === 'videoinput');
          setCameras(videoInputs);
          if (videoInputs.length > 0) {
            setSelectedCamera(videoInputs[0].deviceId);
          }
        })
        .catch(err => console.warn('Could not enumerate cameras', err));
    }
  }, []);

  const handleToggleTheme = () => {
    const nextTheme = currentTheme === 'light' ? 'dark' : 'light';
    setCurrentThemeState(nextTheme);
    setTheme(nextTheme);
  };

  const handleSave = () => {
    setSavedAlert(true);
    setTimeout(() => {
      setSavedAlert(false);
      onClose && onClose();
    }, 800);
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', backdropFilter: 'blur(4px)' }}>
      <div className="glass-card" style={{ width: '100%', maxWidth: '520px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', position: 'relative' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'var(--mint-badge)', color: 'var(--primary-emerald)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Settings size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-main)' }}>SignVision Settings</h3>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Preferences, hardware devices & accessibility</p>
            </div>
          </div>
          <button onClick={onClose} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-muted)' }}>
            <X size={20} />
          </button>
        </div>

        {/* Settings Group 1: Appearance */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <span style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--primary-emerald)', letterSpacing: '0.5px' }}>
            Appearance & Theme
          </span>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: 'var(--bg-card-subtle)', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {currentTheme === 'dark' ? <Moon size={18} color="var(--primary-emerald)" /> : <Sun size={18} color="#EAB308" />}
              <div>
                <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-main)' }}>Dark Mode</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Toggle dark high-contrast theme</div>
              </div>
            </div>
            <button
              onClick={handleToggleTheme}
              style={{
                padding: '6px 14px',
                borderRadius: '20px',
                border: '1px solid var(--border-light)',
                background: currentTheme === 'dark' ? 'var(--primary-emerald)' : 'var(--bg-card)',
                color: currentTheme === 'dark' ? '#FFF' : 'var(--text-main)',
                fontSize: '12px',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              {currentTheme === 'dark' ? 'Dark Active' : 'Light Active'}
            </button>
          </div>
        </div>

        {/* Settings Group 2: Hardware Devices */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <span style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--primary-emerald)', letterSpacing: '0.5px' }}>
            Hardware & Camera
          </span>

          <div style={{ padding: '12px 16px', background: 'var(--bg-card-subtle)', borderRadius: '12px', border: '1px solid var(--border-light)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: '700', color: 'var(--text-main)' }}>
              <Camera size={16} color="var(--primary-emerald)" /> Video Source
            </div>
            <select
              value={selectedCamera}
              onChange={(e) => setSelectedCamera(e.target.value)}
              style={{
                padding: '10px',
                borderRadius: '8px',
                border: '1px solid var(--border-light)',
                background: 'var(--bg-card)',
                color: 'var(--text-main)',
                fontSize: '13px',
                outline: 'none'
              }}
            >
              {cameras.length > 0 ? (
                cameras.map((c, i) => (
                  <option key={c.deviceId || i} value={c.deviceId}>
                    {c.label || `Camera ${i + 1}`}
                  </option>
                ))
              ) : (
                <option value="">Default Web Camera</option>
              )}
            </select>
          </div>
        </div>

        {/* Settings Group 3: Speech & Language */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <span style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--primary-emerald)', letterSpacing: '0.5px' }}>
            Speech & Translation Defaults
          </span>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: 'var(--bg-card-subtle)', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Volume2 size={18} color="var(--primary-emerald)" />
              <div>
                <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-main)' }}>Auto-Readout (TTS)</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Speak translated sentences aloud automatically</div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={ttsEnabled}
              onChange={(e) => setTtsEnabled(e.target.checked)}
              style={{ width: '18px', height: '18px', accentColor: 'var(--primary-emerald)', cursor: 'pointer' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: 'var(--bg-card-subtle)', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Globe size={18} color="var(--primary-emerald)" />
              <div>
                <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-main)' }}>Default Output Language</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Target South African language</div>
              </div>
            </div>
            <select
              value={defaultLanguage}
              onChange={(e) => setDefaultLanguage(e.target.value)}
              style={{
                padding: '6px 10px',
                borderRadius: '8px',
                border: '1px solid var(--border-light)',
                background: 'var(--bg-card)',
                color: 'var(--text-main)',
                fontSize: '13px',
                outline: 'none'
              }}
            >
              <option value="English">English</option>
              <option value="isiZulu">isiZulu</option>
              <option value="isiXhosa">isiXhosa</option>
              <option value="Afrikaans">Afrikaans</option>
              <option value="Sesotho">Sesotho</option>
            </select>
          </div>
        </div>

        {/* Footer Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '6px' }}>
          <button className="btn-outline" onClick={onClose}>
            Cancel
          </button>
          <button className="btn-primary" onClick={handleSave}>
            {savedAlert ? <Check size={16} /> : null}
            {savedAlert ? 'Saved!' : 'Save Preferences'}
          </button>
        </div>

      </div>
    </div>
  );
}
