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

    // Tracking state & 30-frame sequence buffer
    this.camera = null;
    this.hands = null;
    this.isCameraActive = false;
    this.frameCount = 0;
    this.lastFpsUpdate = performance.now();
    this.currentPrediction = { gesture: "NONE", confidence: 0, gloss: "NO HAND" };

    // Rolling 30-frame Sequence Buffer for Motion Trajectory Tracking
    this.sequenceBuffer = [];
    this.maxSequenceLength = 30;

    // Dataset Collector State
    this.isRecordingSequence = false;
    this.recordedSequenceFrames = [];

    // Practice Mode State
    this.learningTargets = ["hello", "where", "please", "sorry", "help", "water", "thumbs_up", "ok"];
    this.learningIndex = 0;
    this.learningScore = 0;
    this.targetHoldStartTime = null;

    this.initMediaPipe();
    this.initEventListeners();
    this.loadDictionary();
    this.initPWA();

    // Speed Quiz Properties
    this.isQuizMode = false;
    this.quizStreak = 0;
    this.quizTimer = null;
    this.quizTimeLeft = 10;
  }

  initPWA() {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/static/sw.js')
          .then(reg => console.log('✅ ServiceWorker registered for PWA:', reg.scope))
          .catch(err => console.warn('ServiceWorker registration failed:', err));
      });
    }

    let deferredPrompt;
    const installBtn = document.getElementById('pwaInstallBtn');

    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredPrompt = e;
      if (installBtn) installBtn.style.display = 'inline-flex';
    });

    if (installBtn) {
      installBtn.addEventListener('click', () => {
        if (deferredPrompt) {
          deferredPrompt.prompt();
          deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
              console.log('User accepted PWA install prompt');
            }
            deferredPrompt = null;
            installBtn.style.display = 'none';
          });
        }
      });
    }
  }

  startSpeedQuiz() {
    if (!this.isCameraActive) {
      alert("Please start the camera tracking first before launching Speed Quiz Mode!");
      return;
    }

    this.isQuizMode = true;
    this.quizStreak = 0;
    document.getElementById('quizStreak').textContent = '0';
    this.speakText("Speed quiz started! Show the target sign before time runs out!");
    this.nextQuizQuestion();
  }

  nextQuizQuestion() {
    if (this.quizTimer) clearInterval(this.quizTimer);

    this.quizTimeLeft = 10;
    this.updateQuizTimerUI(100);

    const targetId = this.learningTargets[this.learningIndex];
    this.updatePracticeUI();

    const start = Date.now();
    this.quizTimer = setInterval(() => {
      const elapsed = (Date.now() - start) / 1000;
      this.quizTimeLeft = Math.max(0, 10 - elapsed);
      const pct = (this.quizTimeLeft / 10) * 100;
      this.updateQuizTimerUI(pct);

      if (this.quizTimeLeft <= 0) {
        clearInterval(this.quizTimer);
        this.onQuizTimeout();
      }
    }, 100);
  }

  updateQuizTimerUI(pct) {
    const timerBar = document.getElementById('quizTimerBar');
    if (timerBar) timerBar.style.width = `${pct}%`;
  }

  onQuizSuccess() {
    if (this.quizTimer) clearInterval(this.quizTimer);

    this.learningScore += 150;
    this.quizStreak += 1;
    document.getElementById('practiceScore').textContent = this.learningScore;
    document.getElementById('quizStreak').textContent = this.quizStreak;

    this.speakText(`Great job! Streak ${this.quizStreak}`);

    // Advance to next target
    this.learningIndex = (this.learningIndex + 1) % this.learningTargets.length;

    setTimeout(() => {
      if (this.isQuizMode) this.nextQuizQuestion();
    }, 1000);
  }

  onQuizTimeout() {
    this.speakText("Time is up! Streak reset.");
    this.quizStreak = 0;
    document.getElementById('quizStreak').textContent = '0';

    const startBtn = document.getElementById('startQuizBtn');
    if (startBtn) startBtn.textContent = '⚡ Retry Speed Quiz Mode';
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
        maxNumHands: 2, // Enable 2-Hand Bimanual CV Tracking
        modelComplexity: 1,
        minDetectionConfidence: 0.7,
        minTrackingConfidence: 0.7
      });

      this.hands.onResults((results) => this.onHandResults(results));
      console.log("✅ MediaPipe Hands (2-Hand Mode) initialized successfully.");
      const overlayInfo = document.querySelector('.camera-overlay-info');
      if (overlayInfo) overlayInfo.innerHTML = '<span id="fpsCounter">0 FPS</span> | 2-Hand CV Engine Active';
      return true;
    } catch (err) {
      console.error("Failed to initialize MediaPipe Hands:", err);
      return false;
    }
  }

  async startCamera() {
    if (this.isCameraActive) return;

    if (!this.hands) {
      const ready = this.initMediaPipe();
      if (!ready) {
        alert("MediaPipe Hands library is still loading from CDN. Please wait 3 seconds and click Start Camera again.");
        return;
      }
    }

    const errorBanner = document.getElementById('cameraErrorBanner');
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
      document.getElementById('liveBadge').textContent = '● 2-HAND CV LIVE';
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
        document.getElementById('cameraErrorTitle').textContent = title;
        document.getElementById('cameraErrorText').textContent = msg;
        errorBanner.style.display = 'flex';
      } else {
        alert(`${title}: ${msg}`);
      }
    }
  }

  stopCamera() {
    if (!this.isCameraActive) return;
    
    this.isCameraActive = false;
    this.sequenceBuffer = [];

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

    const w = this.videoElement.videoWidth || 640;
    const h = this.videoElement.videoHeight || 480;
    this.canvasElement.width = w;
    this.canvasElement.height = h;

    this.canvasCtx.save();
    this.canvasCtx.clearRect(0, 0, w, h);
    
    const imageSource = results.image || this.videoElement;
    try {
      this.canvasCtx.drawImage(imageSource, 0, 0, w, h);
    } catch (e) {}

    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
      const handsList = results.multiHandLandmarks;

      // Update 30-frame sequence buffer
      this.sequenceBuffer.push(handsList[0]);
      if (this.sequenceBuffer.length > this.maxSequenceLength) {
        this.sequenceBuffer.shift();
      }

      // Record custom sequence if active
      if (this.isRecordingSequence) {
        this.recordedSequenceFrames.push(handsList[0]);
        const recordBtn = document.getElementById('recordSequenceBtn');
        if (recordBtn) recordBtn.textContent = `🔴 Recording (${this.recordedSequenceFrames.length}/30 frames)`;
        if (this.recordedSequenceFrames.length >= 30) {
          this.stopSequenceRecorder();
        }
      }

      // Draw Multi-Hand Skeletons (Hand 1 = Neon Green, Hand 2 = Purple Accent)
      handsList.forEach((landmarks, idx) => {
        const primaryColor = idx === 0 ? '#00F59B' : '#A855F7';
        const nodeColor = idx === 0 ? '#00E5FF' : '#EC4899';

        if (typeof drawConnectors === 'function' && typeof HAND_CONNECTIONS !== 'undefined') {
          drawConnectors(this.canvasCtx, landmarks, HAND_CONNECTIONS, {
            color: primaryColor,
            lineWidth: 4
          });
          drawLandmarks(this.canvasCtx, landmarks, {
            color: nodeColor,
            fillColor: '#FFFFFF',
            lineWidth: 2,
            radius: 5
          });
        } else {
          this.drawCustomSkeleton(landmarks, w, h, primaryColor, nodeColor);
        }
      });

      // Classify Gesture via local rule + backend API call
      const pred = this.classifyLandmarks(handsList[0], handsList, this.sequenceBuffer);
      this.updatePredictionUI(pred);
      this.checkPracticeChallenge(pred);

    } else {
      this.sequenceBuffer = [];
      this.updatePredictionUI({ gesture: "NONE", confidence: 0, gloss: "WAITING FOR HAND...", icon: "🖐️" });
    }

    this.canvasCtx.restore();
  }

  drawCustomSkeleton(landmarks, w, h, strokeColor = '#00F59B', fillColor = '#00E5FF') {
    const connections = [
      [0,1],[1,2],[2,3],[3,4],
      [0,5],[5,6],[6,7],[7,8],
      [5,9],[9,10],[10,11],[11,12],
      [9,13],[13,14],[14,15],[15,16],
      [13,17],[17,18],[18,19],[19,20],
      [0,17]
    ];

    this.canvasCtx.strokeStyle = strokeColor;
    this.canvasCtx.lineWidth = 4;
    connections.forEach(([i, j]) => {
      const p1 = landmarks[i];
      const p2 = landmarks[j];
      this.canvasCtx.beginPath();
      this.canvasCtx.moveTo(p1.x * w, p1.y * h);
      this.canvasCtx.lineTo(p2.x * w, p2.y * h);
      this.canvasCtx.stroke();
    });

    this.canvasCtx.fillStyle = fillColor;
    landmarks.forEach(p => {
      this.canvasCtx.beginPath();
      this.canvasCtx.arc(p.x * w, p.y * h, 5, 0, 2 * Math.PI);
      this.canvasCtx.fill();
    });
  }


  classifyLandmarks(landmarks, handsList = null, sequenceBuffer = null) {
    if (!landmarks) return { gesture: "NONE", confidence: 0, gloss: "WAITING FOR HAND...", icon: "🖐️" };

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

    // 1. Check Bimanual 2-Hand Gestures
    if (handsList && handsList.length >= 2) {
      const h1 = handsList[0];
      const h2 = handsList[1];
      const wDist = Math.hypot(h1[0].x - h2[0].x, h1[0].y - h2[0].y);

      const f1_isFist = !isExtended(8,6) && !isExtended(12,10) && !isExtended(16,14) && !isExtended(20,18);
      const f2_isOpen = isExtended(8,6) && isExtended(12,10) && isExtended(16,14) && isExtended(20,18);

      if (f1_isFist && f2_isOpen && wDist < 0.35) {
        return { gesture: "help", confidence: 0.97, gloss: "HELP", icon: "🆘" };
      }
      if (f2_isOpen && h1[0].y > 0.4 && h2[0].y > 0.4) {
        return { gesture: "where", confidence: 0.94, gloss: "WHERE", icon: "❓" };
      }
    }

    // 2. Check 30-Frame Sequence Trajectory
    if (sequenceBuffer && sequenceBuffer.length >= 10) {
      const startWrist = sequenceBuffer[0][0];
      const endWrist = sequenceBuffer[sequenceBuffer.length - 1][0];
      const motionX = Math.abs(endWrist.x - startWrist.x);
      const motionY = Math.abs(endWrist.y - startWrist.y);

      if (motionX > 0.15 && indexExt && middleExt && ringExt && pinkyExt) {
        return { gesture: "where", confidence: 0.92, gloss: "WHERE", icon: "❓" };
      }
      if (motionY > 0.10 && !indexExt && !middleExt && wrist.y < 0.7) {
        return { gesture: "sorry", confidence: 0.91, gloss: "SORRY", icon: "😔" };
      }
      if (motionY > 0.10 && indexExt && middleExt && ringExt && pinkyExt && wrist.y < 0.7) {
        return { gesture: "please", confidence: 0.93, gloss: "PLEASE", icon: "🤲" };
      }
    }

    // 3. Static Single-Hand Rules
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

    // A-Z Manual Alphabet Letters
    if (thumbUp && indexExt && !middleExt && !ringExt && !pinkyExt) {
      return { gesture: "letter_l", confidence: 0.92, gloss: "L", icon: "🔤" };
    }
    if (indexExt && middleExt && ringExt && pinkyExt && !thumbUp) {
      return { gesture: "letter_b", confidence: 0.90, gloss: "B", icon: "🔤" };
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

    if (this.translationLogEl.children.length > 15) {
      this.translationLogEl.removeChild(this.translationLogEl.lastChild);
    }

    // Automatically trigger Gloss-to-Sentence Translation
    this.updateFluentSentenceTranslation();
  }

  async updateFluentSentenceTranslation() {
    const chips = Array.from(this.translationLogEl.querySelectorAll('.log-chip'));
    const glosses = chips.map(c => c.textContent.trim().replace(/^.+?\s/, '')).reverse();

    if (glosses.length === 0) return;

    try {
      const resp = await fetch('/api/gloss-to-sentence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ glosses })
      });
      const data = await resp.json();
      const sentenceEl = document.getElementById('fluentSentenceDisplay');
      if (sentenceEl) {
        sentenceEl.textContent = data.fluent_sentence || sentenceEl.textContent;
      }
    } catch (e) {
      console.warn("Gloss translation failed:", e);
    }
  }

  startSequenceRecorder() {
    const nameInput = document.getElementById('recordGestureName');
    const name = nameInput ? nameInput.value.trim() : "Custom Gesture";
    if (!name) {
      alert("Please enter a gesture name to record.");
      return;
    }

    this.recordedSequenceFrames = [];
    this.isRecordingSequence = true;
    const recordBtn = document.getElementById('recordSequenceBtn');
    if (recordBtn) {
      recordBtn.style.background = '#EF4444';
      recordBtn.textContent = '🔴 Recording (0/30 frames)...';
    }
  }

  async stopSequenceRecorder() {
    this.isRecordingSequence = false;
    const recordBtn = document.getElementById('recordSequenceBtn');
    if (recordBtn) {
      recordBtn.style.background = '';
      recordBtn.textContent = '💾 Saving Sequence...';
    }

    const nameInput = document.getElementById('recordGestureName');
    const gesture_id = nameInput ? nameInput.value.trim() : "custom_sign";

    try {
      const resp = await fetch('/api/record-sequence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gesture_id: gesture_id,
          sequence: this.recordedSequenceFrames
        })
      });
      const data = await resp.json();
      if (data.success) {
        alert(`✅ Saved 30-frame gesture sequence dataset: "${data.filename}"!`);
      } else {
        alert(`Failed to save sequence: ${data.error}`);
      }
    } catch (e) {
      console.error("Dataset recording save error:", e);
    } finally {
      if (recordBtn) recordBtn.textContent = '🎥 Record 30-Frame Sequence';
      this.recordedSequenceFrames = [];
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

    // Custom Sequence Dataset Recorder
    const recordBtn = document.getElementById('recordSequenceBtn');
    if (recordBtn) {
      recordBtn.addEventListener('click', () => {
        if (this.isRecordingSequence) {
          this.stopSequenceRecorder();
        } else {
          this.startSequenceRecorder();
        }
      });
    }
  }

}

// Instantiate on DOM load
window.addEventListener('DOMContentLoaded', () => {
  window.app = new SignBridgeApp();
});
