from datetime import datetime, timezone
import math

def calculate_analytics(profile, repos, events):
    """
    Computes all analytics, charts data, insights, and score for a user profile.
    """
    total_repos = len(repos)
    total_stars = sum(r["stargazers_count"] for r in repos)
    total_forks = sum(r["forks_count"] for r in repos)
    total_issues = sum(r["open_issues_count"] for r in repos)
    
    original_repos = [r for r in repos if not r["fork"]]
    forked_repos = [r for r in repos if r["fork"]]
    archived_repos = [r for r in repos if r["archived"]]
    
    # 1. Language breakdown
    language_counts = {}
    for repo in repos:
        lang = repo.get("language") or "Other"
        language_counts[lang] = language_counts.get(lang, 0) + 1
        
    sorted_languages = sorted(language_counts.items(), key=lambda x: x[1], reverse=True)
    
    language_distribution = []
    for lang, count in sorted_languages:
        percentage = round((count / total_repos) * 100, 1) if total_repos > 0 else 0
        language_distribution.append({
            "name": lang,
            "count": count,
            "percentage": percentage
        })
        
    most_used_language = sorted_languages[0][0] if sorted_languages else "None"
    top_5_languages = [lang[0] for lang in sorted_languages[:5]]
    
    # 2. Charts Data
    # Top Repos by Stars
    top_starred_repos = sorted(repos, key=lambda r: r["stargazers_count"], reverse=True)[:10]
    stars_chart_data = [
        {
            "name": r["name"],
            "stars": r["stargazers_count"],
            "language": r["language"]
        }
        for r in top_starred_repos if r["stargazers_count"] > 0
    ] or [{"name": r["name"], "stars": r["stargazers_count"], "language": r["language"]} for r in repos[:5]]
    
    # Top Repos by Forks
    top_forked_repos = sorted(repos, key=lambda r: r["forks_count"], reverse=True)[:10]
    forks_chart_data = [
        {
            "name": r["name"],
            "forks": r["forks_count"],
            "language": r["language"]
        }
        for r in top_forked_repos if r["forks_count"] > 0
    ] or [{"name": r["name"], "forks": r["forks_count"], "language": r["language"]} for r in repos[:5]]
    
    # Creation Timeline by Year
    yearly_counts = {}
    for repo in repos:
        if repo.get("created_at"):
            try:
                year = repo["created_at"][:4]
                yearly_counts[year] = yearly_counts.get(year, 0) + 1
            except Exception:
                pass
                
    creation_timeline = [
        {"year": yr, "repos": count}
        for yr, count in sorted(yearly_counts.items())
    ]
    
    # 3. Top Repositories List
    # Ranked composite score = stars * 3 + forks * 2 + updated_recency_bonus
    def repo_rank_score(r):
        return (r["stargazers_count"] * 3) + (r["forks_count"] * 2) + (1 if not r["fork"] else 0)
        
    ranked_repos = sorted(repos, key=repo_rank_score, reverse=True)[:10]
    
    # 4. Developer Insights
    insights = []
    
    if total_repos > 0:
        insights.append({
            "title": "Primary Language",
            "text": f"{most_used_language} is the most frequently detected language across {total_repos} analyzed repositories."
        })
        
        avg_stars = round(total_stars / total_repos, 1)
        insights.append({
            "title": "Average Star Impact",
            "text": f"Repositories average {avg_stars} stars per repository across public projects."
        })
        
        avg_forks = round(total_forks / total_repos, 1)
        insights.append({
            "title": "Average Fork Engagement",
            "text": f"Public repositories average {avg_forks} forks per repository."
        })
        
        if top_starred_repos and top_starred_repos[0]["stargazers_count"] > 0:
            top_star = top_starred_repos[0]
            insights.append({
                "title": "Most Starred Repository",
                "text": f"'{top_star['name']}' is the most starred project with {top_star['stargazers_count']} stars."
            })
            
        if top_forked_repos and top_forked_repos[0]["forks_count"] > 0:
            top_fork = top_forked_repos[0]
            insights.append({
                "title": "Most Forked Repository",
                "text": f"'{top_fork['name']}' has been forked {top_fork['forks_count']} times."
            })
            
        # Oldest and Newest Repos
        valid_date_repos = [r for r in repos if r.get("created_at")]
        if valid_date_repos:
            by_date = sorted(valid_date_repos, key=lambda r: r["created_at"])
            oldest = by_date[0]
            newest = by_date[-1]
            oldest_year = oldest["created_at"][:4]
            newest_year = newest["created_at"][:4]
            
            insights.append({
                "title": "Repository Longevity",
                "text": f"Oldest public project '{oldest['name']}' was created in {oldest_year}, and the newest project '{newest['name']}' in {newest_year}."
            })
            
        insights.append({
            "title": "Repository Composition",
            "text": f"Comprises {len(original_repos)} original repositories, {len(forked_repos)} forked repositories, and {len(archived_repos)} archived repositories."
        })
    else:
        insights.append({
            "title": "No Public Repositories",
            "text": "No public repositories were found for this GitHub account."
        })
        
    # 5. Calculate Transparent Developer Activity Score (0 - 100)
    score_components = calculate_activity_score(
        total_repos=len(original_repos),
        total_stars=total_stars,
        total_forks=total_forks,
        followers=profile.get("followers", 0),
        events_count=len(events),
        language_count=len(language_counts)
    )
    
    return {
        "summary": {
            "total_repos": total_repos,
            "total_stars": total_stars,
            "total_forks": total_forks,
            "total_issues": total_issues,
            "followers": profile.get("followers", 0),
            "following": profile.get("following", 0),
            "public_gists": profile.get("public_gists", 0),
            "original_repos": len(original_repos),
            "forked_repos": len(forked_repos),
            "archived_repos": len(archived_repos)
        },
        "languages": {
            "distribution": language_distribution,
            "most_used": most_used_language,
            "top_5": top_5_languages
        },
        "charts": {
            "stars_per_repo": stars_chart_data,
            "forks_per_repo": forks_chart_data,
            "creation_timeline": creation_timeline
        },
        "top_repositories": ranked_repos,
        "insights": insights,
        "activity_score": score_components
    }

def calculate_activity_score(total_repos, total_stars, total_forks, followers, events_count, language_count):
    """
    Transparent developer score algorithm (0-100 pts)
    - Star Impact: max 25 pts (logarithmic scale)
    - Fork & Community Engagement: max 20 pts
    - Original Portfolio Output: max 20 pts
    - Public Event Activity: max 20 pts
    - Language Versatility: max 15 pts
    """
    # 1. Star Impact (0 - 25)
    # 1 star = ~5 pts, 10 stars = 15 pts, 50+ stars = 25 pts
    if total_stars == 0:
        star_score = 0
    else:
        star_score = min(25, round(math.log(total_stars + 1, 1.8) * 4))

    # 2. Fork & Community Engagement (0 - 20)
    # (Forks + Followers)
    community_metric = total_forks * 2 + followers
    if community_metric == 0:
        engagement_score = 0
    else:
        engagement_score = min(20, round(math.log(community_metric + 1, 1.7) * 3))

    # 3. Original Portfolio Output (0 - 20)
    # 1 repo = 4 pts, 5 repos = 15 pts, 10+ repos = 20 pts
    portfolio_score = min(20, total_repos * 3)

    # 4. Public Event Activity (0 - 20)
    # Based on recent 30 public events
    activity_score = min(20, round((events_count / 30.0) * 20))

    # 5. Language Versatility (0 - 15)
    # 1 lang = 5 pts, 3 langs = 10 pts, 5+ langs = 15 pts
    versatility_score = min(15, language_count * 3)

    total_score = min(100, max(0, star_score + engagement_score + portfolio_score + activity_score + versatility_score))

    return {
        "score": total_score,
        "label": get_score_label(total_score),
        "disclaimer": "This score is calculated by GitHub Profile Analyzer using publicly available GitHub data. It is not an official GitHub ranking.",
        "breakdown": [
            {"factor": "Star Impact", "points": star_score, "max_points": 25, "description": "Based on total stars received across repositories"},
            {"factor": "Community & Fork Engagement", "points": engagement_score, "max_points": 20, "description": "Based on total forks and follower network"},
            {"factor": "Portfolio Output", "points": portfolio_score, "max_points": 20, "description": "Based on number of original public projects"},
            {"factor": "Recent Public Activity", "points": activity_score, "max_points": 20, "description": "Based on public commits, PRs, issues, and creations"},
            {"factor": "Language Versatility", "points": versatility_score, "max_points": 15, "description": "Based on variety of programming languages used"}
        ]
    }

def get_score_label(score):
    if score >= 85:
        return "Exceptional Contributor"
    elif score >= 70:
        return "High Active Developer"
    elif score >= 50:
        return "Established Developer"
    elif score >= 30:
        return "Emerging Developer"
    else:
        return "Starter Profile"
