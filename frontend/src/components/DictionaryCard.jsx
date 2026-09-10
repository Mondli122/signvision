import React, { useState } from 'react';
import { BookOpen, Search, Sun, HelpCircle, Users, MapPin, Utensils, Clock, Laptop, Type, X, ChevronRight } from 'lucide-react';

const FALLBACK_SIGNS = [
  { id: 'hello', word: 'Hello', gloss: 'HELLO', category: 'Greetings', icon: '👋', description: 'Place flat open hand near temple or chest, wave slightly outward.', sasl_note: 'Common SASL greeting.' },
  { id: 'help', word: 'Help', gloss: 'HELP', category: 'Needs', icon: '🆘', description: 'Place closed fist with thumb pointing up onto flat open palm and lift together.', sasl_note: 'Bimanual request sign.' },
  { id: 'water', word: 'Water', gloss: 'WATER', category: 'Needs', icon: '💧', description: 'Form W shape with fingers, tap index finger against chin twice.', sasl_note: 'Vital request sign.' },
  { id: 'thank_you', word: 'Thank You', gloss: 'THANK YOU', category: 'Greetings', icon: '🙏', description: 'Touch fingertips of flat hand to chin, then move hand forward.', sasl_note: 'Gratitude sign.' },
  { id: 'yes', word: 'Yes / Agree', gloss: 'YES', category: 'Greetings', icon: '👍', description: 'Thumb up fist nodding up and down.', sasl_note: 'Affirmative response.' },
  { id: 'peace', word: 'Peace / V', gloss: 'PEACE', category: 'General', icon: '✌️', description: 'Index and middle fingers in V-shape.', sasl_note: 'Peace or number two.' },
  { id: 'please', word: 'Please', gloss: 'PLEASE', category: 'Greetings', icon: '🤲', description: 'Open flat hand moving clockwise over heart.', sasl_note: 'Polite request sign.' },
  { id: 'family', word: 'Family', gloss: 'FAMILY', category: 'Family', icon: '👨‍👩‍👦', description: 'F handshapes starting together, drawing circle out to meet.', sasl_note: 'Community union sign.' },
  { id: 'mother', word: 'Mother / Mama', gloss: 'MOTHER', category: 'Family', icon: '👩', description: 'Thumb of open 5-hand tapping chin twice.', sasl_note: 'Female family marker.' },
  { id: 'father', word: 'Father / Tata', gloss: 'FATHER', category: 'Family', icon: '👨', description: 'Thumb of open 5-hand tapping forehead twice.', sasl_note: 'Male family marker.' },
  { id: 'friend', word: 'Friend', gloss: 'FRIEND', category: 'Family', icon: '🤝', description: 'Interlocking index fingers hooked reciprocal motion.', sasl_note: 'Companionship sign.' },
  { id: 'where', word: 'Where?', gloss: 'WHERE', category: 'Questions', icon: '❓', description: 'Both palms facing upward, gently shaking side-to-side.', sasl_note: 'Inquisitive interrogative.' },
  { id: 'who', word: 'Who?', gloss: 'WHO', category: 'Questions', icon: '🤔', description: 'Index finger circling near pursed lips.', sasl_note: 'Person inquiry.' },
  { id: 'when', word: 'When?', gloss: 'WHEN', category: 'Questions', icon: '⏰', description: 'Index finger circling and landing on opposite index tip.', sasl_note: 'Temporal inquiry.' },
  { id: 'school', word: 'School', gloss: 'SCHOOL', category: 'Education', icon: '🏫', description: 'Clap dominant flat palm downward twice on base palm.', sasl_note: 'Academic context.' },
  { id: 'teacher', word: 'Teacher', gloss: 'TEACHER', category: 'Education', icon: '👩‍🏫', description: 'Flattened O-hands pushing from temples forward.', sasl_note: 'Educator sign.' },
  { id: 'learn', word: 'Learn', gloss: 'LEARN', category: 'Education', icon: '📖', description: 'Gathering knowledge from palm up into forehead.', sasl_note: 'Core STEM concept.' },
  { id: 'computer', word: 'Computer', gloss: 'COMPUTER', category: 'Tech', icon: '💻', description: 'C-hand moving up along opposite forearm or typing motion.', sasl_note: 'Digital technology.' },
  { id: 'robot', word: 'Robot / AI', gloss: 'ROBOT', category: 'Tech', icon: '🤖', description: 'Rigid right-angle arm and mechanical hand movement.', sasl_note: 'Robo Rumble 2026.' },
  { id: 'hospital', word: 'Hospital', gloss: 'HOSPITAL', category: 'Places', icon: '🏥', description: 'Draw cross on opposite upper arm with index/middle fingers.', sasl_note: 'Emergency facility.' },
  { id: 'home', word: 'Home', gloss: 'HOME', category: 'Places', icon: '🏠', description: 'Fingertips touching chin then ear, forming sanctuary.', sasl_note: 'Residence sign.' },
  { id: 'today', word: 'Today / Now', gloss: 'TODAY', category: 'Time', icon: '📅', description: 'Both Y-hands dropped downward firmly twice in front of body.', sasl_note: 'Present moment.' },
  { id: 'tomorrow', word: 'Tomorrow', gloss: 'TOMORROW', category: 'Time', icon: '🌅', description: 'Thumb of A-hand flicks forward from cheek bone.', sasl_note: 'Future time marker.' },
  { id: 'love', word: 'I Love You', gloss: 'I LOVE YOU', category: 'Greetings', icon: '🤟', description: 'Thumb, index, and pinky extended together.', sasl_note: 'Universal icon of love.' }
];

export default function DictionaryCard({ items, isLoading = false, onSelectCategory, onSearch, onSelectSign }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCat, setSelectedCat] = useState('');

  const allSigns = (items && items.length > 0) ? items : FALLBACK_SIGNS;

  const categories = [
    { id: 'greetings', label: 'Greetings', icon: Sun },
    { id: 'questions', label: 'Questions', icon: HelpCircle },
    { id: 'family', label: 'Family', icon: Users },
    { id: 'places', label: 'Places', icon: MapPin },
    { id: 'needs', label: 'Needs', icon: Utensils },
    { id: 'time', label: 'Time', icon: Clock },
    { id: 'tech', label: 'Tech', icon: Laptop },
    { id: 'alphabet', label: 'Alphabet', icon: Type },
  ];

  const filteredSigns = allSigns.filter(s => {
    const wordMatch = s.word?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      s.gloss?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      s.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const catMatch = selectedCat ? (s.category?.toLowerCase() === selectedCat.toLowerCase() || s.category?.toLowerCase().includes(selectedCat.toLowerCase())) : true;
    return wordMatch && catMatch;
  });

  const handleCatClick = (label) => {
    const nextCat = selectedCat === label ? '' : label;
    setSelectedCat(nextCat);
    if (onSelectCategory) onSelectCategory(nextCat);
  };

  return (
    <div className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px', height: '100%' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            background: '#F3E8FF',
            color: '#9333EA',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <BookOpen size={20} />
          </div>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#0F172A' }}>
              SASL Lexicon & Dictionary
            </h3>
            <p style={{ fontSize: '12px', color: '#64748B' }}>
              Search {allSigns.length} signs or filter by category
            </p>
          </div>
        </div>
        {selectedCat && (
          <button
            onClick={() => setSelectedCat('')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              border: 'none',
              background: '#F1F5F9',
              color: '#64748B',
              borderRadius: '12px',
              padding: '4px 8px',
              fontSize: '11px',
              cursor: 'pointer'
            }}
          >
            <span>{selectedCat}</span>
            <X size={12} />
          </button>
        )}
      </div>

      {/* Search Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        background: '#F8FAFC',
        border: '1px solid #E2E8F0',
        borderRadius: '12px',
        padding: '10px 14px'
      }}>
        <Search size={16} color="#94A3B8" />
        <input
          type="text"
          placeholder="Search signs by name or gloss..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            if (onSearch) onSearch(e.target.value);
          }}
          style={{
            border: 'none',
            outline: 'none',
            background: 'transparent',
            width: '100%',
            fontSize: '13px',
            color: '#0F172A',
            fontFamily: 'var(--font-body)'
          }}
        />
        {searchTerm && (
          <button
            onClick={() => { setSearchTerm(''); if (onSearch) onSearch(''); }}
            style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#94a3b8' }}
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Category Grid (4 cols x 2 rows) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginTop: '2px' }}>
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isSelected = selectedCat.toLowerCase() === cat.label.toLowerCase();
          return (
            <button
              key={cat.id}
              onClick={() => handleCatClick(cat.label)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px',
                padding: '8px 4px',
                borderRadius: '10px',
                border: isSelected ? '1px solid #00A884' : '1px solid #F1F5F9',
                background: isSelected ? '#ECFDF5' : '#F8FAFC',
                color: isSelected ? '#00A884' : '#475569',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                fontFamily: 'var(--font-heading)',
                fontSize: '10px',
                fontWeight: isSelected ? '700' : '600'
              }}
            >
              <Icon size={16} color={isSelected ? '#00A884' : '#64748B'} />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Filtered Signs List or Quick Inspector Badges */}
      <div style={{ marginTop: 'auto', paddingTop: '6px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
          <span style={{ fontSize: '11px', fontWeight: '700', color: '#64748B', textTransform: 'uppercase' }}>
            {searchTerm || selectedCat ? `Matches (${filteredSigns.length})` : 'Popular Signs'}
          </span>
          <span style={{ fontSize: '11px', color: '#94A3B8' }}>Tap to inspect</span>
        </div>

        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', maxHeight: '110px', overflowY: 'auto' }}>
          {isLoading ? (
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', width: '100%' }}>
              {[80, 110, 95, 75, 120, 90, 85].map((w, i) => (
                <div key={i} className="skeleton-shimmer" style={{ width: `${w}px`, height: '28px', borderRadius: '8px' }} />
              ))}
            </div>
          ) : filteredSigns.length === 0 ? (
            <div style={{ fontSize: '12px', color: '#94a3b8', padding: '8px 0', fontStyle: 'italic' }}>
              No signs found matching "{searchTerm}". Try a different term.
            </div>
          ) : (
            filteredSigns.slice(0, 10).map((s) => (
              <button
                key={s.id || s.gloss}
                onClick={() => onSelectSign && onSelectSign(s)}
                style={{
                  background: '#EFF6FF',
                  border: '1px solid #BFDBFE',
                  color: '#1D4ED8',
                  borderRadius: '8px',
                  padding: '5px 10px',
                  fontSize: '0.78rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  transition: 'transform 0.15s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <span>{s.icon || '🖐️'}</span>
                <span>{s.word || s.gloss}</span>
              </button>
            ))
          )}
        </div>
      </div>

    </div>
  );
}
