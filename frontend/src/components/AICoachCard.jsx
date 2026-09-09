import React, { useState, useEffect } from 'react';

export default function AICoachCard({ currentSign, currentConfidence, landmarkCount }) {
  const [loading, setLoading] = useState(false);
  const [coachData, setCoachData] = useState({
    alignment_score: 88,
    coaching_tip: "Maintain a steady wrist position and keep your non-dominant palm facing flat up.",
    feedback_details: {
      wrist_posture: "Optimal",
      finger_spacing: "Wide & Clear",
      hand_count: "Dual Hand (2)"
    }
  });

  const fetchCoachFeedback = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/ai-coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          target_sign: currentSign || 'HELP',
          detected_sign: currentSign || 'HELP',
          confidence: currentConfidence || 0.85,
          landmark_count: landmarkCount || 42
        })
      });
      const data = await res.json();
      if (data) {
        setCoachData(data);
      }
    } catch (err) {
      console.error('AI Coach fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentSign) {
      fetchCoachFeedback();
    }
  }, [currentSign]);

  return (
    <div style={{
      background: 'rgba(15, 23, 42, 0.75)',
      backdropFilter: 'blur(16px)',
      border: '1px solid rgba(0, 245, 155, 0.25)',
      borderRadius: '16px',
      padding: '20px',
      color: '#f8fafc',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
      marginTop: '16px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '1.5rem' }}>🤖</span>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#00F59B', fontWeight: '700' }}>
              AI Sign Language Tutor & Pose Coach
            </h3>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Powered by OpenRouter AI</span>
          </div>
        </div>
        <button
          onClick={fetchCoachFeedback}
          disabled={loading}
          style={{
            background: 'rgba(0, 245, 155, 0.15)',
            border: '1px solid #00F59B',
            color: '#00F59B',
            padding: '6px 14px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '0.85rem',
            fontWeight: '600',
            transition: 'all 0.2s ease'
          }}
        >
          {loading ? 'Analyzing...' : '🔄 Re-Analyze Pose'}
        </button>
      </div>

      {/* Alignment Gauge Bar */}
      <div style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '6px' }}>
          <span>Posture Alignment Accuracy</span>
          <span style={{ color: coachData.alignment_score > 75 ? '#00F59B' : '#f59e0b', fontWeight: 'bold' }}>
            {coachData.alignment_score}% Match
          </span>
        </div>
        <div style={{ height: '10px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '5px', overflow: 'hidden' }}>
          <div
            style={{
              height: '100%',
              width: `${coachData.alignment_score}%`,
              background: 'linear-gradient(90deg, #a855f7 0%, #00F59B 100%)',
              transition: 'width 0.5s ease-in-out'
            }}
          />
        </div>
      </div>

      {/* AI Tutor Tip */}
      <div style={{
        background: 'rgba(0, 245, 155, 0.08)',
        borderLeft: '4px solid #00F59B',
        padding: '12px 14px',
        borderRadius: '6px',
        fontSize: '0.92rem',
        lineHeight: '1.4',
        color: '#e2e8f0',
        marginBottom: '16px'
      }}>
        <strong style={{ color: '#00F59B' }}>💡 AI Tutor Tip: </strong>
        {coachData.coaching_tip}
      </div>

      {/* Posture Detail Badges */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
        <div style={{ background: 'rgba(255, 255, 255, 0.04)', padding: '10px', borderRadius: '8px', textAlign: 'center' }}>
          <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block' }}>Wrist Angle</span>
          <strong style={{ fontSize: '0.88rem', color: '#38bdf8' }}>{coachData.feedback_details?.wrist_posture || 'Optimal'}</strong>
        </div>
        <div style={{ background: 'rgba(255, 255, 255, 0.04)', padding: '10px', borderRadius: '8px', textAlign: 'center' }}>
          <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block' }}>Finger Spacing</span>
          <strong style={{ fontSize: '0.88rem', color: '#a855f7' }}>{coachData.feedback_details?.finger_spacing || 'Clear'}</strong>
        </div>
        <div style={{ background: 'rgba(255, 255, 255, 0.04)', padding: '10px', borderRadius: '8px', textAlign: 'center' }}>
          <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block' }}>Tracking Mode</span>
          <strong style={{ fontSize: '0.88rem', color: '#00F59B' }}>{coachData.feedback_details?.hand_count || 'Dual Hand'}</strong>
        </div>
      </div>
    </div>
  );
}
