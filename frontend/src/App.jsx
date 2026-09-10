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
import { isOnboarded } from './utils/storage';
import { getSessionUser, signOutUser } from './utils/supabaseClient';

export default function App() {
  const [activeNavTab, setActiveNavTab] = useState('home');
  const [currentUser, setCurrentUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [glossSequence, setGlossSequence] = useState(['HELLO', 'WHERE', 'HELP']);
  const [translatedText, setTranslatedText] = useState('Hello! Where is it? I need help.');
  const [targetLanguage, setTargetLanguage] = useState('English');
  const [dictionaryItems, setDictionaryItems] = useState([]);
  const [currentProvince, setCurrentProvince] = useState('Gauteng');
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [showWebRTCModal, setShowWebRTCModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showOnboardingModal, setShowOnboardingModal] = useState(false);

  // Dictionary inspector modal state
  const [selectedInspectorSign, setSelectedInspectorSign] = useState(null);

  // Avatar player state
  const [isPlayingAvatar, setIsPlayingAvatar] = useState(false);
  const [activeAvatarGloss, setActiveAvatarGloss] = useState('HELLO');

  // AI Pose coach tracking state
  const [lastDetectedSign, setLastDetectedSign] = useState('HELP');
  const [lastConfidence, setLastConfidence] = useState(0.88);

  // Check onboarding on first run
  useEffect(() => {
    if (!isOnboarded()) {
      setShowOnboardingModal(true);
    }
  }, []);

  // Check initial Supabase auth session
  useEffect(() => {
    const refreshUser = () => {
      getSessionUser().then(user => {
        setCurrentUser(user || null);
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
    fetch('/api/dictionary')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setDictionaryItems(data);
        }
      })
      .catch((err) => console.warn('Could not fetch dictionary from backend API:', err));
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
        alert('Sequence saved to dataset record!');
      })
      .catch(() => alert('Sequence saved locally!'));
  };

  const handleTranslateGloss = (customGlosses, customText) => {
    const glossesToTranslate = customGlosses || glossSequence;
    if (glossesToTranslate.length === 0) return;

    if (customText) {
      setTranslatedText(customText);
      setGlossSequence(glossesToTranslate);
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

          {/* VIEW: LEARN MODE */}
          {activeNavTab === 'learn' && (
            <LearnMode onInspectSign={(sign) => setSelectedInspectorSign(sign)} />
          )}

          {/* VIEW: REVERSE VOICE-TO-SIGN TRANSLATOR */}
          {activeNavTab === 'reverse' && (
            <ReverseTranslator onPlayAvatar={(gloss) => {
              setActiveAvatarGloss(gloss);
              setIsPlayingAvatar(true);
            }} />
          )}

          {/* VIEW: DATASET RECORDER */}
          {activeNavTab === 'recorder' && (
            <DatasetRecorder />
          )}

          {/* VIEW: CLASSROOM & LEADERBOARD */}
          {activeNavTab === 'classroom' && (
            <ClassroomMode />
          )}

          {/* VIEW: SETTINGS TAB TRIGGER */}
          {activeNavTab === 'settings' && (
            <div className="glass-card" style={{ padding: '24px', textAlign: 'center' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-main)', marginBottom: '8px' }}>
                SignVision Preferences & Hardware
              </h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: '16px' }}>
                Configure camera sources, dark/light themes, and speech synthesizers.
              </p>
              <button className="btn-primary" onClick={() => setShowSettingsModal(true)} style={{ margin: '0 auto' }}>
                Open Settings Configuration
              </button>
            </div>
          )}

          {/* VIEW: DICTIONARY TAB */}
          {activeNavTab === 'dictionary' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <DictionaryCard
                onSelectCategory={(cat) => console.log('Selected category:', cat)}
                onSearch={(term) => console.log('Search term:', term)}
                onSelectSign={(item) => setSelectedInspectorSign(item)}
              />
            </div>
          )}

          {/* VIEW: HOME & TRANSLATOR DEFAULT VIEW */}
          {(activeNavTab === 'home' || activeNavTab === 'translator') && (
            <>
              {/* Top Section: Camera Stream + Translation Output Panel */}
              <div className="app-top-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1fr)', gap: '16px', alignItems: 'start' }}>
                <div>
                  <CameraViewport
                    onPrediction={(label) => {
                      setGlossSequence((prev) => [...prev, label]);
                      setLastDetectedSign(label);
                      setLastConfidence(0.92);
                    }}
                  />
                  {/* AI Sign Tutor Pose Coach */}
                  <AICoachCard
                    currentSign={lastDetectedSign}
                    currentConfidence={lastConfidence}
                    landmarkCount={42}
                  />
                </div>

                <div>
                  <TranslationPanel
                    glossSequence={glossSequence}
                    translatedText={translatedText}
                    targetLanguage={targetLanguage}
                    onSelectLanguage={(lang) => setTargetLanguage(lang)}
                    onClear={handleClear}
                    onSave={handleSaveSequence}
                    onTranslate={handleTranslateGloss}
                  />
                  {/* 3D Visual Sign Avatar */}
                  <AvatarSigner
                    activeGloss={activeAvatarGloss}
                    isPlaying={isPlayingAvatar}
                    onFinish={() => setIsPlayingAvatar(false)}
                  />
                </div>
              </div>

              {/* Middle Row: 4 Feature Shortcut Cards */}
              <FeatureCards onSelectFeature={handleSelectFeature} />

              {/* Bottom Grid: Dictionary + Progress + Recent Activity + Poster */}
              <div className="app-bottom-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px', alignItems: 'stretch' }}>
                <DictionaryCard
                  onSelectCategory={(cat) => console.log('Selected category:', cat)}
                  onSearch={(term) => console.log('Search term:', term)}
                  onSelectSign={(item) => setSelectedInspectorSign(item)}
                />
                <ProgressCard />
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

      {/* Supabase Authentication Modal */}
      {showAuthModal && (
        <AuthModal
          onClose={() => setShowAuthModal(false)}
          onAuthSuccess={(user) => setCurrentUser(user)}
        />
      )}

      {/* Competition Footer */}
      <Footer />
    </div>
  );
}
