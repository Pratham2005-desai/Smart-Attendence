from flask import Blueprint, request, jsonify
from db import db
from datetime import datetime
from math import radians, cos, sin, sqrt, atan2

attendance_bp = Blueprint('attendance', __name__, url_prefix='/api/attendance')

ALLOWED_LOCATION = { "lat": 19.123, "lon": 72.345, "radius": 100 }  # in meters

def haversine(lat1, lon1, lat2, lon2):
    R = 6371000
    dLat = radians(lat2 - lat1)
    dLon = radians(lon2 - lon1)
    a = sin(dLat/2)**2 + cos(radians(lat1)) * cos(radians(lat2)) * sin(dLon/2)**2
    c = 2 * atan2(sqrt(a), sqrt(1 - a))
    return R * c

@attendance_bp.route('/mark', methods=['POST'])
def mark_attendance():
    data = request.get_json()
    session_id = data.get("sessionId")
    loc = data.get("location")
    student_id = request.headers.get("Authorization")  # or use JWT later

    session = db.qr_sessions.find_one({"session_id": session_id, "active": True})
    if not session or datetime.utcnow() > session["expiry"]:
        return jsonify({ "error": "QR session expired or invalid" }), 400

    distance = haversine(
        loc["latitude"], loc["longitude"],
        ALLOWED_LOCATION["lat"], ALLOWED_LOCATION["lon"]
    )

    if distance > ALLOWED_LOCATION["radius"]:
        return jsonify({ "error": "Not within allowed range" }), 403

    db.attendance.insert_one({
        "studentId": student_id,
        "date": datetime.utcnow(),
        "sessionId": session_id,
        "status": "present",
        "location": loc
    })

    return jsonify({ "message": "Attendance marked" })

import uuid
from datetime import timedelta

@attendance_bp.route('/session/create', methods=['POST'])
def create_qr_session():
    data = request.get_json()
    duration_minutes = data.get("duration", 30)  # default 30 minutes
    location = data.get("location", ALLOWED_LOCATION)

    session_id = str(uuid.uuid4())
    expiry = datetime.utcnow() + timedelta(minutes=duration_minutes)

    session_data = {
        "session_id": session_id,
        "active": True,
        "expiry": expiry,
        "location": location
    }

    db.qr_sessions.insert_one(session_data)
    return jsonify({"sessionId": session_id, "expiry": expiry.isoformat()})

@attendance_bp.route('/session/close', methods=['POST'])
def close_qr_session():
    data = request.get_json()
    session_id = data.get("sessionId")

    result = db.qr_sessions.update_one(
        {"session_id": session_id, "active": True},
        {"$set": {"active": False}}
    )

    if result.modified_count == 0:
        return jsonify({"error": "Session not found or already closed"}), 404

    return jsonify({"message": "Session closed successfully"})
