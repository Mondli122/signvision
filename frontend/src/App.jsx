import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import CameraViewport from './components/CameraViewport';
import TranslationPanel from './components/TranslationPanel';
import FeatureCards from './components/FeatureCards';
import DictionaryCard from './components/DictionaryCard';
import ProgressCard from './components/ProgressCard';
import RecentActivityCard from './components/RecentActivityCard';
import EmpowerPosterCard from './components/EmpowerPosterCard';
import AICoachCard from './components/AICoachCard';
import EmergencyHub from './components/EmergencyHub';
import WebRTCCallRoom from './components/WebRTCCallRoom';
import AvatarSigner from './components/AvatarSigner';
import Footer from './components/Footer';

export default function App() {
  const [activeNavTab, setActiveNavTab] = useState('home');
  const [glossSequence, setGlossSequence] = useState(['HELLO', 'WHERE', 'HELP']);
  const [translatedText, setTranslatedText] = useState('Hello! Where is it? I need help.');
  const [dictionaryItems, setDictionaryItems] = useState([]);
  const [currentProvince, setCurrentProvince] = useState('Gauteng');
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [showWebRTCModal, setShowWebRTCModal] = useState(false);

  // Avatar player state
  const [isPlayingAvatar, setIsPlayingAvatar] = useState(false);
  const [activeAvatarGloss, setActiveAvatarGloss] = useState('HELLO');

  // AI Pose coach tracking state
  const [lastDetectedSign, setLastDetectedSign] = useState('HELP');
  const [lastConfidence, setLastConfidence] = useState(0.88);

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

  const handleTranslateGloss = () => {
    if (glossSequence.length === 0) return;
    fetch('/api/gloss-to-sentence', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ glosses: glossSequence })
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.fluent_sentence) {
          setTranslatedText(data.fluent_sentence);
          // Play Avatar animation for first gloss
          if (glossSequence.length > 0) {
            setActiveAvatarGloss(glossSequence[0]);
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
      />

      {/* Main Body: Sidebar + Main Content Grid */}
      <div style={{ display: 'flex', gap: '16px', alignItems: 'stretch' }}>
        
        {/* Left Navigation Sidebar */}
        <Sidebar activeTab={activeNavTab} setActiveTab={setActiveNavTab} />

        {/* Main Content Dashboard */}
        <main style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px', minWidth: 0 }}>
          
          {/* Top Section: Camera Stream + Translation Output Panel */}
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1fr)', gap: '16px', alignItems: 'start' }}>
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
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px', alignItems: 'stretch' }}>
            <DictionaryCard
              onSelectCategory={(cat) => console.log('Selected category:', cat)}
              onSearch={(term) => console.log('Search term:', term)}
            />
            <ProgressCard level={3} streak={5} score={150} currentPts={320} totalPts={500} />
            <RecentActivityCard />
            <EmpowerPosterCard />
          </div>

        </main>
      </div>

      {/* Emergency First-Responder SOS Modal */}
      {showEmergencyModal && (
        <EmergencyHub onClose={() => setShowEmergencyModal(false)} />
      )}

      {/* WebRTC Video Call Modal */}
      {showWebRTCModal && (
        <WebRTCCallRoom onClose={() => setShowWebRTCModal(false)} />
      )}

      {/* Competition Footer */}
      <Footer />
    </div>
  );
}
