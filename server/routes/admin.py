from flask import Blueprint, request, jsonify, send_file
from werkzeug.security import generate_password_hash
from functools import wraps
from bson.objectid import ObjectId
import datetime
import io
import pandas as pd

from db import db  # <-- IMPORTANT: import from db.py, NOT app.py

admin_bp = Blueprint('admin', __name__, url_prefix='/api/admin')

# Dummy decorator for admin authentication - replace with real auth
def admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({"error": "Unauthorized"}), 401
        token = auth_header.split(' ')[1]
        # TODO: Validate token and check if user is admin
        return f(*args, **kwargs)
    return decorated_function

@admin_bp.route('/create-user', methods=['POST'])
@admin_required
def create_user():
    data = request.json
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')
    role = data.get('role')

    if not name or not email or not password or not role:
        return jsonify({"error": "Name, email, password, and role are required"}), 400

    if role not in ['admin', 'teacher', 'student']:
        return jsonify({"error": "Role must be admin, teacher, or student"}), 400

    existing_user = db.users.find_one({"email": email})
    if existing_user:
        return jsonify({"error": "User with this email already exists"}), 400

    password_hash = generate_password_hash(password)
    user_data = {
        "name": name,
        "email": email,
        "role": role,
        "password_hash": password_hash
    }

    college_id = data.get('collegeId')
    if college_id:
        user_data['collegeId'] = college_id

    db.users.insert_one(user_data)
    return jsonify({"message": f"{role.capitalize()} created user successfully"}), 201

@admin_bp.route('/attendance', methods=['GET'])
@admin_required
def get_attendance():
    records = list(db.attendance.find())
    for r in records:
        r['_id'] = str(r['_id'])
        r['date'] = r['date'].strftime('%Y-%m-%d') if isinstance(r['date'], datetime.datetime) else r['date']
    return jsonify(records), 200

@admin_bp.route('/users', methods=['GET'])
@admin_required
def get_users():
    users = list(db.users.find())
    for u in users:
        u['_id'] = str(u['_id'])
    return jsonify(users), 200

@admin_bp.route('/leaves', methods=['GET'])
@admin_required
def get_leaves():
    leaves = list(db.leaves.find())
    for l in leaves:
        l['_id'] = str(l['_id'])
        l['date'] = l['date'].strftime('%Y-%m-%d') if isinstance(l['date'], datetime.datetime) else l['date']
    return jsonify(leaves), 200

@admin_bp.route('/export', methods=['GET'])
@admin_required
def export_attendance():
    records = list(db.attendance.find())
    data = []
    for r in records:
        data.append({
            'Student': r.get('studentId', ''),
            'Date': r.get('date').strftime('%Y-%m-%d') if isinstance(r.get('date'), datetime.datetime) else r.get('date'),
            'Status': r.get('status', ''),
            'Class': r.get('class', '')
        })
    df = pd.DataFrame(data)
    output = io.BytesIO()
    with pd.ExcelWriter(output, engine='xlsxwriter') as writer:
        df.to_excel(writer, index=False, sheet_name='Attendance')
    output.seek(0)
    return send_file(output, download_name="attendance.xlsx", as_attachment=True)
