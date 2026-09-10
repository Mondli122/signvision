import React, { useState } from 'react';
import { Share2, X, Copy, Check, Award, Trophy, Sparkles } from 'lucide-react';
import { toast } from '../utils/toast';

export default function ShareModal({ progress, onClose }) {
  const [copied, setCopied] = useState(false);

  const streak = progress?.streak || 5;
  const xp = progress?.xp || 320;
  const level = progress?.level || 2;

  const shareText = `🇿🇦 I'm learning South African Sign Language on SignVision! Current Streak: ${streak} Days 🔥 | Level ${level} (${xp} XP). Empowering SASL communication across SA! 🤝 #RoboRumble #SignBridgeSA`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    toast.success('Certificate & stats copied to clipboard!', 'Ready to Share');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank');
  };

  const handleShareWhatsApp = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank');
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', backdropFilter: 'blur(4px)' }}>
      <div className="glass-card" style={{ width: '100%', maxWidth: '480px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', position: 'relative' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'var(--mint-badge)', color: 'var(--primary-emerald)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Share2 size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-main)' }}>Share Your Progress</h3>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Celebrate your South African Sign Language milestones</p>
            </div>
          </div>
          <button onClick={onClose} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-muted)' }}>
            <X size={20} />
          </button>
        </div>

        {/* Certificate Card Preview */}
        <div
          style={{
            padding: '20px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
            border: '2px solid rgba(0, 168, 132, 0.4)',
            color: '#FFFFFF',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 8px 24px rgba(0,0,0,0.3)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <span style={{ fontSize: '12px', letterSpacing: '1px', textTransform: 'uppercase', color: '#10B981', fontWeight: '700' }}>
              Official SASL Achievement Card
            </span>
            <span style={{ fontSize: '20px' }}>🇿🇦</span>
          </div>

          <h4 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '4px' }}>SignVision Scholar</h4>
          <p style={{ fontSize: '12px', color: '#94A3B8', marginBottom: '16px' }}>
            Robo Rumble Technomania 2026 Initiative
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', textAlign: 'center' }}>
            <div style={{ background: 'rgba(255,255,255,0.08)', padding: '10px', borderRadius: '10px' }}>
              <div style={{ fontSize: '18px', fontWeight: '800', color: '#10B981' }}>{streak} Days</div>
              <div style={{ fontSize: '10px', color: '#94A3B8' }}>Streak</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.08)', padding: '10px', borderRadius: '10px' }}>
              <div style={{ fontSize: '18px', fontWeight: '800', color: '#38BDF8' }}>Level {level}</div>
              <div style={{ fontSize: '10px', color: '#94A3B8' }}>Rank</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.08)', padding: '10px', borderRadius: '10px' }}>
              <div style={{ fontSize: '18px', fontWeight: '800', color: '#FBBF24' }}>{xp} XP</div>
              <div style={{ fontSize: '10px', color: '#94A3B8' }}>Experience</div>
            </div>
          </div>
        </div>

        {/* Share Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button
            onClick={handleCopy}
            className="btn-primary"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px', borderRadius: '12px', fontSize: '14px' }}
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
            <span>{copied ? 'Copied to Clipboard!' : 'Copy Achievement Text'}</span>
          </button>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <button
              onClick={handleShareWhatsApp}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '10px',
                borderRadius: '10px',
                background: '#25D366',
                color: '#FFFFFF',
                border: 'none',
                fontWeight: '700',
                cursor: 'pointer',
                fontSize: '13px'
              }}
            >
              💬 WhatsApp
            </button>

            <button
              onClick={handleShareTwitter}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '10px',
                borderRadius: '10px',
                background: '#0F172A',
                color: '#FFFFFF',
                border: 'none',
                fontWeight: '700',
                cursor: 'pointer',
                fontSize: '13px'
              }}
            >
              𝕏 Post
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
