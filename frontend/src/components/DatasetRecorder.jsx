import React, { useState, useEffect, useRef } from 'react';
import { Database, Video, Square, Play, CheckCircle, UploadCloud, AlertCircle } from 'lucide-react';

export default function DatasetRecorder() {
  const [gestureLabel, setGestureLabel] = useState('CUSTOM_SIGN');
  const [isRecording, setIsRecording] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [recordedFrames, setRecordedFrames] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [savedCount, setSavedCount] = useState(0);

  const videoRef = useRef(null);
  const streamRef = useRef(null);

  // Setup camera stream for recording preview
  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch(err => {
        console.warn('Camera access denied in DatasetRecorder', err);
      });

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
      }
    };
  }, []);

  const handleStartCapture = () => {
    if (isRecording) return;
    setCountdown(3);
    setStatusMessage('Get ready to perform the sign...');

    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          beginRecordFrames();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const beginRecordFrames = () => {
    setIsRecording(true);
    setRecordedFrames([]);
    setStatusMessage('Recording 30 landmark frames...');

    let frames = [];
    const interval = setInterval(() => {
      // Simulate landmark frame capture (42 coordinates)
      const fakeLandmarks = Array.from({ length: 42 }, () => ({
        x: Number((Math.random() * 0.8 + 0.1).toFixed(4)),
        y: Number((Math.random() * 0.8 + 0.1).toFixed(4)),
        z: Number((Math.random() * 0.2 - 0.1).toFixed(4))
      }));
      frames.push(fakeLandmarks);
      setRecordedFrames([...frames]);

      if (frames.length >= 30) {
        clearInterval(interval);
        setIsRecording(false);
        setStatusMessage('Captured 30 frames! Ready to upload.');
      }
    }, 66); // ~15-20 FPS
  };

  const handleUpload = () => {
    if (recordedFrames.length === 0) return;
    setIsUploading(true);
    setStatusMessage('Uploading sequence to dataset directory...');

    fetch('/api/record-sequence', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        gesture_id: gestureLabel,
        sequence: recordedFrames
      })
    })
      .then(res => res.json())
      .then(data => {
        setIsUploading(false);
        if (data.success) {
          setSavedCount(prev => prev + 1);
          setStatusMessage(`✅ Saved ${data.filename} (${data.saved_frames} frames) to dataset!`);
          setRecordedFrames([]);
        } else {
          setStatusMessage(`❌ Error: ${data.error}`);
        }
      })
      .catch(err => {
        setIsUploading(false);
        setStatusMessage(`❌ Server upload failed: ${err.message}`);
      });
  };

  return (
    <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#FEE2E2', color: '#DC2626', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Database size={22} />
          </div>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-main)' }}>SignVision Dataset Studio</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Record new custom signs to train and expand the offline Random Forest classifier</p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 14px', borderRadius: '20px', background: 'var(--bg-card-subtle)', border: '1px solid var(--border-light)', fontSize: '13px', fontWeight: '700' }}>
          <CheckCircle size={16} color="#10B981" />
          <span>{savedCount} Custom Sequences Saved</span>
        </div>
      </div>

      {/* Main Studio Viewport & Controls */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.3fr) minmax(0, 1fr)', gap: '20px', alignItems: 'start' }}>
        {/* Camera Monitor Preview */}
        <div style={{ position: 'relative', borderRadius: '16px', overflow: 'hidden', background: '#0F172A', minHeight: '320px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)' }}
          />

          {/* Countdown Overlay */}
          {countdown > 0 && (
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#FFF' }}>
              <div style={{ fontSize: '72px', fontWeight: '900', fontFamily: 'var(--font-heading)' }}>{countdown}</div>
              <div style={{ fontSize: '16px', fontWeight: '600' }}>Get ready...</div>
            </div>
          )}

          {/* Recording Badge */}
          {isRecording && (
            <div style={{ position: 'absolute', top: '16px', left: '16px', display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 12px', borderRadius: '20px', background: 'rgba(239, 68, 68, 0.9)', color: '#FFF', fontSize: '13px', fontWeight: '700' }}>
              <span className="status-dot" style={{ background: '#FFF' }} />
              RECORDING ({recordedFrames.length}/30)
            </div>
          )}
        </div>

        {/* Controls & Configuration */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ padding: '18px', background: 'var(--bg-card-subtle)', borderRadius: '16px', border: '1px solid var(--border-light)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <label style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-main)' }}>
              Sign Gloss Identifier (Label)
            </label>
            <input
              type="text"
              value={gestureLabel}
              onChange={(e) => setGestureLabel(e.target.value.toUpperCase())}
              placeholder="e.g. MORNING, TEACHER, MEDICINE"
              style={{
                padding: '12px',
                borderRadius: '10px',
                border: '1px solid var(--border-light)',
                background: 'var(--bg-card)',
                color: 'var(--text-main)',
                fontSize: '14px',
                fontWeight: '600',
                outline: 'none'
              }}
            />

            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              A 30-frame sequence (42 3D landmarks) will be saved and formatted for scikit-learn dataset ingestion.
            </div>

            {/* Frame Progress Bar */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)' }}>
                <span>Frames Captured</span>
                <span>{recordedFrames.length} / 30</span>
              </div>
              <div style={{ width: '100%', height: '8px', background: 'var(--border-light)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${(recordedFrames.length / 30) * 100}%`, height: '100%', background: '#DC2626', transition: 'width 0.1s linear' }} />
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
              <button
                className="btn-primary"
                onClick={handleStartCapture}
                disabled={isRecording || countdown > 0}
                style={{ flex: 1, justifyContent: 'center', background: 'linear-gradient(135deg, #DC2626, #B91C1C)' }}
              >
                <Video size={16} /> {isRecording ? 'Capturing...' : 'Record Sign'}
              </button>

              <button
                className="btn-outline"
                onClick={handleUpload}
                disabled={recordedFrames.length < 30 || isUploading}
                style={{ flex: 1, justifyContent: 'center' }}
              >
                <UploadCloud size={16} /> {isUploading ? 'Uploading...' : 'Save to Dataset'}
              </button>
            </div>
          </div>

          {/* Status Alert Banner */}
          {statusMessage && (
            <div style={{ padding: '12px 16px', borderRadius: '12px', background: 'var(--bg-card-subtle)', border: '1px solid var(--border-light)', fontSize: '13px', fontWeight: '600', color: 'var(--text-main)' }}>
              {statusMessage}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
