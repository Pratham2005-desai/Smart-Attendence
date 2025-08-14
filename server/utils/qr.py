from flask import Blueprint, jsonify, send_file
from app import db
import qrcode
import uuid
from datetime import datetime, timedelta

qr_bp = Blueprint('qr', __name__, url_prefix='/api/qr')

@qr_bp.route('/generate', methods=['POST'])
def generate_qr():
    session_id = str(uuid.uuid4())
    expiry = datetime.utcnow() + timedelta(minutes=5)
    
    db.qr_sessions.insert_one({
        "session_id": session_id,
        "expiry": expiry,
        "active": True
    })

    qr = qrcode.make(session_id)
    path = f"static/qrcodes/{session_id}.png"
    qr.save(path)
    
    return jsonify({ "session_id": session_id, "qr_url": f"/static/qrcodes/{session_id}.png" })
