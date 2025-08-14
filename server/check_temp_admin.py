from pymongo import MongoClient
import pprint

def check_temp_admin():
    client = MongoClient("mongodb://localhost:27017/")
    db = client["forecasting_db"]
    user = db.users.find_one({"email": "tempadmin@example.com"})
    pprint.pprint(user)

if __name__ == "__main__":
    check_temp_admin()
