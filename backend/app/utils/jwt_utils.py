import jwt
import datetime
from functools import wraps
from flask import request, current_app
from app.utils.response_utils import error_response

def generate_token(user_id, email, name, role="Student"):
    """
    Generate JWT Token for authenticated users
    """
    expiration = datetime.datetime.utcnow() + datetime.timedelta(
        hours=current_app.config.get('JWT_EXPIRATION_HOURS', 24)
    )
    payload = {
        'user_id': user_id,
        'email': email,
        'name': name,
        'role': role,
        'exp': expiration,
        'iat': datetime.datetime.utcnow()
    }
    secret = current_app.config.get('JWT_SECRET_KEY')
    token = jwt.encode(payload, secret, algorithm='HS256')
    return token

def decode_token(token):
    """
    Decode and verify JWT Token
    """
    try:
        secret = current_app.config.get('JWT_SECRET_KEY')
        payload = jwt.decode(token, secret, algorithms=['HS256'])
        return payload
    except jwt.ExpiredSignatureError:
        return {'error': 'Token has expired'}
    except jwt.InvalidTokenError:
        return {'error': 'Invalid token'}

def token_required(f):
    """
    Decorator to protect routes requiring JWT authentication
    """
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        auth_header = request.headers.get('Authorization')

        if auth_header:
            parts = auth_header.split(" ")
            if len(parts) == 2 and parts[0].lower() == 'bearer':
                token = parts[1]
            else:
                token = auth_header

        if not token:
            return error_response('Authentication token is missing in request header', status_code=401)

        decoded = decode_token(token)
        if 'error' in decoded:
            return error_response(decoded['error'], status_code=401)

        # Attach current_user to kwargs or g
        current_user = {
            'user_id': decoded.get('user_id'),
            'email': decoded.get('email'),
            'name': decoded.get('name'),
            'role': decoded.get('role')
        }
        
        return f(current_user=current_user, *args, **kwargs)

    return decorated
