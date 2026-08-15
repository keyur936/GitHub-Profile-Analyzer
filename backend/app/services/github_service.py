import os
import re
import requests
from dotenv import load_dotenv

load_dotenv()

GITHUB_API_BASE = "https://api.github.com"

class GitHubAPIError(Exception):
    def __init__(self, message, status_code=500):
        super().__init__(message)
        self.message = message
        self.status_code = status_code

def extract_username(input_str):
    """
    Extracts username from input string which can be a full GitHub URL or raw username.
    Examples:
      - https://github.com/torvalds
      - http://github.com/torvalds/
      - github.com/torvalds
      - torvalds
    """
    if not input_str:
        return ""
    
    clean_str = input_str.strip()
    
    # Check if full URL or domain based
    url_pattern = r"(?:https?://)?(?:www\.)?github\.com/([a-zA-Z0-9_-]+)/?"
    match = re.search(url_pattern, clean_str, re.IGNORECASE)
    if match:
        return match.group(1)
        
    # If no URL pattern, trim leading/trailing slashes and @ symbols
    clean_str = clean_str.lstrip('@').strip('/')
    
    # Validate GitHub username rules (1-39 chars, alphanumeric or single hyphen)
    if re.match(r"^[a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38}$", clean_str):
        return clean_str
        
    return clean_str

def get_headers():
    token = os.getenv("GITHUB_TOKEN", "").strip()
    headers = {
        "Accept": "application/vnd.github.v3+json",
        "User-Agent": "GitHub-Profile-Analyzer-App"
    }
    if token:
        headers["Authorization"] = f"token {token}"
    return headers

def make_request(url, params=None):
    headers = get_headers()
    try:
        response = requests.get(url, headers=headers, params=params, timeout=10)
        
        if response.status_code == 404:
            raise GitHubAPIError("GitHub profile or resource not found. Please verify username.", status_code=404)
        elif response.status_code in (403, 429):
            rate_limit_remaining = response.headers.get("X-RateLimit-Remaining")
            if rate_limit_remaining == "0":
                raise GitHubAPIError("GitHub API rate limit reached. Please try again later or configure a GITHUB_TOKEN.", status_code=429)
            raise GitHubAPIError("Access forbidden by GitHub API. Rate limit or permissions exceeded.", status_code=403)
        elif response.status_code >= 500:
            raise GitHubAPIError("GitHub API server error. Please try again later.", status_code=502)
        elif response.status_code != 200:
            raise GitHubAPIError(f"GitHub API error ({response.status_code}): {response.text}", status_code=response.status_code)
            
        return response.json()
    except requests.exceptions.Timeout:
        raise GitHubAPIError("Request to GitHub API timed out. Please try again.", status_code=504)
    except requests.exceptions.RequestException as e:
        if isinstance(e, GitHubAPIError):
            raise e
        raise GitHubAPIError(f"Network error while connecting to GitHub: {str(e)}", status_code=500)

def fetch_user_profile(username):
    url = f"{GITHUB_API_BASE}/users/{username}"
    data = make_request(url)
    return {
        "login": data.get("login"),
        "name": data.get("name") or data.get("login"),
        "avatar_url": data.get("avatar_url"),
        "html_url": data.get("html_url"),
        "bio": data.get("bio") or "No bio provided.",
        "location": data.get("location"),
        "company": data.get("company"),
        "blog": data.get("blog"),
        "twitter_username": data.get("twitter_username"),
        "public_repos": data.get("public_repos", 0),
        "public_gists": data.get("public_gists", 0),
        "followers": data.get("followers", 0),
        "following": data.get("following", 0),
        "created_at": data.get("created_at"),
        "updated_at": data.get("updated_at"),
        "type": data.get("type", "User")
    }

def fetch_all_user_repos(username, max_pages=10):
    """
    Retrieves all public repositories for a user handling pagination.
    Uses per_page=100.
    """
    all_repos = []
    page = 1
    
    while page <= max_pages:
        url = f"{GITHUB_API_BASE}/users/{username}/repos"
        params = {
            "per_page": 100,
            "page": page,
            "sort": "updated"
        }
        repos_page = make_request(url, params=params)
        
        if not repos_page or not isinstance(repos_page, list):
            break
            
        for repo in repos_page:
            all_repos.append({
                "id": repo.get("id"),
                "name": repo.get("name"),
                "full_name": repo.get("full_name"),
                "description": repo.get("description") or "No description provided.",
                "html_url": repo.get("html_url"),
                "language": repo.get("language") or "Other",
                "stargazers_count": repo.get("stargazers_count", 0),
                "forks_count": repo.get("forks_count", 0),
                "open_issues_count": repo.get("open_issues_count", 0),
                "watchers_count": repo.get("watchers_count", 0),
                "size": repo.get("size", 0),  # size in KB
                "created_at": repo.get("created_at"),
                "updated_at": repo.get("updated_at"),
                "pushed_at": repo.get("pushed_at"),
                "license": repo.get("license", {}).get("name") if repo.get("license") else "No License",
                "default_branch": repo.get("default_branch", "main"),
                "topics": repo.get("topics", []),
                "archived": repo.get("archived", False),
                "fork": repo.get("fork", False),
                "visibility": repo.get("visibility", "public")
            })
            
        if len(repos_page) < 100:
            break
            
        page += 1
        
    return all_repos

def fetch_user_events(username):
    """
    Fetches public events for a user.
    """
    url = f"{GITHUB_API_BASE}/users/{username}/events/public"
    params = {"per_page": 30}
    try:
        events = make_request(url, params=params)
        formatted_events = []
        if isinstance(events, list):
            for ev in events:
                ev_type = ev.get("type")
                repo_name = ev.get("repo", {}).get("name", "")
                created_at = ev.get("created_at")
                
                # Format friendly action
                action_text = "Performed public activity"
                if ev_type == "PushEvent":
                    commit_count = len(ev.get("payload", {}).get("commits", []))
                    action_text = f"Pushed {commit_count} commit(s) to {repo_name}"
                elif ev_type == "CreateEvent":
                    ref_type = ev.get("payload", {}).get("ref_type", "repository")
                    action_text = f"Created {ref_type} in {repo_name}"
                elif ev_type == "WatchEvent":
                    action_text = f"Starred repository {repo_name}"
                elif ev_type == "PullRequestEvent":
                    action = ev.get("payload", {}).get("action", "opened")
                    action_text = f"{action.capitalize()} pull request in {repo_name}"
                elif ev_type == "IssuesEvent":
                    action = ev.get("payload", {}).get("action", "opened")
                    action_text = f"{action.capitalize()} issue in {repo_name}"
                elif ev_type == "ForkEvent":
                    action_text = f"Forked repository {repo_name}"
                elif ev_type == "IssueCommentEvent":
                    action_text = f"Commented on issue in {repo_name}"
                
                formatted_events.append({
                    "id": ev.get("id"),
                    "type": ev_type,
                    "repo_name": repo_name,
                    "action_text": action_text,
                    "created_at": created_at
                })
        return formatted_events
    except Exception:
        return []

def fetch_single_repository(owner, repo):
    url = f"{GITHUB_API_BASE}/repos/{owner}/{repo}"
    repo_data = make_request(url)
    return {
        "id": repo_data.get("id"),
        "name": repo_data.get("name"),
        "full_name": repo_data.get("full_name"),
        "description": repo_data.get("description") or "No description provided.",
        "html_url": repo_data.get("html_url"),
        "owner": {
            "login": repo_data.get("owner", {}).get("login"),
            "avatar_url": repo_data.get("owner", {}).get("avatar_url")
        },
        "language": repo_data.get("language") or "Other",
        "stargazers_count": repo_data.get("stargazers_count", 0),
        "forks_count": repo_data.get("forks_count", 0),
        "open_issues_count": repo_data.get("open_issues_count", 0),
        "watchers_count": repo_data.get("subscribers_count") or repo_data.get("watchers_count", 0),
        "size": repo_data.get("size", 0),
        "created_at": repo_data.get("created_at"),
        "updated_at": repo_data.get("updated_at"),
        "pushed_at": repo_data.get("pushed_at"),
        "license": repo_data.get("license", {}).get("name") if repo_data.get("license") else "No License",
        "default_branch": repo_data.get("default_branch", "main"),
        "topics": repo_data.get("topics", []),
        "archived": repo_data.get("archived", False),
        "fork": repo_data.get("fork", False),
        "visibility": repo_data.get("visibility", "public")
    }
