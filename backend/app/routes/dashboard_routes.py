from flask import Blueprint
from app.controllers import dashboard_controller
from app.utils.jwt_utils import token_required

dashboard_bp = Blueprint('dashboard', __name__, url_prefix='/api/dashboard')

@dashboard_bp.route('/stats', methods=['GET'])
@token_required
def get_stats(current_user):
    return dashboard_controller.get_dashboard_summary(current_user)
