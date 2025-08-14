from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
from db import db  # import db first

load_dotenv()

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000", "https://your-frontend.vercel.app", "https://smart-attendance-ecru.vercel.app"])

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
