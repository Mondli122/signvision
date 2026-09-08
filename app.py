from flask import Flask, render_template, jsonify, request
import os
import sys

# Ensure root workspace is in sys.path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from models.gesture_classifier import GestureClassifier

app = Flask(__name__)
classifier = GestureClassifier()

# Comprehensive SASL / ASL Sign Dictionary Data
DICTIONARY = [
    {
        "id": "hello",
        "word": "Hello",
        "gloss": "HELLO",
        "category": "Greetings",
        "icon": "👋",
        "description": "Place flat open hand near temple or chest, wave slightly outward.",
        "difficulty": "Beginner",
        "sasl_note": "Commonly used in South African Sign Language for welcoming and initial greeting."
    },
    {
        "id": "thank_you",
        "word": "Thank You",
        "gloss": "THANK YOU",
        "category": "Etiquette",
        "icon": "🙏",
        "description": "Touch fingertips of flat hand to your chin, then move hand forward towards person.",
        "difficulty": "Beginner",
        "sasl_note": "Expresses gratitude in SASL. Keeps palm facing up towards the recipient."
    },
    {
        "id": "i_love_you",
        "word": "I Love You",
        "gloss": "I LOVE YOU",
        "category": "Expressions",
        "icon": "🤟",
        "description": "Extend thumb, index, and pinky finger simultaneously while middle and ring fingers are folded.",
        "difficulty": "Beginner",
        "sasl_note": "Universal sign combining letters I, L, Y into one gesture."
    },
    {
        "id": "thumbs_up",
        "word": "Yes / Agree",
        "gloss": "YES",
        "category": "Responses",
        "icon": "👍",
        "description": "Extend thumb upwards with fingers closed in a fist.",
        "difficulty": "Beginner",
        "sasl_note": "Affirmative response sign used across SASL dialects."
    },
    {
        "id": "peace",
        "word": "Peace / Victory",
        "gloss": "PEACE",
        "category": "General",
        "icon": "✌️",
        "description": "Extend index and middle fingers in a V shape while thumb holds ring and pinky fingers.",
        "difficulty": "Beginner",
        "sasl_note": "Symbol for peace, two, or victory in conversation."
    },
    {
        "id": "water",
        "word": "Water",
        "gloss": "WATER",
        "category": "Basic Needs",
        "icon": "💧",
        "description": "Form a 'W' with index, middle, and ring fingers up, tap index finger against chin twice.",
        "difficulty": "Intermediate",
        "sasl_note": "Vital request sign for requesting water or hydration."
    },
    {
        "id": "help",
        "word": "Help",
        "gloss": "HELP",
        "category": "Emergency & Needs",
        "icon": "🆘",
        "description": "Place closed fist with thumb pointing up onto flat open palm of other hand and lift together.",
        "difficulty": "Intermediate",
        "sasl_note": "Crucial safety sign. Moving hand upwards indicates asking for assistance."
    },
    {
        "id": "no",
        "word": "No",
        "gloss": "NO",
        "category": "Responses",
        "icon": "🙅",
        "description": "Snap index and middle fingers closed against thumb quickly.",
        "difficulty": "Beginner",
        "sasl_note": "Negative response sign."
    },
    {
        "id": "ok",
        "word": "OK / Fine",
        "gloss": "OK",
        "category": "Responses",
        "icon": "👌",
        "description": "Touch tip of index finger to tip of thumb forming a circle, while remaining three fingers extend.",
        "difficulty": "Beginner",
        "sasl_note": "Sign of agreement or confirmation."
    },
    {
        "id": "fist",
        "word": "Stop / Wait",
        "gloss": "STOP",
        "category": "Control",
        "icon": "✊",
        "description": "Firmly close hand into a tight fist with thumb wrapped across fingers.",
        "difficulty": "Beginner",
        "sasl_note": "Clear signal for stopping or pausing an action."
    }
]

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/gestures', methods=['GET'])
def get_gestures():
    return jsonify(classifier.get_supported_gestures())

@app.route('/api/dictionary', methods=['GET'])
def get_dictionary():
    return jsonify(DICTIONARY)

@app.route('/api/predict', methods=['POST'])
def predict_gesture():
    data = request.json or {}
    landmarks = data.get('landmarks', [])
    prediction = classifier.classify_gesture(landmarks)
    return jsonify(prediction)

@app.route('/api/translate-text', methods=['POST'])
def translate_text():
    """
    Translates spoken or typed text into SASL Glosses and Visual Dictionary Cards.
    """
    data = request.json or {}
    text = data.get('text', '').strip().lower()
    
    if not text:
        return jsonify({"glosses": [], "cards": []})

    words = text.replace('.', '').replace(',', '').replace('!', '').replace('?', '').split()
    glosses = []
    matched_cards = []

    # Map words to glosses
    dictionary_lookup = {item['word'].lower(): item for item in DICTIONARY}
    
    # Add alias mappings
    dictionary_lookup['hi'] = dictionary_lookup['hello']
    dictionary_lookup['thanks'] = dictionary_lookup['thank you']
    dictionary_lookup['yeah'] = dictionary_lookup['yes / agree']

    for word in words:
        # Check direct or partial match in dictionary
        matched_item = None
        for dict_key, item in dictionary_lookup.items():
            if word in dict_key or dict_key in word:
                matched_item = item
                break
        
        if matched_item:
            glosses.append(matched_item['gloss'])
            if matched_item not in matched_cards:
                matched_cards.append(matched_item)
        else:
            # Fingerspell letters for unmapped words
            for char in word:
                if char.isalpha():
                    glosses.append(char.upper())

    return jsonify({
        "original_text": text,
        "gloss_sequence": " ".join(glosses),
        "glosses": glosses,
        "cards": matched_cards
    })

if __name__ == '__main__':
    print("[SignBridge SA] Starting Server on http://127.0.0.1:5000 ...")
    app.run(host='0.0.0.0', port=5000, debug=True)
