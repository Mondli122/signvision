import React, { useRef, useEffect } from 'react';

export default function AudioVisualizer({ isListening }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!isListening) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let animationId;
    let phase = 0;

    const drawWaveform = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const width = canvas.width;
      const height = canvas.height;
      const centerY = height / 2;

      ctx.beginPath();
      ctx.moveTo(0, centerY);

      for (let x = 0; x < width; x++) {
        const freq = 0.05;
        const amp = Math.sin(x * 0.02 + phase) * 14 + Math.cos(x * 0.08 - phase) * 8;
        const y = centerY + Math.sin(x * freq + phase) * amp;
        ctx.lineTo(x, y);
      }

      ctx.strokeStyle = '#00F59B';
      ctx.lineWidth = 3;
      ctx.shadowColor = '#00F59B';
      ctx.shadowBlur = 10;
      ctx.stroke();

      phase += 0.15;
      animationId = requestAnimationFrame(drawWaveform);
    };

    drawWaveform();

    return () => {
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, [isListening]);

  if (!isListening) return null;

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      background: 'rgba(0, 245, 155, 0.1)',
      border: '1px solid #00F59B',
      borderRadius: '20px',
      padding: '4px 12px',
      marginTop: '8px'
    }}>
      <span style={{ fontSize: '0.8rem', color: '#00F59B', fontWeight: 'bold' }}>🎙️ Listening...</span>
      <canvas
        ref={canvasRef}
        width={160}
        height={30}
        style={{ borderRadius: '6px' }}
      />
    </div>
  );
}
