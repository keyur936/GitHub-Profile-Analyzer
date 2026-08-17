const API_BASE = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');

const TOKEN_KEY = 'gh_analyzer_auth_token';

export function getStoredToken() {
  return localStorage.getItem(TOKEN_KEY) || '';
}

export function setStoredToken(token) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
}

function getHeaders() {
  const token = getStoredToken();
  const headers = { 'Content-Type': 'application/json' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

export async function sendOtpApi({ email, name, password }) {
  const response = await fetch(`${API_BASE}/api/auth/send-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, name, password })
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Failed to send OTP code.');
  }
  return data;
}

export async function verifyOtpApi({ email, otp }) {
  const response = await fetch(`${API_BASE}/api/auth/verify-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, otp })
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Failed to verify OTP code.');
  }
  if (data.token) {
    setStoredToken(data.token);
  }
  return data;
}

export async function registerUser({ email, name, password }) {
  return sendOtpApi({ email, name, password });
}

export async function loginUser({ email, password }) {
  const response = await fetch(`${API_BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Invalid credentials.');
  }
  if (data.token) {
    setStoredToken(data.token);
  }
  return data;
}

export async function fetchMe() {
  const token = getStoredToken();
  if (!token) return null;
  
  try {
    const response = await fetch(`${API_BASE}/api/auth/me`, {
      method: 'GET',
      headers: getHeaders()
    });
    if (!response.ok) {
      setStoredToken('');
      return null;
    }
    const data = await response.json();
    return data.user;
  } catch (e) {
    return null;
  }
}

export async function refillCreditsApi() {
  const response = await fetch(`${API_BASE}/api/auth/refill`, {
    method: 'POST',
    headers: getHeaders()
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Failed to claim credits.');
  }
  return data;
}

export async function buyCreditsApi({ packId = 'popular_1000', paymentMethod = 'upi' }) {
  const response = await fetch(`${API_BASE}/api/payment/buy-credits`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ pack_id: packId, payment_method: paymentMethod })
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Failed to process credit purchase.');
  }
  return data;
}

export function logoutUser() {
  setStoredToken('');
}

export async function fetchProfileAnalysis(userInput) {
  const cleanInput = encodeURIComponent(userInput.trim());
  const response = await fetch(`${API_BASE}/api/github/analyze/${cleanInput}`, {
    headers: getHeaders()
  });
  
  const data = await response.json();
  if (response.status === 401) {
    const err = new Error(data.error || 'Please login to analyze profiles.');
    err.authRequired = true;
    throw err;
  }
  if (response.status === 402) {
    const err = new Error(data.error || 'Insufficient credits.');
    err.insufficientCredits = true;
    err.requiredCredits = data.required_credits;
    err.currentCredits = data.current_credits;
    throw err;
  }
  if (!response.ok) {
    throw new Error(data.error || 'Failed to fetch profile analysis.');
  }
  return data;
}

export async function fetchRepoDetails(owner, repo) {
  const response = await fetch(`${API_BASE}/api/github/repository/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}`, {
    headers: getHeaders()
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Failed to fetch repository details.');
  }
  return data;
}

export async function compareProfiles(user1, user2) {
  const u1 = encodeURIComponent(user1.trim());
  const u2 = encodeURIComponent(user2.trim());
  const response = await fetch(`${API_BASE}/api/github/compare/${u1}/vs/${u2}`, {
    headers: getHeaders()
  });
  const data = await response.json();
  if (response.status === 401) {
    const err = new Error(data.error || 'Please login to compare profiles.');
    err.authRequired = true;
    throw err;
  }
  if (response.status === 402) {
    const err = new Error(data.error || 'Insufficient credits.');
    err.insufficientCredits = true;
    err.requiredCredits = data.required_credits;
    err.currentCredits = data.current_credits;
    throw err;
  }
  if (!response.ok) {
    throw new Error(data.error || 'Failed to compare profiles.');
  }
  return data;
}
