from flask import Blueprint, request
from app.controllers import upload_controller
from app.utils.jwt_utils import token_required

upload_bp = Blueprint('upload', __name__, url_prefix='/api/upload')

@upload_bp.route('/resume', methods=['POST'])
@token_required
def upload_resume(current_user):
    return upload_controller.handle_resume_upload(request, current_user)

@upload_bp.route('/resumes', methods=['GET'])
@token_required
def get_resumes(current_user):
    return upload_controller.get_user_resumes(current_user)
