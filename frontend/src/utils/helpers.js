// Format numbers like 1,234 or 12.5k
export function formatNumber(num) {
  if (num === null || num === undefined) return '0';
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k';
  }
  return num.toLocaleString();
}

// Format ISO dates into human readable strings
export function formatDate(dateString) {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch (e) {
    return dateString;
  }
}

// Format repository size (KB to MB/GB)
export function formatSize(sizeInKB) {
  if (!sizeInKB) return '0 KB';
  if (sizeInKB >= 1024 * 1024) {
    return (sizeInKB / (1024 * 1024)).toFixed(1) + ' GB';
  }
  if (sizeInKB >= 1024) {
    return (sizeInKB / 1024).toFixed(1) + ' MB';
  }
  return sizeInKB + ' KB';
}

// Programming language hex colors
export const LANGUAGE_COLORS = {
  JavaScript: '#f1e05a',
  TypeScript: '#3178c6',
  Python: '#3572A5',
  Java: '#b07219',
  'C++': '#f34b7d',
  C: '#555555',
  'C#': '#178600',
  PHP: '#4F5D95',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Ruby: '#701516',
  Go: '#00ADD8',
  Rust: '#dea584',
  Swift: '#F05138',
  Kotlin: '#A97BFF',
  Dart: '#00B4AB',
  Shell: '#89e051',
  Vue: '#41b883',
  React: '#61dafb',
  Jupyter: '#DA5B0B',
  Other: '#8b949e'
};

export function getLanguageColor(language) {
  return LANGUAGE_COLORS[language] || LANGUAGE_COLORS.Other;
}

// SessionStorage helpers for Recently Analyzed Profiles
// (Clears automatically on page refresh or tab close!)
const RECENT_PROFILES_KEY = 'gh_analyzer_recent_profiles';

export function getRecentProfiles() {
  try {
    // Clear any old legacy localStorage
    localStorage.removeItem(RECENT_PROFILES_KEY);

    const data = sessionStorage.getItem(RECENT_PROFILES_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
}

export function saveRecentProfile(profile) {
  if (!profile || !profile.login) return;
  try {
    const recents = getRecentProfiles();
    const filtered = recents.filter(p => p.login.toLowerCase() !== profile.login.toLowerCase());
    const updated = [
      {
        login: profile.login,
        name: profile.name || profile.login,
        avatar_url: profile.avatar_url,
        followers: profile.followers,
        public_repos: profile.public_repos,
        analyzed_at: new Date().toISOString()
      },
      ...filtered
    ].slice(0, 8); // Keep last 8
    sessionStorage.setItem(RECENT_PROFILES_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save to sessionStorage', e);
  }
}
