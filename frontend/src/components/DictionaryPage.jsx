import React, { useState } from 'react';
import AvatarSigner from './AvatarSigner';
import { BookOpen, Search, Volume2, Sparkles, Filter, ChevronRight, Check } from 'lucide-react';
import { toast } from '../utils/toast';
import { addXP, markSignLearned } from '../utils/storage';

const COMPREHENSIVE_SIGNS = [
  { id: 'hello', word: 'Hello', gloss: 'HELLO', category: 'Greetings', icon: '👋', description: 'Place flat open hand near temple or chest, wave slightly outward.', sasl_note: 'Standard SASL polite greeting across all 9 provinces.' },
  { id: 'thank_you', word: 'Thank You', gloss: 'THANK YOU', category: 'Greetings', icon: '🙏', description: 'Touch fingertips of flat hand to chin, then extend hand gently forward.', sasl_note: 'Essential sign of courtesy.' },
  { id: 'please', word: 'Please', gloss: 'PLEASE', category: 'Greetings', icon: '🤲', description: 'Open flat hand rubbing chest in a clockwise circle over heart.', sasl_note: 'Respectful request marker.' },
  { id: 'sorry', word: 'Sorry', gloss: 'SORRY', category: 'Greetings', icon: '😔', description: 'Closed fist rubbed gently in a circular motion on center of chest.', sasl_note: 'Apology and empathy sign.' },
  { id: 'yes', word: 'Yes / Agree', gloss: 'YES', category: 'Greetings', icon: '👍', description: 'Thumb up fist nodding up and down firmly.', sasl_note: 'Affirmative response.' },
  { id: 'no', word: 'No / Decline', gloss: 'NO', category: 'Greetings', icon: '👎', description: 'Index and middle finger snapping shut onto thumb.', sasl_note: 'Clear negation marker.' },
  { id: 'help', word: 'Help / Urgent', gloss: 'HELP', category: 'Needs', icon: '🆘', description: 'Closed fist with thumb pointing up placed on flat base palm and lifted upwards.', sasl_note: 'Bimanual distress and assistance sign.' },
  { id: 'water', word: 'Water', gloss: 'WATER', category: 'Needs', icon: '💧', description: 'Form W shape with 3 middle fingers, tap index against chin twice.', sasl_note: 'Vital everyday need.' },
  { id: 'food', word: 'Food / Eat', gloss: 'FOOD', category: 'Needs', icon: '🍲', description: 'Fingertips brought together tapping lips repeatedly.', sasl_note: 'Nutrition marker.' },
  { id: 'family', word: 'Family', gloss: 'FAMILY', category: 'Family', icon: '👨‍👩‍👧', description: 'F handshapes starting together, drawing smooth circle outward to touch pinkies.', sasl_note: 'Community union sign.' },
  { id: 'mother', word: 'Mother / Mama', gloss: 'MOTHER', category: 'Family', icon: '👩', description: 'Thumb of open 5-hand tapping chin twice.', sasl_note: 'Female family marker.' },
  { id: 'father', word: 'Father / Tata', gloss: 'FATHER', category: 'Family', icon: '👨', description: 'Thumb of open 5-hand tapping forehead twice.', sasl_note: 'Male family marker.' },
  { id: 'friend', word: 'Friend', gloss: 'FRIEND', category: 'Family', icon: '🤝', description: 'Interlocking index fingers hooked in reciprocal motion.', sasl_note: 'Companionship sign.' },
  { id: 'where', word: 'Where?', gloss: 'WHERE', category: 'Questions', icon: '❓', description: 'Both palms facing upward, gently shaking side-to-side inquiringly.', sasl_note: 'Location interrogative.' },
  { id: 'who', word: 'Who?', gloss: 'WHO', category: 'Questions', icon: '🤔', description: 'Index finger circling near pursed lips.', sasl_note: 'Person interrogative.' },
  { id: 'what', word: 'What?', gloss: 'WHAT', category: 'Questions', icon: '🧐', description: 'Index finger slicing downward across opposite palm.', sasl_note: 'Object inquiry.' },
  { id: 'when', word: 'When?', gloss: 'WHEN', category: 'Questions', icon: '⏰', description: 'Index finger circling and landing on opposite index fingertip.', sasl_note: 'Temporal interrogative.' },
  { id: 'why', word: 'Why?', gloss: 'WHY', category: 'Questions', icon: '💭', description: 'Middle finger brushing forehead pulling down into Y shape.', sasl_note: 'Causal interrogative.' },
  { id: 'school', word: 'School', gloss: 'SCHOOL', category: 'Education', icon: '🏫', description: 'Clap dominant flat palm downward twice firmly onto base palm.', sasl_note: 'Academic context.' },
  { id: 'teacher', word: 'Teacher', gloss: 'TEACHER', category: 'Education', icon: '👩‍🏫', description: 'Flattened O-hands pushing from temples forward.', sasl_note: 'Educator marker.' },
  { id: 'learn', word: 'Learn / Study', gloss: 'LEARN', category: 'Education', icon: '📖', description: 'Gathering knowledge from base palm upward into forehead.', sasl_note: 'Core STEM concept.' },
  { id: 'computer', word: 'Computer', gloss: 'COMPUTER', category: 'Tech', icon: '💻', description: 'C-hand moving up along opposite forearm or typing motion.', sasl_note: 'Digital technology.' },
  { id: 'robot', word: 'Robot / AI', gloss: 'ROBOT', category: 'Tech', icon: '🤖', description: 'Rigid right-angle mechanical arm and hand movement.', sasl_note: 'Robo Rumble Technomania.' },
  { id: 'hospital', word: 'Hospital', gloss: 'HOSPITAL', category: 'Places', icon: '🏥', description: 'Draw cross on opposite upper arm with index and middle fingers.', sasl_note: 'Medical facility.' },
  { id: 'home', word: 'Home', gloss: 'HOME', category: 'Places', icon: '🏠', description: 'Fingertips touching chin then ear, forming sanctuary.', sasl_note: 'Domestic residence.' },
  { id: 'today', word: 'Today / Now', gloss: 'TODAY', category: 'Time', icon: '📅', description: 'Both Y-hands dropped downward firmly twice in front of body.', sasl_note: 'Present moment.' },
  { id: 'tomorrow', word: 'Tomorrow', gloss: 'TOMORROW', category: 'Time', icon: '🌅', description: 'Thumb of A-hand flicks forward from cheek bone.', sasl_note: 'Future time marker.' },
  { id: 'love', word: 'I Love You', gloss: 'I LOVE YOU', category: 'Greetings', icon: '🤟', description: 'Thumb, index, and pinky extended together outwards.', sasl_note: 'Universal icon of love & inclusion.' },
];

const CATEGORIES = ['All', 'Greetings', 'Needs', 'Questions', 'Family', 'Education', 'Tech', 'Places', 'Time'];
const ALPHABET = ['All', 'A', 'C', 'F', 'H', 'L', 'M', 'N', 'P', 'R', 'S', 'T', 'W', 'Y'];

export default function DictionaryPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLetter, setSelectedLetter] = useState('All');
  const [selectedSign, setSelectedSign] = useState(COMPREHENSIVE_SIGNS[0]);
  const [isPlayingAvatar, setIsPlayingAvatar] = useState(true);

  const filteredSigns = COMPREHENSIVE_SIGNS.filter((sign) => {
    const matchesSearch = sign.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          sign.gloss.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          sign.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === 'All' || sign.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesLetter = selectedLetter === 'All' || sign.word.toUpperCase().startsWith(selectedLetter);
    return matchesSearch && matchesCat && matchesLetter;
  });

  const handleSelectSign = (sign) => {
    setSelectedSign(sign);
    setIsPlayingAvatar(true);
  };

  const handleSpeak = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handlePracticeMark = () => {
    markSignLearned(selectedSign.id, selectedSign.word);
    addXP(15);
    toast.success(`+15 XP! Mastered sign "${selectedSign.word}"!`, 'Sign Mastered');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', width: '100%' }}>
      {/* Top Banner */}
      <div
        className="glass-card"
        style={{
          padding: '16px 22px',
          borderRadius: '16px',
          background: 'linear-gradient(135deg, #2D848A 0%, #205E63 100%)',
          color: '#FFFFFF',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'rgba(255, 255, 255, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF'
          }}>
            <BookOpen size={24} />
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '800' }}>
              Interactive SASL Lexicon & Dictionary Studio
            </h2>
            <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#C1DFF0' }}>
              Explore certified South African Sign Language vocabulary with animated 3D demonstrations
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{
            padding: '5px 12px',
            borderRadius: '9999px',
            background: 'rgba(255, 255, 255, 0.15)',
            color: '#FFFFFF',
            fontSize: '12px',
            fontWeight: '700'
          }}>
            {COMPREHENSIVE_SIGNS.length} Signs Indexed
          </span>
        </div>
      </div>

      {/* Filters Bar: Search + Categories */}
      <div
        className="glass-card"
        style={{
          padding: '14px 20px',
          borderRadius: '14px',
          background: '#FFFFFF',
          border: '1px solid rgba(136, 204, 241, 0.4)',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}
      >
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Search Box */}
          <div style={{ flex: 1, minWidth: '240px', position: 'relative' }}>
            <Search size={16} color="#5C7B8A" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search signs, glosses, or meanings (e.g. Hello, Water, Hospital)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '9px 12px 9px 36px',
                borderRadius: '10px',
                border: '1px solid #C1DFF0',
                background: '#F0F7FB',
                fontSize: '13.5px',
                color: '#133340',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Letter Jump Chips */}
          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
            {ALPHABET.map((letter) => {
              const active = selectedLetter === letter;
              return (
                <button
                  key={letter}
                  onClick={() => setSelectedLetter(letter)}
                  style={{
                    padding: '4px 8px',
                    borderRadius: '6px',
                    border: 'none',
                    background: active ? '#2D848A' : '#F0F7FB',
                    color: active ? '#FFFFFF' : '#5C7B8A',
                    fontSize: '11.5px',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  {letter}
                </button>
              );
            })}
          </div>
        </div>

        {/* Category Pills */}
        <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '2px' }}>
          {CATEGORIES.map((cat) => {
            const active = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '9999px',
                  border: `1px solid ${active ? '#2D848A' : '#C1DFF0'}`,
                  background: active ? '#E6F4FA' : '#FFFFFF',
                  color: active ? '#2D848A' : '#5C7B8A',
                  fontSize: '12px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main 2-Column Workspace: Signs List + 3D Avatar Inspector */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1.4fr) minmax(340px, 1fr)',
        gap: '14px',
        alignItems: 'start'
      }}>
        {/* Signs Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: '10px'
        }}>
          {filteredSigns.map((sign) => {
            const isSelected = selectedSign.id === sign.id;
            return (
              <div
                key={sign.id}
                onClick={() => handleSelectSign(sign)}
                style={{
                  padding: '14px',
                  borderRadius: '12px',
                  background: isSelected ? '#E6F4FA' : '#FFFFFF',
                  border: `2px solid ${isSelected ? '#2D848A' : 'rgba(136, 204, 241, 0.4)'}`,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  boxShadow: isSelected ? '0 4px 14px rgba(45, 137, 139, 0.12)' : 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '22px' }}>{sign.icon}</span>
                  <span style={{
                    fontSize: '10.5px',
                    padding: '2px 8px',
                    borderRadius: '6px',
                    background: '#F0F7FB',
                    color: '#2D848A',
                    fontWeight: '700'
                  }}>
                    {sign.category}
                  </span>
                </div>

                <div style={{ fontSize: '15px', fontWeight: '800', color: '#133340' }}>
                  {sign.word}
                </div>
                <div style={{ fontSize: '11px', color: '#2D848A', fontWeight: '700' }}>
                  GLOSS: {sign.gloss}
                </div>
                <p style={{ margin: 0, fontSize: '11.5px', color: '#5C7B8A', lineHeight: '1.4' }}>
                  {sign.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* 3D Avatar Inspector Sidebar */}
        <div style={{
          position: 'sticky',
          top: '12px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          {/* Avatar Demonstrator Card */}
          <div
            className="glass-card"
            style={{
              padding: '16px',
              borderRadius: '16px',
              background: '#FFFFFF',
              border: '1px solid rgba(136, 204, 241, 0.4)',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              boxShadow: '0 4px 20px rgba(45, 137, 139, 0.08)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '11px', color: '#5C7B8A', fontWeight: '700', textTransform: 'uppercase' }}>
                  3D Sign Demonstration
                </span>
                <h3 style={{ margin: '2px 0 0 0', fontSize: '18px', fontWeight: '800', color: '#133340' }}>
                  {selectedSign.word}
                </h3>
              </div>

              <button
                onClick={() => handleSpeak(selectedSign.word)}
                title="Hear Pronunciation"
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: '#F0F7FB',
                  border: '1px solid #C1DFF0',
                  color: '#2D848A',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Volume2 size={18} />
              </button>
            </div>

            {/* Avatar Player Viewport */}
            <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid #C1DFF0' }}>
              <AvatarSigner
                activeGloss={selectedSign.gloss}
                isPlaying={isPlayingAvatar}
                onFinish={() => setIsPlayingAvatar(false)}
              />
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => setIsPlayingAvatar(true)}
                style={{
                  flex: 1,
                  padding: '10px',
                  borderRadius: '8px',
                  border: 'none',
                  background: '#2D848A',
                  color: '#FFFFFF',
                  fontWeight: '700',
                  fontSize: '13px',
                  cursor: 'pointer'
                }}
              >
                ▶ Replay Avatar
              </button>
              <button
                onClick={handlePracticeMark}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  border: '1px solid #C1DFF0',
                  background: '#F0F7FB',
                  color: '#2D848A',
                  fontWeight: '700',
                  fontSize: '13px',
                  cursor: 'pointer'
                }}
              >
                <Check size={16} /> Mastered
              </button>
            </div>

            {/* Description & Linguistic Note */}
            <div style={{ background: '#F8FBFC', border: '1px solid #C1DFF0', borderRadius: '10px', padding: '12px' }}>
              <strong style={{ display: 'block', fontSize: '12px', color: '#133340', marginBottom: '4px' }}>
                Handshape & Movement:
              </strong>
              <p style={{ margin: '0 0 8px 0', fontSize: '12px', color: '#5C7B8A', lineHeight: '1.4' }}>
                {selectedSign.description}
              </p>
              <strong style={{ display: 'block', fontSize: '11px', color: '#2D848A', marginBottom: '2px' }}>
                Linguistic SASL Context:
              </strong>
              <p style={{ margin: 0, fontSize: '11.5px', color: '#3587A4' }}>
                {selectedSign.sasl_note}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
