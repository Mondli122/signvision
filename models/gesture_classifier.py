import math
import os
import pickle
import numpy as np

class GestureClassifier:
    """
    Multi-Hand & Dynamic Sequence Feature Extractor and Rule / ML Classifier for 21/42 MediaPipe 3D Hand Landmarks.
    Provides real-time hand pose and motion trajectory classification for SASL / ASL conversational gestures.
    """
    def __init__(self):
        self.ml_model = None
        self.model_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'trained_gesture_model.pkl')
        self._load_ml_model()

        self.supported_gestures = [

            {
                "id": "hello",
                "name": "Hello / Wave",
                "gloss": "HELLO",
                "description": "Open hand facing forward, waving or fingers extended",
                "category": "Conversational",
                "icon": "👋"
            },
            {
                "id": "thank_you",
                "name": "Thank You",
                "gloss": "THANK YOU",
                "description": "Fingertips near chin moving outward, open palm",
                "category": "Conversational",
                "icon": "🙏"
            },
            {
                "id": "i_love_you",
                "name": "I Love You",
                "gloss": "I LOVE YOU",
                "description": "Thumb, index, and pinky extended, middle and ring curled",
                "category": "Conversational",
                "icon": "🤟"
            },
            {
                "id": "thumbs_up",
                "name": "Yes / Agree",
                "gloss": "YES",
                "description": "Thumb pointing straight up with fingers curled into fist",
                "category": "Responses",
                "icon": "👍"
            },
            {
                "id": "peace",
                "name": "Peace / Victory / V",
                "gloss": "PEACE",
                "description": "Index and middle fingers extended in a V-shape",
                "category": "Gestures",
                "icon": "✌️"
            },
            {
                "id": "water",
                "name": "Water / W",
                "gloss": "WATER",
                "description": "Index, middle, and ring fingers extended up, thumb holds pinky",
                "category": "Needs",
                "icon": "💧"
            },
            {
                "id": "help",
                "name": "Help (Bimanual)",
                "gloss": "HELP",
                "description": "Fist with thumb up resting on flat open palm or extended",
                "category": "Emergency & Needs",
                "icon": "🆘"
            },
            {
                "id": "where",
                "name": "Where? (Dynamic)",
                "gloss": "WHERE",
                "description": "Both palms open facing up moving side to side or index waving",
                "category": "Questions",
                "icon": "❓"
            },
            {
                "id": "please",
                "name": "Please (Dynamic)",
                "gloss": "PLEASE",
                "description": "Flat palm on chest making a circular motion",
                "category": "Etiquette",
                "icon": "🤲"
            },
            {
                "id": "sorry",
                "name": "Sorry (Dynamic)",
                "gloss": "SORRY",
                "description": "Fist rubbing chest in circular motion",
                "category": "Etiquette",
                "icon": "😔"
            },
            {
                "id": "no",
                "name": "No",
                "gloss": "NO",
                "description": "Index and middle fingers tap thumb quickly",
                "category": "Responses",
                "icon": "🙅"
            },
            {
                "id": "ok",
                "name": "OK / Fine",
                "gloss": "OK",
                "description": "Index tip touching thumb tip forming a circle, middle/ring/pinky up",
                "category": "Responses",
                "icon": "👌"
            },
            {
                "id": "fist",
                "name": "Stop / Wait",
                "gloss": "STOP",
                "description": "All fingers curled tight into a fist",
                "category": "Control",
                "icon": "✊"
            },
            {
                "id": "letter_a",
                "name": "Letter A (Fingerspelling)",
                "gloss": "A",
                "description": "Fist with thumb resting alongside index finger",
                "category": "Alphabet",
                "icon": "🔤"
            },
            {
                "id": "letter_b",
                "name": "Letter B (Fingerspelling)",
                "gloss": "B",
                "description": "4 fingers extended straight up, thumb tucked across palm",
                "category": "Alphabet",
                "icon": "🔤"
            },
            {
                "id": "letter_c",
                "name": "Letter C (Fingerspelling)",
                "gloss": "C",
                "description": "Hand curved in C shape facing sideways",
                "category": "Alphabet",
                "icon": "🔤"
            },
            {
                "id": "letter_l",
                "name": "Letter L (Fingerspelling)",
                "gloss": "L",
                "description": "Thumb and index finger form an L shape, other fingers curled",
                "category": "Alphabet",
                "icon": "🔤"
            },
            {
                "id": "eat",
                "name": "Eat / Food",
                "gloss": "EAT",
                "description": "Bring squished fingertips to mouth repeatedly",
                "category": "Needs",
                "icon": "🍽️"
            },
            {
                "id": "drink",
                "name": "Drink",
                "gloss": "DRINK",
                "description": "C hand shape tilted upward near chin",
                "category": "Needs",
                "icon": "🥤"
            },
            {
                "id": "want",
                "name": "Want",
                "gloss": "WANT",
                "description": "Open palms facing up pulling toward body",
                "category": "Expressions",
                "icon": "🤲"
            },
            {
                "id": "need",
                "name": "Need",
                "gloss": "NEED",
                "description": "Hooked index finger moving downward",
                "category": "Emergency & Needs",
                "icon": "⚠️"
            },
            {
                "id": "more",
                "name": "More",
                "gloss": "MORE",
                "description": "Fingertips tapping together repeatedly",
                "category": "General",
                "icon": "➕"
            },
            {
                "id": "good",
                "name": "Good",
                "gloss": "GOOD",
                "description": "Hand moving from chin to open palm",
                "category": "Expressions",
                "icon": "🌟"
            },
            {
                "id": "bad",
                "name": "Bad",
                "gloss": "BAD",
                "description": "Hand moving from chin turning downward",
                "category": "Expressions",
                "icon": "👎"
            },
            {
                "id": "family",
                "name": "Family",
                "gloss": "FAMILY",
                "description": "F hand shapes moving in a circle touching pinkies",
                "category": "Family & People",
                "icon": "👨‍👩‍👧‍👦"
            },
            {
                "id": "friend",
                "name": "Friend",
                "gloss": "FRIEND",
                "description": "Interlocking index fingers together twice",
                "category": "Family & People",
                "icon": "🧑‍🤝‍🧑"
            },
            {
                "id": "school",
                "name": "School",
                "gloss": "SCHOOL",
                "description": "Clapping flat palms together horizontally twice",
                "category": "Places & Education",
                "icon": "🏫"
            },
            {
                "id": "work",
                "name": "Work / Job",
                "gloss": "WORK",
                "description": "Dominant fist tapping wrist of non-dominant fist",
                "category": "Places & Education",
                "icon": "💼"
            },
            {
                "id": "home",
                "name": "Home",
                "gloss": "HOME",
                "description": "Touch flat hand to cheek then jaw",
                "category": "Places & Education",
                "icon": "🏠"
            },
            {
                "id": "time",
                "name": "Time / Clock",
                "gloss": "TIME",
                "description": "Index finger tapping wrist watch location",
                "category": "Time & Calendar",
                "icon": "⏰"
            },
            {
                "id": "today",
                "name": "Today / Now",
                "gloss": "TODAY",
                "description": "Y hand shapes dropped downward twice",
                "category": "Time & Calendar",
                "icon": "📅"
            },
            {
                "id": "money",
                "name": "Money / Pay",
                "gloss": "MONEY",
                "description": "Flat hand tapping palm of other hand repeatedly",
                "category": "Finance & Commerce",
                "icon": "💵"
            },
            {
                "id": "computer",
                "name": "Computer / Tech",
                "gloss": "COMPUTER",
                "description": "C hand shape moving along forearm",
                "category": "Technology",
                "icon": "💻"
            },
            {
                "id": "deaf",
                "name": "Deaf / SASL",
                "gloss": "DEAF",
                "description": "Index finger moving from ear to mouth",
                "category": "Community & Culture",
                "icon": "🤟"
            }
        ]



    def get_supported_gestures(self):
        return self.supported_gestures

    def extract_features(self, landmarks):
        """
        Extracts structural spatial features from 21 MediaPipe hand landmarks.
        landmarks: list of dicts [{'x': float, 'y': float, 'z': float}, ...]
        """
        if not landmarks or len(landmarks) < 21:
            return None

        wrist = landmarks[0]

        def is_finger_extended(tip_idx, pip_idx):
            tip = landmarks[tip_idx]
            pip = landmarks[pip_idx]
            d_tip = math.sqrt((tip['x'] - wrist['x'])**2 + (tip['y'] - wrist['y'])**2)
            d_pip = math.sqrt((pip['x'] - wrist['x'])**2 + (pip['y'] - wrist['y'])**2)
            return d_tip > d_pip

        thumb_ext = landmarks[4]['x'] > landmarks[3]['x'] if landmarks[4]['x'] != landmarks[3]['x'] else False
        thumb_up = landmarks[4]['y'] < landmarks[2]['y']

        index_ext = is_finger_extended(8, 6)
        middle_ext = is_finger_extended(12, 10)
        ring_ext = is_finger_extended(16, 14)
        pinky_ext = is_finger_extended(20, 18)

        def get_dist(idx1, idx2):
            p1, p2 = landmarks[idx1], landmarks[idx2]
            return math.sqrt((p1['x'] - p2['x'])**2 + (p1['y'] - p2['y'])**2)

        thumb_index_dist = get_dist(4, 8)
        index_middle_dist = get_dist(8, 12)
        thumb_pinky_dist = get_dist(4, 20)

        return {
            "wrist": wrist,
            "thumb": thumb_ext or thumb_up,
            "thumb_up": thumb_up,
            "index": index_ext,
            "middle": middle_ext,
            "ring": ring_ext,
            "pinky": pinky_ext,
            "thumb_index_dist": thumb_index_dist,
            "index_middle_dist": index_middle_dist,
            "thumb_pinky_dist": thumb_pinky_dist
        }

    def classify_multi_hand(self, hands_landmarks):
        """
        Classifies bimanual (2-hand) spatial interactions.
        hands_landmarks: list of 2 landmark sets [[hand1_21_pts], [hand2_21_pts]]
        """
        if not hands_landmarks or len(hands_landmarks) < 2:
            return None

        h1 = hands_landmarks[0]
        h2 = hands_landmarks[1]
        
        if len(h1) < 21 or len(h2) < 21:
            return None

        f1 = self.extract_features(h1)
        f2 = self.extract_features(h2)

        if not f1 or not f2:
            return None

        # Distance between wrists of both hands
        w_dist = math.sqrt((f1['wrist']['x'] - f2['wrist']['x'])**2 + (f1['wrist']['y'] - f2['wrist']['y'])**2)

        # 1. HELP (Bimanual): One hand is a fist with thumb up, resting near or on flat open palm of other hand
        is_fist1 = not f1['index'] and not f1['middle'] and not f1['ring'] and not f1['pinky'] and f1['thumb_up']
        is_open2 = f2['index'] and f2['middle'] and f2['ring'] and f2['pinky']
        is_fist2 = not f2['index'] and not f2['middle'] and not f2['ring'] and not f2['pinky'] and f2['thumb_up']
        is_open1 = f1['index'] and f1['middle'] and f1['ring'] and f1['pinky']

        if ((is_fist1 and is_open2) or (is_fist2 and is_open1)) and w_dist < 0.35:
            return {"gesture": "help", "confidence": 0.97, "gloss": "HELP", "icon": "🆘", "bimanual": True}

        # 2. WHERE (Bimanual): Both hands open with palms facing upward
        if is_open1 and is_open2 and f1['wrist']['y'] > 0.4 and f2['wrist']['y'] > 0.4:
            return {"gesture": "where", "confidence": 0.94, "gloss": "WHERE", "icon": "❓", "bimanual": True}

    def _load_ml_model(self):
        try:
            if os.path.exists(self.model_path):
                with open(self.model_path, 'rb') as f:
                    self.ml_model = pickle.load(f)
                print(f"[GestureClassifier] SUCCESS: Loaded ML Model weights from '{self.model_path}'")
        except Exception as e:
            print(f"[GestureClassifier] ML Model load warning: {e}")
            self.ml_model = None


    def classify_sequence(self, sequence_frames):
        """
        Analyzes temporal motion trajectories across a sliding 30-frame sequence buffer.
        Uses trained ML model if available; falls back to geometric rule classifier.
        """
        if not sequence_frames or len(sequence_frames) < 5:
            return None

        # 1. Try Trained Machine Learning Model Prediction
        if self.ml_model is not None:
            try:
                features = []
                for f_idx in [0, len(sequence_frames)//2, -1]:
                    frame = sequence_frames[f_idx]
                    if isinstance(frame, list) and len(frame) >= 21:
                        wrist = frame[0]
                        for p in frame:
                            features.append(p['x'] - wrist['x'])
                            features.append(p['y'] - wrist['y'])
                            features.append(p['z'] - wrist['z'])

                first_w = sequence_frames[0][0]
                last_w = sequence_frames[-1][0]
                dx = last_w['x'] - first_w['x']
                dy = last_w['y'] - first_w['y']
                motion = math.sqrt(dx**2 + dy**2)
                features.extend([dx, dy, motion])

                X_feat = np.array([features])
                pred_label = self.ml_model.predict(X_feat)[0]
                probs = self.ml_model.predict_proba(X_feat)[0]
                conf = float(np.max(probs))

                if conf >= 0.70:
                    for g in self.supported_gestures:
                        if g['id'] == pred_label:
                            return {"gesture": g['id'], "confidence": conf, "gloss": g['gloss'], "icon": g['icon'], "ml": True}
            except Exception as e:
                pass

        # 2. Geometric Trajectory Fallback
        start_wrist = sequence_frames[0][0] if isinstance(sequence_frames[0], list) and len(sequence_frames[0]) > 0 else None
        end_wrist = sequence_frames[-1][0] if isinstance(sequence_frames[-1], list) and len(sequence_frames[-1]) > 0 else None


        if not start_wrist or not end_wrist:
            return None

        dx = end_wrist['x'] - start_wrist['x']
        dy = end_wrist['y'] - start_wrist['y']
        total_motion = math.sqrt(dx**2 + dy**2)

        # Check average finger state across recent frames
        recent_feats = self.extract_features(sequence_frames[-1])
        if not recent_feats:
            return None

        # If significant horizontal motion with open hand -> Dynamic WAVE / HELLO or WHERE
        if total_motion > 0.15:
            if recent_feats['index'] and recent_feats['middle'] and recent_feats['ring'] and recent_feats['pinky']:
                if abs(dx) > abs(dy):
                    return {"gesture": "where", "confidence": 0.92, "gloss": "WHERE", "icon": "❓", "dynamic": True}
                else:
                    return {"gesture": "hello", "confidence": 0.95, "gloss": "HELLO", "icon": "👋", "dynamic": True}

        # Circular or vertical motion with fist/flat palm on chest -> PLEASE or SORRY
        if total_motion > 0.08 and recent_feats['wrist']['y'] < 0.7:
            if not recent_feats['index'] and not recent_feats['middle']:
                return {"gesture": "sorry", "confidence": 0.91, "gloss": "SORRY", "icon": "😔", "dynamic": True}
            elif recent_feats['index'] and recent_feats['middle'] and recent_feats['ring'] and recent_feats['pinky']:
                return {"gesture": "please", "confidence": 0.93, "gloss": "PLEASE", "icon": "🤲", "dynamic": True}

        return None

    def classify_gesture(self, landmarks, hands_list=None, sequence_buffer=None):
        """
        Main multi-mode classification entrypoint.
        Prioritizes:
        1. Multi-hand interaction (if 2 hands present)
        2. Dynamic Sequence Motion Trajectories (if 30-frame sequence provided)
        3. Static Single-Hand Geometry Classification
        """
        # 1. Check Multi-Hand Interaction
        if hands_list and len(hands_list) >= 2:
            multi_res = self.classify_multi_hand(hands_list)
            if multi_res:
                return multi_res

        # 2. Check Dynamic Sequence Trajectory
        if sequence_buffer and len(sequence_buffer) >= 10:
            seq_res = self.classify_sequence(sequence_buffer)
            if seq_res:
                return seq_res

        # If landmarks is a list of hands, pick primary hand
        if isinstance(landmarks, dict) and 'hands' in landmarks:
            hands_list = landmarks['hands']
            landmarks = hands_list[0] if len(hands_list) > 0 else []

        if isinstance(landmarks, list) and len(landmarks) > 0 and isinstance(landmarks[0], list):
            landmarks = landmarks[0]

        # 3. Static Single-Hand Classification
        feats = self.extract_features(landmarks)
        if not feats:
            return {"gesture": "NONE", "confidence": 0.0, "gloss": ""}

        # I LOVE YOU: Thumb, Index, Pinky extended; Middle & Ring curled
        if feats['index'] and feats['pinky'] and feats['thumb_up'] and not feats['middle'] and not feats['ring']:
            return {"gesture": "i_love_you", "confidence": 0.96, "gloss": "I LOVE YOU", "icon": "🤟"}

        # OK: Thumb and Index touching (small dist), Middle, Ring, Pinky extended
        if feats['thumb_index_dist'] < 0.08 and feats['middle'] and feats['ring'] and feats['pinky']:
            return {"gesture": "ok", "confidence": 0.93, "gloss": "OK", "icon": "👌"}

        # PEACE / V: Index & Middle extended, Ring & Pinky curled
        if feats['index'] and feats['middle'] and not feats['ring'] and not feats['pinky']:
            return {"gesture": "peace", "confidence": 0.95, "gloss": "PEACE", "icon": "✌️"}

        # WATER / W: Index, Middle, Ring extended, Pinky curled
        if feats['index'] and feats['middle'] and feats['ring'] and not feats['pinky']:
            return {"gesture": "water", "confidence": 0.91, "gloss": "WATER", "icon": "💧"}

        # THUMBS UP (YES): Thumb pointing up, index, middle, ring, pinky curled
        if feats['thumb_up'] and not feats['index'] and not feats['middle'] and not feats['ring'] and not feats['pinky']:
            return {"gesture": "thumbs_up", "confidence": 0.97, "gloss": "YES", "icon": "👍"}

        # HELLO: All 5 fingers extended
        if feats['index'] and feats['middle'] and feats['ring'] and feats['pinky'] and feats['thumb']:
            return {"gesture": "hello", "confidence": 0.98, "gloss": "HELLO", "icon": "👋"}

        # STOP / FIST: All fingers curled
        if not feats['index'] and not feats['middle'] and not feats['ring'] and not feats['pinky']:
            return {"gesture": "fist", "confidence": 0.89, "gloss": "STOP", "icon": "✊"}

        # --- A-Z Fingerspelling Matches ---
        # Letter L: Thumb & Index extended, Middle, Ring, Pinky curled
        if feats['thumb_up'] and feats['index'] and not feats['middle'] and not feats['ring'] and not feats['pinky']:
            return {"gesture": "letter_l", "confidence": 0.92, "gloss": "L", "icon": "🔤"}

        # Letter B: Index, Middle, Ring, Pinky extended straight, Thumb curled across palm
        if feats['index'] and feats['middle'] and feats['ring'] and feats['pinky'] and not feats['thumb_up']:
            return {"gesture": "letter_b", "confidence": 0.90, "gloss": "B", "icon": "🔤"}

        # Letter A: Fist with thumb alongside index
        if not feats['index'] and not feats['middle'] and not feats['ring'] and not feats['pinky'] and feats['thumb']:
            return {"gesture": "letter_a", "confidence": 0.88, "gloss": "A", "icon": "🔤"}

        # Fallback OPEN HAND
        if feats['index'] and feats['middle'] and feats['ring'] and feats['pinky']:
            return {"gesture": "hello", "confidence": 0.85, "gloss": "HELLO", "icon": "👋"}

        return {"gesture": "UNKNOWN", "confidence": 0.50, "gloss": "DETECTING...", "icon": "✋"}

