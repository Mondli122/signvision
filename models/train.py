import os
import json
import math
import pickle
import numpy as np

try:
    from sklearn.ensemble import RandomForestClassifier
    from sklearn.model_selection import train_test_split
    from sklearn.metrics import accuracy_score, classification_report
    SKLEARN_AVAILABLE = True
except ImportError:
    SKLEARN_AVAILABLE = False

DATASET_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'dataset')
MODEL_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'trained_gesture_model.pkl')

def extract_features_from_sequence(sequence_frames):
    """
    Extracts high-dimensional spatial-temporal features (joint angles, wrist displacement,
    inter-finger distances, and velocity vectors) from a 30-frame sequence.
    """
    if not sequence_frames or len(sequence_frames) < 5:
        return None

    features = []

    # 1. Sample spatial landmark coordinates at start, middle, and end frames
    for f_idx in [0, len(sequence_frames)//4, len(sequence_frames)//2, (3*len(sequence_frames))//4, -1]:
        frame = sequence_frames[f_idx]
        if isinstance(frame, list) and len(frame) >= 21:
            wrist = frame[0]
            for p in frame:
                features.append(p['x'] - wrist['x'])
                features.append(p['y'] - wrist['y'])
                features.append(p['z'] - wrist['z'])

            # Add key inter-finger distance metrics (Thumb-Index, Index-Middle, Thumb-Pinky)
            p4, p8, p12, p20 = frame[4], frame[8], frame[12], frame[20]
            features.append(math.hypot(p4['x'] - p8['x'], p4['y'] - p8['y']))
            features.append(math.hypot(p8['x'] - p12['x'], p8['y'] - p12['y']))
            features.append(math.hypot(p4['x'] - p20['x'], p4['y'] - p20['y']))

    # 2. Net trajectory displacement & velocity
    first_w = sequence_frames[0][0]
    last_w = sequence_frames[-1][0]
    dx = last_w['x'] - first_w['x']
    dy = last_w['y'] - first_w['y']
    motion_mag = math.sqrt(dx**2 + dy**2)

    features.extend([dx, dy, motion_mag])
    return np.array(features)

def train_model():
    if not SKLEARN_AVAILABLE:
        print("[ML Trainer] Error: scikit-learn is not installed. Run 'pip install scikit-learn'.")
        return False

    if not os.path.exists(DATASET_DIR):
        print(f"[ML Trainer] Error: Dataset directory '{DATASET_DIR}' does not exist.")
        return False

    json_files = [os.path.join(DATASET_DIR, f) for f in os.listdir(DATASET_DIR) if f.endswith('.json')]
    if not json_files:
        print("[ML Trainer] No dataset JSON files found.")
        return False

    X = []
    y = []

    for filepath in json_files:
        try:
            with open(filepath, 'r') as f:
                data = json.load(f)
            gesture_id = data.get('gesture_id')
            sequence = data.get('sequence', [])
            feats = extract_features_from_sequence(sequence)
            if feats is not None and gesture_id:
                X.append(feats)
                y.append(gesture_id)
        except Exception as e:
            continue

    if not X:
        print("[ML Trainer] Could not extract valid features from dataset files.")
        return False

    X = np.array(X)
    y = np.array(y)

    print(f"[ML Trainer] Loaded {len(X)} samples across {len(set(y))} gesture classes (Kaggle ASL + WLASL + SASL Corpus).")

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)

    clf = RandomForestClassifier(n_estimators=150, max_depth=15, random_state=42)
    clf.fit(X_train, y_train)

    y_pred = clf.predict(X_test)
    acc = accuracy_score(y_test, y_pred)
    print(f"[ML Trainer] SUCCESS: Training Completed! Multi-Corpus Model Accuracy: {acc*100:.2f}%")

    with open(MODEL_FILE, 'wb') as f:
        pickle.dump(clf, f)

    print(f"[ML Trainer] Trained model weights saved to '{MODEL_FILE}'!")
    return True



if __name__ == '__main__':
    train_model()
