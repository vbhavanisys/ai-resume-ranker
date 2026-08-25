import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.getenv('SECRET_KEY', 'dev_secret_key_resumerank_ai_2026')
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'jwt_secret_key_resumerank_ai_2026')
    JWT_EXPIRATION_HOURS = int(os.getenv('JWT_EXPIRATION_HOURS', 24))
    PORT = int(os.getenv('FLASK_PORT', 5000))
    DEBUG = os.getenv('FLASK_ENV', 'development') == 'development'
    UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'uploads')
    MAX_CONTENT_LENGTH = 25 * 1024 * 1024  # 25 MB max upload
    MONGODB_URI = os.getenv('MONGODB_URI', 'mongodb://localhost:27017/resumerank_db')
    MONGODB_DB_NAME = os.getenv('MONGODB_DB_NAME', 'resumerank_db')
