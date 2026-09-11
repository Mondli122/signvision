import React, { useState } from 'react';
import { LogIn, UserPlus, KeyRound, X, Mail, Lock, User, AlertCircle, CheckCircle2, Eye, EyeOff, Sparkles, RefreshCw } from 'lucide-react';
import { signInUser, signUpUser, forgotPassword } from '../utils/supabaseClient';
import { toast } from '../utils/toast';

export default function AuthModal({ onClose, onAuthSuccess, defaultMode = 'login' }) {
  const [mode, setMode] = useState(defaultMode); // 'login' | 'signup' | 'forgot'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const resetMessages = () => {
    setErrorMsg('');
    setSuccessMsg('');
  };

  const handleModeChange = (newMode) => {
    setMode(newMode);
    resetMessages();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    resetMessages();
    setLoading(true);

    try {
      if (mode === 'signup') {
        if (password !== confirmPassword) {
          throw new Error('Passwords do not match.');
        }
        if (password.length < 6) {
          throw new Error('Password must be at least 6 characters long.');
        }
        const { data, error } = await signUpUser(email, password, fullName);
        if (error) throw error;
        setSuccessMsg('Account created successfully!');
        toast.success(`Welcome to SignVision SA, ${fullName || email}!`, 'Account Created');
        setTimeout(() => {
          onAuthSuccess && onAuthSuccess(data.user);
          onClose && onClose();
        }, 800);
      } else if (mode === 'login') {
        const { data, error } = await signInUser(email, password);
        if (error) throw error;
        setSuccessMsg('Welcome back!');
        toast.success('Signed in successfully!', 'Welcome');
        setTimeout(() => {
          onAuthSuccess && onAuthSuccess(data.user);
          onClose && onClose();
        }, 600);
      } else if (mode === 'forgot') {
        const { data, error } = await forgotPassword(email);
        if (error) throw error;
        setSuccessMsg(data?.message || `Password reset instructions have been dispatched to ${email}.`);
        toast.info(`Recovery instructions sent to ${email}`, 'Password Reset');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Authentication error. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoSignIn = async () => {
    setLoading(true);
    resetMessages();
    const { data } = await signInUser('thabo.student@signvision.co.za', 'password123');
    setLoading(false);
    if (data?.user) {
      toast.success('Logged in with Demo Account', 'Demo Access');
      onAuthSuccess && onAuthSuccess(data.user);
      onClose && onClose();
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(5, 9, 18, 0.75)',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px',
      backdropFilter: 'blur(8px)'
    }}>
      <div
        className="glass-card"
        style={{
          width: '100%',
          maxWidth: '460px',
          background: '#FFFFFF',
          borderRadius: '16px',
          border: '1px solid rgba(136, 204, 241, 0.4)',
          padding: '28px',
          display: 'flex',
          flexDirection: 'column',
          gap: '18px',
          position: 'relative',
          boxShadow: '0 8px 32px rgba(45, 137, 139, 0.2)'
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            border: 'none',
            background: '#F0F7FB',
            color: '#5C7B8A',
            borderRadius: '8px',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '700'
          }}
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span style={{ fontSize: '20px' }}>🇿🇦</span>
            <h3 style={{ fontSize: '19px', fontWeight: '800', color: '#133340', margin: 0 }}>
              {mode === 'login' && 'Sign in to SignVision SA'}
              {mode === 'signup' && 'Create Your SignVision Account'}
              {mode === 'forgot' && 'Reset Your Password'}
            </h3>
          </div>
          <p style={{ fontSize: '12.5px', color: '#5C7B8A', margin: 0 }}>
            {mode === 'login' && 'Sync your SASL learning streaks, XP, and custom datasets'}
            {mode === 'signup' && 'Start your journey mastering South African Sign Language'}
            {mode === 'forgot' && 'We will send recovery instructions to your email'}
          </p>
        </div>

        {/* Mode Switcher Tabs */}
        <div style={{ display: 'flex', background: '#F0F7FB', borderRadius: '10px', padding: '3px', border: '1px solid #C1DFF0' }}>
          <button
            onClick={() => handleModeChange('login')}
            style={{
              flex: 1,
              padding: '8px 10px',
              borderRadius: '8px',
              border: 'none',
              background: mode === 'login' ? '#2D848A' : 'transparent',
              color: mode === 'login' ? '#FFFFFF' : '#5C7B8A',
              fontSize: '12.5px',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <LogIn size={14} /> Sign In
          </button>
          <button
            onClick={() => handleModeChange('signup')}
            style={{
              flex: 1,
              padding: '8px 10px',
              borderRadius: '8px',
              border: 'none',
              background: mode === 'signup' ? '#2D848A' : 'transparent',
              color: mode === 'signup' ? '#FFFFFF' : '#5C7B8A',
              fontSize: '12.5px',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <UserPlus size={14} /> Register
          </button>
          <button
            onClick={() => handleModeChange('forgot')}
            style={{
              flex: 1,
              padding: '8px 10px',
              borderRadius: '8px',
              border: 'none',
              background: mode === 'forgot' ? '#2D848A' : 'transparent',
              color: mode === 'forgot' ? '#FFFFFF' : '#5C7B8A',
              fontSize: '12.5px',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <KeyRound size={14} /> Reset
          </button>
        </div>

        {/* Error / Success Feedback Alerts */}
        {errorMsg && (
          <div style={{
            background: '#FEF2F2',
            border: '1px solid #FCA5A5',
            borderRadius: '10px',
            padding: '10px 14px',
            color: '#DC2626',
            fontSize: '12.5px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div style={{
            background: '#F0FDF4',
            border: '1px solid #86EFAC',
            borderRadius: '10px',
            padding: '10px 14px',
            color: '#16A34A',
            fontSize: '12.5px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <CheckCircle2 size={16} style={{ flexShrink: 0 }} />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Form Inputs */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          
          {mode === 'signup' && (
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#133340', marginBottom: '5px' }}>
                Full Name
              </label>
              <div style={{ position: 'relative' }}>
                <User size={16} color="#5C7B8A" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  required
                  placeholder="e.g. Sipho Dlamini"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '9px 12px 9px 36px',
                    borderRadius: '10px',
                    border: '1px solid #C1DFF0',
                    background: '#F0F7FB',
                    fontSize: '13px',
                    color: '#133340',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>
          )}

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#133340', marginBottom: '5px' }}>
              Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} color="#5C7B8A" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="email"
                required
                placeholder="name@example.co.za"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 12px 9px 36px',
                  borderRadius: '10px',
                  border: '1px solid #C1DFF0',
                  background: '#F0F7FB',
                  fontSize: '13px',
                  color: '#133340',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>

          {mode !== 'forgot' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                <label style={{ fontSize: '12px', fontWeight: '700', color: '#133340' }}>
                  Password
                </label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => handleModeChange('forgot')}
                    style={{ background: 'none', border: 'none', color: '#2D848A', fontSize: '11px', fontWeight: '700', cursor: 'pointer', padding: 0 }}
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
              <div style={{ position: 'relative' }}>
                <Lock size={16} color="#5C7B8A" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Enter password..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '9px 36px 9px 36px',
                    borderRadius: '10px',
                    border: '1px solid #C1DFF0',
                    background: '#F0F7FB',
                    fontSize: '13px',
                    color: '#133340',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#5C7B8A',
                    padding: 0
                  }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
          )}

          {mode === 'signup' && (
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#133340', marginBottom: '5px' }}>
                Confirm Password
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} color="#5C7B8A" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Confirm password..."
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '9px 12px 9px 36px',
                    borderRadius: '10px',
                    border: '1px solid #C1DFF0',
                    background: '#F0F7FB',
                    fontSize: '13px',
                    color: '#133340',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '11px',
              borderRadius: '10px',
              border: 'none',
              background: '#2D848A',
              color: '#FFFFFF',
              fontSize: '13.5px',
              fontWeight: '800',
              cursor: loading ? 'wait' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              marginTop: '4px',
              boxShadow: '0 4px 14px rgba(45, 132, 138, 0.25)'
            }}
          >
            {loading && <RefreshCw size={14} className="spin" />}
            {mode === 'login' && (loading ? 'Signing In...' : 'Sign In')}
            {mode === 'signup' && (loading ? 'Creating Account...' : 'Register Account')}
            {mode === 'forgot' && (loading ? 'Sending Link...' : 'Send Reset Link')}
          </button>
        </form>

        {/* Demo Login Shortcut */}
        {mode === 'login' && (
          <div style={{ textAlign: 'center' }}>
            <button
              onClick={handleDemoSignIn}
              disabled={loading}
              style={{
                background: '#F0F7FB',
                border: '1px solid #C1DFF0',
                borderRadius: '8px',
                padding: '7px 14px',
                color: '#2D848A',
                fontSize: '12px',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Sparkles size={14} /> Quick Demo Login (Thabo Mokoena)
            </button>
          </div>
        )}

        {/* Alternate Mode Navigation Footer */}
        <div style={{
          borderTop: '1px solid #C1DFF0',
          paddingTop: '12px',
          textAlign: 'center',
          fontSize: '12px',
          color: '#5C7B8A'
        }}>
          {mode === 'login' && (
            <span>
              Don't have an account?{' '}
              <button
                onClick={() => handleModeChange('signup')}
                style={{ background: 'none', border: 'none', color: '#2D848A', fontWeight: '800', cursor: 'pointer', padding: 0 }}
              >
                Register
              </button>
            </span>
          )}

          {mode === 'signup' && (
            <span>
              Already have an account?{' '}
              <button
                onClick={() => handleModeChange('login')}
                style={{ background: 'none', border: 'none', color: '#2D848A', fontWeight: '800', cursor: 'pointer', padding: 0 }}
              >
                Sign In
              </button>
            </span>
          )}

          {mode === 'forgot' && (
            <span>
              Remember your credentials?{' '}
              <button
                onClick={() => handleModeChange('login')}
                style={{ background: 'none', border: 'none', color: '#2D848A', fontWeight: '800', cursor: 'pointer', padding: 0 }}
              >
                Back to Sign In
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
