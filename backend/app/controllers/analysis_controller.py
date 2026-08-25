import uuid
import datetime
from app.db import db_instance
from app.utils.response_utils import success_response, error_response
from app.services.ai_service import analyze_resume_with_gemini

def run_resume_analysis(data, current_user):
    user_id = current_user.get("user_id", "usr_101")
    if not data:
        data = {}

    candidate_name = data.get("candidateName") or current_user.get("name", "Candidate")
    file_name = data.get("fileName") or "Uploaded_Resume.pdf"
    job_title = data.get("jobTitle") or "Target Role"
    company_name = data.get("companyName") or "Target Company"
    resume_id = data.get("resumeId") or f"res_{uuid.uuid4().hex[:6]}"
    job_id = data.get("jobId") or f"job_{uuid.uuid4().hex[:6]}"

    # Fetch text from request or database
    resume_text = data.get("extractedText") or data.get("resumeText") or ""
    if not resume_text and resume_id:
        res_doc = db_instance.resumes.find_one({"_id": resume_id}) or db_instance.resumes.find_one({"id": resume_id})
        if res_doc:
            resume_text = res_doc.get("extractedText", "")
            file_name = res_doc.get("filename") or file_name

    if not resume_text:
        # Fallback to user's latest resume
        latest_res = db_instance.resumes.find({"userId": user_id}).sort("uploadedAt", -1).limit(1)
        res_list = list(latest_res)
        if res_list:
            resume_text = res_list[0].get("extractedText", "")
            file_name = res_list[0].get("filename") or file_name

    job_description_text = data.get("jobDescriptionText") or data.get("jobText") or ""
    if not job_description_text and job_id:
        job_doc = db_instance.jobs.find_one({"_id": job_id}) or db_instance.jobs.find_one({"id": job_id})
        if job_doc:
            job_description_text = job_doc.get("description", "")
            job_title = job_doc.get("jobTitle") or job_title
            company_name = job_doc.get("company") or company_name

    if not job_description_text:
        # Fallback to user's latest job description
        latest_job = db_instance.jobs.find({"userId": user_id}).sort("createdAt", -1).limit(1)
        j_list = list(latest_job)
        if j_list:
            job_description_text = j_list[0].get("description", "")
            job_title = j_list[0].get("jobTitle") or job_title
            company_name = j_list[0].get("company") or company_name

    if not resume_text and not job_description_text:
        return error_response("Please upload a resume or provide text content for analysis.", status_code=400)

    # Perform Real AI Resume Analysis with Gemini
    ai_result = analyze_resume_with_gemini(
        resume_text=resume_text,
        job_description_text=job_description_text,
        candidate_name=candidate_name,
        file_name=file_name,
        job_title=job_title,
        company_name=company_name
    )

    analysis_id = f"an_{uuid.uuid4().hex[:6]}"
    created_at = datetime.datetime.utcnow().isoformat()

    analysis_doc = {
        "_id": analysis_id,
        "id": analysis_id,
        "userId": user_id,
        "resumeId": resume_id,
        "jobId": job_id,
        "candidateName": ai_result.get("candidateName") or candidate_name,
        "fileName": file_name,
        "jobTitle": job_title,
        "companyName": company_name,
        "resumeScore": ai_result.get("resumeScore", 80),
        "jobMatchPercentage": ai_result.get("jobMatchPercentage", 78),
        "skillMatchPercentage": ai_result.get("skillMatchPercentage", 75),
        "keywordMatchPercentage": ai_result.get("keywordMatchPercentage", 72),
        "matchScore": ai_result.get("jobMatchPercentage", 78),  # keep for backwards compatibility
        "date": datetime.date.today().isoformat(),
        "technicalSkills": ai_result.get("technicalSkills", []),
        "softSkills": ai_result.get("softSkills", []),
        "education": ai_result.get("education", []),
        "experience": ai_result.get("experience", []),
        "projects": ai_result.get("projects", []),
        "certifications": ai_result.get("certifications", []),
        "keywords": ai_result.get("keywords", []),
        "matchedSkills": ai_result.get("matchedSkills", []),
        "missingSkills": ai_result.get("missingSkills", []),
        "strengths": ai_result.get("strengths", []),
        "weaknesses": ai_result.get("weaknesses", []),
        "suggestions": ai_result.get("suggestions", []),
        "originalBullet": ai_result.get("originalBullet", ""),
        "optimizedBullet": ai_result.get("optimizedBullet", ""),
        "createdAt": created_at
    }

    db_instance.analyses.insert_one(analysis_doc)

    return success_response(
        data=analysis_doc,
        message="AI Resume analysis completed and stored in MongoDB successfully",
        status_code=201
    )
