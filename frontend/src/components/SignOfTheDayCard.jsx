import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, CheckCircle, Flame, Award, Calendar } from 'lucide-react';
import { addXP, markSignLearned, logActivity } from '../utils/storage';
import { toast } from '../utils/toast';

const DAILY_SIGNS = [
  {
    id: 'thank_you',
    word: 'Thank You / Ngiyabonga / Ke a leboha',
    gloss: 'THANK YOU',
    icon: '🙏',
    category: 'Etiquette',
    culturalContext: 'In South African Sign Language, placing fingertips to the chin and extending the palm outward expresses heartfelt gratitude.',
    bonusXP: 50
  },
  {
    id: 'hello',
    word: 'Hello / Sawubona / Dumela',
    gloss: 'HELLO',
    icon: '👋',
    category: 'Greetings',
    culturalContext: 'Used across all 9 provinces as the universal friendly opening in SASL conversations with eye contact.',
    bonusXP: 50
  },
  {
    id: 'help',
    word: 'Help / Siza / Thusa',
    gloss: 'HELP',
    icon: '🆘',
    category: 'Emergency',
    culturalContext: 'A vital emergency gesture formed with a dominant fist resting upon an open palm, moving upwards together.',
    bonusXP: 60
  },
  {
    id: 'water',
    word: 'Water / Amanzi / Metsi',
    gloss: 'WATER',
    icon: '💧',
    category: 'Basic Needs',
    culturalContext: 'Index, middle, and ring fingers form the W-shape touching near the chin or mouth area.',
    bonusXP: 50
  },
  {
    id: 'family',
    word: 'Family / Umndeni / Lelapa',
    gloss: 'FAMILY',
    icon: '👨‍👩‍👦',
    category: 'Society',
    culturalContext: 'Both hands form "F" or cupped handshapes, starting together and arcing outward to meet in a unified circle.',
    bonusXP: 55
  },
  {
    id: 'school',
    word: 'School / Isikole / Sekolo',
    gloss: 'SCHOOL',
    icon: '🏫',
    category: 'Education',
    culturalContext: 'Clap the flat dominant palm down twice on top of the flat non-dominant palm, representing paper/chalkboards.',
    bonusXP: 50
  },
  {
    id: 'friend',
    word: 'Friend / Umngane / Motswalle',
    gloss: 'FRIEND',
    icon: '🤝',
    category: 'Community',
    culturalContext: 'Hook dominant index finger around non-dominant index finger, then reverse for reciprocal bonds.',
    bonusXP: 50
  },
  {
    id: 'please',
    word: 'Please / Ngicela / Ke kopa',
    gloss: 'PLEASE',
    icon: '🤲',
    category: 'Etiquette',
    culturalContext: 'Rub flat open hand in a smooth circular clockwise motion over the center of the chest.',
    bonusXP: 45
  },
  {
    id: 'teacher',
    word: 'Teacher / Uthisha / Moruti',
    gloss: 'TEACHER',
    icon: '👩‍🏫',
    category: 'Education',
    culturalContext: 'Flattened O-hands at temples pushing forward twice, followed by the downward open-palm person marker.',
    bonusXP: 55
  },
  {
    id: 'emergency',
    word: 'Emergency / Inkinga / Tsietsi',
    gloss: 'EMERGENCY',
    icon: '🚨',
    category: 'Emergency',
    culturalContext: 'Shaking "E" handshape rapidly back and forth in front of chest indicating urgent priority.',
    bonusXP: 65
  },
  {
    id: 'i_love_you',
    word: 'I Love You / Ngiyakuthanda',
    gloss: 'I LOVE YOU',
    icon: '🤟',
    category: 'Expressions',
    culturalContext: 'Simultaneous thumb, index, and pinky finger extension — universally embraced by the SA Deaf community.',
    bonusXP: 50
  },
  {
    id: 'learn',
    word: 'Learn / Funda / Ithute',
    gloss: 'LEARN',
    icon: '📖',
    category: 'Education',
    culturalContext: 'Take information from the flat open book-palm and draw it up to the forehead.',
    bonusXP: 50
  },
  {
    id: 'yes',
    word: 'Yes / Yebo / Ee',
    gloss: 'YES',
    icon: '👍',
    category: 'Greetings',
    culturalContext: 'A closed fist nods up and down at wrist level, mimicking an affirming head nod.',
    bonusXP: 40
  },
  {
    id: 'beautiful',
    word: 'Beautiful / Muhle / Montle',
    gloss: 'BEAUTIFUL',
    icon: '✨',
    category: 'Expressions',
    culturalContext: 'Open 5-hand circles the face clockwise and closes gently into a fist as it passes the chin.',
    bonusXP: 55
  },
  {
    id: 'mother',
    word: 'Mother / Umama / Mmé',
    gloss: 'MOTHER',
    icon: '👩',
    category: 'Family',
    culturalContext: 'Thumb of an open 5-hand gently taps the chin twice, honoring maternal matriarchs in South African society.',
    bonusXP: 50
  },
  {
    id: 'father',
    word: 'Father / Ubaba / Ntate',
    gloss: 'FATHER',
    icon: '👨',
    category: 'Family',
    culturalContext: 'Thumb of an open 5-hand taps the forehead twice, reflecting parental reverence across provinces.',
    bonusXP: 50
  },
  {
    id: 'robot',
    word: 'Robot / Irobhothi / Roboto',
    gloss: 'ROBOT',
    icon: '🤖',
    category: 'STEM & Tech',
    culturalContext: 'Right-angled forearm motions showcasing mechanical precision, celebrating the Robo Rumble 2026 challenge.',
    bonusXP: 60
  },
  {
    id: 'computer',
    word: 'Computer / Ikhompyutha / Khomphutha',
    gloss: 'COMPUTER',
    icon: '💻',
    category: 'STEM & Tech',
    culturalContext: 'Forming a "C" handshape arcing smoothly upward along the forearm, bridging digital literacy with SASL.',
    bonusXP: 55
  },
  {
    id: 'home',
    word: 'Home / Ikhaya / Hae',
    gloss: 'HOME',
    icon: '🏠',
    category: 'Community',
    culturalContext: 'Fingertips touching the cheek near the mouth then transitioning to touch near the ear, representing warmth and shelter.',
    bonusXP: 50
  },
  {
    id: 'hospital',
    word: 'Hospital / Isibhedlela / Sepetlele',
    gloss: 'HOSPITAL',
    icon: '🏥',
    category: 'Emergency',
    culturalContext: 'Index and middle fingers trace a symbolic cross on the opposite upper arm, critical for healthcare access.',
    bonusXP: 65
  },
  {
    id: 'peace',
    word: 'Peace / Ukuthula / Khotso',
    gloss: 'PEACE',
    icon: '✌️',
    category: 'Expressions',
    culturalContext: 'Extending index and middle fingers in an open V-sign radiating calm and unity in our rainbow nation.',
    bonusXP: 45
  }
];

export default function SignOfTheDayCard({ onInspectSign }) {
  const today = new Date();
  const todayDateKey = today.toISOString().slice(0, 10);
  const dayIndex = (today.getDate() + today.getMonth() * 31) % DAILY_SIGNS.length;
  const todaySign = DAILY_SIGNS[dayIndex];

  const storageKey = `signvision_sod_completed_${todayDateKey}`;
  const [hasCompleted, setHasCompleted] = useState(() => {
    return localStorage.getItem(storageKey) === 'true';
  });

  const handlePracticeNow = () => {
    if (hasCompleted) return;

    addXP(todaySign.bonusXP);
    markSignLearned(todaySign.id);
    localStorage.setItem(storageKey, 'true');
    setHasCompleted(true);

    logActivity(
      'daily_sign',
      'Sign of the Day Completed',
      `Mastered "${todaySign.word}" in SASL (+${todaySign.bonusXP} XP)`
    );

    toast.success(`+${todaySign.bonusXP} XP earned for completing today's sign challenge!`, 'Daily Goal Complete');
    if (onInspectSign) {
      onInspectSign(todaySign);
    }
  };

  return (
    <div
      className="glass-card"
      style={{
        padding: '20px 24px',
        borderRadius: '18px',
        background: 'linear-gradient(135deg, rgba(254, 243, 199, 0.45) 0%, rgba(240, 253, 244, 0.65) 100%)',
        border: '1px solid #FDE68A',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div
          style={{
            width: '54px',
            height: '54px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '28px',
            boxShadow: '0 4px 14px rgba(245, 158, 11, 0.35)',
            flexShrink: 0
          }}
        >
          {todaySign.icon}
        </div>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', color: '#B45309', letterSpacing: '0.6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Sparkles size={13} /> Sign of the Day
            </span>
            <span style={{ fontSize: '11px', background: '#FEF3C7', color: '#92400E', padding: '2px 8px', borderRadius: '10px', fontWeight: '700' }}>
              +{todaySign.bonusXP} XP Daily
            </span>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '3px' }}>
              <Calendar size={12} /> {today.toLocaleDateString('en-ZA', { month: 'short', day: 'numeric' })}
            </span>
          </div>

          <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-main)', marginTop: '2px' }}>
            {todaySign.word} <span style={{ color: 'var(--primary-emerald)', fontSize: '15px' }}>({todaySign.gloss})</span>
          </h3>

          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px', maxWidth: '580px', lineHeight: '1.4' }}>
            {todaySign.culturalContext}
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {hasCompleted ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '12px', background: '#D1FAE5', color: '#047857', fontWeight: '700', fontSize: '13px', border: '1px solid #A7F3D0' }}>
            <CheckCircle size={17} color="#059669" />
            <span>Practiced Today (+{todaySign.bonusXP} XP)</span>
          </div>
        ) : (
          <button
            onClick={handlePracticeNow}
            className="btn-primary"
            style={{
              padding: '10px 18px',
              borderRadius: '12px',
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer'
            }}
          >
            <span>Practice Today's Sign</span>
            <ArrowRight size={15} />
          </button>
        )}
      </div>
    </div>
  );
}
