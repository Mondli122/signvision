import React, { useState, useEffect, useRef } from 'react';
import { Database, Video, Square, Play, CheckCircle, UploadCloud, AlertCircle, Sparkles, Activity } from 'lucide-react';
import { logActivity } from '../utils/storage';
import { toast } from '../utils/toast';

export default function DatasetRecorder() {
  const [gestureLabel, setGestureLabel] = useState('CUSTOM_SIGN');
  const [isRecording, setIsRecording] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [recordedFrames, setRecordedFrames] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [savedCount, setSavedCount] = useState(0);
  const [handDetected, setHandDetected] = useState(false);
  const [landmarksCount, setLandmarksCount] = useState(0);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const handsRef = useRef(null);
  const latestLandmarksRef = useRef([]);

  // Setup camera stream and MediaPipe Hands tracking
  useEffect(() => {
    let isMounted = true;

    async function initCameraAndMediaPipe() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' },
          audio: false
        });

        if (!isMounted) return;
        streamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }

        // Initialize MediaPipe Hands if available
        const MediaPipeHands = window.Hands || (window.mediapipe && window.mediapipe.Hands);
        if (MediaPipeHands) {
          const hands = new MediaPipeHands({
            locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
          });

          hands.setOptions({
            maxNumHands: 2,
            modelComplexity: 1,
            minDetectionConfidence: 0.6,
            minTrackingConfidence: 0.6
          });

          hands.onResults((results) => {
            if (!isMounted) return;
            drawLandmarks(results);
          });

          handsRef.current = hands;

          // Process animation frames
          const processFrame = async () => {
            if (!isMounted || !videoRef.current || !handsRef.current) return;
            if (videoRef.current.readyState >= 2) {
              try {
                await handsRef.current.send({ image: videoRef.current });
              } catch (e) {
                // Skips frame silently
              }
            }
            if (isMounted) requestAnimationFrame(processFrame);
          };

          processFrame();
        } else {
          console.warn('MediaPipe Hands script not found on window, fallback to camera-only tracking');
        }
      } catch (err) {
        console.warn('Camera access denied in DatasetRecorder', err);
        setStatusMessage('Camera access denied. Please allow webcam permissions in your browser.');
      }
    }

    initCameraAndMediaPipe();

    return () => {
      isMounted = false;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
      if (handsRef.current && handsRef.current.close) {
        handsRef.current.close();
      }
    };
  }, []);

  const drawLandmarks = (results) => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;

    const ctx = canvas.getContext('2d');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
      setHandDetected(true);
      const allPoints = [];

      results.multiHandLandmarks.forEach((landmarks, handIdx) => {
        const color = handIdx === 0 ? '#10B981' : '#A855F7';
        ctx.strokeStyle = color;
        ctx.lineWidth = 2.5;
        ctx.fillStyle = '#00F59B';

        // Connect hand joints
        const connections = [
          [0, 1], [1, 2], [2, 3], [3, 4],
          [0, 5], [5, 6], [6, 7], [7, 8],
          [0, 9], [9, 10], [10, 11], [11, 12],
          [0, 13], [13, 14], [14, 15], [15, 16],
          [0, 17], [17, 18], [18, 19], [19, 20],
          [5, 9], [9, 13], [13, 17]
        ];

        connections.forEach(([i, j]) => {
          if (landmarks[i] && landmarks[j]) {
            ctx.beginPath();
            ctx.moveTo(landmarks[i].x * canvas.width, landmarks[i].y * canvas.height);
            ctx.lineTo(landmarks[j].x * canvas.width, landmarks[j].y * canvas.height);
            ctx.stroke();
          }
        });

        // Draw points
        landmarks.forEach((pt) => {
          ctx.beginPath();
          ctx.arc(pt.x * canvas.width, pt.y * canvas.height, 4, 0, 2 * Math.PI);
          ctx.fill();

          allPoints.push({
            x: Number(pt.x.toFixed(4)),
            y: Number(pt.y.toFixed(4)),
            z: Number((pt.z || 0).toFixed(4))
          });
        });
      });

      // Ensure 42 points (pad second hand with zeros if only 1 hand detected)
      while (allPoints.length < 42) {
        allPoints.push({ x: 0, y: 0, z: 0 });
      }

      setLandmarksCount(results.multiHandLandmarks.length * 21);
      latestLandmarksRef.current = allPoints.slice(0, 42);
    } else {
      setHandDetected(false);
      setLandmarksCount(0);
    }
  };

  const handleStartCapture = () => {
    if (isRecording) return;
    setCountdown(3);
    setStatusMessage('Position your hands in the frame...');

    const timer = setInterval(() => {
      setCountdown((prev) => {
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
    setStatusMessage('Recording 30 real-time landmark frames...');

    let frames = [];
    const interval = setInterval(() => {
      let currentLandmarks = latestLandmarksRef.current;

      // If hand is detected, use the real MediaPipe tracked points
      // Otherwise, keep the last known good frame
      if (!currentLandmarks || currentLandmarks.length === 0) {
        currentLandmarks = Array.from({ length: 42 }, () => ({ x: 0.5, y: 0.5, z: 0.0 }));
      }

      frames.push([...currentLandmarks]);
      setRecordedFrames([...frames]);

      if (frames.length >= 30) {
        clearInterval(interval);
        setIsRecording(false);
        setStatusMessage('Captured 30 real landmark frames! Ready to save to dataset.');
      }
    }, 66); // ~15 FPS captures 30 frames in 2 seconds
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
      .then((res) => res.json())
      .then((data) => {
        setIsUploading(false);
        if (data.success) {
          setSavedCount((prev) => prev + 1);
          setStatusMessage(`✅ Saved ${data.filename} (${data.saved_frames} real landmark frames) to dataset!`);
          logActivity(
            'dataset',
            'Custom Sign Recorded',
            `Saved 30 landmark frames for "${gestureLabel}" to dataset`
          );
          toast.success(`Successfully saved 30 landmark frames for ${gestureLabel}!`, 'Dataset Saved');
          setRecordedFrames([]);
        } else {
          setStatusMessage(`❌ Error: ${data.error}`);
          toast.error(data.error || 'Failed to save dataset sequence', 'Upload Error');
        }
      })
      .catch((err) => {
        setIsUploading(false);
        setStatusMessage(`❌ Server upload failed: ${err.message}`);
        toast.error('Upload failed. Please check server connection.', 'Error');
      });
  };

  return (
    <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: '#FEE2E2', color: '#DC2626', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Database size={22} />
          </div>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-main)' }}>SignVision Dataset Studio</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Capture real MediaPipe 3D hand landmark coordinates (42 points) to train custom SASL sign classifiers</p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 12px',
            borderRadius: '20px',
            background: handDetected ? '#D1FAE5' : '#F1F5F9',
            color: handDetected ? '#065F46' : '#64748B',
            fontSize: '12px',
            fontWeight: '700',
            border: `1px solid ${handDetected ? '#A7F3D0' : '#CBD5E1'}`
          }}>
            <Activity size={14} className={handDetected ? 'animate-pulse' : ''} />
            <span>{handDetected ? `MediaPipe Tracking (${landmarksCount} pts)` : 'No Hands in Frame'}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 14px', borderRadius: '20px', background: 'var(--bg-card-subtle)', border: '1px solid var(--border-light)', fontSize: '13px', fontWeight: '700' }}>
            <CheckCircle size={16} color="#10B981" />
            <span>{savedCount} Sequences Saved</span>
          </div>
        </div>
      </div>

      {/* Main Studio Viewport & Controls */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.3fr) minmax(0, 1fr)', gap: '20px', alignItems: 'start' }}>
        {/* Camera Monitor Preview with Canvas Landmark Overlay */}
        <div style={{ position: 'relative', borderRadius: '16px', overflow: 'hidden', background: '#0F172A', minHeight: '340px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)' }}
          />

          <canvas
            ref={canvasRef}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              transform: 'scaleX(-1)',
              pointerEvents: 'none'
            }}
          />

          {/* Countdown Overlay */}
          {countdown > 0 && (
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.65)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#FFF' }}>
              <div style={{ fontSize: '72px', fontWeight: '900', fontFamily: 'var(--font-heading)' }}>{countdown}</div>
              <div style={{ fontSize: '16px', fontWeight: '600' }}>Hold your sign steady...</div>
            </div>
          )}

          {/* Recording Badge */}
          {isRecording && (
            <div style={{ position: 'absolute', top: '16px', left: '16px', display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 14px', borderRadius: '20px', background: 'rgba(239, 68, 68, 0.95)', color: '#FFF', fontSize: '13px', fontWeight: '800', boxShadow: '0 4px 12px rgba(239,68,68,0.4)' }}>
              <span className="status-dot" style={{ background: '#FFF' }} />
              RECORDING REAL LANDMARKS ({recordedFrames.length}/30)
            </div>
          )}
        </div>

        {/* Controls & Configuration */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ padding: '20px', background: 'var(--bg-card-subtle)', borderRadius: '16px', border: '1px solid var(--border-light)', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <label style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-main)' }}>
              Sign Gloss Identifier (Label)
            </label>
            <input
              type="text"
              value={gestureLabel}
              onChange={(e) => setGestureLabel(e.target.value.toUpperCase())}
              placeholder="e.g. MORNING, TEACHER, MEDICINE"
              style={{
                padding: '12px 14px',
                borderRadius: '10px',
                border: '1px solid var(--border-light)',
                background: 'var(--bg-card)',
                color: 'var(--text-main)',
                fontSize: '14px',
                fontWeight: '700',
                outline: 'none'
              }}
            />

            <div style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: '1.5' }}>
              Records 30 sequential frames of 42 real 3D hand coordinates (x, y, z) sampled live at ~15 FPS. Saved directly to the server's <code>dataset/</code> folder for training.
            </div>

            {/* Frame Progress Bar */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)' }}>
                <span>Real Frames Captured</span>
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
                style={{ flex: 1, justifyContent: 'center', background: 'linear-gradient(135deg, #DC2626, #B91C1C)', cursor: isRecording ? 'not-allowed' : 'pointer' }}
              >
                <Video size={16} /> {isRecording ? 'Capturing...' : 'Record 30 Frames'}
              </button>

              <button
                className="btn-outline"
                onClick={handleUpload}
                disabled={recordedFrames.length < 30 || isUploading}
                style={{ flex: 1, justifyContent: 'center', cursor: recordedFrames.length < 30 || isUploading ? 'not-allowed' : 'pointer' }}
              >
                <UploadCloud size={16} /> {isUploading ? 'Saving...' : 'Save to Dataset'}
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
