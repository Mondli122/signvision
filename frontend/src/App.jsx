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
import { MessageSquareText, Activity, Settings } from 'lucide-react';

export default function App() {
  const [activeNavTab, setActiveNavTab] = useState('home');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
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

  // Keep onboarding closed by default so dashboard renders immediately
  useEffect(() => {
    // Can still be opened anytime via Header Welcome Guide button
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
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
      />

      {/* Main Body: Sidebar + Main Content Grid */}
      <div className="app-main-layout" style={{ display: 'flex', gap: '12px', alignItems: 'stretch', width: '100%', flex: 1 }}>
        
        {/* Left Navigation Sidebar (Collapsible) */}
        <Sidebar
          activeTab={activeNavTab}
          setActiveTab={setActiveNavTab}
          isOpen={isSidebarOpen}
          onToggle={() => setIsSidebarOpen((prev) => !prev)}
        />

        {/* Main Content Dashboard */}
        <main style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px', minWidth: 0 }}>
          
          {/* VIEW: QUIZ GAME / AI COACH */}
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
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
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
              {/* Top Hero Banner (Boxy, Compact, Decluttered) */}
              <HeroBanner />

              {/* Main 2-Column Dashboard Grid */}
              <div
                className="app-top-grid"
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'minmax(0, 1.85fr) minmax(320px, 1fr)',
                  gap: '12px',
                  alignItems: 'start'
                }}
              >
                {/* Left Column: Live Translation with Dual Viewport (Camera + 3D Avatar) & Translation Control Panel */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  
                  {/* Live Translation Header Card */}
                  <div
                    className="glass-card"
                    style={{
                      padding: '12px 20px',
                      borderRadius: '16px',
                      background: '#FFFFFF',
                      border: '1px solid rgba(136, 204, 241, 0.4)',
                      boxShadow: '0 4px 16px rgba(45, 137, 139, 0.06)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '10px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '50%',
                          background: '#2D848A',
                          color: '#FFFFFF',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <Activity size={19} />
                      </div>
                      <div>
                        <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#133340', fontFamily: 'var(--font-heading)', margin: 0 }}>
                          Live Translation
                        </h3>
                        <p style={{ fontSize: '11.5px', color: '#5C7B8A', margin: 0 }}>
                          Use your webcam or mic to translate between SASL and text/voice in real-time.
                        </p>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '5px 14px',
                          borderRadius: '9999px',
                          background: '#D5F0EC',
                          color: '#2D848A',
                          border: '1px solid #88CCF1',
                          fontSize: '12px',
                          fontWeight: '800'
                        }}
                      >
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#2D898B' }} />
                        Tracking: ON
                      </div>
                      <button
                        onClick={() => setShowSettingsModal(true)}
                        style={{
                          width: '34px',
                          height: '34px',
                          borderRadius: '50%',
                          border: '1px solid #C1DFF0',
                          background: '#F0F7FB',
                          color: '#2D848A',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'all 0.15s'
                        }}
                        title="Translation Settings"
                      >
                        <Settings size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Dual Video Grid: Camera Viewport + 3D Avatar Signer Side-by-Side at equal height */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', alignItems: 'stretch' }}>
                    <div style={{ flex: 1, minHeight: 0 }}>
                      <CameraViewport
                        onPrediction={(label) => {
                          setGlossSequence((prev) => [...prev, label]);
                          setLastDetectedSign(label);
                          setLastConfidence(0.92);
                        }}
                      />
                    </div>

                    <div style={{ flex: 1, minHeight: 0 }}>
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

                {/* Right Column: Your Progress, STEM Learning, and National Leaderboard */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {/* Your Progress Widget */}
                  <ProgressCard />

                  {/* STEM Learning Card */}
                  <StemLearningCard onPlayNow={() => setActiveNavTab('learn')} />

                  {/* National Leaderboard Card */}
                  <MiniLeaderboardCard onViewAll={() => setActiveNavTab('classroom')} />
                </div>
              </div>

              {/* Bottom Feature Shortcuts Strip (Boxy 5-Badge Row) */}
              <FeatureCards onSelectFeature={handleSelectFeature} />
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

      {/* Subtle Floating AI Tutor Launcher Button */}
      {!showAIChatModal && (
        <button
          onClick={() => setShowAIChatModal(true)}
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            zIndex: 1000,
            background: 'linear-gradient(135deg, #2D898B 0%, #3587A4 100%)',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '9999px',
            padding: '10px 18px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 6px 20px rgba(45, 137, 139, 0.35)',
            cursor: 'pointer',
            fontWeight: '700',
            fontSize: '12.5px',
            transition: 'all 0.2s ease'
          }}
          title="Ask AI SASL Tutor"
        >
          <MessageSquareText size={17} />
          <span>AI Tutor</span>
        </button>
      )}

      {/* Global Animated Toast Notification System */}
      <ToastContainer />
    </div>
  );
}
