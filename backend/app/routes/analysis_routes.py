from flask import Blueprint, request
from app.controllers import analysis_controller
from app.utils.jwt_utils import token_required

analysis_bp = Blueprint('analysis', __name__, url_prefix='/api/analysis')

@analysis_bp.route('/analyze', methods=['POST'])
@token_required
def analyze(current_user):
    data = request.get_json() or {}
    return analysis_controller.run_resume_analysis(data, current_user)
