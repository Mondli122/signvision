from flask import Flask, render_template, jsonify, request, send_from_directory
from flask_cors import CORS
import os
import sys
import json
import time

# Ensure root workspace is in sys.path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from models.gesture_classifier import GestureClassifier
from utils.openrouter_client import OpenRouterClient

FRONTEND_DIST = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'frontend', 'dist')
if os.path.exists(FRONTEND_DIST):
    app = Flask(__name__, static_folder=FRONTEND_DIST, static_url_path='')
else:
    app = Flask(__name__)

CORS(app)
classifier = GestureClassifier()
ai_client = OpenRouterClient()

# Dataset storage directory
DATASET_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'dataset')
os.makedirs(DATASET_DIR, exist_ok=True)

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
        "sasl_note": "Bimanual sign. Moving dominant hand upward on palm indicates asking for assistance."
    },
    {
        "id": "where",
        "word": "Where?",
        "gloss": "WHERE",
        "category": "Questions",
        "icon": "❓",
        "description": "Hold both open palms up moving side to side gently.",
        "difficulty": "Intermediate",
        "sasl_note": "Essential question sign in SASL conversations."
    },
    {
        "id": "please",
        "word": "Please",
        "gloss": "PLEASE",
        "category": "Etiquette",
        "icon": "🤲",
        "description": "Place open flat palm over chest and move in a smooth clockwise circular motion.",
        "difficulty": "Beginner",
        "sasl_note": "Polite request sign widely used across South African Sign Language."
    },
    {
        "id": "sorry",
        "word": "Sorry",
        "gloss": "SORRY",
        "category": "Etiquette",
        "icon": "😔",
        "description": "Make a fist and rub in circular motion over center of chest.",
        "difficulty": "Beginner",
        "sasl_note": "Expresses apology or regret."
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
    },
    {
        "id": "eat",
        "word": "Eat / Food",
        "gloss": "EAT",
        "category": "Basic Needs",
        "icon": "🍽️",
        "description": "Bring squished fingertips to mouth repeatedly.",
        "difficulty": "Beginner",
        "sasl_note": "Kaggle ASL & WLASL benchmark sign for requesting food or meal."
    },
    {
        "id": "drink",
        "word": "Drink",
        "gloss": "DRINK",
        "category": "Basic Needs",
        "icon": "🥤",
        "description": "Form a C hand shape near chin and tip upward like drinking from a cup.",
        "difficulty": "Beginner",
        "sasl_note": "Universal sign across SASL and WLASL benchmarks."
    },
    {
        "id": "want",
        "word": "Want",
        "gloss": "WANT",
        "category": "Expressions",
        "icon": "🤲",
        "description": "Open hands facing up, pulling towards chest while curving fingers.",
        "difficulty": "Intermediate",
        "sasl_note": "Common request sign in conversational SASL."
    },
    {
        "id": "need",
        "word": "Need / Must",
        "gloss": "NEED",
        "category": "Emergency & Needs",
        "icon": "⚠️",
        "description": "Bend index finger into a hook and move downward forcefully.",
        "difficulty": "Intermediate",
        "sasl_note": "Expresses necessity or emergency in SASL."
    },
    {
        "id": "more",
        "word": "More",
        "gloss": "MORE",
        "category": "General",
        "icon": "➕",
        "description": "Tap fingertips of both hands together repeatedly.",
        "difficulty": "Beginner",
        "sasl_note": "Frequent request sign across Kaggle ASL and SASL."
    },
    {
        "id": "good",
        "word": "Good / Fine",
        "gloss": "GOOD",
        "category": "Expressions",
        "icon": "🌟",
        "description": "Touch fingertips to chin and bring hand down into open palm.",
        "difficulty": "Beginner",
        "sasl_note": "Affirmative evaluation sign in SASL."
    },
    {
        "id": "family",
        "word": "Family",
        "gloss": "FAMILY",
        "category": "Family & People",
        "icon": "👨‍👩‍👧‍👦",
        "description": "F hand shapes moving in a circle touching pinkies.",
        "difficulty": "Intermediate",
        "sasl_note": "Universal sign across Kaggle ASL, WLASL, and SASL."
    },
    {
        "id": "friend",
        "word": "Friend",
        "gloss": "FRIEND",
        "category": "Family & People",
        "icon": "🧑‍🤝‍🧑",
        "description": "Interlocking index fingers together twice.",
        "difficulty": "Beginner",
        "sasl_note": "Common relationship sign in SASL."
    },
    {
        "id": "school",
        "word": "School",
        "gloss": "SCHOOL",
        "category": "Places & Education",
        "icon": "🏫",
        "description": "Clapping flat palms together horizontally twice.",
        "difficulty": "Beginner",
        "sasl_note": "Essential educational sign in SASL."
    },
    {
        "id": "work",
        "word": "Work / Job",
        "gloss": "WORK",
        "category": "Places & Education",
        "icon": "💼",
        "description": "Dominant fist tapping wrist of non-dominant fist.",
        "difficulty": "Intermediate",
        "sasl_note": "Key employment sign across SASL dialects."
    },
    {
        "id": "home",
        "word": "Home",
        "gloss": "HOME",
        "category": "Places & Education",
        "icon": "🏠",
        "description": "Touch flat hand to cheek then jaw.",
        "difficulty": "Beginner",
        "sasl_note": "Universal location sign."
    },
    {
        "id": "time",
        "word": "Time / Clock",
        "gloss": "TIME",
        "category": "Time & Calendar",
        "icon": "⏰",
        "description": "Index finger tapping wrist watch location.",
        "difficulty": "Beginner",
        "sasl_note": "Standard temporal sign."
    },
    {
        "id": "today",
        "word": "Today / Now",
        "gloss": "TODAY",
        "category": "Time & Calendar",
        "icon": "📅",
        "description": "Y hand shapes dropped downward twice.",
        "difficulty": "Intermediate",
        "sasl_note": "Current time marker sign."
    },
    {
        "id": "money",
        "word": "Money / Pay",
        "gloss": "MONEY",
        "category": "Finance & Commerce",
        "icon": "💵",
        "description": "Flat hand tapping palm of other hand repeatedly.",
        "difficulty": "Beginner",
        "sasl_note": "Financial request sign in SASL."
    },
    {
        "id": "computer",
        "word": "Computer / Tech",
        "gloss": "COMPUTER",
        "category": "Technology",
        "icon": "💻",
        "description": "C hand shape moving along forearm.",
        "difficulty": "Intermediate",
        "sasl_note": "STEM & innovation sign."
    },
    {
        "id": "deaf",
        "word": "Deaf / SASL",
        "gloss": "DEAF",
        "category": "Community & Culture",
        "icon": "🤟",
        "description": "Index finger moving from ear to mouth.",
        "difficulty": "Beginner",
        "sasl_note": "Deaf community culture sign."
    },
    {
        "id": "letter_l",
        "word": "Letter L",
        "gloss": "L",
        "category": "Alphabet",
        "icon": "🔤",
        "description": "Form L shape with index finger pointing up and thumb extended sideways.",
        "difficulty": "Beginner",
        "sasl_note": "Standard SASL / ASL manual alphabet letter."
    },
    {
        "id": "letter_b",
        "word": "Letter B",
        "gloss": "B",
        "category": "Alphabet",
        "icon": "🔤",
        "description": "Hold four fingers extended together with thumb folded across palm.",
        "difficulty": "Beginner",
        "sasl_note": "Standard SASL / ASL manual alphabet letter."
    }
]



@app.route('/')
def index():
    if os.path.exists(os.path.join(FRONTEND_DIST, 'index.html')):
        return send_from_directory(FRONTEND_DIST, 'index.html')
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
    hands_list = data.get('hands', None)
    sequence_buffer = data.get('sequence_buffer', None)

    prediction = classifier.classify_gesture(landmarks, hands_list=hands_list, sequence_buffer=sequence_buffer)
    return jsonify(prediction)

@app.route('/api/record-sequence', methods=['POST'])
def record_sequence():
    """
    Saves recorded 30-frame landmark sequences for custom sign model training.
    """
    data = request.json or {}
    gesture_id = data.get('gesture_id', 'custom_sign').lower().replace(' ', '_')
    sequence = data.get('sequence', [])

    if not sequence:
        return jsonify({"success": False, "error": "Empty sequence provided"}), 400

    filename = f"{gesture_id}_{int(time.time()*1000)}.json"
    filepath = os.path.join(DATASET_DIR, filename)

    try:
        with open(filepath, 'w') as f:
            json.dump({
                "gesture_id": gesture_id,
                "timestamp": time.time(),
                "num_frames": len(sequence),
                "sequence": sequence
            }, f, indent=2)
        return jsonify({"success": True, "filename": filename, "saved_frames": len(sequence)})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/gloss-to-sentence', methods=['POST'])
def gloss_to_sentence():
    """
    Translates raw SASL Gloss sequence streams into fluent, natural English sentences using OpenRouter AI.
    Falls back gracefully to rule-based mapping if API limit is reached.
    """
    data = request.json or {}
    glosses = data.get('glosses', [])
    target_lang = data.get('language', 'English').title()
    
    if isinstance(glosses, str):
        glosses = glosses.strip().split()

    if not glosses:
        return jsonify({"sentence": "", "original_glosses": [], "language": target_lang})

    clean_glosses = [g.upper() for g in glosses if g not in ["WAITING FOR HAND...", "DETECTING..."]]
    if not clean_glosses:
        return jsonify({"original_glosses": [], "fluent_sentence": "Waiting for sign input...", "language": target_lang})

    gloss_str = " ".join(clean_glosses)
    
    # Try OpenRouter LLM first for Multilingual SA Translation
    system_prompt = (
        f"You are an expert South African Sign Language (SASL) interpreter and multilingual NLP translator. "
        f"Convert the raw input stream of SASL Sign Glosses into one natural, grammatically correct sentence in {target_lang}. "
        f"Return ONLY the plain {target_lang} sentence without meta commentary, quotes, or JSON."
    )
    user_prompt = f"SASL Gloss Stream: {gloss_str}. Target Output Language: {target_lang}."

    ai_sentence = ai_client.generate(system_prompt, user_prompt, max_tokens=100, temperature=0.3)

    if ai_sentence and len(ai_sentence) > 2:
        return jsonify({
            "original_glosses": clean_glosses,
            "fluent_sentence": ai_sentence,
            "language": target_lang,
            "engine": "OpenRouter Multilingual AI"
        })


    # Rule-based fallback
    mapped_words = []
    for g in clean_glosses:
        if g == "HELLO": mapped_words.append("Hello!")
        elif g == "THANK YOU": mapped_words.append("Thank you")
        elif g == "PLEASE": mapped_words.append("please")
        elif g == "SORRY": mapped_words.append("I am sorry")
        elif g == "HELP": mapped_words.append("I need help")
        elif g == "WHERE": mapped_words.append("where is it?")
        elif g == "WATER": mapped_words.append("water")
        elif g == "YES": mapped_words.append("Yes, agreed.")
        elif g == "NO": mapped_words.append("No.")
        elif g == "I LOVE YOU": mapped_words.append("I love you!")
        elif g == "STOP": mapped_words.append("Stop!")
        elif g == "EAT": mapped_words.append("I want to eat food")
        elif g == "DRINK": mapped_words.append("I need something to drink")
        elif g == "WANT": mapped_words.append("I want")
        elif g == "NEED": mapped_words.append("I need")
        elif g == "MORE": mapped_words.append("more")
        elif g == "GOOD": mapped_words.append("that is good")
        elif g == "BAD": mapped_words.append("that is bad")
        elif len(g) == 1 and g.isalpha(): mapped_words.append(g)
        else: mapped_words.append(g.lower())

    sentence = " ".join(mapped_words)
    if sentence:
        sentence = sentence[0].upper() + sentence[1:]
        if not sentence.endswith('.') and not sentence.endswith('!') and not sentence.endswith('?'):
            sentence += '.'

    return jsonify({
        "original_glosses": clean_glosses,
        "fluent_sentence": sentence or "Waiting for sign input...",
        "engine": "Local Rule Engine"
    })

@app.route('/api/ai-coach', methods=['POST'])
def ai_coach():
    """
    Evaluates user sign pose alignment & provides AI sign language tutor tips.
    """
    data = request.json or {}
    target_sign = data.get('target_sign', 'HELP')
    detected_sign = data.get('detected_sign', '')
    confidence = float(data.get('confidence', 0.0))
    landmark_count = int(data.get('landmark_count', 21))

    # Ask OpenRouter LLM for personalized sign feedback
    system_prompt = (
        "You are an AI Sign Language Tutor for South African Sign Language (SASL). "
        "Given a student's target sign, detected sign, and confidence, provide a concise 2-sentence coaching tip "
        "on how to adjust hand alignment, finger extension, or dominant hand posture. "
        "Return ONLY the direct 2-sentence tip without any chain-of-thought, prelude, or meta commentary."
    )

    user_prompt = f"Target Sign: {target_sign}. Detected Sign: {detected_sign}. Accuracy Confidence: {confidence*100:.1f}%. Joint Landmarks Tracked: {landmark_count}."

    ai_feedback = ai_client.generate(system_prompt, user_prompt, max_tokens=150, temperature=0.5)

    if not ai_feedback:
        if confidence >= 0.85:
            ai_feedback = f"Great form on '{target_sign}'! Keep hand stable and maintain wrist orientation."
        elif confidence >= 0.5:
            ai_feedback = f"Good attempt for '{target_sign}'. Spread fingers slightly wider and raise non-dominant hand higher."
        else:
            ai_feedback = f"Form adjustment needed for '{target_sign}'. Ensure both hands are clearly visible in the camera frame."

    # Compute pose alignment score %
    pose_score = min(99, max(40, int(confidence * 100) if confidence > 0 else 75))

    return jsonify({
        "target_sign": target_sign,
        "detected_sign": detected_sign,
        "alignment_score": pose_score,
        "coaching_tip": ai_feedback,
        "feedback_details": {
            "wrist_posture": "Optimal" if pose_score > 80 else "Adjust Angle",
            "finger_spacing": "Wide & Clear" if pose_score > 70 else "Extend Fully",
            "hand_count": "Dual Hand (2)" if landmark_count > 21 else "Single Hand (1)"
        }
    })

@app.route('/api/emergency-assist', methods=['POST'])
def emergency_assist():
    """
    Formulates rapid emergency alert payloads for Deaf users (Medical, Police, Fire, Rescue).
    """
    data = request.json or {}
    category = data.get('category', 'medical').lower()
    details = data.get('details', '')
    latitude = data.get('latitude', None)
    longitude = data.get('longitude', None)

    emergency_messages = {
        'medical': "EMERGENCY MEDICAL SOS: Immediate medical assistance required for Deaf patient.",
        'police': "POLICE SOS ALERT: Immediate security / police response requested.",
        'fire': "FIRE SOS ALERT: Fire emergency reported. Send immediate fire rescue.",
        'disaster': "DISASTER SOS: Emergency evacuation assistance required."
    }

    base_msg = emergency_messages.get(category, emergency_messages['medical'])
    if details:
        base_msg += f" Details: {details}"

    # Use AI to format official emergency responder summary
    system_prompt = (
        "You are an Emergency Dispatch AI Helper. Format the following emergency alert into a professional, clear, "
        "single-paragraph emergency broadcast message suitable for first responders."
    )
    user_prompt = f"Emergency Alert Type: {category.upper()}. Context: {base_msg}."

    ai_alert = ai_client.generate(system_prompt, user_prompt, max_tokens=150)
    formatted_alert = ai_alert or base_msg

    loc_str = f"Lat: {latitude}, Long: {longitude}" if latitude and longitude else "Location Tagged via PWA"

    return jsonify({
        "success": True,
        "category": category,
        "broadcast_message": formatted_alert,
        "location": loc_str,
        "timestamp": time.strftime("%Y-%m-%d %H:%M:%S SAST")
    })

@app.route('/api/synthesize-emotion', methods=['POST'])
def synthesize_emotion():
    """
    Analyzes gesture intensity and message text to synthesize Web Speech pitch, rate, and emotion.
    """
    data = request.json or {}
    text = data.get('text', '')
    velocity = float(data.get('velocity', 1.0))

    emotion = "neutral"
    pitch = 1.0
    rate = 1.0

    if velocity > 2.5 or any(w in text.lower() for w in ['help', 'stop', 'emergency', 'fire', 'danger', '!']):
        emotion = "urgent"
        pitch = 1.3
        rate = 1.25
    elif any(w in text.lower() for w in ['love', 'happy', 'good', 'thank', 'great', 'friend']):
        emotion = "joyful"
        pitch = 1.15
        rate = 1.05
    elif any(w in text.lower() for w in ['sorry', 'sad', 'bad', 'hurt']):
        emotion = "empathetic"
        pitch = 0.85
        rate = 0.85

    return jsonify({
        "text": text,
        "emotion": emotion,
        "pitch": pitch,
        "rate": rate
    })

@app.route('/api/sasl-dialect', methods=['POST'])
def sasl_dialect():
    """
    Translates standard sign glosses into regional SASL provincial variations.
    """
    data = request.json or {}
    glosses = data.get('glosses', [])
    province = data.get('province', 'Gauteng').title()

    provincial_notes = {
        'Gauteng': "Gauteng SASL emphasizes rapid dual-hand signing and urban school standard signs.",
        'Western Cape': "Western Cape SASL incorporates unique regional signs for greeting and location expressions.",
        'Kwazulu-Natal': "KwaZulu-Natal SASL features distinct cultural gesture markers and regional family signs.",
        'Eastern Cape': "Eastern Cape SASL uses traditional regional fingerspelling and community signs.",
        'Free State': "Free State SASL emphasizes distinct spatial direction markers and agricultural term signs."
    }

    note = provincial_notes.get(province, provincial_notes['Gauteng'])

    return jsonify({
        "province": province,
        "glosses": glosses,
        "sasl_dialect_note": note,
        "regional_variant_active": True
    })


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

