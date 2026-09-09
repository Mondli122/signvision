import os
import json
import time
import random
import math

DATASET_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'dataset')
os.makedirs(DATASET_DIR, exist_ok=True)

GESTURES = [
    "hello", "thank_you", "i_love_you", "thumbs_up", "peace",
    "water", "help", "where", "please", "sorry", "ok", "fist",
    "letter_l", "letter_b"
]

def generate_hand_landmarks(gesture_id, frame_idx, total_frames=30):
    """
    Generates realistic 21 3D hand landmark coordinates for a specific gesture across time.
    """
    progress = frame_idx / float(total_frames)
    noise = lambda: random.uniform(-0.015, 0.015)

    wrist = {'x': 0.5 + noise(), 'y': 0.6 + noise(), 'z': 0.0}

    if gesture_id == "hello":
        wrist['x'] += 0.08 * math.sin(progress * math.pi * 2)
    elif gesture_id == "where":
        wrist['x'] += 0.12 * (progress - 0.5)
    elif gesture_id in ["please", "sorry"]:
        wrist['x'] += 0.05 * math.cos(progress * math.pi * 2)
        wrist['y'] += 0.05 * math.sin(progress * math.pi * 2) - 0.1
    elif gesture_id == "thank_you":
        wrist['y'] += 0.08 * progress
        wrist['z'] -= 0.05 * progress

    landmarks = [wrist]

    is_fist = gesture_id in ["fist", "sorry"]
    is_open = gesture_id in ["hello", "please", "where"]

    for finger in range(5):
        base_angle = (finger - 2) * 0.25
        for joint in range(1, 5):
            dist = joint * 0.06
            if is_fist and joint > 1:
                dx = dist * 0.4 * math.sin(base_angle)
                dy = dist * 0.4 * math.cos(base_angle)
            elif is_open:
                dx = dist * math.sin(base_angle)
                dy = -dist * math.cos(base_angle)
            else:
                dx = dist * math.sin(base_angle)
                dy = -dist * math.cos(base_angle) * (0.8 if joint > 2 else 1.0)

            landmarks.append({
                'x': wrist['x'] + dx + noise(),
                'y': wrist['y'] + dy + noise(),
                'z': wrist['z'] + (joint * 0.01) + noise()
            })

    return landmarks

def generate_dataset_samples(samples_per_gesture=20):
    print(f"[Dataset Generator] Generating {samples_per_gesture} samples per gesture...")
    total_generated = 0

    for gesture_id in GESTURES:
        for i in range(samples_per_gesture):
            sequence = []
            for frame_idx in range(30):
                sequence.append(generate_hand_landmarks(gesture_id, frame_idx, 30))

            filename = f"syn_{gesture_id}_{int(time.time()*1000)}_{i}.json"
            filepath = os.path.join(DATASET_DIR, filename)

            with open(filepath, 'w') as f:
                json.dump({
                    "gesture_id": gesture_id,
                    "timestamp": time.time(),
                    "num_frames": 30,
                    "sequence": sequence
                }, f, indent=2)

            total_generated += 1

    print(f"[Dataset Generator] Successfully generated {total_generated} sequence samples in '{DATASET_DIR}'!")

if __name__ == '__main__':
    generate_dataset_samples(samples_per_gesture=20)
