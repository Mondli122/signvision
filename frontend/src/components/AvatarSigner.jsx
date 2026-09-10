import React, { useRef, useEffect, useState } from 'react';
import { Play, RotateCcw } from 'lucide-react';

export default function AvatarSigner({ activeGloss, isPlaying, onFinish }) {
  const canvasRef = useRef(null);
  const [currentFrame, setCurrentFrame] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let animationFrameId;
    let frame = 0;
    const totalFrames = 60; // 60 frames = 2 seconds at 30fps

    const gloss = (activeGloss || 'HELLO').toUpperCase().trim();

    const renderAvatarFrame = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Background
      const bgGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
      bgGrad.addColorStop(0, '#090d16');
      bgGrad.addColorStop(1, '#0f172a');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Grid visual background accent
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.05)';
      ctx.lineWidth = 1;
      for (let x = 20; x < canvas.width; x += 30) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }

      const centerX = canvas.width / 2;
      const headY = 65;
      const progress = frame / totalFrames;
      const cycle = Math.sin(progress * Math.PI * 2);

      // --- Head & Face ---
      ctx.beginPath();
      ctx.arc(centerX, headY, 28, 0, Math.PI * 2);
      ctx.fillStyle = '#1e293b';
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 3;
      ctx.fill();
      ctx.stroke();

      // Eyes
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(centerX - 10, headY - 5, 5, 5);
      ctx.fillRect(centerX + 5, headY - 5, 5, 5);

      // Smile / Expression
      ctx.beginPath();
      ctx.arc(centerX, headY + 8, 8, 0.2, Math.PI - 0.2);
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Torso
      ctx.beginPath();
      ctx.moveTo(centerX, headY + 28);
      ctx.lineTo(centerX, headY + 120);
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 8;
      ctx.stroke();

      // Shoulders
      const shoulderY = headY + 45;
      const lShoulderX = centerX - 50;
      const rShoulderX = centerX + 50;
      ctx.beginPath();
      ctx.moveTo(lShoulderX, shoulderY);
      ctx.lineTo(rShoulderX, shoulderY);
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 6;
      ctx.stroke();

      // --- Sign-Specific Keyframed Arm Coordinates ---
      let rElbow = { x: rShoulderX + 25, y: shoulderY + 35 };
      let rWrist = { x: rElbow.x + 15, y: rElbow.y + 25 };
      let lElbow = { x: lShoulderX - 25, y: shoulderY + 35 };
      let lWrist = { x: lElbow.x - 15, y: lElbow.y + 25 };
      let handLabel = '';

      if (gloss.includes('HELLO')) {
        // HELLO: Right hand waves at temple, Left hand relaxed
        const wave = Math.sin(progress * Math.PI * 6) * 18;
        rElbow = { x: rShoulderX + 20, y: shoulderY - 10 };
        rWrist = { x: centerX + 38 + wave, y: headY - 5 };
        lElbow = { x: lShoulderX - 15, y: shoulderY + 45 };
        lWrist = { x: lShoulderX - 20, y: shoulderY + 80 };
        handLabel = 'WAVE AT TEMPLE';
      } else if (gloss.includes('HELP')) {
        // HELP: Left hand flat palm base, Right fist on top lifting upward
        const lift = Math.sin(progress * Math.PI) * 30;
        lElbow = { x: centerX - 25, y: shoulderY + 40 - lift * 0.8 };
        lWrist = { x: centerX - 2, y: shoulderY + 30 - lift };
        rElbow = { x: centerX + 25, y: shoulderY + 40 - lift * 0.8 };
        rWrist = { x: centerX, y: shoulderY + 18 - lift };
        handLabel = 'SUPPORT & LIFT UP';
      } else if (gloss.includes('WATER')) {
        // WATER: W shape tapping chin twice
        const tap = Math.abs(Math.sin(progress * Math.PI * 4)) * 12;
        rElbow = { x: rShoulderX + 15, y: shoulderY + 20 };
        rWrist = { x: centerX + 8, y: headY + 18 - tap };
        lElbow = { x: lShoulderX - 15, y: shoulderY + 45 };
        lWrist = { x: lShoulderX - 20, y: shoulderY + 80 };
        handLabel = 'W-HAND TAPPING CHIN';
      } else if (gloss.includes('THANK')) {
        // THANK YOU: Chin touch moving forward & down with open palm
        const forward = progress * 40;
        const down = progress * 20;
        rElbow = { x: rShoulderX + 15, y: shoulderY + 25 + down * 0.5 };
        rWrist = { x: centerX + 10 + forward * 0.4, y: headY + 15 + down };
        lElbow = { x: lShoulderX - 15, y: shoulderY + 45 };
        lWrist = { x: lShoulderX - 20, y: shoulderY + 80 };
        handLabel = 'CHIN FORWARD TO CHEST';
      } else if (gloss.includes('LOVE')) {
        // I LOVE YOU: ILY gesture pulsing forward
        const pulse = Math.sin(progress * Math.PI * 2) * 15;
        rElbow = { x: rShoulderX + 18, y: shoulderY + 15 };
        rWrist = { x: centerX + 20, y: shoulderY - 5 + pulse };
        lElbow = { x: lShoulderX - 18, y: shoulderY + 15 };
        lWrist = { x: centerX - 20, y: shoulderY - 5 + pulse };
        handLabel = 'ILY GESTURE EXTENDED';
      } else if (gloss.includes('YES') || gloss.includes('AGREE')) {
        // YES: Fist nodding
        const nod = Math.sin(progress * Math.PI * 6) * 16;
        rElbow = { x: rShoulderX + 15, y: shoulderY + 20 };
        rWrist = { x: centerX + 25, y: shoulderY + 5 + nod };
        lElbow = { x: lShoulderX - 15, y: shoulderY + 45 };
        lWrist = { x: lShoulderX - 20, y: shoulderY + 80 };
        handLabel = 'NODDING FIST (AFFIRMATION)';
      } else {
        // DEFAULT: Smooth conversational gesture
        const offset = Math.sin(progress * Math.PI * 2) * 20;
        rElbow = { x: rShoulderX + 25, y: shoulderY + 30 + offset * 0.5 };
        rWrist = { x: rElbow.x + 15 + offset, y: rElbow.y - 20 };
        lElbow = { x: lShoulderX - 25, y: shoulderY + 30 - offset * 0.5 };
        lWrist = { x: lElbow.x - 15, y: lElbow.y + 15 };
        handLabel = 'CONVERSATIONAL SIGN';
      }

      // Draw Left Arm (Purple)
      ctx.beginPath();
      ctx.moveTo(lShoulderX, shoulderY);
      ctx.lineTo(lElbow.x, lElbow.y);
      ctx.lineTo(lWrist.x, lWrist.y);
      ctx.strokeStyle = '#A855F7';
      ctx.lineWidth = 5;
      ctx.lineCap = 'round';
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(lWrist.x, lWrist.y, 7, 0, Math.PI * 2);
      ctx.fillStyle = '#A855F7';
      ctx.fill();

      // Draw Right Arm (Emerald Neon)
      ctx.beginPath();
      ctx.moveTo(rShoulderX, shoulderY);
      ctx.lineTo(rElbow.x, rElbow.y);
      ctx.lineTo(rWrist.x, rWrist.y);
      ctx.strokeStyle = '#00F59B';
      ctx.lineWidth = 5;
      ctx.lineCap = 'round';
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(rWrist.x, rWrist.y, 8, 0, Math.PI * 2);
      ctx.fillStyle = '#00F59B';
      ctx.shadowColor = '#00F59B';
      ctx.shadowBlur = 10;
      ctx.fill();
      ctx.shadowBlur = 0;

      // Bottom Sign Banner
      ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
      ctx.fillRect(10, canvas.height - 34, canvas.width - 20, 26);
      ctx.strokeStyle = 'rgba(0, 245, 155, 0.4)';
      ctx.strokeRect(10, canvas.height - 34, canvas.width - 20, 26);

      ctx.font = 'bold 12px Inter, sans-serif';
      ctx.fillStyle = '#00F59B';
      ctx.textAlign = 'center';
      ctx.fillText(`SIGN: ${gloss} — ${handLabel}`, centerX, canvas.height - 17);

      frame++;
      setCurrentFrame(frame);

      if (isPlaying && frame < totalFrames) {
        animationFrameId = requestAnimationFrame(renderAvatarFrame);
      } else {
        if (onFinish && isPlaying) onFinish();
      }
    };

    renderAvatarFrame();

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [isPlaying, activeGloss]);

  const gloss = (activeGloss || 'HELLO').toUpperCase().trim();

  return (
    <div
      style={{
        background: '#0F172A',
        border: '1.5px solid rgba(136, 204, 241, 0.3)',
        borderRadius: '18px',
        padding: '14px',
        textAlign: 'center',
        marginTop: '12px',
        boxShadow: '0 8px 24px rgba(15, 23, 42, 0.4)'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <h4 style={{ margin: 0, color: '#88CCF1', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '800' }}>
          <span>▶</span>
          <span>3D Avatar Signer</span>
        </h4>
        <span style={{ fontSize: '0.72rem', color: isPlaying ? '#88CCF1' : '#94A3B8', fontWeight: '800', letterSpacing: '0.5px' }}>
          {isPlaying ? '● ANIMATING' : 'IDLE'}
        </span>
      </div>

      <canvas
        ref={canvasRef}
        width={320}
        height={180}
        style={{
          width: '100%',
          maxHeight: '180px',
          borderRadius: '12px',
          background: '#070A12',
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}
      />
      {/* Bottom control bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          marginTop: '10px',
          background: 'rgba(15, 23, 42, 0.7)',
          padding: '6px 12px',
          borderRadius: '10px',
          border: '1px solid rgba(136, 204, 241, 0.15)'
        }}
      >
        <button
          onClick={() => {
            if (!isPlaying) {
              const canvas = canvasRef.current;
              if (canvas) canvas.click();
            }
          }}
          style={{
            width: '26px',
            height: '26px',
            borderRadius: '50%',
            background: '#88CCF1',
            border: 'none',
            color: '#133340',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
        >
          <Play size={13} style={{ marginLeft: '1px' }} />
        </button>

        <span style={{ fontSize: '11px', fontWeight: '800', color: '#88CCF1', minWidth: '50px' }}>
          {gloss}
        </span>

        {/* Scrubber bar */}
        <div style={{ flex: 1, height: '4px', background: 'rgba(255, 255, 255, 0.2)', borderRadius: '2px', position: 'relative', overflow: 'hidden' }}>
          <div
            style={{
              width: `${Math.min(100, Math.round((currentFrame / totalFrames) * 100))}%`,
              height: '100%',
              background: '#88CCF1',
              borderRadius: '2px'
            }}
          />
        </div>

        {/* Carousel indicators */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#94A3B8' }}>
          <span style={{ cursor: 'pointer', color: '#88CCF1' }}>‹</span>
          <span style={{ fontWeight: '700', color: '#FFFFFF' }}>1/5</span>
          <span style={{ cursor: 'pointer', color: '#88CCF1' }}>›</span>
        </div>
      </div>
    </div>
  );
}
