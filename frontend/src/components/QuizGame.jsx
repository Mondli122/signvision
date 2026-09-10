import React, { useState, useEffect } from 'react';
import { Gamepad2, Timer, Award, Flame, CheckCircle2, XCircle, RotateCcw, ArrowRight, Zap } from 'lucide-react';
import { recordQuizCompletion } from '../utils/storage';

const QUIZ_QUESTIONS = [
  {
    id: 1,
    question: "Which sign is performed by extending the thumb, index, and pinky finger simultaneously?",
    options: ["Help", "I Love You", "Water", "School"],
    correctIndex: 1,
    gloss: "I LOVE YOU",
    hint: "Combines letters I, L, and Y into one iconic gesture.",
    difficulty: "Beginner"
  },
  {
    id: 2,
    question: "How do you sign 'Thank You' in South African Sign Language (SASL)?",
    options: [
      "Tap forehead twice with two fingers",
      "Touch fingertips to chin, then move hand outward towards recipient",
      "Rub chest in circular motion",
      "Clap both hands horizontally"
    ],
    correctIndex: 1,
    gloss: "THANK YOU",
    hint: "Keeps palm facing upward toward the person you are thanking.",
    difficulty: "Beginner"
  },
  {
    id: 3,
    question: "What is the key handshape for signing 'Water'?",
    options: ["Forming a 'C' cup shape", "Forming a 'W' with 3 fingers tapping chin twice", "Fist with thumb up", "Open flat hand"],
    correctIndex: 1,
    gloss: "WATER",
    hint: "Uses the manual alphabet letter W at the chin.",
    difficulty: "Intermediate"
  },
  {
    id: 4,
    question: "Which emergency sign involves resting a closed fist (thumb up) on an open flat palm and lifting together?",
    options: ["Need / Must", "Fire", "Help", "Stop"],
    correctIndex: 2,
    gloss: "HELP",
    hint: "A bimanual sign where the base hand provides support.",
    difficulty: "Beginner"
  },
  {
    id: 5,
    question: "How is 'Please' politely expressed in SASL?",
    options: [
      "Open flat palm placed over chest moving in smooth clockwise circles",
      "Interlocking index fingers together",
      "Snapping fingers closed against thumb",
      "Index finger pointing from ear to mouth"
    ],
    correctIndex: 0,
    gloss: "PLEASE",
    hint: "Smooth circular gesture over the heart.",
    difficulty: "Beginner"
  },
  {
    id: 6,
    question: "What does moving your dominant index finger from ear to mouth represent in Deaf culture?",
    options: ["Music", "Deaf / SASL", "Friend", "Family"],
    correctIndex: 1,
    gloss: "DEAF",
    hint: "Represents community, culture, and deafness.",
    difficulty: "Intermediate"
  },
  {
    id: 7,
    question: "What sign is executed by interlocking index fingers together twice?",
    options: ["Friend", "Work", "School", "Home"],
    correctIndex: 0,
    gloss: "FRIEND",
    hint: "Two hands linked in friendship.",
    difficulty: "Intermediate"
  },
  {
    id: 8,
    question: "Which sign involves bending the index finger into a hook and pulling downward forcefully?",
    options: ["Money", "Need / Must", "More", "Where"],
    correctIndex: 1,
    gloss: "NEED",
    hint: "Urgent need marker in SASL.",
    difficulty: "Expert"
  }
];

export default function QuizGame({ onBackToHome }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [gameOver, setGameOver] = useState(false);
  const [xpEarned, setXpEarned] = useState(0);

  const currentQ = QUIZ_QUESTIONS[currentIdx];

  // Timer countdown
  useEffect(() => {
    if (gameOver || isAnswered) return;
    if (timeLeft <= 0) {
      handleAnswerTimeout();
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, isAnswered, gameOver]);

  const handleAnswerTimeout = () => {
    setIsAnswered(true);
    setSelectedOption(-1); // Timed out
    setStreak(0);
  };

  const handleSelect = (index) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);

    if (index === currentQ.correctIndex) {
      const timeBonus = Math.max(0, timeLeft * 2);
      const streakBonus = streak * 5;
      const points = 20 + timeBonus + streakBonus;
      setScore(prev => prev + points);
      setStreak(prev => prev + 1);
    } else {
      setStreak(0);
    }
  };

  const handleNext = () => {
    if (currentIdx + 1 < QUIZ_QUESTIONS.length) {
      setCurrentIdx(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setTimeLeft(15);
    } else {
      // Game completed
      const totalEarned = score + 30; // Completion bonus
      setXpEarned(totalEarned);
      recordQuizCompletion(totalEarned);
      setGameOver(true);
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setStreak(0);
    setTimeLeft(15);
    setGameOver(false);
    setXpEarned(0);
  };

  if (gameOver) {
    return (
      <div className="glass-card" style={{ padding: '32px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
        <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'linear-gradient(135deg, #EAB308, #CA8A04)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF' }}>
          <Award size={40} />
        </div>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--text-main)', marginBottom: '8px' }}>
            Quiz Completed! 🎉
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '15px' }}>
            You tested your knowledge of South African Sign Language!
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', width: '100%', maxWidth: '440px' }}>
          <div style={{ padding: '16px', background: 'var(--bg-card-subtle)', borderRadius: '14px', border: '1px solid var(--border-light)' }}>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600' }}>FINAL SCORE</div>
            <div style={{ fontSize: '24px', fontWeight: '800', color: 'var(--primary-emerald)' }}>{score}</div>
          </div>
          <div style={{ padding: '16px', background: 'var(--bg-card-subtle)', borderRadius: '14px', border: '1px solid var(--border-light)' }}>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600' }}>XP EARNED</div>
            <div style={{ fontSize: '24px', fontWeight: '800', color: '#EAB308' }}>+{xpEarned}</div>
          </div>
          <div style={{ padding: '16px', background: 'var(--bg-card-subtle)', borderRadius: '14px', border: '1px solid var(--border-light)' }}>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600' }}>ACCURACY</div>
            <div style={{ fontSize: '24px', fontWeight: '800', color: '#0284C7' }}>
              {Math.round((score / (QUIZ_QUESTIONS.length * 35)) * 100)}%
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn-primary" onClick={handleRestart}>
            <RotateCcw size={16} /> Play Again
          </button>
          <button className="btn-outline" onClick={onBackToHome}>
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Top Quiz Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'var(--mint-badge)', color: 'var(--primary-emerald)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Gamepad2 size={22} />
          </div>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-main)' }}>SASL Speed Quiz Challenge</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Question {currentIdx + 1} of {QUIZ_QUESTIONS.length}</p>
          </div>
        </div>

        {/* Stats Chips */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '20px', background: 'var(--bg-card-subtle)', border: '1px solid var(--border-light)', fontSize: '13px', fontWeight: '700' }}>
            <Timer size={16} color={timeLeft <= 5 ? '#EF4444' : 'var(--primary-emerald)'} />
            <span style={{ color: timeLeft <= 5 ? '#EF4444' : 'var(--text-main)' }}>{timeLeft}s</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '20px', background: 'var(--bg-card-subtle)', border: '1px solid var(--border-light)', fontSize: '13px', fontWeight: '700' }}>
            <Flame size={16} color="#F97316" />
            <span style={{ color: '#F97316' }}>Streak: {streak}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '20px', background: 'var(--bg-card-subtle)', border: '1px solid var(--border-light)', fontSize: '13px', fontWeight: '700' }}>
            <Zap size={16} color="#EAB308" />
            <span style={{ color: 'var(--text-main)' }}>{score} PTS</span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div style={{ width: '100%', height: '6px', background: 'var(--border-light)', borderRadius: '3px', overflow: 'hidden' }}>
        <div style={{ width: `${((currentIdx + 1) / QUIZ_QUESTIONS.length) * 100}%`, height: '100%', background: 'var(--emerald-gradient)', transition: 'width 0.3s ease' }} />
      </div>

      {/* Question Card */}
      <div style={{ padding: '20px', background: 'var(--bg-card-subtle)', borderRadius: '16px', border: '1px solid var(--border-light)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--primary-emerald)' }}>
            Difficulty: {currentQ.difficulty}
          </span>
          <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)' }}>
            Gloss: <span style={{ color: 'var(--primary-emerald)' }}>{currentQ.gloss}</span>
          </span>
        </div>
        <h4 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-main)', lineHeight: '1.4' }}>
          {currentQ.question}
        </h4>
      </div>

      {/* Options List */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
        {currentQ.options.map((opt, i) => {
          let btnBg = 'var(--bg-card)';
          let btnBorder = 'var(--border-light)';
          let btnColor = 'var(--text-main)';

          if (isAnswered) {
            if (i === currentQ.correctIndex) {
              btnBg = '#D1FAE5';
              btnBorder = '#10B981';
              btnColor = '#047857';
            } else if (i === selectedOption) {
              btnBg = '#FEE2E2';
              btnBorder = '#EF4444';
              btnColor = '#B91C1C';
            }
          }

          return (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              disabled={isAnswered}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 18px',
                borderRadius: '14px',
                border: `2px solid ${btnBorder}`,
                background: btnBg,
                color: btnColor,
                fontSize: '14px',
                fontWeight: '600',
                cursor: isAnswered ? 'default' : 'pointer',
                textAlign: 'left',
                transition: 'all 0.15s ease'
              }}
            >
              <span>{opt}</span>
              {isAnswered && i === currentQ.correctIndex && <CheckCircle2 size={18} color="#10B981" />}
              {isAnswered && i === selectedOption && i !== currentQ.correctIndex && <XCircle size={18} color="#EF4444" />}
            </button>
          );
        })}
      </div>

      {/* Answer Explanation & Next Button */}
      {isAnswered && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            💡 <b>Pro Tip:</b> {currentQ.hint}
          </div>
          <button className="btn-primary" onClick={handleNext}>
            {currentIdx + 1 === QUIZ_QUESTIONS.length ? 'View Results' : 'Next Question'} <ArrowRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
