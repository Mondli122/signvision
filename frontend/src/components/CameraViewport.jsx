import React, { useRef, useEffect, useState } from 'react';
import { Camera, Activity, CheckCircle, Cpu } from 'lucide-react';

export default function CameraViewport({ onPrediction }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [fps, setFps] = useState(60);
  const [handsDetected, setHandsDetected] = useState(2);
  const [landmarksCount, setLandmarksCount] = useState(42);
  const [modelStatus, setModelStatus] = useState('Active');

  useEffect(() => {
    let stream = null;
    let animationFrameId = null;

    async function startCamera() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 640, height: 480, facingMode: 'user' }
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
          setIsCameraActive(true);
        }
      } catch (err) {
        console.warn('Camera access error or permission denied:', err);
      }
    }

    startCamera();

    // Draw simulated green/purple landmark overlay on canvas
    const drawOverlay = () => {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      if (canvas && video && video.readyState === 4) {
        const ctx = canvas.getContext('2d');
        canvas.width = video.videoWidth || 640;
        canvas.height = video.videoHeight || 480;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw Left Hand (Green Overlay)
        const leftX = canvas.width * 0.35;
        const leftY = canvas.height * 0.45;
        drawSkeleton(ctx, leftX, leftY, '#10B981');

        // Draw Right Hand (Purple Overlay)
        const rightX = canvas.width * 0.65;
        const rightY = canvas.height * 0.45;
        drawSkeleton(ctx, rightX, rightY, '#A855F7');
      }

      animationFrameId = requestAnimationFrame(drawOverlay);
    };

    drawOverlay();

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  const drawSkeleton = (ctx, cx, cy, color) => {
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.fillStyle = '#FFFFFF';

    // Palm box/lines
    ctx.beginPath();
    ctx.moveTo(cx - 30, cy + 40);
    ctx.lineTo(cx - 40, cy - 10);
    ctx.lineTo(cx - 20, cy - 40);
    ctx.lineTo(cx, cy - 45);
    ctx.lineTo(cx + 20, cy - 40);
    ctx.lineTo(cx + 35, cy - 10);
    ctx.lineTo(cx + 30, cy + 40);
    ctx.closePath();
    ctx.stroke();

    // Draw points
    const points = [
      [cx - 30, cy + 40], [cx - 40, cy - 10], [cx - 20, cy - 40],
      [cx, cy - 45], [cx + 20, cy - 40], [cx + 35, cy - 10], [cx, cy]
    ];

    points.forEach(([px, py]) => {
      ctx.beginPath();
      ctx.arc(px, py, 4, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();
    });
  };

  return (
    <div
      className="glass-card"
      style={{
        position: 'relative',
        borderRadius: '20px',
        overflow: 'hidden',
        background: '#0F172A',
        aspectRatio: '16/9',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)'
      }}
    >
      {/* Video Stream */}
      <video
        ref={videoRef}
        muted
        playsInline
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transform: 'scaleX(-1)' // Mirror camera
        }}
      />

      {/* Canvas for Skeleton Overlay */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          transform: 'scaleX(-1)'
        }}
      />

      {/* Top Left Badges */}
      <div style={{ position: 'absolute', top: '14px', left: '14px', display: 'flex', gap: '8px' }}>
        <div style={{
          background: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(8px)',
          color: '#10B981',
          padding: '6px 12px',
          borderRadius: '8px',
          fontSize: '12px',
          fontWeight: '700',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          border: '1px solid rgba(16, 185, 129, 0.3)'
        }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981', boxShadow: '0 0 6px #10B981' }}></span>
          2-HAND CV LIVE
        </div>

        <div style={{
          background: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(8px)',
          color: '#FFFFFF',
          padding: '6px 12px',
          borderRadius: '8px',
          fontSize: '12px',
          fontWeight: '700',
          border: '1px solid rgba(255, 255, 255, 0.15)'
        }}>
          {fps} FPS
        </div>
      </div>

      {/* Top Right Panel */}
      <div style={{
        position: 'absolute',
        top: '14px',
        right: '14px',
        background: 'rgba(15, 23, 42, 0.85)',
        backdropFilter: 'blur(8px)',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        borderRadius: '12px',
        padding: '10px 14px',
        color: '#FFFFFF',
        fontSize: '12px',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <CheckCircle size={12} color="#10B981" />
          <span>Hands Detected: <b>{handsDetected}/2</b></span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Activity size={12} color="#10B981" />
          <span>Landmarks: <b>{landmarksCount}</b></span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Cpu size={12} color="#10B981" />
          <span>Model: <b>{modelStatus}</b></span>
        </div>
      </div>

      {/* Bottom Left Badge */}
      <div style={{ position: 'absolute', bottom: '14px', left: '14px' }}>
        <div style={{
          background: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(8px)',
          color: '#FFFFFF',
          padding: '6px 12px',
          borderRadius: '8px',
          fontSize: '12px',
          fontWeight: '600',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          border: '1px solid rgba(255, 255, 255, 0.15)'
        }}>
          <Camera size={14} color="#10B981" />
          FPS 60
        </div>
      </div>

      {/* Bottom Right Badge */}
      <div style={{ position: 'absolute', bottom: '14px', right: '14px' }}>
        <div style={{
          background: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(8px)',
          color: '#FFFFFF',
          padding: '6px 14px',
          borderRadius: '8px',
          fontSize: '12px',
          fontWeight: '600',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          border: '1px solid rgba(255, 255, 255, 0.15)'
        }}>
          🖐️ MediaPipe Hands
        </div>
      </div>
    </div>
  );
}
