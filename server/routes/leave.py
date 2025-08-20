from flask import Blueprint, request, jsonify
from db import db
from datetime import datetime

leave_bp = Blueprint('leave', __name__, url_prefix='/api/leave')

@leave_bp.route('/apply', methods=['POST'])
@leave_bp.route('/apply', methods=['POST'])
def apply_leave():
    data = request.get_json()
    print("📩 Backend received leave apply request:", data)

    college_id = data.get('collegeId')
    start_date = data.get('startDate')
    end_date = data.get('endDate')
    reason = data.get('reason')

    missing_fields = [f for f, v in {
        "collegeId": college_id,
        "startDate": start_date,
        "endDate": end_date,
        "reason": reason
    }.items() if not v]

    if missing_fields:
        print("🚨 Missing fields:", missing_fields)
        return jsonify({"error": f"Missing required fields: {', '.join(missing_fields)}"}), 400

    leave_request = {
        "collegeId": college_id,
        "startDate": start_date,
        "endDate": end_date,
        "reason": reason,
        "status": "pending",
        "appliedAt": datetime.utcnow()
    }

    result = db.leaves.insert_one(leave_request)
    leave_request["_id"] = str(result.inserted_id)  # ✅ make ObjectId serializable

    print("✅ Inserting leave into DB:", leave_request)
    return jsonify({"message": "Leave applied successfully", "leave": leave_request}), 201

@leave_bp.route('/status/<college_id>', methods=['GET'])
def leave_status(college_id):
    user_leaves = list(db.leaves.find({"collegeId": college_id}, {"_id": 0}))
    return jsonify({"leaves": user_leaves})
