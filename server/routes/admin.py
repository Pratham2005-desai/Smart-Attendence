from flask import Blueprint, request, jsonify, send_file
from functools import wraps
from bson import ObjectId
import datetime
import io
import pandas as pd
from db import db   # ✅ correct import
from werkzeug.security import generate_password_hash, check_password_hash

admin_bp = Blueprint("admin", __name__)

# -----------------------------
# Admin Auth Decorator
# -----------------------------
def admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if request.method == "OPTIONS":  # ✅ Allow CORS preflight
            return jsonify({"message": "OK"}), 200

        auth_header = request.headers.get("Authorization")
        if not auth_header:
            return jsonify({"error": "Unauthorized"}), 401

        token = auth_header.split(' ')[1] if " " in auth_header else None
        # TODO: Replace with real JWT/session validation
        if token != "admin-secret":  # placeholder
            return jsonify({"error": "Forbidden"}), 403

        return f(*args, **kwargs)
    return decorated_function


# -----------------------------
# Get all attendance
# -----------------------------
@admin_bp.route("/attendance", methods=["GET"])
@admin_required
def get_attendance():
    records = list(db["attendance"].find())
    for r in records:
        r["_id"] = str(r["_id"])
        if isinstance(r.get("date"), datetime.datetime):
            r["date"] = r["date"].strftime("%Y-%m-%d")
    return jsonify(records), 200


# -----------------------------
# Export attendance to Excel
# -----------------------------
@admin_bp.route("/attendance/export", methods=["GET"])
@admin_required
def export_attendance():
    records = list(db["attendance"].find())
    data = []
    for r in records:
        data.append({
            "Student": r.get("studentId", ""),
            "Date": r["date"].strftime("%Y-%m-%d") if isinstance(r.get("date"), datetime.datetime) else r.get("date"),
            "Status": r.get("status", ""),
            "Class": r.get("class", "")
        })

    df = pd.DataFrame(data)
    output = io.BytesIO()
    with pd.ExcelWriter(output, engine="xlsxwriter") as writer:
        df.to_excel(writer, index=False, sheet_name="Attendance")
    output.seek(0)
    return send_file(output, download_name="attendance.xlsx", as_attachment=True)


# -----------------------------
# Get all leave requests
# -----------------------------
@admin_bp.route("/leaves", methods=["GET"])
@admin_required
def get_leaves():
    leaves = list(db["leaves"].find())
    for leave in leaves:
        leave["_id"] = str(leave["_id"])
        if isinstance(leave.get("appliedAt"), datetime.datetime):
            leave["appliedAt"] = leave["appliedAt"].strftime("%Y-%m-%d %H:%M")
    return jsonify(leaves), 200


# -----------------------------
# Update leave status (approve / reject / pending)
# -----------------------------
@admin_bp.route("/leaves/<leave_id>", methods=["PUT", "OPTIONS"])
@admin_required
def update_leave_status(leave_id):
    if request.method == "OPTIONS":
        return jsonify({"message": "OK"}), 200

    data = request.get_json()
    new_status = data.get("status")

    if new_status not in ["approved", "rejected", "pending"]:
        return jsonify({"error": "Invalid status"}), 400

    result = db["leaves"].update_one(
        {"_id": ObjectId(leave_id)},
        {"$set": {"status": new_status}}
    )

    if result.matched_count == 0:
        return jsonify({"error": "Leave not found"}), 404

    return jsonify({"message": f"Leave {new_status} successfully"}), 200


# -----------------------------
# Get all users
# -----------------------------
@admin_bp.route("/users", methods=["GET"])
@admin_required
def get_users():
    users = list(db["users"].find())
    for u in users:
        u["_id"] = str(u["_id"])
    return jsonify(users), 200


# -----------------------------
# Register new user
# -----------------------------
@admin_bp.route("/create-user", methods=["POST", "OPTIONS"])
@admin_required
def register_user():
    if request.method == "OPTIONS":
        return jsonify({"message": "OK"}), 200

    data = request.get_json()
    print("📥 Incoming user data:", data)   # 🟢 DEBUG

    collegeId = data.get("collegeId")
    email = data.get("email")
    password = data.get("password")
    role = data.get("role", "student")

    if not collegeId or not email or not password:
        print("❌ Missing fields:", {"collegeId": collegeId, "email": email, "password": bool(password)})
        return jsonify({"error": "Missing required fields"}), 400

    if db["users"].find_one({"collegeId": collegeId}):
        print(f"⚠️ User already exists with collegeId {collegeId}")
        return jsonify({"error": "User with this College ID already exists"}), 400

    hashed_password = generate_password_hash(password)

    user = {
        "collegeId": collegeId,
        "email": email,
        "password": hashed_password,
        "role": role,
        "createdAt": datetime.datetime.utcnow()
    }

    result = db["users"].insert_one(user)
    print("✅ User inserted with _id:", result.inserted_id)

    return jsonify({"message": "User registered successfully"}), 201
