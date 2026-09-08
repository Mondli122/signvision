# 🤝 SignVision / SignBridge SA
> **Real-Time Two-Way Sign Language Translator & Interactive Learning Platform**  
> *Developed for the South African **Robo Rumble Technomania STEM & Innovation Competition***.

---

## 📌 Project Overview

**SignVision (SignBridge SA)** bridges the digital and communication divide between Deaf/Hard-of-Hearing individuals and hearing communities across South Africa. 

Built in partnership alignment with **AlgoAtWork Robotics Academy** and the **University of Limpopo (UL Digital Hub)**, SignVision leverages high-speed Computer Vision, Machine Learning, and Web Technologies to deliver real-time, low-latency sign language translation and interactive learning.

---

## ✨ Core Features

1. **📹 Sign-to-Text & Speech (Deaf $\rightarrow$ Hearing):**
   - 60 FPS client-side hand tracking powered by **Google MediaPipe Hands**.
   - Geometric 21-joint 3D landmark feature extraction and gesture classification (*Hello, Thank You, I Love You, Yes, Peace, Water, Help, OK, Stop*).
   - Real-time confidence bar, transcript history stream, and Web Speech API audio synthesis.

2. **💬 Speech & Text-to-Sign (Hearing $\rightarrow$ Deaf):**
   - Converts spoken microphone audio or typed English sentences into South African Sign Language (SASL) glosses and visual gesture cards.

3. **🎓 Interactive Learn & Practice Mode:**
   - Challenge system prompting users to practice target signs with live accuracy checking, hold duration verification, score tracking, and speech rewards.

4. **📖 South African Sign Language (SASL) Reference Dictionary:**
   - Searchable reference library with visual icons, descriptions, categories, and dialect notes.

5. **🎨 Technomania Competition Dashboard:**
   - Dark glassmorphism design system with neon accents, live FPS counters, camera error diagnostics, and smooth tab navigation.

---

## 🛠 Tech Stack

- **Backend:** Python 3, Flask
- **Computer Vision & AI:** Google MediaPipe Hands, OpenCV, NumPy
- **Frontend & UI:** HTML5, Vanilla CSS3 (Glassmorphism), JavaScript (ES6+), WebRTC
- **Audio & Speech:** Web Speech API (SpeechSynthesis & SpeechRecognition)

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

### 3. Launch the Server
```bash
python app.py
```

### 4. Open in Browser
Navigate to **`http://127.0.0.1:5000`** and click **Start Camera Tracking**!

---

## 📄 License
Distributed under the MIT License. See `LICENSE` for more information.

*Built for Robo Rumble Technomania 2026.*
