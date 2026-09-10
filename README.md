# 🇿🇦 SignVision SA (SignBridge)
> **Real-Time Two-Way South African Sign Language (SASL) AI Translator, ML Sequence Engine & Gamified STEM Learning Platform**  
> *Engineered for the South African **Robo Rumble Technomania STEM & Innovation Competition 2026**.*

[![Status](https://img.shields.io/badge/Status-Competition--Ready-00A884.svg)](#)
[![Python](https://img.shields.io/badge/Python-3.9%2B-3776AB.svg?logo=python&logoColor=white)](#)
[![Flask](https://img.shields.io/badge/Backend-Flask-000000.svg?logo=flask&logoColor=white)](#)
[![React](https://img.shields.io/badge/Frontend-React%2018%20%2B%20Vite-61DAFB.svg?logo=react&logoColor=black)](#)
[![MediaPipe](https://img.shields.io/badge/CV-Google%20MediaPipe-00F59B.svg)](#)
[![PWA](https://img.shields.io/badge/PWA-100%25%20Offline%20Ready-5A0FC8.svg)](#)
[![Language](https://img.shields.io/badge/SASL-12th%20Official%20Language-EAB308.svg)](#)

---

## 📌 Mission & Overview

In July 2023, **South African Sign Language (SASL)** was officially enacted as the **12th Official Language of South Africa**. Despite this historic milestone, over **600,000 Deaf and hard-of-hearing South Africans** face daily communication barriers in healthcare facilities, police stations, classrooms, and public services.

**SignVision SA** bridges this digital divide. Built in alignment with **AlgoAtWork Robotics Academy** and the **University of Limpopo (UL Digital Hub)**, SignVision delivers:
1. **Real-time, two-way translation** between SASL and spoken/written English & South African indigenous languages.
2. **Offline-first edge inference** so rural schools without stable internet or airtime can learn without limits.
3. **Gamified STEM classroom integration** teaching Deaf and hearing students robotics, AI, and sign language together.

---

## ✨ Core Features & Architecture

```
                                  SIGNVISION SA ARCHITECTURE
                                  
  [ Deaf User (Webcam) ] ──▶ [ MediaPipe Dual-Hand CV ] ──▶ [ 30-Frame Sequence Engine ] ──▶ [ OpenRouter AI NLP ]
                                (42 3D Landmarks)             (RandomForest ML Classifier)        (Multilingual Sentence)
                                                                                                        │
                                                                                                        ▼
  [ Hearing User (Speaker) ] ◀── [ Web Speech API Audio ] ◀── [ Fluent Sentence Output ] ◀───────────────┘
                                           │
  [ Hearing User (Mic) ] ──────▶ [ Web Speech Recognition ] ──▶ [ SASL Lexicon Lookup ] ──▶ [ 3D Avatar Signer ]
```

### 1. 📹 60 FPS Dual-Hand Computer Vision (`maxNumHands: 2`)
* Tracks up to **2 hands simultaneously** (42 3D landmarks total) directly in the browser using **Google MediaPipe Hands**.
* Color-coded spatial skeletons: Dominant Hand in Neon Emerald (`#00F59B`) and Non-Dominant Hand in Purple (`#A855F7`).
* Real-time hardware telemetry: Live FPS counter, detection confidence meter, and tracking status.

### 2. 🤖 Machine Learning Sequence Classifier
* Powered by a trained `scikit-learn` `RandomForestClassifier` running on a **30-frame temporal sliding window**.
* Distinguishes static handshapes from dynamic bimanual conversational signs (*HELP*, *WHERE*, *WATER*, *THANK YOU*, *EMERGENCY*).
* **Dataset Studio (`/api/record-sequence`):** In-app recording studio capturing real 42-point landmark arrays across 30 frames to train custom regional signs.

### 3. 🧠 Multilingual OpenRouter NLP Engine
* Converts raw sign gloss streams (*HELLO WHERE HELP*) into natural, grammatically correct sentences in English, isiZulu, isiXhosa, Afrikaans, and Sesotho.
* Rule-based edge fallback ensures instant translation even if cloud API limits are reached.

### 4. 🧍‍♀️ Sign-Specific 3D Avatar Signer
* Keyframed 3D canvas avatar rendering anatomical SASL arm, elbow, wrist, and hand poses for signs like *HELLO*, *HELP*, *WATER*, *THANK YOU*, *I LOVE YOU*, and *YES*.

### 5. 📞 Real-Time WebRTC Call Room
* Live two-way video calling room featuring real local camera/mic media streams, live interactive speech-to-sign captions, mute/camera toggles, and seamless Deaf-hearing communication.

### 6. 🏆 National STEM Classroom & Leaderboards
* Live leaderboard ranking learners across South African provinces (Gauteng, Western Cape, KZN, Limpopo, Eastern Cape, Free State).
* Automatically places the active student into the national leaderboard based on their actual earned XP and daily streak.

### 7. 🔒 Backend Supabase Authentication
* Secure server-side authentication (`/api/auth/signup`, `/api/auth/login`, `/api/auth/user`, `/api/auth/logout`) keeping API keys protected on the server.
* Persistent cloud progress synchronization (`/api/user/progress`) ensuring XP, levels, and badges survive across sessions.

### 8. 📲 Offline Progressive Web App (PWA)
* Fully installable on Android, iOS, Windows, and macOS desktop/mobile devices.
* Offline Service Worker (`sw.js`) and Web App Manifest (`manifest.json`) caching core assets and dictionary signs for 100% offline usage in remote areas.

---

## 🛠 Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite, Vanilla CSS3 (Glassmorphism), Lucide Icons |
| **Backend** | Python 3.9+, Flask, Flask-CORS, Gunicorn |
| **Computer Vision** | Google MediaPipe Hands, HTML5 Canvas 2D, WebRTC |
| **Machine Learning** | scikit-learn, NumPy, OpenCV, Custom 42-point Feature Extractor |
| **Generative AI** | OpenRouter API (Claude / Gemini / Llama models) |
| **Authentication & DB** | Supabase REST Backend Client, File-backed JSON store |
| **Audio & Speech** | Web Speech Synthesis API, Webkit Speech Recognition |
| **PWA & Offline** | Service Worker, Web App Manifest, Cache API |

---

## 🚀 Quick Start Guide

### 1. Clone the Repository
```bash
git clone https://github.com/Mondli122/signvision.git
cd signvision
```

### 2. Configure Environment Variables
Create a `.env` file in the root directory:
```env
OPENROUTER_API_KEY=your_openrouter_api_key_here
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
SUPABASE_ANON_KEY=your_supabase_anon_key_here
PORT=5000
```

### 3. Install Python Dependencies
```bash
python -m venv venv
# On Windows:
venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
```

### 4. Build the Frontend (React + Vite)
```bash
cd frontend
npm install
npm run build
cd ..
```
*(Note: On Windows PowerShell, use `npm.cmd` if script execution policies apply).*

### 5. Start the Application Server
```bash
python app.py
```
Open your browser and navigate to: **`http://127.0.0.1:5000`**

---

## 🌐 API Endpoint Reference

| Endpoint | Method | Description |
|---|---|---|
| `/api/predict` | `POST` | Classifies 42 landmark coordinates against the trained gesture model |
| `/api/gloss-to-sentence` | `POST` | Translates raw SASL gloss sequences into fluent multilingual sentences |
| `/api/translate-text` | `POST` | Reverse translator: Converts typed/spoken text into SASL glosses and dictionary cards |
| `/api/dictionary` | `GET` | Returns the complete South African Sign Language lexicon |
| `/api/ai-coach` | `POST` | Evaluates user pose alignment and returns AI sign coaching feedback |
| `/api/ai-tutor` | `POST` | Interactive AI sign language tutor chat assistant |
| `/api/leaderboard` | `GET` | Fetches national STEM school rankings |
| `/api/user/progress` | `GET / POST` | Persistent sync of user XP, streak, and badges |
| `/api/emergency-assist` | `POST` | Formulates rapid emergency SOS alerts for first responders |
| `/api/community-signs` | `GET / POST` | Repository of user-contributed regional SASL signs |
| `/api/record-sequence` | `POST` | Saves 30-frame landmark sequences for ML dataset training |
| `/api/auth/signup` | `POST` | Registers a new user through Supabase Auth REST |
| `/api/auth/login` | `POST` | Authenticates user and returns JWT session token |
| `/api/auth/user` | `GET` | Fetches authenticated user profile |

---

## 🏆 Competition Checklist for Evaluators

- [x] **Real-time Dual Hand Tracking:** Powered by MediaPipe Hands at 60 FPS.
- [x] **Offline PWA Architecture:** Installs to desktop/mobile; operates without internet.
- [x] **Reverse Speech-to-Sign:** Hearing users speak; Deaf users receive sign cards and 3D avatar animations.
- [x] **Emergency SOS Dispatch:** Medical, Police, Fire, and Rescue alerts tailored for Deaf citizens.
- [x] **National Classroom Integration:** Live gamified leaderboards across SA provinces.
- [x] **Dark Mode & Accessibility:** High contrast, large fonts, theme-aware scrollbars.
- [x] **Zero Mock Crashes:** All routes, error boundaries, and loading skeletons verified.

---

## 📄 License & Attribution
Distributed under the **MIT License**.  
Developed with pride for the **Robo Rumble Technomania STEM & Innovation Competition 2026** 🇿🇦.