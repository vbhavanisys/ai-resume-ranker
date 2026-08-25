import uuid
import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from app.db import db_instance
from app.utils.jwt_utils import generate_token
from app.utils.response_utils import success_response, error_response

def register_user(data):
    if not data:
        return error_response("Request payload is required", status_code=400)

    name = (data.get("name") or data.get("fullName") or "").strip()
    email = data.get("email", "").strip().lower()
    password = data.get("password", "")
    role = data.get("role", "Student / Job Seeker").strip()

    if not name or not email or not password:
        return error_response("Name, email, and password are required fields", status_code=400)

    # Check if user already exists in MongoDB Users collection
    existing_user = db_instance.users.find_one({"email": email})
    if existing_user:
        return error_response("An account with this email address already exists", status_code=409)

    user_id = f"usr_{uuid.uuid4().hex[:8]}"
    hashed_password = generate_password_hash(password)
    created_at = datetime.datetime.utcnow().isoformat()

    new_user_doc = {
        "_id": user_id,
        "name": name,
        "email": email,
        "password": hashed_password,
        "role": role,
        "createdAt": created_at
    }

    db_instance.users.insert_one(new_user_doc)

    token = generate_token(user_id=user_id, email=email, name=name, role=role)

    user_data = {
        "id": user_id,
        "name": name,
        "email": email,
        "role": role,
        "createdAt": created_at,
        "token": token
    }

    return success_response(data=user_data, message="Registration successful", status_code=201)


def login_user(data):
    if not data:
        return error_response("Request payload is required", status_code=400)

    email = data.get("email", "").strip().lower()
    password = data.get("password", "")

    if not email or not password:
        return error_response("Email and password are required", status_code=400)

    # Query MongoDB Users collection
    user = db_instance.users.find_one({"email": email})

    if not user:
        return error_response("Invalid email or password credentials", status_code=401)

    stored_password = user.get("password", "")
    # Check if hashed or plain fallback for seed user
    is_valid_pw = False
    if stored_password.startswith("pbkdf2:") or stored_password.startswith("scrypt:"):
        is_valid_pw = check_password_hash(stored_password, password)
    else:
        is_valid_pw = (stored_password == password)

    if not is_valid_pw:
        return error_response("Invalid email or password credentials", status_code=401)

    user_id = user.get("_id") or user.get("id")
    token = generate_token(
        user_id=user_id,
        email=user["email"],
        name=user["name"],
        role=user.get("role", "Student")
    )

    user_data = {
        "id": user_id,
        "name": user["name"],
        "email": user["email"],
        "role": user.get("role", "Student"),
        "createdAt": user.get("createdAt"),
        "token": token
    }

    return success_response(data=user_data, message="Login successful", status_code=200)


def get_current_user_profile(current_user):
    user_id = current_user.get("user_id")
    user = db_instance.users.find_one({"_id": user_id}) or db_instance.users.find_one({"id": user_id})

    if not user:
        return success_response(data=current_user, message="User profile retrieved")

    profile = {
        "id": user.get("_id") or user.get("id"),
        "name": user["name"],
        "email": user["email"],
        "role": user.get("role", "Student"),
        "createdAt": user.get("createdAt")
    }
    return success_response(data=profile, message="User profile retrieved successfully")
