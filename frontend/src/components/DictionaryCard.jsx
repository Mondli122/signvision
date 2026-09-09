import React, { useState } from 'react';
import { BookOpen, Search, Sun, HelpCircle, Users, MapPin, Utensils, Clock, Laptop, Type, ArrowRight } from 'lucide-react';

export default function DictionaryCard({ onSelectCategory, onSearch, onSelectSign }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCat, setSelectedCat] = useState('Greetings');

  const sampleSigns = [
    { id: 'hello', word: 'Hello', gloss: 'HELLO', category: 'Greetings', icon: '👋', description: 'Place flat open hand near temple or chest, wave slightly outward.', sasl_note: 'Common SASL greeting.' },
    { id: 'help', word: 'Help', gloss: 'HELP', category: 'Emergency', icon: '🆘', description: 'Place closed fist with thumb pointing up onto flat open palm and lift together.', sasl_note: 'Bimanual request sign.' },
    { id: 'water', word: 'Water', gloss: 'WATER', category: 'Basic Needs', icon: '💧', description: 'Form W shape with fingers, tap index finger against chin twice.', sasl_note: 'Vital request sign.' },
    { id: 'thank_you', word: 'Thank You', gloss: 'THANK YOU', category: 'Etiquette', icon: '🙏', description: 'Touch fingertips of flat hand to chin, then move hand forward.', sasl_note: 'Gratitude sign.' }
  ];

  const categories = [
    { id: 'greetings', label: 'Greetings', icon: Sun },
    { id: 'questions', label: 'Questions', icon: HelpCircle },
    { id: 'family', label: 'Family', icon: Users },
    { id: 'places', label: 'Places', icon: MapPin },
    { id: 'needs', label: 'Basic Needs', icon: Utensils },
    { id: 'time', label: 'Time', icon: Clock },
    { id: 'tech', label: 'Tech', icon: Laptop },
    { id: 'alphabet', label: 'Alphabet', icon: Type },
  ];

  const handleCatClick = (label) => {
    setSelectedCat(label);
    if (onSelectCategory) onSelectCategory(label);
    const matched = sampleSigns.find(s => s.category.toLowerCase().includes(label.toLowerCase())) || sampleSigns[0];
    if (onSelectSign) onSelectSign(matched);
  };

  return (
    <div className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px', height: '100%' }}>
      
      {/* Header */}
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
            SASL Dictionary & 3D Inspector
          </h3>
          <p style={{ fontSize: '12px', color: '#64748B' }}>
            Click any category to inspect 3D sign avatar
          </p>
        </div>
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
          placeholder="Search sign & inspect..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            if (onSearch) onSearch(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && searchTerm) {
              const matched = sampleSigns.find(s => s.word.toLowerCase().includes(searchTerm.toLowerCase())) || sampleSigns[0];
              if (onSelectSign) onSelectSign(matched);
            }
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
      </div>

      {/* Category Grid (4 cols x 2 rows) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginTop: '4px' }}>
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isSelected = selectedCat === cat.label;
          return (
            <button
              key={cat.id}
              onClick={() => handleCatClick(cat.label)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                padding: '12px 8px',
                borderRadius: '12px',
                border: isSelected ? '1px solid #00A884' : '1px solid #F1F5F9',
                background: isSelected ? '#ECFDF5' : '#F8FAFC',
                color: isSelected ? '#00A884' : '#475569',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                fontFamily: 'var(--font-heading)',
                fontSize: '11px',
                fontWeight: isSelected ? '700' : '600'
              }}
            >
              <Icon size={18} color={isSelected ? '#00A884' : '#64748B'} />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Quick Inspector Badges */}
      <div style={{ marginTop: 'auto', paddingTop: '6px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {sampleSigns.map((s) => (
          <button
            key={s.id}
            onClick={() => onSelectSign && onSelectSign(s)}
            style={{
              background: '#EFF6FF',
              border: '1px solid #BFDBFE',
              color: '#1D4ED8',
              borderRadius: '8px',
              padding: '4px 10px',
              fontSize: '0.78rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <span>{s.icon}</span> {s.word}
          </button>
        ))}
      </div>

    </div>
  );
}

