import math

class GestureClassifier:
    """
    Geometric Feature Extractor and Rule Classifier for 21 MediaPipe 3D Hand Landmarks.
    Provides real-time hand pose classification for SASL / ASL gestures.
    """
    def __init__(self):
        self.supported_gestures = [
            {
                "id": "hello",
                "name": "Hello / Wave",
                "gloss": "HELLO",
                "description": "Open hand facing forward, fingers extended",
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
                "name": "Help",
                "gloss": "HELP",
                "description": "Fist with thumb up resting on flat palm or extended",
                "category": "Needs",
                "icon": "🆘"
            },
            {
                "id": "no",
                "name": "No",
                "gloss": "NO",
                "description": "Index and middle fingers tap thumb, pinky and ring closed",
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

        # Wrist landmark
        wrist = landmarks[0]

        # Check finger extension states (True = Extended, False = Curled)
        # Using distance from tip to wrist vs PIP joint to wrist
        def is_finger_extended(tip_idx, pip_idx):
            tip = landmarks[tip_idx]
            pip = landmarks[pip_idx]
            d_tip = math.sqrt((tip['x'] - wrist['x'])**2 + (tip['y'] - wrist['y'])**2)
            d_pip = math.sqrt((pip['x'] - wrist['x'])**2 + (pip['y'] - wrist['y'])**2)
            return d_tip > d_pip

        # Finger index constants
        # Thumb: 4, Index: 8, Middle: 12, Ring: 16, Pinky: 20
        thumb_ext = landmarks[4]['x'] > landmarks[3]['x'] if landmarks[4]['x'] != landmarks[3]['x'] else False
        # Calculate thumb elevation relative to wrist
        thumb_up = landmarks[4]['y'] < landmarks[2]['y']

        index_ext = is_finger_extended(8, 6)
        middle_ext = is_finger_extended(12, 10)
        ring_ext = is_finger_extended(16, 14)
        pinky_ext = is_finger_extended(20, 18)

        # Distances between key tips
        def get_dist(idx1, idx2):
            p1, p2 = landmarks[idx1], landmarks[idx2]
            return math.sqrt((p1['x'] - p2['x'])**2 + (p1['y'] - p2['y'])**2)

        thumb_index_dist = get_dist(4, 8)
        index_middle_dist = get_dist(8, 12)

        return {
            "thumb": thumb_ext or thumb_up,
            "thumb_up": thumb_up,
            "index": index_ext,
            "middle": middle_ext,
            "ring": ring_ext,
            "pinky": pinky_ext,
            "thumb_index_dist": thumb_index_dist,
            "index_middle_dist": index_middle_dist
        }

    def classify_gesture(self, landmarks):
        """
        Classifies hand landmarks into gesture predictions with confidence scores.
        """
        feats = self.extract_features(landmarks)
        if not feats:
            return {"gesture": "NONE", "confidence": 0.0, "gloss": ""}

        # 1. I LOVE YOU: Thumb, Index, Pinky extended; Middle & Ring curled
        if feats['index'] and feats['pinky'] and feats['thumb_up'] and not feats['middle'] and not feats['ring']:
            return {"gesture": "i_love_you", "confidence": 0.95, "gloss": "I LOVE YOU", "icon": "🤟"}

        # 2. OK: Thumb and Index touching (small dist), Middle, Ring, Pinky extended
        if feats['thumb_index_dist'] < 0.08 and feats['middle'] and feats['ring'] and feats['pinky']:
            return {"gesture": "ok", "confidence": 0.92, "gloss": "OK", "icon": "👌"}

        # 3. PEACE / V: Index & Middle extended, Ring & Pinky curled
        if feats['index'] and feats['middle'] and not feats['ring'] and not feats['pinky']:
            return {"gesture": "peace", "confidence": 0.94, "gloss": "PEACE", "icon": "✌️"}

        # 4. WATER / W: Index, Middle, Ring extended, Pinky curled
        if feats['index'] and feats['middle'] and feats['ring'] and not feats['pinky']:
            return {"gesture": "water", "confidence": 0.90, "gloss": "WATER", "icon": "💧"}

        # 5. THUMBS UP (YES): Thumb pointing up, index, middle, ring, pinky curled
        if feats['thumb_up'] and not feats['index'] and not feats['middle'] and not feats['ring'] and not feats['pinky']:
            return {"gesture": "thumbs_up", "confidence": 0.96, "gloss": "YES", "icon": "👍"}

        # 6. HELLO: All 5 fingers extended
        if feats['index'] and feats['middle'] and feats['ring'] and feats['pinky'] and feats['thumb']:
            return {"gesture": "hello", "confidence": 0.98, "gloss": "HELLO", "icon": "👋"}

        # 7. STOP / FIST: All fingers curled
        if not feats['index'] and not feats['middle'] and not feats['ring'] and not feats['pinky']:
            return {"gesture": "fist", "confidence": 0.88, "gloss": "STOP", "icon": "✊"}

        # Fallback to OPEN HAND if 4 fingers extended
        if feats['index'] and feats['middle'] and feats['ring'] and feats['pinky']:
            return {"gesture": "hello", "confidence": 0.85, "gloss": "HELLO", "icon": "👋"}

        return {"gesture": "UNKNOWN", "confidence": 0.40, "gloss": "..."}
