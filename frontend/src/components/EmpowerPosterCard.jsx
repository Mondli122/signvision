import React, { useState } from 'react';
import { Heart, Sparkles, Share2, Award, BookOpen, ShieldCheck, ChevronRight } from 'lucide-react';
import { toast } from '../utils/toast';

export default function EmpowerPosterCard() {
  const [activeFactIndex, setActiveFactIndex] = useState(0);

  const facts = [
    {
      title: "12th Official Language 🇿🇦",
      badge: "Constitutional Act 2023",
      stat: "July 2023",
      description: "Signed into law as South Africa's 12th official language, enshrining equal linguistic dignity under Section 6 of the Constitution."
    },
    {
      title: "Vibrant Deaf Community",
      badge: "National Demographic",
      stat: "600,000+",
      description: "Over 600,000 South Africans rely on SASL daily across public health, education, transport, and community life."
    },
    {
      title: "STEM Robotics Inclusion",
      badge: "Robo Rumble 2026",
      stat: "43 Schools",
      description: "Partnering with specialized Deaf academies across all 9 provinces to teach robotics, Python, and AI."
    },
    {
      title: "100% Offline Edge Vision",
      badge: "Rural Accessibility",
      stat: "0 MB Data",
      description: "PWA service worker and on-device MediaPipe models allow learners in remote townships to practice without airtime."
    }
  ];

  const current = facts[activeFactIndex];

  const handleShareAdvocacy = async () => {
    const text = `South African Sign Language (SASL) is our 12th Official Language! Explore real-time AI translation & STEM learning with SignVision SA. #RoboRumble2026 #SASL`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'SignVision SA - SASL Empowerment',
          text: text,
          url: window.location.origin
        });
      } catch (e) {
        // User cancelled share
      }
    } else {
      navigator.clipboard.writeText(`${text} ${window.location.origin}`);
      toast.success('SASL advocacy message copied to clipboard!', 'Advocate & Share');
    }
  };

  return (
    <div
      className="glass-card"
      style={{
        borderRadius: '18px',
        position: 'relative',
        height: '100%',
        minHeight: '220px',
        background: 'linear-gradient(135deg, #0284C7 0%, #0369A1 45%, #0F172A 100%)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '22px',
        color: '#FFFFFF',
        boxShadow: '0 8px 24px rgba(2, 132, 199, 0.25)',
        overflow: 'hidden'
      }}
    >
      {/* Decorative background glow */}
      <div style={{
        position: 'absolute',
        top: '-40px',
        right: '-40px',
        width: '180px',
        height: '180px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(16, 185, 129, 0.35) 0%, rgba(234, 179, 8, 0.2) 60%, transparent 100%)',
        filter: 'blur(25px)',
        pointerEvents: 'none'
      }} />

      {/* Top Bar: Title & Advocacy Share Button */}
      <div style={{ position: 'relative', zIndex: 2 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '3px 10px', borderRadius: '12px', background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(4px)', fontSize: '11px', fontWeight: '700', marginBottom: '8px', letterSpacing: '0.4px' }}>
              <Sparkles size={12} color="#FDE047" />
              <span>{current.badge}</span>
            </div>
            <h3 style={{
              fontSize: '20px',
              fontWeight: '800',
              lineHeight: '1.2',
              fontFamily: 'var(--font-heading)'
            }}>
              {current.title}
            </h3>
          </div>

          <button
            onClick={handleShareAdvocacy}
            title="Share SASL Inclusion Message"
            style={{
              background: 'rgba(255,255,255,0.18)',
              border: 'none',
              borderRadius: '10px',
              padding: '8px',
              color: '#FFFFFF',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background 0.2s ease'
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.3)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.18)'}
          >
            <Share2 size={16} />
          </button>
        </div>

        {/* Fact Card Content */}
        <div style={{ marginTop: '12px', display: 'flex', alignItems: 'baseline', gap: '10px' }}>
          <span style={{ fontSize: '26px', fontWeight: '900', color: '#34D399', fontFamily: 'var(--font-heading)' }}>
            {current.stat}
          </span>
        </div>
        <p style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.88)', lineHeight: '1.45', marginTop: '4px' }}>
          {current.description}
        </p>
      </div>

      {/* Bottom Interactive Indicators */}
      <div style={{ position: 'relative', zIndex: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '14px', paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.15)' }}>
        <div style={{ display: 'flex', gap: '6px' }}>
          {facts.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveFactIndex(idx)}
              style={{
                width: activeFactIndex === idx ? '22px' : '7px',
                height: '7px',
                borderRadius: '4px',
                background: activeFactIndex === idx ? '#34D399' : 'rgba(255,255,255,0.3)',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                padding: 0
              }}
            />
          ))}
        </div>

        <button
          onClick={() => setActiveFactIndex((prev) => (prev + 1) % facts.length)}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'rgba(255,255,255,0.85)',
            fontSize: '11px',
            fontWeight: '700',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '3px'
          }}
        >
          <span>Next Insight</span>
          <ChevronRight size={13} />
        </button>
      </div>
    </div>
  );
}
