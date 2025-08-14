from flask import Blueprint, request, jsonify
from db import db
from werkzeug.security import generate_password_hash, check_password_hash

auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')

@auth_bp.route("/register", methods=["POST"])
def register():
    try:
        data = request.json
        name = data.get("name")
        email = data.get("email")
        role = data.get("role")
        user_class = data.get("class")
        college_id = data.get("collegeId")
        password = data.get("password")

        if not name or not email or not role or not password:
            return jsonify({"error": "Name, email, role, and password are required"}), 400

        if role not in ["admin", "student"]:
            return jsonify({"error": "Role must be admin or student"}), 400

        existing_user = db.users.find_one({"email": email})
        if existing_user:
            return jsonify({"error": "User with this email already exists"}), 400

        user_data = {
            "name": name,
            "email": email,
            "role": role,
            "password_hash": generate_password_hash(password)
        }

        if role == "student":
            user_data["class"] = user_class
            user_data["collegeId"] = college_id

        db.users.insert_one(user_data)

        return jsonify({"message": "User registered successfully"}), 201

    except Exception as e:
        print("Registration Error:", e)
        return jsonify({"error": "Internal Server Error"}), 500

@auth_bp.route("/login", methods=["POST"])
def login():
    try:
        data = request.json
        college_id = data.get("collegeId")
        password = data.get("password")

        print("📩 Login attempt:", data)

        user = db.users.find_one({"collegeId": college_id})
        print("👤 Fetched user:", user)

        if not user:
            return jsonify({"error": "User not found"}), 404

        password_hash = user.get("password_hash", "")
        print("🔐 Stored Hash:", password_hash)
        print("🔑 Password Entered:", password)

        password_valid = check_password_hash(password_hash, password)
        print("✅ Password Valid:", password_valid)

        if not password_valid:
            return jsonify({"error": "Invalid password"}), 400

        return jsonify({
            "success": True,
            "message": "Login successful",
            "user": {
                "_id": str(user["_id"]),
                "email": user["email"],
                "name": user["name"],
                "role": user["role"],
                "class": user.get("class"),
                "collegeId": user.get("collegeId")
            },
            "token": "fake-token"
        }), 200

    except Exception as e:
        print("🚨 Login Exception:", e)
        return jsonify({"error": "Internal Server Error"}), 500

@auth_bp.route("/change-password", methods=["POST"])
def change_password():
    try:
        data = request.json
        email = data.get("email")
        current_password = data.get("currentPassword")
        new_password = data.get("newPassword")

        if not email or not current_password or not new_password:
            return jsonify({"error": "All fields are required"}), 400

        user = db.users.find_one({"email": email})
        if not user:
            return jsonify({"error": "User not found"}), 404

        if not check_password_hash(user.get("password_hash", ""), current_password):
            return jsonify({"error": "Current password is incorrect"}), 400

        new_hashed = generate_password_hash(new_password)
        db.users.update_one({"email": email}, {"$set": {"password_hash": new_hashed}})

        return jsonify({"message": "Password updated successfully"}), 200

    except Exception as e:
        print("Change password error:", e)
        return jsonify({"error": "Server error"}), 500
