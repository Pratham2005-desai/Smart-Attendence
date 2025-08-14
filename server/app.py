from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv

import os
from flask import Flask
from flask_cors import CORS

from db import client, db

# Load .env variables
load_dotenv()

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000", "https://your-frontend.vercel.app", "https://smart-attendance-ecru.vercel.app"])

if __name__ == "__main__":
    # Import routes after db initialization to avoid circular imports
    from routes.auth import auth_bp
    from routes.admin import admin_bp
    from routes.attendance import attendance_bp
    from routes.leave import leave_bp

    app.register_blueprint(auth_bp)
    app.register_blueprint(admin_bp)
    app.register_blueprint(attendance_bp)
    app.register_blueprint(leave_bp)

    app.run(debug=True)
