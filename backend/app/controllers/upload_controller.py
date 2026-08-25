import uuid
import datetime
from werkzeug.utils import secure_filename
from app.db import db_instance
from app.utils.response_utils import success_response, error_response

def handle_resume_upload(request, current_user):
    user_id = current_user.get("user_id", "usr_101")

    # Multipart form upload
    if 'file' in request.files:
        file = request.files['file']
        if file.filename == '':
            return error_response("No selected file", status_code=400)

        filename = secure_filename(file.filename)
        file_content = file.read()
        extracted_text = file_content.decode('utf-8', errors='ignore') if file_content else f"Extracted text from {filename}"

        resume_id = f"res_{uuid.uuid4().hex[:8]}"
        uploaded_at = datetime.datetime.utcnow().isoformat()

        resume_doc = {
            "_id": resume_id,
            "id": resume_id,
            "userId": user_id,
            "filename": filename,
            "extractedText": extracted_text[:2000] if len(extracted_text) > 2000 else extracted_text,
            "uploadedAt": uploaded_at,
            "fileSize": len(file_content),
            "mimeType": file.mimetype or "application/octet-stream"
        }

        db_instance.resumes.insert_one(resume_doc)
        return success_response(data=resume_doc, message="Resume file uploaded successfully to MongoDB", status_code=201)

    # JSON payload
    data = request.get_json(silent=True) or {}
    if data and ("extracted_text" in data or "extractedText" in data or "fileName" in data or "file_name" in data):
        filename = data.get("fileName") or data.get("file_name") or "uploaded_resume.pdf"
        extracted_text = data.get("extractedText") or data.get("extracted_text") or data.get("text") or "Resume text provided."
        file_size = data.get("fileSize") or data.get("file_size") or len(extracted_text)

        resume_id = f"res_{uuid.uuid4().hex[:8]}"
        uploaded_at = datetime.datetime.utcnow().isoformat()

        resume_doc = {
            "_id": resume_id,
            "id": resume_id,
            "userId": user_id,
            "filename": filename,
            "extractedText": extracted_text,
            "uploadedAt": uploaded_at,
            "fileSize": file_size,
            "mimeType": "application/pdf"
        }

        db_instance.resumes.insert_one(resume_doc)
        return success_response(data=resume_doc, message="Resume data saved successfully to MongoDB", status_code=201)

    return error_response("Please upload a file or provide resume text payload", status_code=400)


def get_user_resumes(current_user):
    user_id = current_user.get("user_id")
    query = {"userId": user_id} if user_id else {}
    resumes_cursor = db_instance.resumes.find(query).sort("uploadedAt", -1)

    resumes = []
    for r in resumes_cursor:
        resumes.append({
            "id": r.get("id") or r.get("_id"),
            "_id": r.get("_id") or r.get("id"),
            "userId": r.get("userId"),
            "filename": r.get("filename") or r.get("file_name"),
            "extractedText": r.get("extractedText") or r.get("extracted_text"),
            "uploadedAt": r.get("uploadedAt") or r.get("uploaded_at"),
            "fileSize": r.get("fileSize", 0)
        })

    return success_response(data=resumes, message="Resumes retrieved successfully from MongoDB")
