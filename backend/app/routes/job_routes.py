from flask import Blueprint, request
from app.controllers import job_controller
from app.utils.jwt_utils import token_required

job_bp = Blueprint('job', __name__, url_prefix='/api/job')

@job_bp.route('/description', methods=['POST'])
@token_required
def create_job_description(current_user):
    data = request.get_json() or {}
    return job_controller.save_job_description(data, current_user)

@job_bp.route('/descriptions', methods=['GET'])
@token_required
def list_job_descriptions(current_user):
    return job_controller.get_job_descriptions(current_user)

@job_bp.route('/presets', methods=['GET'])
def list_job_presets():
    return job_controller.get_job_presets()
