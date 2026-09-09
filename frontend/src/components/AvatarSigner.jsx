import React, { useRef, useEffect, useState } from 'react';

export default function AvatarSigner({ activeGloss, isPlaying, onFinish }) {
  const canvasRef = useRef(null);
  const [currentFrame, setCurrentFrame] = useState(0);

  useEffect(() => {
    if (!isPlaying || !activeGloss) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let animationFrameId;
    let frame = 0;
    const totalFrames = 60; // 2 second animation

    const renderAvatarFrame = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw background avatar frame
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw avatar head & torso
      const centerX = canvas.width / 2;
      const headY = 70;

      // Head
      ctx.beginPath();
      ctx.arc(centerX, headY, 32, 0, Math.PI * 2);
      ctx.fillStyle = '#1e293b';
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 3;
      ctx.fill();
      ctx.stroke();

      // Eyes
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(centerX - 12, headY - 6, 6, 6);
      ctx.fillRect(centerX + 6, headY - 6, 6, 6);

      // Torso
      ctx.beginPath();
      ctx.moveTo(centerX, headY + 32);
      ctx.lineTo(centerX, headY + 140);
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 8;
      ctx.stroke();

      // Shoulders
      ctx.beginPath();
      ctx.moveTo(centerX - 60, headY + 50);
      ctx.lineTo(centerX + 60, headY + 50);
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 6;
      ctx.stroke();

      // Animated Arm Keyframes based on frame phase
      const phase = (frame / totalFrames) * Math.PI * 2;
      const waveOffset = Math.sin(phase) * 35;
      const liftOffset = Math.cos(phase) * 25;

      // Right (Dominant Hand - Neon Green)
      const rShoulderX = centerX + 60;
      const rShoulderY = headY + 50;
      const rElbowX = rShoulderX + 30;
      const rElbowY = rShoulderY + 40 + liftOffset;
      const rWristX = rElbowX + 20 + waveOffset;
      const rWristY = rElbowY - 30;

      ctx.beginPath();
      ctx.moveTo(rShoulderX, rShoulderY);
      ctx.lineTo(rElbowX, rElbowY);
      ctx.lineTo(rWristX, rWristY);
      ctx.strokeStyle = '#00F59B';
      ctx.lineWidth = 5;
      ctx.stroke();

      // Hand Joint Points
      ctx.beginPath();
      ctx.arc(rWristX, rWristY, 8, 0, Math.PI * 2);
      ctx.fillStyle = '#00F59B';
      ctx.fill();

      // Left (Non-dominant Hand - Purple)
      const lShoulderX = centerX - 60;
      const lShoulderY = headY + 50;
      const lElbowX = lShoulderX - 25;
      const lElbowY = lShoulderY + 40 - liftOffset;
      const lWristX = lElbowX - 15;
      const lWristY = lElbowY + 20;

      ctx.beginPath();
      ctx.moveTo(lShoulderX, lShoulderY);
      ctx.lineTo(lElbowX, lElbowY);
      ctx.lineTo(lWristX, lWristY);
      ctx.strokeStyle = '#a855f7';
      ctx.lineWidth = 5;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(lWristX, lWristY, 8, 0, Math.PI * 2);
      ctx.fillStyle = '#a855f7';
      ctx.fill();

      // Label text
      ctx.font = 'bold 16px Inter, sans-serif';
      ctx.fillStyle = '#00F59B';
      ctx.textAlign = 'center';
      ctx.fillText(`SIGNING: ${activeGloss}`, centerX, canvas.height - 20);

      frame++;
      setCurrentFrame(frame);

      if (frame < totalFrames) {
        animationFrameId = requestAnimationFrame(renderAvatarFrame);
      } else {
        if (onFinish) onFinish();
      }
    };

    renderAvatarFrame();

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [isPlaying, activeGloss]);

  return (
    <div style={{
      background: 'rgba(15, 23, 42, 0.8)',
      border: '1px solid rgba(56, 189, 248, 0.3)',
      borderRadius: '16px',
      padding: '16px',
      textAlign: 'center',
      marginTop: '16px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <h4 style={{ margin: 0, color: '#38bdf8', fontSize: '0.95rem' }}>
          🧍 3D Visual Sign Avatar (Text-to-Sign)
        </h4>
        <span style={{ fontSize: '0.8rem', color: '#00F59B' }}>
          {isPlaying ? '● SIGNING ANIMATION ACTIVE' : 'Ready'}
        </span>
      </div>
      <canvas
        ref={canvasRef}
        width={320}
        height={220}
        style={{
          width: '100%',
          maxHeight: '220px',
          borderRadius: '12px',
          background: '#0b0f19',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}
      />
    </div>
  );
}
