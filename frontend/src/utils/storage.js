// Storage utility to manage persistent user learning progress, preferences, and theme
const STORAGE_KEY = 'signvision_user_progress_v1';
const THEME_KEY = 'signvision_theme_v1';
const ONBOARDED_KEY = 'signvision_onboarded_v1';
const ACTIVITY_KEY = 'signvision_activity_log_v1';

const DEFAULT_PROGRESS = {
  xp: 0,
  level: 1,
  streak: 1,
  quizzesCompleted: 0,
  highScore: 0,
  learnedSigns: [],
  lastActiveDate: new Date().toISOString().split('T')[0]
};

const DEFAULT_ACTIVITIES = [
  {
    id: 'act_1',
    type: 'welcome',
    title: 'Welcome to SignVision',
    detail: 'Joined Robo Rumble Technomania 2026',
    timestamp: Date.now() - 3600000 * 2
  }
];

export function getActivityLog() {
  try {
    const raw = localStorage.getItem(ACTIVITY_KEY);
    if (!raw) {
      localStorage.setItem(ACTIVITY_KEY, JSON.stringify(DEFAULT_ACTIVITIES));
      return DEFAULT_ACTIVITIES;
    }
    return JSON.parse(raw);
  } catch (e) {
    return DEFAULT_ACTIVITIES;
  }
}

export function logActivity(type, title, detail) {
  try {
    const current = getActivityLog();
    const newEntry = {
      id: 'act_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      type,
      title,
      detail,
      timestamp: Date.now()
    };
    const updated = [newEntry, ...current].slice(0, 20); // Keep latest 20
    localStorage.setItem(ACTIVITY_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('signvision_activity_updated'));
    return updated;
  } catch (e) {
    console.error('Failed to log activity:', e);
  }
}

export function getProgress() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_PROGRESS));
      return DEFAULT_PROGRESS;
    }
    const parsed = JSON.parse(saved);
    // Check streak
    const today = new Date().toISOString().split('T')[0];
    if (parsed.lastActiveDate !== today) {
      const lastDate = new Date(parsed.lastActiveDate);
      const currentDate = new Date(today);
      const diffDays = Math.round((currentDate - lastDate) / (1000 * 60 * 60 * 24));
      if (diffDays === 1) {
        parsed.streak += 1;
      } else if (diffDays > 1) {
        parsed.streak = 1;
      }
      parsed.lastActiveDate = today;
      saveProgress(parsed);
    }
    return parsed;
  } catch (e) {
    return DEFAULT_PROGRESS;
  }
}

export function saveProgress(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    
    // Async background sync with backend /api/user/progress
    const token = localStorage.getItem('signvision_auth_token_v1') || '';
    fetch('/api/user/progress', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      body: JSON.stringify({ progress: data })
    }).catch(() => {});
  } catch (e) {
    console.error('Failed to save progress to localStorage', e);
  }
}

export function addXP(amount) {
  const progress = getProgress();
  progress.xp += amount;
  
  // Level threshold calculation (each level needs level * 150 xp)
  const requiredForNext = progress.level * 150;
  if (progress.xp >= requiredForNext) {
    progress.level += 1;
    logActivity('level_up', 'Level Up!', `Advanced to Level ${progress.level}`);
  }
  
  saveProgress(progress);
  window.dispatchEvent(new Event('signvision_progress_updated'));
  return progress;
}

export function recordQuizCompletion(score) {
  const progress = getProgress();
  progress.quizzesCompleted += 1;
  if (score > (progress.highScore || 0)) {
    progress.highScore = score;
  }
  progress.xp += score;
  const requiredForNext = progress.level * 150;
  if (progress.xp >= requiredForNext) {
    progress.level += 1;
    logActivity('level_up', 'Level Up!', `Advanced to Level ${progress.level}`);
  }
  logActivity('quiz', 'Quiz completed', `Scored ${score} XP in SASL Speed Quiz`);
  saveProgress(progress);
  window.dispatchEvent(new Event('signvision_progress_updated'));
  return progress;
}

export function markSignLearned(signId, signName = '') {
  const progress = getProgress();
  if (!progress.learnedSigns.includes(signId)) {
    progress.learnedSigns.push(signId);
    progress.xp += 25;
    logActivity('sign_learned', 'New sign mastered', signName || signId.toUpperCase());
    saveProgress(progress);
    window.dispatchEvent(new Event('signvision_progress_updated'));
  }
  return progress;
}

export function getTheme() {
  return localStorage.getItem(THEME_KEY) || 'light';
}

export function setTheme(theme) {
  localStorage.setItem(THEME_KEY, theme);
  document.documentElement.setAttribute('data-theme', theme);
  window.dispatchEvent(new Event('signvision_theme_changed'));
}

export function isOnboarded() {
  return localStorage.getItem(ONBOARDED_KEY) === 'true';
}

export function setOnboarded() {
  localStorage.setItem(ONBOARDED_KEY, 'true');
}
