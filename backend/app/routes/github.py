from flask import Blueprint, jsonify, request
from app.services.github_service import (
    extract_username,
    fetch_user_profile,
    fetch_all_user_repos,
    fetch_user_events,
    fetch_single_repository,
    GitHubAPIError
)
from app.services.analytics_service import calculate_analytics
from app.utils.cache import cache
from app.routes.auth import get_current_user_from_request
from app.database import deduct_credits

github_bp = Blueprint("github", __name__, url_prefix="/api/github")

ANALYZE_CREDIT_COST = 10
COMPARE_CREDIT_COST = 15

@github_bp.route("/profile/<path:user_input>", methods=["GET"])
def get_profile(user_input):
    username = extract_username(user_input)
    if not username:
        return jsonify({"error": "Invalid GitHub profile URL or username provided."}), 400
        
    cache_key = f"profile:{username.lower()}"
    cached_data = cache.get(cache_key)
    if cached_data:
        return jsonify(cached_data)
        
    try:
        profile = fetch_user_profile(username)
        cache.set(cache_key, profile, ttl=300)
        return jsonify(profile)
    except GitHubAPIError as e:
        return jsonify({"error": e.message}), e.status_code
    except Exception as e:
        return jsonify({"error": f"An unexpected error occurred: {str(e)}"}), 500

@github_bp.route("/repos/<path:user_input>", methods=["GET"])
def get_repos(user_input):
    username = extract_username(user_input)
    if not username:
        return jsonify({"error": "Invalid GitHub profile URL or username provided."}), 400
        
    cache_key = f"repos:{username.lower()}"
    cached_data = cache.get(cache_key)
    if cached_data:
        return jsonify(cached_data)
        
    try:
        repos = fetch_all_user_repos(username)
        cache.set(cache_key, repos, ttl=300)
        return jsonify(repos)
    except GitHubAPIError as e:
        return jsonify({"error": e.message}), e.status_code
    except Exception as e:
        return jsonify({"error": f"An unexpected error occurred: {str(e)}"}), 500

@github_bp.route("/analyze/<path:user_input>", methods=["GET"])
def analyze_user(user_input):
    # 1. Require Authentication
    current_user = get_current_user_from_request()
    if not current_user:
        return jsonify({
            "error": "Authentication required. Please login or register to analyze profiles.",
            "auth_required": True
        }), 401

    # 2. Check Credit Balance (Cost: 10 Credits)
    if current_user["credits"] < ANALYZE_CREDIT_COST:
        return jsonify({
            "error": f"Insufficient credits! Analyzing a profile requires {ANALYZE_CREDIT_COST} credits.",
            "insufficient_credits": True,
            "required_credits": ANALYZE_CREDIT_COST,
            "current_credits": current_user["credits"]
        }), 402

    username = extract_username(user_input)
    if not username:
        return jsonify({"error": "Invalid GitHub profile URL or username provided."}), 400
        
    try:
        # Check cache
        cache_key = f"analyze:{username.lower()}"
        cached_data = cache.get(cache_key)
        
        if cached_data:
            # Deduct credits even for cached results
            success, remaining_credits = deduct_credits(current_user["id"], ANALYZE_CREDIT_COST)
            if not success:
                return jsonify({
                    "error": f"Insufficient credits! Analyzing a profile requires {ANALYZE_CREDIT_COST} credits.",
                    "insufficient_credits": True
                }), 402
            cached_data["user_credits"] = remaining_credits
            return jsonify(cached_data)

        # Fetch profile, repos, events
        profile = fetch_user_profile(username)
        repos = fetch_all_user_repos(username)
        events = fetch_user_events(username)
        
        # Calculate full analytics and score
        analytics = calculate_analytics(profile, repos, events)
        
        # Deduct 10 Credits
        success, remaining_credits = deduct_credits(current_user["id"], ANALYZE_CREDIT_COST)
        if not success:
            return jsonify({
                "error": f"Insufficient credits! Analyzing a profile requires {ANALYZE_CREDIT_COST} credits.",
                "insufficient_credits": True
            }), 402
        
        result = {
            "username": username,
            "profile": profile,
            "repositories": repos,
            "events": events,
            "analytics": analytics,
            "user_credits": remaining_credits
        }
        
        cache.set(cache_key, result, ttl=300)
        return jsonify(result)
    except GitHubAPIError as e:
        return jsonify({"error": e.message}), e.status_code
    except Exception as e:
        return jsonify({"error": f"An unexpected error occurred while analyzing profile: {str(e)}"}), 500

@github_bp.route("/repository/<owner>/<repo>", methods=["GET"])
def get_repo_details(owner, repo):
    cache_key = f"repo:{owner.lower()}:{repo.lower()}"
    cached_data = cache.get(cache_key)
    if cached_data:
        return jsonify(cached_data)
        
    try:
        repo_data = fetch_single_repository(owner, repo)
        cache.set(cache_key, repo_data, ttl=600)
        return jsonify(repo_data)
    except GitHubAPIError as e:
        return jsonify({"error": e.message}), e.status_code
    except Exception as e:
        return jsonify({"error": f"An error occurred fetching repository: {str(e)}"}), 500

@github_bp.route("/compare/<path:user1>/vs/<path:user2>", methods=["GET"])
def compare_users(user1, user2):
    # 1. Require Authentication
    current_user = get_current_user_from_request()
    if not current_user:
        return jsonify({
            "error": "Authentication required. Please login or register to compare profiles.",
            "auth_required": True
        }), 401

    # 2. Check Credit Balance (Cost: 15 Credits)
    if current_user["credits"] < COMPARE_CREDIT_COST:
        return jsonify({
            "error": f"Insufficient credits! Comparing profiles requires {COMPARE_CREDIT_COST} credits.",
            "insufficient_credits": True,
            "required_credits": COMPARE_CREDIT_COST,
            "current_credits": current_user["credits"]
        }), 402

    u1 = extract_username(user1)
    u2 = extract_username(user2)
    
    if not u1 or not u2:
        return jsonify({"error": "Two valid GitHub usernames or URLs are required for comparison."}), 400
        
    try:
        def analyze_single(u):
            cache_key = f"analyze:{u.lower()}"
            cached = cache.get(cache_key)
            if cached:
                return cached
            p = fetch_user_profile(u)
            r = fetch_all_user_repos(u)
            e = fetch_user_events(u)
            a = calculate_analytics(p, r, e)
            res = {"username": u, "profile": p, "repositories": r, "events": e, "analytics": a}
            cache.set(cache_key, res, ttl=300)
            return res

        user1_data = analyze_single(u1)
        user2_data = analyze_single(u2)

        # Deduct 15 Credits
        success, remaining_credits = deduct_credits(current_user["id"], COMPARE_CREDIT_COST)
        if not success:
            return jsonify({
                "error": f"Insufficient credits! Comparing profiles requires {COMPARE_CREDIT_COST} credits.",
                "insufficient_credits": True
            }), 402

        return jsonify({
            "user1": user1_data,
            "user2": user2_data,
            "user_credits": remaining_credits
        })
    except GitHubAPIError as e:
        return jsonify({"error": e.message}), e.status_code
    except Exception as e:
        return jsonify({"error": f"Error during profile comparison: {str(e)}"}), 500
