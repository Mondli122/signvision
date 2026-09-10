import React, { useState, useEffect } from 'react';
import { Settings, Moon, Sun, Camera, Volume2, Globe, Shield, X, Check, Eye, Type, Sliders } from 'lucide-react';
import { getTheme, setTheme } from '../utils/storage';
import { toast } from '../utils/toast';

export default function SettingsModal({ onClose, isInline = false }) {
  const [currentTheme, setCurrentThemeState] = useState(getTheme());
  const [cameras, setCameras] = useState([]);
  const [selectedCamera, setSelectedCamera] = useState('');
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const [highContrast, setHighContrast] = useState(false);
  const [largeFont, setLargeFont] = useState(false);
  const [defaultLanguage, setDefaultLanguage] = useState('English');
  const [selectedDialect, setSelectedDialect] = useState('Gauteng');
  const [savedAlert, setSavedAlert] = useState(false);

  useEffect(() => {
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
    toast.info(`Theme set to ${nextTheme} mode`, 'Theme Updated');
  };

  const handleToggleHighContrast = () => {
    const next = !highContrast;
    setHighContrast(next);
    if (next) {
      document.body.classList.add('high-contrast');
      toast.success('High Contrast Accessibility Mode activated', 'Accessibility');
    } else {
      document.body.classList.remove('high-contrast');
      toast.info('High Contrast Mode disabled', 'Accessibility');
    }
  };

  const handleToggleLargeFont = () => {
    const next = !largeFont;
    setLargeFont(next);
    if (next) {
      document.body.classList.add('font-large');
      toast.success('Large Font Accessibility Mode activated', 'Accessibility');
    } else {
      document.body.classList.remove('font-large');
      toast.info('Default Font Size restored', 'Accessibility');
    }
  };

  const handleSave = () => {
    setSavedAlert(true);
    toast.success('Hardware & accessibility preferences saved!', 'Settings Updated');
    setTimeout(() => {
      setSavedAlert(false);
      if (onClose && !isInline) onClose();
    }, 600);
  };

  const content = (
    <div className="glass-card" style={{ width: '100%', maxWidth: isInline ? '800px' : '560px', padding: '28px', display: 'flex', flexDirection: 'column', gap: '22px', margin: isInline ? '0 auto' : undefined }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'var(--mint-badge)', color: 'var(--primary-emerald)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Settings size={22} />
          </div>
          <div>
            <h3 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--text-main)' }}>SignVision Hardware & Settings</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Preferences, video feeds, provincial dialects & accessibility</p>
          </div>
        </div>
        {!isInline && (
          <button onClick={onClose} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-muted)' }}>
            <X size={22} />
          </button>
        )}
      </div>

      {/* Appearance Section */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <span style={{ fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', color: 'var(--primary-emerald)', letterSpacing: '0.6px' }}>
          Visual Theme
        </span>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', background: 'var(--bg-card-subtle)', borderRadius: '14px', border: '1px solid var(--border-light)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {currentTheme === 'dark' ? <Moon size={20} color="var(--primary-emerald)" /> : <Sun size={20} color="#EAB308" />}
            <div>
              <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-main)' }}>Dark Theme Mode</div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>OLED dark high-contrast interface</div>
            </div>
          </div>
          <button
            onClick={handleToggleTheme}
            style={{
              padding: '8px 16px',
              borderRadius: '20px',
              border: '1px solid var(--border-light)',
              background: currentTheme === 'dark' ? 'var(--primary-emerald)' : 'var(--bg-card)',
              color: currentTheme === 'dark' ? '#FFF' : 'var(--text-main)',
              fontSize: '13px',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            {currentTheme === 'dark' ? 'Dark Active' : 'Light Active'}
          </button>
        </div>
      </div>

      {/* Accessibility Section */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <span style={{ fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', color: 'var(--primary-emerald)', letterSpacing: '0.6px' }}>
          Accessibility & Inclusive Design
        </span>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', background: 'var(--bg-card-subtle)', borderRadius: '14px', border: '1px solid var(--border-light)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Eye size={18} color="var(--primary-emerald)" />
              <div>
                <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-main)' }}>High Contrast</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>For low vision</div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={highContrast}
              onChange={handleToggleHighContrast}
              style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: 'var(--primary-emerald)' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', background: 'var(--bg-card-subtle)', borderRadius: '14px', border: '1px solid var(--border-light)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Type size={18} color="var(--primary-emerald)" />
              <div>
                <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-main)' }}>Large Font</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Enhanced legibility</div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={largeFont}
              onChange={handleToggleLargeFont}
              style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: 'var(--primary-emerald)' }}
            />
          </div>
        </div>
      </div>

      {/* Hardware Camera Section */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <span style={{ fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', color: 'var(--primary-emerald)', letterSpacing: '0.6px' }}>
          Webcam Input Device
        </span>

        <div style={{ padding: '14px 16px', background: 'var(--bg-card-subtle)', borderRadius: '14px', border: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Camera size={18} color="var(--primary-emerald)" />
          <select
            value={selectedCamera}
            onChange={(e) => setSelectedCamera(e.target.value)}
            style={{
              flex: 1,
              padding: '8px 12px',
              borderRadius: '8px',
              border: '1px solid var(--border-light)',
              background: 'var(--bg-card)',
              color: 'var(--text-main)',
              fontSize: '13px',
              outline: 'none'
            }}
          >
            {cameras.length > 0 ? (
              cameras.map(c => <option key={c.deviceId} value={c.deviceId}>{c.label || `Camera ${c.deviceId.slice(0, 6)}`}</option>)
            ) : (
              <option value="">Default Web Camera (Integrated)</option>
            )}
          </select>
        </div>
      </div>

      {/* Language & Dialect Section */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <span style={{ fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', color: 'var(--primary-emerald)', letterSpacing: '0.6px' }}>
          Regional SASL Corpus & Speech
        </span>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div>
            <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Target Audio Language</label>
            <select
              value={defaultLanguage}
              onChange={(e) => setDefaultLanguage(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '10px',
                border: '1px solid var(--border-light)',
                background: 'var(--bg-card)',
                color: 'var(--text-main)',
                fontSize: '13px'
              }}
            >
              <option value="English">English (South Africa)</option>
              <option value="isiZulu">isiZulu</option>
              <option value="Afrikaans">Afrikaans</option>
              <option value="Sesotho">Sesotho</option>
            </select>
          </div>

          <div>
            <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Provincial SASL Standard</label>
            <select
              value={selectedDialect}
              onChange={(e) => setSelectedDialect(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '10px',
                border: '1px solid var(--border-light)',
                background: 'var(--bg-card)',
                color: 'var(--text-main)',
                fontSize: '13px'
              }}
            >
              <option value="Gauteng">🏛️ Gauteng Standard</option>
              <option value="Western Cape">🏔️ Western Cape Coastal</option>
              <option value="KwaZulu-Natal">🌊 KwaZulu-Natal Regional</option>
              <option value="Eastern Cape">🌾 Eastern Cape Traditional</option>
            </select>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        className="btn-primary"
        style={{
          padding: '14px',
          borderRadius: '14px',
          fontSize: '15px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          marginTop: '6px'
        }}
      >
        <Check size={18} />
        <span>Save All Preferences</span>
      </button>

    </div>
  );

  if (isInline) {
    return content;
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', backdropFilter: 'blur(4px)' }}>
      {content}
    </div>
  );
}
