# 🤝 SignVision / SignBridge SA
> **Real-Time Two-Way Sign Language Translator, ML Sequence Engine & Gamified Learning Platform**  
> *Developed for the South African **Robo Rumble Technomania STEM & Innovation Competition***.

---

## 📌 Project Overview

**SignVision (SignBridge SA)** bridges the digital and communication divide between Deaf/Hard-of-Hearing individuals and hearing communities across South Africa. 

Built in partnership alignment with **AlgoAtWork Robotics Academy** and the **University of Limpopo (UL Digital Hub)**, SignVision leverages high-speed Computer Vision, Machine Learning, NLP, and Progressive Web Technologies to deliver real-time, low-latency sign language translation and interactive learning.

---

## ✨ Core Features & Technical Capabilities

### 1. 📹 60 FPS Multi-Hand Vision Engine (`maxNumHands: 2`)
* **Dual-Hand CV Tracking:** Tracks up to 2 hands simultaneously (42 3D landmarks total) powered by **Google MediaPipe Hands**.
* **Color-Coded Skeletons:** Distinct visual rendering for Dominant Hand (Neon Green `#00F59B`) and Non-Dominant Hand (Purple `#A855F7`).
* **Telemetry & Diagnostics:** Real-time FPS counter, live status indicator (`● 2-HAND CV LIVE`), and error diagnostics overlay.

### 2. 🤖 Machine Learning & 30-Frame Sequence Classification Engine
* **Trained ML Model (`trained_gesture_model.pkl`):** Powered by a `scikit-learn` `RandomForestClassifier` trained on **8,118 landmark sequence samples** across **202 gesture classes**.
* **30-Frame Sliding Window:** Captures spatial-temporal motion trajectories (wrist velocity, joint deltas, inter-finger spacing) for dynamic conversational signs.
* **Bimanual Interaction Classifier:** Detects 2-handed interactions (e.g. *HELP*, *WHERE*, *WORK*, *SCHOOL*).
* **Multi-Corpus Dataset Ingestion:** Ingests benchmark datasets from **Kaggle ASL** (196 classes), **WLASL Benchmark** (50 classes), and the **SASL Corpus** (20 classes).
* **Custom Dataset Sequence Recorder:** UI recorder allowing users to capture 30-frame landmark sequences for new custom signs directly from the browser into `dataset/`.

### 3. 🔤 A–Z Manual Alphabet & Fingerspelling Engine
* Real-time static and dynamic recognition for the manual alphabet (A–Z), enabling users to spell out names, places, or technical terms missing from the main dictionary.

### 4. 💬 Two-Way Speech / Text-to-Sign & Gloss-to-Sentence NLP Engine
* **Deaf $\rightarrow$ Hearing Translation:** Live transcript log, Web Speech API audio synthesis readout, and an **NLP Gloss-to-Sentence Transformer** (`/api/gloss-to-sentence`) that converts raw sign Gloss streams (*HELLO WHERE HELP*) into natural, fluent English sentences (*"Hello! Where is it? I need help."*).
* **Hearing $\rightarrow$ Deaf Translation:** Converts spoken microphone audio (`webkitSpeechRecognition`) or typed English sentences into SASL Gloss sequences and visual dictionary cards (`/api/translate-text`).

### 5. ⚡ Interactive SASL Speed Quiz & Gamified Learning Engine
* **10-Second Countdown Challenge:** Fast-paced quiz mode with a 10-second progress timer bar testing user sign accuracy.
* **Daily Streaks & Score Leaderboard:** Live streak counter (`🔥 Streak: 5`), score accumulator (`+150 PTS`), and celebratory audio rewards.

### 6. 📲 Offline PWA & Mobile App Support
* **Installable Web App (`manifest.json`):** Add SignVision to your mobile (Android/iOS) or desktop (Windows/macOS) home screen.
* **ServiceWorker (`sw.js`):** Offline caching of HTML, CSS, JS, fonts, and API responses enabling **100% offline usage** in rural schools without internet.
* **Header Install Prompt:** One-click PWA installation button in the navbar.

### 7. 📖 South African Sign Language (SASL) Reference Dictionary
* Searchable dictionary library categorized into *Greetings, Etiquette, Expressions, Basic Needs, Questions, Family, Places, Time, Tech, Alphabet*.
* Features SASL dialect notes, visual icons, descriptions, and difficulty badges.

### 8. 🎨 Glassmorphism Technomania Dashboard
* Modern dark glassmorphism design system (`--bg-primary: #0b0f19`, `--primary-accent: #00F59B`) built for high visual impact in competition demonstrations.

---

## 🛠 Tech Stack

- **Backend:** Python 3, Flask, NumPy, scikit-learn
- **Computer Vision & AI:** MediaPipe Hands (2-Hand Mode), OpenCV, Custom Feature Extraction Pipeline
- **Frontend & UI:** HTML5, Vanilla CSS3 (Glassmorphism), JavaScript (ES6+), WebRTC
- **Audio & Speech:** Web Speech API (SpeechSynthesis & SpeechRecognition)
- **PWA & Offline:** Service Worker, Web App Manifest

---

## 🚀 Quick Start Guide

### 1. Clone the Repository
```bash
git clone https://github.com/Mondli122/signvision.git
cd signvision
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. (Optional) Re-ingest Online Datasets & Retrain Model
```bash
python models/online_dataset_importer.py
python models/train.py
```

### 4. Launch the Server
```bash
python app.py
```

### 5. Open in Browser
Navigate to **`http://127.0.0.1:5000`** and click **Start Camera Tracking**!

---

## 📄 License
Distributed under the MIT License.

*Built for Robo Rumble Technomania 2026.*