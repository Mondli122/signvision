/**
 * SignBridge SA - Real-Time Two-Way Sign Language Translator & Learning Engine
 * Built for Robo Rumble Technomania Competition
 */

class SignBridgeApp {
  constructor() {
    this.videoElement = document.getElementById('inputVideo');
    this.canvasElement = document.getElementById('outputCanvas');
    this.canvasCtx = this.canvasElement.getContext('2d');
    
    // UI Elements
    this.gestureIconEl = document.getElementById('gestureIcon');
    this.gestureGlossEl = document.getElementById('gestureGloss');
    this.confidenceBarEl = document.getElementById('confidenceBar');
    this.confidenceValueEl = document.getElementById('confidenceValue');
    this.translationLogEl = document.getElementById('translationLog');
    this.fpsCounterEl = document.getElementById('fpsCounter');

    // Speech & Audio
    this.synth = window.speechSynthesis;
    this.autoSpeak = true;
    this.lastSpokenGloss = "";
    this.lastSpokenTime = 0;

    // Tracking state
    this.camera = null;
    this.hands = null;
    this.isCameraActive = false;
    this.frameCount = 0;
    this.lastFpsUpdate = performance.now();
    this.currentPrediction = { gesture: "NONE", confidence: 0, gloss: "NO HAND" };

    // Practice Mode State
    this.learningTargets = ["hello", "i_love_you", "thumbs_up", "peace", "water", "ok"];
    this.learningIndex = 0;
    this.learningScore = 0;
    this.targetHoldStartTime = null;

    this.initMediaPipe();
    this.initEventListeners();
    this.loadDictionary();
  }

  initMediaPipe() {
    if (typeof Hands === 'undefined') {
      console.warn("MediaPipe Hands CDN script not loaded yet. Will retry upon camera start.");
      const overlayInfo = document.querySelector('.camera-overlay-info');
      if (overlayInfo) overlayInfo.innerHTML = '<span id="fpsCounter">0 FPS</span> | MediaPipe Loading...';
      return false;
    }

    try {
      this.hands = new Hands({
        locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
      });

      this.hands.setOptions({
        maxNumHands: 2,
        modelComplexity: 1,
        minDetectionConfidence: 0.7,
        minTrackingConfidence: 0.7
      });

      this.hands.onResults((results) => this.onHandResults(results));
      console.log("✅ MediaPipe Hands initialized successfully.");
      const overlayInfo = document.querySelector('.camera-overlay-info');
      if (overlayInfo) overlayInfo.innerHTML = '<span id="fpsCounter">0 FPS</span> | MediaPipe Ready';
      return true;
    } catch (err) {
      console.error("Failed to initialize MediaPipe Hands:", err);
      return false;
    }
  }

  async startCamera() {
    if (this.isCameraActive) return;

    // Ensure MediaPipe is initialized
    if (!this.hands) {
      const ready = this.initMediaPipe();
      if (!ready) {
        alert("MediaPipe Hands library is still loading from CDN. Please wait 3 seconds and click Start Camera again.");
        return;
      }
    }

    const errorBanner = document.getElementById('cameraErrorBanner');
    const errorTitle = document.getElementById('cameraErrorTitle');
    const errorText = document.getElementById('cameraErrorText');
    if (errorBanner) errorBanner.style.display = 'none';

    try {
      if (window.isSecureContext === false && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
        throw new Error("Webcams are blocked on insecure network IP HTTP addresses. Please open http://127.0.0.1:5000 in your browser instead.");
      }

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Your browser does not support webcam access (getUserMedia API missing).");
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        },
        audio: false
      });

      this.videoElement.srcObject = stream;
      await this.videoElement.play();

      this.isCameraActive = true;

      const processFrame = async () => {
        if (!this.isCameraActive) return;
        if (this.videoElement.readyState >= 2 && this.hands) {
          try {
            await this.hands.send({ image: this.videoElement });
          } catch (e) {
            console.warn("MediaPipe frame send error:", e);
          }
        }
        if (this.isCameraActive) {
          requestAnimationFrame(processFrame);
        }
      };

      processFrame();

      document.getElementById('liveBadge').classList.add('active');
      document.getElementById('liveBadge').textContent = '● LIVE CV';
      document.getElementById('startCameraBtn').style.display = 'none';
      document.getElementById('stopCameraBtn').style.display = 'inline-flex';

    } catch (err) {
      console.error("Camera access error:", err);
      this.isCameraActive = false;
      
      let title = "Camera Access Failed";
      let msg = err.message || "Failed to connect to webcam.";

      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        title = "Permission Denied";
        msg = "Camera permission was blocked. Please click the camera/lock icon in your browser address bar and grant access, then click Retry.";
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        title = "No Camera Found";
        msg = "No webcam device was detected on your computer. Please connect a USB camera and try again.";
      } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
        title = "Camera In Use";
        msg = "Your camera is currently being used by another application (Zoom, Teams, or another browser tab). Please close it and retry.";
      }

      if (errorBanner) {
        errorTitle.textContent = title;
        errorText.textContent = msg;
        errorBanner.style.display = 'flex';
      } else {
        alert(`${title}: ${msg}`);
      }
    }
  }

  stopCamera() {
    if (!this.isCameraActive) return;
    
    this.isCameraActive = false;

    if (this.videoElement && this.videoElement.srcObject) {
      const tracks = this.videoElement.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      this.videoElement.srcObject = null;
    }

    document.getElementById('liveBadge').classList.remove('active');
    document.getElementById('liveBadge').textContent = '● STANDBY';
    document.getElementById('startCameraBtn').style.display = 'inline-flex';
    document.getElementById('stopCameraBtn').style.display = 'none';
    this.canvasCtx.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);
  }

  onHandResults(results) {
    // Calculate FPS
    this.frameCount++;
    const now = performance.now();
    if (now - this.lastFpsUpdate >= 1000) {
      const fps = Math.round((this.frameCount * 1000) / (now - this.lastFpsUpdate));
      this.fpsCounterEl.textContent = `${fps} FPS`;
      this.frameCount = 0;
      this.lastFpsUpdate = now;
    }

    // Set canvas dimensions
    const w = this.videoElement.videoWidth || 640;
    const h = this.videoElement.videoHeight || 480;
    this.canvasElement.width = w;
    this.canvasElement.height = h;

    this.canvasCtx.save();
    this.canvasCtx.clearRect(0, 0, w, h);
    
    // Always render webcam video frame onto canvas
    const imageSource = results.image || this.videoElement;
    try {
      this.canvasCtx.drawImage(imageSource, 0, 0, w, h);
    } catch (e) {
      // Fallback
    }

    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
      for (const landmarks of results.multiHandLandmarks) {
        // Draw Skeleton Connections (using MediaPipe helper or custom fallback)
        if (typeof drawConnectors === 'function' && typeof HAND_CONNECTIONS !== 'undefined') {
          drawConnectors(this.canvasCtx, landmarks, HAND_CONNECTIONS, {
            color: '#00F59B',
            lineWidth: 4
          });
          drawLandmarks(this.canvasCtx, landmarks, {
            color: '#00E5FF',
            fillColor: '#FFFFFF',
            lineWidth: 2,
            radius: 5
          });
        } else {
          // Custom fallback skeleton rendering
          this.drawCustomSkeleton(landmarks, w, h);
        }

        // Classify Gesture
        const pred = this.classifyLandmarks(landmarks);
        this.updatePredictionUI(pred);
        this.checkPracticeChallenge(pred);
      }
    } else {
      this.updatePredictionUI({ gesture: "NONE", confidence: 0, gloss: "WAITING FOR HAND...", icon: "🖐️" });
    }

    this.canvasCtx.restore();
  }

  drawCustomSkeleton(landmarks, w, h) {
    const connections = [
      [0,1],[1,2],[2,3],[3,4],
      [0,5],[5,6],[6,7],[7,8],
      [5,9],[9,10],[10,11],[11,12],
      [9,13],[13,14],[14,15],[15,16],
      [13,17],[17,18],[18,19],[19,20],
      [0,17]
    ];

    this.canvasCtx.strokeStyle = '#00F59B';
    this.canvasCtx.lineWidth = 4;
    connections.forEach(([i, j]) => {
      const p1 = landmarks[i];
      const p2 = landmarks[j];
      this.canvasCtx.beginPath();
      this.canvasCtx.moveTo(p1.x * w, p1.y * h);
      this.canvasCtx.lineTo(p2.x * w, p2.y * h);
      this.canvasCtx.stroke();
    });

    this.canvasCtx.fillStyle = '#00E5FF';
    landmarks.forEach(p => {
      this.canvasCtx.beginPath();
      this.canvasCtx.arc(p.x * w, p.y * h, 5, 0, 2 * Math.PI);
      this.canvasCtx.fill();
    });
  }

  classifyLandmarks(landmarks) {
    const wrist = landmarks[0];

    const isExtended = (tipIdx, pipIdx) => {
      const tip = landmarks[tipIdx];
      const pip = landmarks[pipIdx];
      const dTip = Math.hypot(tip.x - wrist.x, tip.y - wrist.y);
      const dPip = Math.hypot(pip.x - wrist.x, pip.y - wrist.y);
      return dTip > dPip;
    };

    const thumbUp = landmarks[4].y < landmarks[2].y;
    const indexExt = isExtended(8, 6);
    const middleExt = isExtended(12, 10);
    const ringExt = isExtended(16, 14);
    const pinkyExt = isExtended(20, 18);

    const thumbIndexDist = Math.hypot(landmarks[4].x - landmarks[8].x, landmarks[4].y - landmarks[8].y);

    // Classification Rules
    if (indexExt && pinkyExt && thumbUp && !middleExt && !ringExt) {
      return { gesture: "i_love_you", confidence: 0.96, gloss: "I LOVE YOU", icon: "🤟" };
    }
    if (thumbIndexDist < 0.08 && middleExt && ringExt && pinkyExt) {
      return { gesture: "ok", confidence: 0.93, gloss: "OK", icon: "👌" };
    }
    if (indexExt && middleExt && !ringExt && !pinkyExt) {
      return { gesture: "peace", confidence: 0.95, gloss: "PEACE", icon: "✌️" };
    }
    if (indexExt && middleExt && ringExt && !pinkyExt) {
      return { gesture: "water", confidence: 0.91, gloss: "WATER", icon: "💧" };
    }
    if (thumbUp && !indexExt && !middleExt && !ringExt && !pinkyExt) {
      return { gesture: "thumbs_up", confidence: 0.97, gloss: "YES", icon: "👍" };
    }
    if (indexExt && middleExt && ringExt && pinkyExt && thumbUp) {
      return { gesture: "hello", confidence: 0.98, gloss: "HELLO", icon: "👋" };
    }
    if (!indexExt && !middleExt && !ringExt && !pinkyExt) {
      return { gesture: "fist", confidence: 0.89, gloss: "STOP", icon: "✊" };
    }

    return { gesture: "UNKNOWN", confidence: 0.50, gloss: "DETECTING...", icon: "✋" };
  }

  updatePredictionUI(pred) {
    this.currentPrediction = pred;
    this.gestureIconEl.textContent = pred.icon || "✋";
    this.gestureGlossEl.textContent = pred.gloss;
    
    const pct = Math.round(pred.confidence * 100);
    this.confidenceBarEl.style.width = `${pct}%`;
    this.confidenceValueEl.textContent = `${pct}%`;

    // Append to live log stream if confidence is high and new word
    if (pred.confidence >= 0.85 && pred.gloss !== "WAITING FOR HAND..." && pred.gloss !== "DETECTING...") {
      const now = Date.now();
      if (pred.gloss !== this.lastSpokenGloss || (now - this.lastSpokenTime > 3000)) {
        this.addLogChip(pred);
        if (this.autoSpeak) {
          this.speakText(pred.gloss);
        }
        this.lastSpokenGloss = pred.gloss;
        this.lastSpokenTime = now;
      }
    }
  }

  addLogChip(pred) {
    const chip = document.createElement('span');
    chip.className = 'log-chip';
    chip.innerHTML = `${pred.icon} ${pred.gloss}`;
    this.translationLogEl.insertBefore(chip, this.translationLogEl.firstChild);

    // Keep log limited to 15 items
    if (this.translationLogEl.children.length > 15) {
      this.translationLogEl.removeChild(this.translationLogEl.lastChild);
    }
  }

  speakText(text) {
    if (!this.synth) return;
    this.synth.cancel(); // Stop current audio
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    this.synth.speak(utterance);
  }

  speakCurrentLog() {
    const chips = Array.from(this.translationLogEl.querySelectorAll('.log-chip'));
    if (chips.length === 0) return;
    const sentence = chips.map(c => c.textContent.trim()).reverse().join(" ");
    this.speakText(sentence);
  }

  clearLog() {
    this.translationLogEl.innerHTML = '';
  }

  // Mode 2: Speech / Text to Sign
  async translateTextToSign() {
    const inputEl = document.getElementById('textToSignInput');
    const text = inputEl.value.trim();
    if (!text) return;

    try {
      const resp = await fetch('/api/translate-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });
      const data = await resp.json();

      const sequenceEl = document.getElementById('glossSequenceDisplay');
      sequenceEl.textContent = data.gloss_sequence || "NO MATCH";

      const cardsContainer = document.getElementById('visualSignCards');
      cardsContainer.innerHTML = '';

      if (data.cards && data.cards.length > 0) {
        data.cards.forEach(card => {
          const cardDiv = document.createElement('div');
          cardDiv.className = 'sign-card';
          cardDiv.innerHTML = `
            <div class="sign-card-icon">${card.icon}</div>
            <div class="sign-card-word">${card.word}</div>
            <div class="sign-card-gloss">${card.gloss}</div>
          `;
          cardsContainer.appendChild(cardDiv);
        });
      } else {
        cardsContainer.innerHTML = `<p style="color: var(--text-muted);">Fingerspelling sequence generated for unmapped words.</p>`;
      }
    } catch (err) {
      console.error("Translation error:", err);
    }
  }

  startSpeechRecognition() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert("Speech recognition is not supported in this browser. Please type text into the input field.");
      return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;

    const micBtn = document.getElementById('micBtn');
    micBtn.style.background = 'rgba(239, 68, 68, 0.3)';

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      document.getElementById('textToSignInput').value = transcript;
      this.translateTextToSign();
      micBtn.style.background = '';
    };

    recognition.onerror = () => {
      micBtn.style.background = '';
    };

    recognition.start();
  }

  // Practice & Learning Mode
  checkPracticeChallenge(pred) {
    const targetId = this.learningTargets[this.learningIndex];
    if (pred.gesture === targetId && pred.confidence >= 0.85) {
      if (!this.targetHoldStartTime) {
        this.targetHoldStartTime = performance.now();
      } else if (performance.now() - this.targetHoldStartTime >= 1200) {
        // Successfully held sign for 1.2s!
        this.onPracticeSuccess();
      }
    } else {
      this.targetHoldStartTime = null;
    }
  }

  onPracticeSuccess() {
    this.learningScore += 100;
    document.getElementById('practiceScore').textContent = this.learningScore;
    
    // Play celebratory speech
    this.speakText("Correct sign! Great job!");

    // Advance to next sign
    this.learningIndex = (this.learningIndex + 1) % this.learningTargets.length;
    this.updatePracticeUI();
    this.targetHoldStartTime = null;
  }

  updatePracticeUI() {
    const targetId = this.learningTargets[this.learningIndex];
    fetch('/api/dictionary')
      .then(res => res.json())
      .then(dict => {
        const item = dict.find(d => d.id === targetId) || dict[0];
        document.getElementById('targetSignWord').textContent = item.word;
        document.getElementById('targetSignDesc').textContent = item.description;
        document.getElementById('targetSignIcon').textContent = item.icon;
      });
  }

  async loadDictionary() {
    try {
      const resp = await fetch('/api/dictionary');
      const data = await resp.json();
      const container = document.getElementById('modalDictGrid');
      container.innerHTML = '';

      data.forEach(item => {
        const el = document.createElement('div');
        el.className = 'dict-item-card';
        el.innerHTML = `
          <div class="dict-item-header">
            <span class="dict-item-icon">${item.icon}</span>
            <div class="dict-item-title">
              <h4>${item.word}</h4>
              <span class="dict-item-category">${item.category}</span>
            </div>
          </div>
          <p class="dict-item-desc">${item.description}</p>
          <small style="color: var(--secondary-accent); font-size: 0.75rem;">${item.sasl_note}</small>
        `;
        container.appendChild(el);
      });
    } catch (e) {
      console.error("Failed to load dictionary:", e);
    }
  }

  initEventListeners() {
    // Mode Switcher Tabs
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const mode = btn.dataset.mode;
        document.querySelectorAll('.view-section').forEach(sec => sec.classList.remove('active'));
        document.getElementById(`view-${mode}`).classList.add('active');

        if (mode === 'practice') {
          this.updatePracticeUI();
        }
      });
    });

    // Camera Buttons
    document.getElementById('startCameraBtn').addEventListener('click', () => this.startCamera());
    document.getElementById('stopCameraBtn').addEventListener('click', () => this.stopCamera());

    // Audio / Speech
    document.getElementById('speakLogBtn').addEventListener('click', () => this.speakCurrentLog());
    document.getElementById('clearLogBtn').addEventListener('click', () => this.clearLog());

    // Text to Sign
    document.getElementById('translateTextBtn').addEventListener('click', () => this.translateTextToSign());
    document.getElementById('micBtn').addEventListener('click', () => this.startSpeechRecognition());

    // Dictionary Modal
    document.getElementById('openDictBtn').addEventListener('click', () => {
      document.getElementById('dictModal').classList.add('active');
    });
    document.getElementById('closeDictBtn').addEventListener('click', () => {
      document.getElementById('dictModal').classList.remove('active');
    });
  }
}

// Instantiate on DOM load
window.addEventListener('DOMContentLoaded', () => {
  window.app = new SignBridgeApp();
});
