from flask import Blueprint, request, jsonify
from app.routes.auth import get_current_user_from_request
from app.database import add_credits

payment_bp = Blueprint("payment", __name__, url_prefix="/api/payment")

PACKS = {
    "starter_500": {"amount": 50, "credits": 500, "name": "Starter Pack"},
    "popular_1000": {"amount": 100, "credits": 1000, "name": "Popular Pro Pack"},
    "mega_3000": {"amount": 250, "credits": 3000, "name": "Mega Developer Pack"}
}

@payment_bp.route("/buy-credits", methods=["POST"])
def buy_credits():
    current_user = get_current_user_from_request()
    if not current_user:
        return jsonify({"error": "Please login to purchase credits."}), 401

    data = request.get_json() or {}
    pack_id = data.get("pack_id", "popular_1000")
    payment_method = data.get("payment_method", "upi")

    pack = PACKS.get(pack_id, PACKS["popular_1000"])
    credits_to_add = pack["credits"]
    amount = pack["amount"]

    # Process credit top-up
    new_total_credits = add_credits(current_user["id"], credits_to_add)

    return jsonify({
        "success": True,
        "message": f"Payment of ₹{amount} Successful! {credits_to_add} Credits added to your account.",
        "pack_name": pack["name"],
        "added_credits": credits_to_add,
        "amount_paid": amount,
        "new_credits": new_total_credits,
        "transaction_id": f"TXN_{current_user['id']}_{int(credits_to_add)}"
    })
