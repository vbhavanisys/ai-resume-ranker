import os
from flask import Flask, jsonify
from flask_cors import CORS
from app.config import Config
from app.db import db_instance
from app.utils.response_utils import error_response

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Initialize MongoDB connection
    db_instance.init_db(app)

    # Ensure upload folder exists
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

    # Enable CORS
    cors_origins = os.getenv('CORS_ORIGINS', '*')
    CORS(app, resources={r"/api/*": {"origins": cors_origins}}, supports_credentials=True)

    # Register Blueprints
    from app.routes.auth_routes import auth_bp
    from app.routes.upload_routes import upload_bp
    from app.routes.job_routes import job_bp
    from app.routes.analysis_routes import analysis_bp
    from app.routes.history_routes import history_bp
    from app.routes.dashboard_routes import dashboard_bp

    app.register_blueprint(auth_bp)
    app.register_blueprint(upload_bp)
    app.register_blueprint(job_bp)
    app.register_blueprint(analysis_bp)
    app.register_blueprint(history_bp)
    app.register_blueprint(dashboard_bp)

    # Health check route
    @app.route('/api/health', methods=['GET'])
    def health_check():
        return jsonify({
            "status": "healthy",
            "service": "AI Resume Ranker Flask Backend",
            "version": "1.0.0",
            "database": "connected" if db_instance.db is not None else "disconnected",
            "is_mock_db": db_instance.is_mock
        }), 200

    @app.route('/api/db-health', methods=['GET'])
    def db_health_check():
        try:
            user_count = db_instance.users.count_documents({})
            resume_count = db_instance.resumes.count_documents({})
            job_count = db_instance.jobs.count_documents({})
            analysis_count = db_instance.analyses.count_documents({})

            return jsonify({
                "success": True,
                "message": "MongoDB connection active",
                "database_info": {
                    "collections": ["users", "resumes", "job_descriptions", "analyses"],
                    "is_mock": db_instance.is_mock,
                    "counts": {
                        "users": user_count,
                        "resumes": resume_count,
                        "job_descriptions": job_count,
                        "analyses": analysis_count
                    }
                }
            }), 200
        except Exception as e:
            return error_response(f"Database error: {str(e)}", status_code=500)

    # Error handlers
    @app.errorhandler(400)
    def bad_request_error(e):
        return error_response(str(e.description) if hasattr(e, 'description') else "Bad request", status_code=400)

    @app.errorhandler(404)
    def not_found_error(e):
        return error_response("Requested resource or API endpoint not found", status_code=404)

    @app.errorhandler(405)
    def method_not_allowed_error(e):
        return error_response("HTTP method not allowed for this endpoint", status_code=405)

    @app.errorhandler(500)
    def internal_server_error(e):
        return error_response("An internal server error occurred", status_code=500)

    return app
