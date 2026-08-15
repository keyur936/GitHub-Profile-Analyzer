import os
from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv()

def create_app():
    app = Flask(__name__)
    CORS(app, resources={r"/api/*": {"origins": "*"}})
    
    # Register blueprints
    from app.routes.github import github_bp
    app.register_blueprint(github_bp)
    
    @app.route("/")
    def index():
        return jsonify({
            "service": "GitHub Profile Analyzer API",
            "status": "online",
            "version": "1.0.0",
            "endpoints": [
                "/api/github/profile/<username>",
                "/api/github/repos/<username>",
                "/api/github/analyze/<username>",
                "/api/github/repository/<owner>/<repo>",
                "/api/github/compare/<user1>/vs/<user2>"
            ]
        })
        
    @app.errorhandler(404)
    def not_found(e):
        return jsonify({"error": "Resource not found"}), 404
        
    @app.errorhandler(500)
    def internal_error(e):
        return jsonify({"error": "Internal server error"}), 500
        
    return app
