const API_BASE = '/api/github';

export async function fetchProfileAnalysis(userInput) {
  const cleanInput = encodeURIComponent(userInput.trim());
  const response = await fetch(`${API_BASE}/analyze/${cleanInput}`);
  
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Failed to fetch profile analysis.');
  }
  return data;
}

export async function fetchRepoDetails(owner, repo) {
  const response = await fetch(`${API_BASE}/repository/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}`);
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Failed to fetch repository details.');
  }
  return data;
}

export async function compareProfiles(user1, user2) {
  const u1 = encodeURIComponent(user1.trim());
  const u2 = encodeURIComponent(user2.trim());
  const response = await fetch(`${API_BASE}/compare/${u1}/vs/${u2}`);
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Failed to compare profiles.');
  }
  return data;
}
