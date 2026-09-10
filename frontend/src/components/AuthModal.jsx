import React, { useState } from 'react';
import { LogIn, UserPlus, X, Mail, Lock, User, AlertCircle, CheckCircle2 } from 'lucide-react';
import { signInUser, signUpUser } from '../utils/supabaseClient';

export default function AuthModal({ onClose, onAuthSuccess }) {
  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      if (mode === 'signup') {
        const { data, error } = await signUpUser(email, password, fullName);
        if (error) throw error;
        setSuccessMsg('Account created successfully! Signing you in...');
        setTimeout(() => {
          onAuthSuccess && onAuthSuccess(data.user);
          onClose && onClose();
        }, 1200);
      } else {
        const { data, error } = await signInUser(email, password);
        if (error) throw error;
        setSuccessMsg('Welcome back!');
        setTimeout(() => {
          onAuthSuccess && onAuthSuccess(data.user);
          onClose && onClose();
        }, 800);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Authentication failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoSignIn = async () => {
    setLoading(true);
    const { data } = await signInUser('thabo.student@signvision.co.za', 'password123');
    setLoading(false);
    if (data?.user) {
      onAuthSuccess && onAuthSuccess(data.user);
      onClose && onClose();
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', backdropFilter: 'blur(4px)' }}>
      <div className="glass-card" style={{ width: '100%', maxWidth: '440px', padding: '28px', display: 'flex', flexDirection: 'column', gap: '20px', position: 'relative' }}>
        
        {/* Decorative Top Accent Bar */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'var(--emerald-gradient)' }} />

        {/* Close Button */}
        <button onClick={onClose} style={{ position: 'absolute', top: '16px', right: '16px', border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-muted)' }}>
          <X size={20} />
        </button>

        {/* Header */}
        <div>
          <h3 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--text-main)', marginBottom: '4px' }}>
            {mode === 'login' ? 'Sign in to SignVision' : 'Join SignVision'}
          </h3>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            {mode === 'login' ? 'Sync your SASL learning streaks, XP, and custom datasets' : 'Start your journey mastering South African Sign Language'}
          </p>
        </div>

        <div style={{ padding: '10px 14px', background: 'var(--mint-badge)', borderRadius: '10px', fontSize: '12px', color: 'var(--mint-text)', fontWeight: '600' }}>
          🔒 Powered by secure Flask backend Supabase service.
        </div>

        {/* Mode Switcher Tabs */}
        <div style={{ display: 'flex', background: 'var(--bg-card-subtle)', borderRadius: '10px', padding: '4px', border: '1px solid var(--border-light)' }}>
          <button
            onClick={() => { setMode('login'); setErrorMsg(''); }}
            style={{
              flex: 1,
              padding: '8px',
              borderRadius: '8px',
              border: 'none',
              background: mode === 'login' ? 'var(--primary-emerald)' : 'transparent',
              color: mode === 'login' ? '#FFF' : 'var(--text-muted)',
              fontSize: '13px',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            Sign In
          </button>
          <button
            onClick={() => { setMode('signup'); setErrorMsg(''); }}
            style={{
              flex: 1,
              padding: '8px',
              borderRadius: '8px',
              border: 'none',
              background: mode === 'signup' ? 'var(--primary-emerald)' : 'transparent',
              color: mode === 'signup' ? '#FFF' : 'var(--text-muted)',
              fontSize: '13px',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            Create Account
          </button>
        </div>

        {/* Error / Success Messages */}
        {errorMsg && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', borderRadius: '10px', background: '#FEE2E2', border: '1px solid #EF4444', color: '#B91C1C', fontSize: '13px', fontWeight: '600' }}>
            <AlertCircle size={16} /> {errorMsg}
          </div>
        )}

        {successMsg && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', borderRadius: '10px', background: '#D1FAE5', border: '1px solid #10B981', color: '#047857', fontSize: '13px', fontWeight: '600' }}>
            <CheckCircle2 size={16} /> {successMsg}
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {mode === 'signup' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-main)' }}>Full Name</label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <User size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px' }} />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Thabo Mokoena"
                  style={{
                    width: '100%',
                    padding: '11px 12px 11px 36px',
                    borderRadius: '10px',
                    border: '1px solid var(--border-light)',
                    background: 'var(--bg-card-subtle)',
                    color: 'var(--text-main)',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                />
              </div>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-main)' }}>Email Address</label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Mail size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px' }} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="learner@signvision.co.za"
                style={{
                  width: '100%',
                  padding: '11px 12px 11px 36px',
                  borderRadius: '10px',
                  border: '1px solid var(--border-light)',
                  background: 'var(--bg-card-subtle)',
                  color: 'var(--text-main)',
                  fontSize: '14px',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-main)' }}>Password</label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Lock size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px' }} />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{
                  width: '100%',
                  padding: '11px 12px 11px 36px',
                  borderRadius: '10px',
                  border: '1px solid var(--border-light)',
                  background: 'var(--bg-card-subtle)',
                  color: 'var(--text-main)',
                  fontSize: '14px',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{ width: '100%', justifyContent: 'center', marginTop: '6px', padding: '12px' }}
          >
            {loading ? 'Processing...' : (mode === 'login' ? 'Sign In with Supabase' : 'Create Supabase Account')}
          </button>
        </form>

        {/* Quick Demo Sign In */}
        <button
          onClick={handleDemoSignIn}
          className="btn-outline"
          style={{ width: '100%', justifyContent: 'center', fontSize: '13px', padding: '10px' }}
        >
          ⚡ Instant Demo Sign-In (Thabo Mokoena)
        </button>

      </div>
    </div>
  );
}
