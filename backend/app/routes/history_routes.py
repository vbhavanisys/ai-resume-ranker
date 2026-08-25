from flask import Blueprint
from app.controllers import history_controller
from app.utils.jwt_utils import token_required

history_bp = Blueprint('history', __name__, url_prefix='/api/history')

@history_bp.route('', methods=['GET'])
@token_required
def get_history(current_user):
    return history_controller.get_analysis_history(current_user)

@history_bp.route('/<string:analysis_id>', methods=['GET'])
@token_required
def get_history_detail(current_user, analysis_id):
    return history_controller.get_analysis_detail(analysis_id, current_user)

@history_bp.route('/<string:analysis_id>', methods=['DELETE'])
@token_required
def delete_history_item(current_user, analysis_id):
    return history_controller.delete_analysis_record(analysis_id, current_user)
