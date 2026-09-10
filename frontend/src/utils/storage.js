// Storage utility to manage persistent user learning progress, preferences, and theme
const STORAGE_KEY = 'signvision_user_progress_v1';
const THEME_KEY = 'signvision_theme_v1';
const ONBOARDED_KEY = 'signvision_onboarded_v1';

const DEFAULT_PROGRESS = {
  xp: 320,
  level: 3,
  streak: 5,
  quizzesCompleted: 4,
  highScore: 180,
  learnedSigns: ['hello', 'thank_you', 'i_love_you', 'thumbs_up', 'peace'],
  lastActiveDate: new Date().toISOString().split('T')[0]
};

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
  } catch (e) {
    console.error('Failed to save progress to localStorage', e);
  }
}

export function addXP(amount) {
  const progress = getProgress();
  progress.xp += amount;
  
  // Level threshold calculation (e.g. each level needs level * 150 xp)
  const requiredForNext = progress.level * 150;
  if (progress.xp >= requiredForNext) {
    progress.level += 1;
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
  }
  saveProgress(progress);
  window.dispatchEvent(new Event('signvision_progress_updated'));
  return progress;
}

export function markSignLearned(signId) {
  const progress = getProgress();
  if (!progress.learnedSigns.includes(signId)) {
    progress.learnedSigns.push(signId);
    progress.xp += 25;
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
