import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import CameraViewport from './components/CameraViewport';
import TranslationPanel from './components/TranslationPanel';
import FeatureCards from './components/FeatureCards';
import DictionaryCard from './components/DictionaryCard';
import DictionaryModal from './components/DictionaryModal';
import ProgressCard from './components/ProgressCard';
import RecentActivityCard from './components/RecentActivityCard';
import EmpowerPosterCard from './components/EmpowerPosterCard';
import AICoachCard from './components/AICoachCard';
import EmergencyHub from './components/EmergencyHub';
import WebRTCCallRoom from './components/WebRTCCallRoom';
import AvatarSigner from './components/AvatarSigner';
import Footer from './components/Footer';

// New Features Components
import QuizGame from './components/QuizGame';
import LearnMode from './components/LearnMode';
import DatasetRecorder from './components/DatasetRecorder';
import SettingsModal from './components/SettingsModal';
import ReverseTranslator from './components/ReverseTranslator';
import OnboardingModal from './components/OnboardingModal';
import ClassroomMode from './components/ClassroomMode';
import AuthModal from './components/AuthModal';
import ToastContainer from './components/ToastContainer';
import ProfilePage from './components/ProfilePage';
import SignOfTheDayCard from './components/SignOfTheDayCard';
import ShareModal from './components/ShareModal';
import AIChatAssistant from './components/AIChatAssistant';
import CommunitySubmissions from './components/CommunitySubmissions';
import HeroBanner from './components/HeroBanner';
import StemLearningCard from './components/StemLearningCard';
import MiniLeaderboardCard from './components/MiniLeaderboardCard';
import { isOnboarded, getProgress, saveProgress, logActivity } from './utils/storage';
import { toast } from './utils/toast';
import { getSessionUser, signOutUser, getAuthToken } from './utils/supabaseClient';
import { MessageSquareText } from 'lucide-react';

export default function App() {
  const [activeNavTab, setActiveNavTab] = useState('home');
  const [currentUser, setCurrentUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [glossSequence, setGlossSequence] = useState(['HELLO', 'WHERE', 'HELP']);
  const [translatedText, setTranslatedText] = useState('Hello! Where is it? I need help.');
  const [targetLanguage, setTargetLanguage] = useState('English');
  const [dictionaryItems, setDictionaryItems] = useState([]);
  const [isDictionaryLoading, setIsDictionaryLoading] = useState(true);
  const [currentProvince, setCurrentProvince] = useState('Gauteng');
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [showWebRTCModal, setShowWebRTCModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showOnboardingModal, setShowOnboardingModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showAIChatModal, setShowAIChatModal] = useState(false);

  // Dictionary inspector modal state
  const [selectedInspectorSign, setSelectedInspectorSign] = useState(null);

  // Avatar player state
  const [isPlayingAvatar, setIsPlayingAvatar] = useState(false);
  const [activeAvatarGloss, setActiveAvatarGloss] = useState('HELLO');

  // AI Pose coach tracking state
  const [lastDetectedSign, setLastDetectedSign] = useState('HELP');
  const [lastConfidence, setLastConfidence] = useState(0.88);

  // Sync user progress with persistent backend database
  const syncCloudProgress = async () => {
    try {
      const token = getAuthToken();
      if (!token) return;

      const res = await fetch('/api/user/progress', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success && data.progress) {
        const local = getProgress();
        const cloud = data.progress;
        const merged = {
          xp: Math.max(local.xp || 0, cloud.xp || 0),
          level: Math.max(local.level || 1, cloud.level || 1),
          streak: Math.max(local.streak || 1, cloud.streak || 1),
          learnedSigns: Array.from(new Set([
            ...(local.learnedSigns || local.signsLearned || []),
            ...(cloud.learnedSigns || cloud.signsLearned || [])
          ])),
          quizzesCompleted: Math.max(local.quizzesCompleted || 0, cloud.quizzesCompleted || 0),
          highScore: Math.max(local.highScore || 0, cloud.highScore || 0),
          accuracy: Math.max(local.accuracy || 85, cloud.accuracy || 85)
        };
        saveProgress(merged);
        window.dispatchEvent(new Event('signvision_progress_updated'));

        // Push merged state back to server
        fetch('/api/user/progress', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ progress: merged })
        }).catch(() => {});
      }
    } catch (err) {
      console.warn('Cloud progress sync skipped:', err);
    }
  };

  // Check onboarding on first run
  useEffect(() => {
    if (!isOnboarded()) {
      setShowOnboardingModal(true);
    }
  }, []);

  // Check initial Supabase auth session & sync cloud progress
  useEffect(() => {
    const refreshUser = () => {
      getSessionUser().then(user => {
        setCurrentUser(user || null);
        if (user) {
          syncCloudProgress();
        }
      });
    };

    refreshUser();
    window.addEventListener('signvision_auth_state_changed', refreshUser);
    return () => window.removeEventListener('signvision_auth_state_changed', refreshUser);
  }, []);

  const handleSignOut = async () => {
    await signOutUser();
    setCurrentUser(null);
  };

  // Fetch dictionary from Flask API
  useEffect(() => {
    setIsDictionaryLoading(true);
    fetch('/api/dictionary')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setDictionaryItems(data);
        }
      })
      .catch((err) => console.warn('Could not fetch dictionary from backend API:', err))
      .finally(() => setIsDictionaryLoading(false));
  }, []);

  const handleClear = () => {
    setGlossSequence([]);
    setTranslatedText('');
  };

  const handleSaveSequence = () => {
    if (glossSequence.length === 0) return;
    fetch('/api/record-sequence', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ glosses: glossSequence, sentence: translatedText })
    })
      .then((res) => res.json())
      .then(() => {
        logActivity('dataset', 'Saved Dataset Sequence', `Saved [${glossSequence.join(' ')}] for ML model training`);
        toast.success(`Saved sequence (${glossSequence.join(' ')}) to dataset repository!`, 'Sequence Saved');
      })
      .catch(() => {
        logActivity('dataset', 'Saved Local Sequence', `Stored [${glossSequence.join(' ')}] in device session`);
        toast.info('Sequence saved locally to your device session.', 'Saved Locally');
      });
  };

  const handleTranslateGloss = (customGlosses, customText) => {
    const glossesToTranslate = customGlosses || glossSequence;
    if (glossesToTranslate.length === 0) return;

    if (customText) {
      setTranslatedText(customText);
      setGlossSequence(glossesToTranslate);
      logActivity('translation', 'Translated SASL Sequence', `${glossesToTranslate.join(' ')} → "${customText}"`);
      return;
    }

    fetch('/api/gloss-to-sentence', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ glosses: glossesToTranslate, language: targetLanguage })
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.fluent_sentence) {
          setTranslatedText(data.fluent_sentence);
          logActivity('translation', 'Translated SASL Sequence', `${glossesToTranslate.join(' ')} → "${data.fluent_sentence}"`);
          // Play Avatar animation for first gloss
          if (glossesToTranslate.length > 0) {
            setActiveAvatarGloss(glossesToTranslate[0]);
            setIsPlayingAvatar(true);
          }
        }
      })
      .catch((err) => console.warn('Gloss translation error:', err));
  };

  const handleSelectFeature = (featureId) => {
    if (featureId === 'quiz') setActiveNavTab('quiz');
    else if (featureId === 'alphabet') setActiveNavTab('learn');
    else if (featureId === 'realtime') setActiveNavTab('translator');
  };

  return (
    <div className="app-container">
      {/* Header Banner */}
      <Header
        currentProvince={currentProvince}
        onSelectProvince={(prov) => setCurrentProvince(prov)}
        onOpenEmergency={() => setShowEmergencyModal(true)}
        onOpenWebRTC={() => setShowWebRTCModal(true)}
        onOpenSettings={() => setShowSettingsModal(true)}
        onOpenOnboarding={() => setShowOnboardingModal(true)}
        currentUser={currentUser}
        onOpenAuth={() => setShowAuthModal(true)}
        onSignOut={handleSignOut}
        onOpenProfile={() => setActiveNavTab('profile')}
      />

      {/* Main Body: Sidebar + Main Content Grid */}
      <div className="app-main-layout" style={{ display: 'flex', gap: '16px', alignItems: 'stretch' }}>
        
        {/* Left Navigation Sidebar */}
        <Sidebar activeTab={activeNavTab} setActiveTab={setActiveNavTab} />

        {/* Main Content Dashboard */}
        <main style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px', minWidth: 0 }}>
          
          {/* VIEW: QUIZ GAME */}
          {activeNavTab === 'quiz' && (
            <QuizGame onBackToHome={() => setActiveNavTab('home')} />
          )}

          {/* VIEW: USER PROFILE & XP */}
          {activeNavTab === 'profile' && (
            <ProfilePage
              currentUser={currentUser}
              onOpenShare={() => setShowShareModal(true)}
              onOpenAuth={() => setShowAuthModal(true)}
            />
          )}

          {/* VIEW: COMMUNITY SIGNS REPOSITORY */}
          {activeNavTab === 'community' && (
            <CommunitySubmissions />
          )}

          {/* VIEW: LEARN MODE */}
          {activeNavTab === 'learn' && (
            <LearnMode onInspectSign={(sign) => setSelectedInspectorSign(sign)} />
          )}

          {/* VIEW: REVERSE VOICE-TO-SIGN TRANSLATOR */}
          {activeNavTab === 'reverse' && (
            <ReverseTranslator
              onPlayAvatar={(gloss) => {
                setActiveAvatarGloss(gloss);
                setIsPlayingAvatar(true);
              }}
              onInspectCard={(card) => setSelectedInspectorSign(card)}
            />
          )}

          {/* VIEW: DATASET RECORDER */}
          {activeNavTab === 'recorder' && (
            <DatasetRecorder />
          )}

          {/* VIEW: CLASSROOM & LEADERBOARD */}
          {activeNavTab === 'classroom' && (
            <ClassroomMode />
          )}

          {/* VIEW: FULL INLINE SETTINGS PAGE */}
          {activeNavTab === 'settings' && (
            <SettingsModal isInline={true} />
          )}

          {/* VIEW: DICTIONARY TAB */}
          {activeNavTab === 'dictionary' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <DictionaryCard
                items={dictionaryItems}
                isLoading={isDictionaryLoading}
                onSelectSign={(item) => setSelectedInspectorSign(item)}
              />
            </div>
          )}

          {/* VIEW: HOME & TRANSLATOR DEFAULT VIEW */}
          {(activeNavTab === 'home' || activeNavTab === 'translator') && (
            <>
              {/* Top Hero Banner Matching Design Mockup */}
              <HeroBanner />

              {/* Main 2-Column Dashboard Grid (Left: Translation & Vision, Right: Progress & STEM & Leaderboard) */}
              <div
                className="app-top-grid"
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'minmax(0, 1.7fr) minmax(320px, 1fr)',
                  gap: '18px',
                  alignItems: 'start'
                }}
              >
                {/* Left Column: Live Translation with Dual Viewport (Camera + 3D Avatar) & Translation Control Panel */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  
                  {/* Live Translation Header Card */}
                  <div
                    className="glass-card"
                    style={{
                      padding: '16px 20px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '12px'
                    }}
                  >
                    <div>
                      <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#133340', fontFamily: 'var(--font-heading)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span>📊</span> Live Translation
                      </h3>
                      <p style={{ fontSize: '12px', color: '#5C7B8A', marginTop: '2px' }}>
                        Use your webcam or mic to translate between SASL and text/voice in real-time.
                      </p>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div className="status-pill" style={{ background: '#C1DFF0', color: '#2D848A', border: '1px solid #88CCF1' }}>
                        <span className="status-dot" style={{ background: '#2D898B', boxShadow: '0 0 8px #2D898B' }} />
                        Tracking: ON
                      </div>
                    </div>
                  </div>

                  {/* Dual Video Grid: Camera Viewport + 3D Avatar Signer Side-by-Side (Matching Mockup) */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <CameraViewport
                        onPrediction={(label) => {
                          setGlossSequence((prev) => [...prev, label]);
                          setLastDetectedSign(label);
                          setLastConfidence(0.92);
                        }}
                      />
                      <AICoachCard
                        currentSign={lastDetectedSign}
                        currentConfidence={lastConfidence}
                        landmarkCount={42}
                      />
                    </div>

                    <div>
                      <AvatarSigner
                        activeGloss={activeAvatarGloss}
                        isPlaying={isPlayingAvatar}
                        onFinish={() => setIsPlayingAvatar(false)}
                      />
                    </div>
                  </div>

                  {/* Interactive Translation Panel with Quick Signs */}
                  <TranslationPanel
                    glossSequence={glossSequence}
                    translatedText={translatedText}
                    targetLanguage={targetLanguage}
                    onSelectLanguage={(lang) => setTargetLanguage(lang)}
                    onClear={handleClear}
                    onSave={handleSaveSequence}
                    onTranslate={handleTranslateGloss}
                  />
                </div>

                {/* Right Column: Your Progress, STEM Learning, and National Leaderboard (Matching Mockup) */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {/* Your Progress Widget */}
                  <ProgressCard />

                  {/* STEM Learning Card */}
                  <StemLearningCard onPlayNow={() => setActiveNavTab('learn')} />

                  {/* National Leaderboard Card */}
                  <MiniLeaderboardCard onViewAll={() => setActiveNavTab('classroom')} />
                </div>
              </div>

              {/* Middle Row: Feature Shortcut Cards (Offline Ready, Dual Hand, ML Engine, Multi-language) */}
              <FeatureCards onSelectFeature={handleSelectFeature} />

              {/* Bottom Grid: Dictionary + Recent Activity + Poster + Daily Sign */}
              <div className="app-bottom-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', alignItems: 'stretch' }}>
                <SignOfTheDayCard onInspectSign={(sign) => setSelectedInspectorSign(sign)} />
                <DictionaryCard
                  items={dictionaryItems}
                  isLoading={isDictionaryLoading}
                  onSelectSign={(item) => setSelectedInspectorSign(item)}
                />
                <RecentActivityCard />
                <EmpowerPosterCard />
              </div>
            </>
          )}

        </main>
      </div>

      {/* Dictionary Inspector Modal */}
      {selectedInspectorSign && (
        <DictionaryModal
          item={selectedInspectorSign}
          onClose={() => setSelectedInspectorSign(null)}
        />
      )}

      {/* Emergency First-Responder SOS Modal */}
      {showEmergencyModal && (
        <EmergencyHub onClose={() => setShowEmergencyModal(false)} />
      )}

      {/* WebRTC Video Call Modal */}
      {showWebRTCModal && (
        <WebRTCCallRoom onClose={() => setShowWebRTCModal(false)} />
      )}

      {/* Settings Modal */}
      {showSettingsModal && (
        <SettingsModal onClose={() => setShowSettingsModal(false)} />
      )}

      {/* Onboarding Tour Modal */}
      {showOnboardingModal && (
        <OnboardingModal onClose={() => setShowOnboardingModal(false)} />
      )}

      {/* Share Progress & Milestone Modal */}
      {showShareModal && (
        <ShareModal
          progress={getProgress()}
          onClose={() => setShowShareModal(false)}
        />
      )}

      {/* AI SASL Chat Assistant Panel */}
      {showAIChatModal && (
        <AIChatAssistant onClose={() => setShowAIChatModal(false)} />
      )}

      {/* Floating AI Tutor Launcher Button */}
      {!showAIChatModal && (
        <button
          onClick={() => setShowAIChatModal(true)}
          style={{
            position: 'fixed',
            bottom: '24px',
            left: '24px',
            zIndex: 1000,
            background: 'linear-gradient(135deg, #00A884 0%, #059669 100%)',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '30px',
            padding: '12px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 8px 24px rgba(0, 168, 132, 0.4)',
            cursor: 'pointer',
            fontWeight: '700',
            fontSize: '13px'
          }}
        >
          <MessageSquareText size={18} />
          <span>Ask AI SASL Tutor</span>
        </button>
      )}

      {/* Global Animated Toast Notification System */}
      <ToastContainer />

      {/* Competition Footer */}
      <Footer />
    </div>
  );
}
