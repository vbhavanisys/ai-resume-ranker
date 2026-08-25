from flask import jsonify

def success_response(data=None, message="Success", status_code=200):
    response = {
        "success": True,
        "message": message
    }
    if data is not None:
        response["data"] = data
    return jsonify(response), status_code

def error_response(error_message="An error occurred", details=None, status_code=400):
    response = {
        "success": False,
        "error": error_message
    }
    if details is not None:
        response["details"] = details
    return jsonify(response), status_code
