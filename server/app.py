from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
from db import db  # import db first
import os

from db import client, db

# Load .env variables
load_dotenv()

app = Flask(__name__)

# ✅ Global CORS fix
CORS(app, resources={r"/api/*": {"origins": [
    "http://localhost:3000",
    "https://your-frontend.vercel.app",
    "https://smart-attendance-ecru.vercel.app"
]}}, supports_credentials=True)

# Import routes here AFTER db is ready
from routes.auth import auth_bp
from routes.admin import admin_bp
from routes.attendance import attendance_bp
from routes.leave import leave_bp

app.register_blueprint(auth_bp)
app.register_blueprint(admin_bp)
app.register_blueprint(attendance_bp)
app.register_blueprint(leave_bp)

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=int(os.environ.get("PORT", 5000)))
    # Import routes after db initialization to avoid circular imports
    from routes.auth import auth_bp
    from routes.admin import admin_bp
    from routes.attendance import attendance_bp
    from routes.leave import leave_bp

    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(admin_bp, url_prefix="/api/admin")
    app.register_blueprint(attendance_bp, url_prefix="/api/attendance")
    app.register_blueprint(leave_bp, url_prefix="/api/leave")

    app.run(debug=True)