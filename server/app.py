from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
import os

from db import client, db

# Load .env variables
load_dotenv()

app = Flask(__name__)
CORS(app, origins=[
    "http://localhost:3000", 
    "https://your-frontend.vercel.app", 
    "https://smart-attendance-ecru.vercel.app"
])

# Import routes
from routes.auth import auth_bp
from routes.admin import admin_bp
from routes.attendance import attendance_bp
from routes.leave import leave_bp

app.register_blueprint(auth_bp)
app.register_blueprint(admin_bp)
app.register_blueprint(attendance_bp)
app.register_blueprint(leave_bp)

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
