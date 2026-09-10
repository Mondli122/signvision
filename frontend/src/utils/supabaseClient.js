// Client-side authentication routing through Flask backend (/api/auth/*)
const TOKEN_KEY = 'signvision_auth_token_v1';
const CACHED_USER_KEY = 'signvision_cached_user_v1';

export function getStoredToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export const getAuthToken = getStoredToken;

export function setStoredSession(token, user) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  if (user) localStorage.setItem(CACHED_USER_KEY, JSON.stringify(user));
  window.dispatchEvent(new Event('signvision_auth_state_changed'));
}

export function clearStoredSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(CACHED_USER_KEY);
  window.dispatchEvent(new Event('signvision_auth_state_changed'));
}

export async function signUpUser(email, password, fullName = '') {
  try {
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, fullName })
    });
    const data = await res.json();
    if (!res.ok || data.error) {
      return { data: null, error: new Error(data.error || 'Failed to register') };
    }
    setStoredSession(data.token, data.user);
    return { data, error: null };
  } catch (err) {
    return { data: null, error: err };
  }
}

export async function signInUser(email, password) {
  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok || data.error) {
      return { data: null, error: new Error(data.error || 'Failed to sign in') };
    }
    setStoredSession(data.token, data.user);
    return { data, error: null };
  } catch (err) {
    return { data: null, error: err };
  }
}

export async function signOutUser() {
  const token = getStoredToken();
  try {
    await fetch('/api/auth/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
      }
    });
  } catch (e) {
    console.warn('Backend logout request failed', e);
  } finally {
    clearStoredSession();
  }
  return { error: null };
}

export async function getSessionUser() {
  const token = getStoredToken();
  if (!token) return null;

  try {
    const res = await fetch('/api/auth/user', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const data = await res.json();
    if (data.user) {
      localStorage.setItem(CACHED_USER_KEY, JSON.stringify(data.user));
      return data.user;
    }
  } catch (e) {
    console.warn('Could not verify session with backend', e);
  }

  // Fallback to cached user if offline
  const cached = localStorage.getItem(CACHED_USER_KEY);
  return cached ? JSON.parse(cached) : null;
}
