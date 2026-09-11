import React, { useState } from 'react';
import { LogIn, UserPlus, KeyRound, Mail, Lock, User, Eye, EyeOff, CheckCircle2, AlertCircle, Sparkles, ShieldCheck, School, ArrowRight, RefreshCw } from 'lucide-react';
import { signInUser, signUpUser, forgotPassword } from '../utils/supabaseClient';
import { toast } from '../utils/toast';

const PROVINCES = [
  'Gauteng', 'Western Cape', 'KwaZulu-Natal', 'Eastern Cape',
  'Free State', 'Limpopo', 'Mpumalanga', 'North West', 'Northern Cape'
];

export default function AuthPage({ initialMode = 'login', onAuthSuccess, onBackToHome }) {
  const [mode, setMode] = useState(initialMode); // 'login' | 'signup' | 'forgot'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [province, setProvince] = useState('Gauteng');
  const [school, setSchool] = useState('Johannesburg School for the Deaf');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const resetMessages = () => {
    setErrorMsg('');
    setSuccessMsg('');
  };

  const handleModeSwitch = (newMode) => {
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
          throw new Error('Passwords do not match. Please re-enter.');
        }
        if (password.length < 6) {
          throw new Error('Password must be at least 6 characters long.');
        }
        const { data, error } = await signUpUser(email, password, fullName);
        if (error) throw error;

        setSuccessMsg('Account registered successfully! Welcome to SignVision SA.');
        toast.success(`Welcome to SignVision SA, ${fullName || email}!`, 'Account Created');
        setTimeout(() => {
          onAuthSuccess && onAuthSuccess(data.user);
          if (onBackToHome) onBackToHome();
        }, 1000);
      } else if (mode === 'login') {
        const { data, error } = await signInUser(email, password);
        if (error) throw error;

        setSuccessMsg('Signed in successfully! Syncing your SASL progress...');
        toast.success('Welcome back! Cloud progress synced.', 'Signed In');
        setTimeout(() => {
          onAuthSuccess && onAuthSuccess(data.user);
          if (onBackToHome) onBackToHome();
        }, 800);
      } else if (mode === 'forgot') {
        const { data, error } = await forgotPassword(email);
        if (error) throw error;

        setSuccessMsg(data?.message || `Password reset instructions have been sent to ${email}. Check your inbox!`);
        toast.info(`Reset link dispatched to ${email}`, 'Password Recovery');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Authentication error. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setLoading(true);
    resetMessages();
    const { data, error } = await signInUser('thabo.student@signvision.co.za', 'password123');
    setLoading(false);
    if (!error && data?.user) {
      toast.success('Logged in as demo learner Thabo Mokoena!', 'Demo Access');
      onAuthSuccess && onAuthSuccess(data.user);
      if (onBackToHome) onBackToHome();
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      width: '100%',
      minHeight: '82vh',
      boxSizing: 'border-box'
    }}>
      {/* Top Banner */}
      <div
        className="glass-card"
        style={{
          padding: '16px 22px',
          borderRadius: '16px',
          background: 'linear-gradient(135deg, #2D848A 0%, #205E63 100%)',
          color: '#FFFFFF',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'rgba(255, 255, 255, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF'
          }}>
            <ShieldCheck size={24} />
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '800' }}>
              SignVision SA Authentication & Cloud Sync
            </h2>
            <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#C1DFF0' }}>
              {mode === 'login' && 'Sign in to sync your streaks, classroom badges, and custom SASL datasets'}
              {mode === 'signup' && 'Create a certified South African Sign Language learner profile'}
              {mode === 'forgot' && 'Recover access to your SignVision account via secure verification'}
            </p>
          </div>
        </div>

        {onBackToHome && (
          <button
            onClick={onBackToHome}
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              borderRadius: '8px',
              padding: '6px 14px',
              color: '#FFFFFF',
              fontSize: '12px',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            ← Back to Dashboard
          </button>
        )}
      </div>

      {/* Main 2-Column Auth Layout: Brand Hero on Left, Form Card on Right */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1.15fr) minmax(360px, 1fr)',
        gap: '16px',
        alignItems: 'stretch'
      }}>
        {/* Left: Visual Brand Hero & Features */}
        <div
          className="glass-card"
          style={{
            padding: '32px',
            borderRadius: '16px',
            background: '#FFFFFF',
            border: '1px solid rgba(136, 204, 241, 0.4)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: '24px',
            boxShadow: '0 4px 20px rgba(45, 137, 139, 0.08)'
          }}
        >
          <div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '5px 12px',
              borderRadius: '9999px',
              background: '#E6F4FA',
              color: '#2D848A',
              fontSize: '12px',
              fontWeight: '800',
              marginBottom: '16px'
            }}>
              <Sparkles size={14} color="#2D848A" /> Official 12th National Language of South Africa
            </div>

            <h1 style={{
              fontSize: '28px',
              fontWeight: '800',
              color: '#133340',
              lineHeight: '1.25',
              margin: '0 0 14px 0'
            }}>
              Bridging Communities with Real-Time SASL Translation
            </h1>

            <p style={{ fontSize: '14px', color: '#5C7B8A', lineHeight: '1.6', margin: '0 0 24px 0' }}>
              SignVision enables Deaf and hearing South Africans to communicate seamlessly using AI computer vision, 3D digital avatars, and real-time WebRTC sign calling.
            </p>

            {/* Feature Badges List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#F0F7FB', border: '1px solid #C1DFF0', color: '#2D848A', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <CheckCircle2 size={18} />
                </div>
                <div>
                  <strong style={{ fontSize: '13.5px', color: '#133340', display: 'block' }}>Instant 2-Way Live Translation</strong>
                  <span style={{ fontSize: '12px', color: '#5C7B8A' }}>Camera-to-text and voice-to-avatar translation across 11 national official languages.</span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#F0F7FB', border: '1px solid #C1DFF0', color: '#2D848A', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <CheckCircle2 size={18} />
                </div>
                <div>
                  <strong style={{ fontSize: '13.5px', color: '#133340', display: 'block' }}>National STEM Classroom Rooms</strong>
                  <span style={{ fontSize: '12px', color: '#5C7B8A' }}>Compete with learners across all 9 provinces and climb the national leaderboard.</span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#F0F7FB', border: '1px solid #C1DFF0', color: '#2D848A', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <CheckCircle2 size={18} />
                </div>
                <div>
                  <strong style={{ fontSize: '13.5px', color: '#133340', display: 'block' }}>Deaf Crisis 1-Tap SOS Beacon</strong>
                  <span style={{ fontSize: '12px', color: '#5C7B8A' }}>Emergency voice siren and GPS dispatch to 112, 10111, and metro emergency services.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Demo Credentials Footer */}
          <div style={{
            padding: '14px 18px',
            background: '#F8FBFC',
            border: '1px solid #C1DFF0',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px'
          }}>
            <div>
              <span style={{ fontSize: '11px', color: '#5C7B8A', fontWeight: '700', textTransform: 'uppercase', display: 'block' }}>
                Quick Demo Access
              </span>
              <span style={{ fontSize: '12.5px', color: '#133340', fontWeight: '700' }}>
                thabo.student@signvision.co.za
              </span>
            </div>
            <button
              onClick={handleDemoLogin}
              disabled={loading}
              style={{
                padding: '8px 14px',
                borderRadius: '8px',
                border: 'none',
                background: '#2D848A',
                color: '#FFFFFF',
                fontSize: '12px',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              1-Click Demo <ArrowRight size={13} />
            </button>
          </div>
        </div>

        {/* Right: Auth Form Container */}
        <div
          className="glass-card"
          style={{
            padding: '30px 28px',
            borderRadius: '16px',
            background: '#FFFFFF',
            border: '1px solid rgba(136, 204, 241, 0.4)',
            display: 'flex',
            flexDirection: 'column',
            gap: '18px',
            boxShadow: '0 4px 20px rgba(45, 137, 139, 0.08)'
          }}
        >
          {/* Mode Switcher Tabs */}
          <div style={{ display: 'flex', background: '#F0F7FB', borderRadius: '10px', padding: '3px', border: '1px solid #C1DFF0' }}>
            <button
              onClick={() => handleModeSwitch('login')}
              style={{
                flex: 1,
                padding: '9px 12px',
                borderRadius: '8px',
                border: 'none',
                background: mode === 'login' ? '#2D848A' : 'transparent',
                color: mode === 'login' ? '#FFFFFF' : '#5C7B8A',
                fontSize: '13px',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
            >
              <LogIn size={15} /> Sign In
            </button>

            <button
              onClick={() => handleModeSwitch('signup')}
              style={{
                flex: 1,
                padding: '9px 12px',
                borderRadius: '8px',
                border: 'none',
                background: mode === 'signup' ? '#2D848A' : 'transparent',
                color: mode === 'signup' ? '#FFFFFF' : '#5C7B8A',
                fontSize: '13px',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
            >
              <UserPlus size={15} /> Register
            </button>

            <button
              onClick={() => handleModeSwitch('forgot')}
              style={{
                flex: 1,
                padding: '9px 12px',
                borderRadius: '8px',
                border: 'none',
                background: mode === 'forgot' ? '#2D848A' : 'transparent',
                color: mode === 'forgot' ? '#FFFFFF' : '#5C7B8A',
                fontSize: '13px',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
            >
              <KeyRound size={15} /> Reset
            </button>
          </div>

          {/* Form Header */}
          <div>
            <h3 style={{ margin: '0 0 4px 0', fontSize: '18px', fontWeight: '800', color: '#133340' }}>
              {mode === 'login' && 'Sign In to Your Account'}
              {mode === 'signup' && 'Create Your Learner Profile'}
              {mode === 'forgot' && 'Reset Your Password'}
            </h3>
            <p style={{ margin: 0, fontSize: '12.5px', color: '#5C7B8A' }}>
              {mode === 'login' && 'Enter your email and password to access your SASL progress.'}
              {mode === 'signup' && 'Join students and mentors mastering South African Sign Language.'}
              {mode === 'forgot' && 'Enter your registered email to receive recovery instructions.'}
            </p>
          </div>

          {/* Error & Success Messages */}
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

          {/* Auth Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            
            {/* Full Name (Sign Up Only) */}
            {mode === 'signup' && (
              <div>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', color: '#133340', marginBottom: '6px' }}>
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
                      padding: '10px 12px 10px 36px',
                      borderRadius: '10px',
                      border: '1px solid #C1DFF0',
                      background: '#F0F7FB',
                      fontSize: '13.5px',
                      color: '#133340',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>
            )}

            {/* Email Field (All Modes) */}
            <div>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', color: '#133340', marginBottom: '6px' }}>
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
                    padding: '10px 12px 10px 36px',
                    borderRadius: '10px',
                    border: '1px solid #C1DFF0',
                    background: '#F0F7FB',
                    fontSize: '13.5px',
                    color: '#133340',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>

            {/* Password Field (Login & Sign Up) */}
            {mode !== 'forgot' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <label style={{ fontSize: '12.5px', fontWeight: '700', color: '#133340' }}>
                    Password
                  </label>
                  {mode === 'login' && (
                    <button
                      type="button"
                      onClick={() => handleModeSwitch('forgot')}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#2D848A',
                        fontSize: '11.5px',
                        fontWeight: '700',
                        cursor: 'pointer',
                        padding: 0
                      }}
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
                    placeholder="Enter your password..."
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 36px 10px 36px',
                      borderRadius: '10px',
                      border: '1px solid #C1DFF0',
                      background: '#F0F7FB',
                      fontSize: '13.5px',
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

            {/* Confirm Password & School (Sign Up Only) */}
            {mode === 'signup' && (
              <>
                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', color: '#133340', marginBottom: '6px' }}>
                    Confirm Password
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={16} color="#5C7B8A" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="Re-enter your password..."
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 12px 10px 36px',
                        borderRadius: '10px',
                        border: '1px solid #C1DFF0',
                        background: '#F0F7FB',
                        fontSize: '13.5px',
                        color: '#133340',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '10px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#133340', marginBottom: '6px' }}>
                      Province
                    </label>
                    <select
                      value={province}
                      onChange={(e) => setProvince(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '9px 10px',
                        borderRadius: '10px',
                        border: '1px solid #C1DFF0',
                        background: '#F0F7FB',
                        fontSize: '12.5px',
                        color: '#133340',
                        outline: 'none'
                      }}
                    >
                      {PROVINCES.map((p) => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#133340', marginBottom: '6px' }}>
                      School / Academy
                    </label>
                    <input
                      type="text"
                      value={school}
                      onChange={(e) => setSchool(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '9px 10px',
                        borderRadius: '10px',
                        border: '1px solid #C1DFF0',
                        background: '#F0F7FB',
                        fontSize: '12.5px',
                        color: '#133340',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                </div>
              </>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '12px 20px',
                borderRadius: '10px',
                border: 'none',
                background: '#2D848A',
                color: '#FFFFFF',
                fontSize: '14px',
                fontWeight: '800',
                cursor: loading ? 'wait' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 16px rgba(45, 132, 138, 0.3)',
                marginTop: '6px'
              }}
            >
              {loading && <RefreshCw size={16} className="spin" />}
              {mode === 'login' && (loading ? 'Signing In...' : 'Sign In to Account')}
              {mode === 'signup' && (loading ? 'Creating Profile...' : 'Complete Registration')}
              {mode === 'forgot' && (loading ? 'Sending Instructions...' : 'Send Password Reset Email')}
            </button>
          </form>

          {/* Alternate Navigation Footer */}
          <div style={{
            borderTop: '1px solid #C1DFF0',
            paddingTop: '14px',
            textAlign: 'center',
            fontSize: '12.5px',
            color: '#5C7B8A'
          }}>
            {mode === 'login' && (
              <span>
                Don't have an account yet?{' '}
                <button
                  onClick={() => handleModeSwitch('signup')}
                  style={{ background: 'none', border: 'none', color: '#2D848A', fontWeight: '800', cursor: 'pointer', padding: 0 }}
                >
                  Register Now
                </button>
              </span>
            )}

            {mode === 'signup' && (
              <span>
                Already have an account?{' '}
                <button
                  onClick={() => handleModeSwitch('login')}
                  style={{ background: 'none', border: 'none', color: '#2D848A', fontWeight: '800', cursor: 'pointer', padding: 0 }}
                >
                  Sign In Here
                </button>
              </span>
            )}

            {mode === 'forgot' && (
              <span>
                Remembered your password?{' '}
                <button
                  onClick={() => handleModeSwitch('login')}
                  style={{ background: 'none', border: 'none', color: '#2D848A', fontWeight: '800', cursor: 'pointer', padding: 0 }}
                >
                  Back to Sign In
                </button>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
