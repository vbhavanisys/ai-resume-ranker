from flask import Blueprint, request
from app.controllers import auth_controller
from app.utils.jwt_utils import token_required

auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json() or {}
    return auth_controller.register_user(data)

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json() or {}
    return auth_controller.login_user(data)

@auth_bp.route('/me', methods=['GET'])
@token_required
def get_me(current_user):
    return auth_controller.get_current_user_profile(current_user)
