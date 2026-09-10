import React, { useState } from 'react';
import { Camera, Bot, AlertTriangle, Repeat, X, ArrowRight, Check } from 'lucide-react';
import { setOnboarded } from '../utils/storage';

const STEPS = [
  {
    icon: Camera,
    iconColor: '#00A884',
    iconBg: '#D1FAE5',
    title: 'AI Computer Vision Sign Recognition',
    desc: 'SignVision captures your 42 3D hand landmarks in real-time right from your webcam using Google MediaPipe and our offline Random Forest classifier.'
  },
  {
    icon: Bot,
    iconColor: '#0284C7',
    iconBg: '#E0F2FE',
    title: 'OpenRouter Free AI Translation & Pose Coach',
    desc: 'Transforms raw SASL gloss streams into fluent natural sentences in English, Zulu, Xhosa, and Afrikaans, and provides real-time coaching tips on your hand posture.'
  },
  {
    icon: Repeat,
    iconColor: '#8B5CF6',
    iconBg: '#EDE9FE',
    title: 'Bi-Directional Communication & Speed Quiz',
    desc: 'Communicate effortlessly both ways: Sign-to-Speech or Voice-to-Sign, and test your fluency with gamified quizzes, streaks, and XP points.'
  },
  {
    icon: AlertTriangle,
    iconColor: '#EF4444',
    iconBg: '#FEE2E2',
    title: '1-Tap Deaf Emergency SOS First-Responder Hub',
    desc: 'Broadcast instant emergency dispatches with loud acoustic sirens, high-contrast strobe visuals, and real-time GPS coordinates to police, medical, and fire units.'
  }
];

export default function OnboardingModal({ onClose }) {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep + 1 < STEPS.length) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleFinish();
    }
  };

  const handleFinish = () => {
    setOnboarded();
    onClose && onClose();
  };

  const StepIcon = STEPS[currentStep].icon;

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', backdropFilter: 'blur(5px)' }}>
      <div className="glass-card" style={{ width: '100%', maxWidth: '480px', padding: '32px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '20px', position: 'relative' }}>
        
        <button onClick={handleFinish} style={{ position: 'absolute', top: '16px', right: '16px', border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-muted)' }}>
          <X size={20} />
        </button>

        {/* Step Indicator Dots */}
        <div style={{ display: 'flex', gap: '8px' }}>
          {STEPS.map((_, i) => (
            <div
              key={i}
              style={{
                width: i === currentStep ? '24px' : '8px',
                height: '8px',
                borderRadius: '4px',
                background: i === currentStep ? 'var(--primary-emerald)' : 'var(--border-light)',
                transition: 'all 0.2s ease'
              }}
            />
          ))}
        </div>

        {/* Icon Circle */}
        <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: STEPS[currentStep].iconBg, color: STEPS[currentStep].iconColor, display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '10px' }}>
          <StepIcon size={36} />
        </div>

        <div>
          <h3 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--text-main)', marginBottom: '8px' }}>
            {STEPS[currentStep].title}
          </h3>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.5' }}>
            {STEPS[currentStep].desc}
          </p>
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', gap: '12px', width: '100%', marginTop: '10px' }}>
          <button className="btn-outline" style={{ flex: 1, justifyContent: 'center' }} onClick={handleFinish}>
            Skip Tour
          </button>
          <button className="btn-primary" style={{ flex: 1, justifyContent: 'center' }} onClick={handleNext}>
            {currentStep + 1 === STEPS.length ? 'Get Started' : 'Next'} <ArrowRight size={16} />
          </button>
        </div>

      </div>
    </div>
  );
}
