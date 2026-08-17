import os
import random
import time
import jwt
from datetime import datetime, timedelta, timezone
from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from app.database import (
    create_user,
    get_user_by_email,
    get_user_by_id,
    add_credits
)

auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")

JWT_SECRET = os.getenv("JWT_SECRET", "github_profile_analyzer_super_secret_jwt_key_2026")

# Temporary store for pending OTP verifications (10-minute expiry)
# Format: { email: { "otp": "123456", "name": "...", "password_hash": "...", "expires_at": timestamp } }
PENDING_OTPS = {}

def generate_token(user_id):
    payload = {
        "user_id": user_id,
        "exp": datetime.now(timezone.utc) + timedelta(days=30)
    }
    return jwt.encode(payload, JWT_SECRET, algorithm="HS256")

def get_current_user_from_request():
    auth_header = request.headers.get("Authorization", "")
    if not auth_header or not auth_header.startswith("Bearer "):
        return None
    token = auth_header.split(" ")[1].strip()
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        user_id = payload.get("user_id")
        return get_user_by_id(user_id)
    except Exception:
        return None

@auth_bp.route("/send-otp", methods=["POST"])
def send_otp():
    data = request.get_json() or {}
    email = data.get("email", "").strip().lower()
    name = data.get("name", "").strip()
    password = data.get("password", "").strip()

    if not email or "@" not in email:
        return jsonify({"error": "Valid email address is required."}), 400
    if not name:
        return jsonify({"error": "Full name is required."}), 400
    if not password or len(password) < 6:
        return jsonify({"error": "Password must be at least 6 characters long."}), 400

    existing_user = get_user_by_email(email)
    if existing_user:
        return jsonify({"error": "An account with this email already exists."}), 400

    # Generate 6-digit OTP (e.g. 584920)
    otp = str(random.randint(100000, 999999))
    password_hash = generate_password_hash(password)
    expires_at = time.time() + (10 * 60) # Valid for 10 minutes

    PENDING_OTPS[email] = {
        "otp": otp,
        "name": name,
        "password_hash": password_hash,
        "expires_at": expires_at
    }

    return jsonify({
        "success": True,
        "message": f"6-Digit OTP sent to {email}. (Verification Code: {otp})",
        "demo_otp": otp,
        "expires_in_seconds": 600
    })

@auth_bp.route("/verify-otp", methods=["POST"])
def verify_otp():
    data = request.get_json() or {}
    email = data.get("email", "").strip().lower()
    user_otp = data.get("otp", "").strip()

    if not email or not user_otp:
        return jsonify({"error": "Email and 6-digit OTP code are required."}), 400

    pending = PENDING_OTPS.get(email)
    if not pending:
        return jsonify({"error": "No pending OTP request found for this email. Please request a new OTP."}), 400

    if time.time() > pending["expires_at"]:
        del PENDING_OTPS[email]
        return jsonify({"error": "OTP has expired. Please request a new OTP code."}), 400

    if pending["otp"] != user_otp:
        return jsonify({"error": "Invalid 6-digit OTP code. Please check and try again."}), 400

    # OTP is valid -> Create verified account with 100 free credits
    user = create_user(
        email=email,
        name=pending["name"],
        password_hash=pending["password_hash"],
        initial_credits=100
    )

    # Clear pending OTP
    del PENDING_OTPS[email]

    if not user:
        return jsonify({"error": "Failed to create account. User might already exist."}), 500

    token = generate_token(user["id"])
    return jsonify({
        "message": "🎉 Email Verified! Account created with 100 Free Credits.",
        "token": token,
        "user": user
    }), 201

@auth_bp.route("/register", methods=["POST"])
def register():
    return send_otp()

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json() or {}
    email = data.get("email", "").strip()
    password = data.get("password", "").strip()

    if not email or not password:
        return jsonify({"error": "Email and password are required."}), 400

    user = get_user_by_email(email)
    if not user or not check_password_hash(user["password_hash"], password):
        return jsonify({"error": "Invalid email or password."}), 401

    clean_user = {
        "id": user["id"],
        "email": user["email"],
        "name": user["name"],
        "credits": user["credits"],
        "created_at": user["created_at"]
    }

    token = generate_token(user["id"])
    return jsonify({
        "message": "Login successful!",
        "token": token,
        "user": clean_user
    })

@auth_bp.route("/me", methods=["GET"])
def get_me():
    user = get_current_user_from_request()
    if not user:
        return jsonify({"error": "Unauthorized or session expired."}), 401
    return jsonify({"user": user})

@auth_bp.route("/refill", methods=["POST"])
def refill_credits():
    user = get_current_user_from_request()
    if not user:
        return jsonify({"error": "Please login to claim bonus credits."}), 401

    new_credits = add_credits(user["id"], 50)
    return jsonify({
        "message": "🎉 50 Bonus Credits added to your account!",
        "credits": new_credits
    })
