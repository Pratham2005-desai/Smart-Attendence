from db import db
from werkzeug.security import generate_password_hash

db.users.insert_one({
    "name": "Meshell Shelby",
    "email": "meshell9282@gmail.com",
    "collegeId": "SA-001",
    "role": "superadmin",
    "password_hash": generate_password_hash("Shelby@1980")
})
