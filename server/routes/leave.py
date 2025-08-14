from flask import Blueprint, request, jsonify

leave_bp = Blueprint('leave', __name__, url_prefix='/api/leave')

# Placeholder in-memory leave data
leaves = []

@leave_bp.route('/apply', methods=['POST'])
def apply_leave():
    data = request.get_json()
    user_id = data.get('userId')
    start_date = data.get('startDate')
    end_date = data.get('endDate')
    reason = data.get('reason')

    if not all([user_id, start_date, end_date, reason]):
        return jsonify({"error": "Missing required fields"}), 400

    leave_request = {
        "userId": user_id,
        "startDate": start_date,
        "endDate": end_date,
        "reason": reason,
        "status": "pending"
    }
    leaves.append(leave_request)
    return jsonify({"message": "Leave applied successfully", "leave": leave_request}), 201

@leave_bp.route('/status/<user_id>', methods=['GET'])
def leave_status(user_id):
    user_leaves = [leave for leave in leaves if leave["userId"] == user_id]
    return jsonify({"leaves": user_leaves})
