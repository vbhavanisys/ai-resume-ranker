import uuid
import datetime
from app.db import db_instance
from app.utils.response_utils import success_response, error_response

JOB_PRESETS = [
    {
        "id": "preset_1",
        "jobTitle": "Senior Frontend Engineer",
        "company": "TechCorp",
        "description": "Requires React, TypeScript, Tailwind CSS, Next.js, Webpack, REST APIs, Jest, and web performance optimization experience."
    },
    {
        "id": "preset_2",
        "jobTitle": "Full Stack Developer",
        "company": "Innovate Software",
        "description": "Requires React, Node.js, Express, PostgreSQL, MongoDB, Docker, AWS, GraphQL, and CI/CD pipeline management."
    },
    {
        "id": "preset_3",
        "jobTitle": "Python Data Engineer",
        "company": "DataPulse AI",
        "description": "Requires Python, PySpark, SQL, Airflow, Snowflake, AWS S3, Pandas, ETL pipelines, and machine learning model deployment."
    }
]

def save_job_description(data, current_user):
    user_id = current_user.get("user_id", "usr_101")
    if not data:
        return error_response("Job description payload is required", status_code=400)

    title = data.get("jobTitle") or data.get("title") or "Target Role"
    company = data.get("companyName") or data.get("company") or "Target Company"
    description = data.get("jobDescriptionText") or data.get("description") or ""

    if not description.strip():
        return error_response("Job description text cannot be empty", status_code=400)

    job_id = f"job_{uuid.uuid4().hex[:8]}"
    created_at = datetime.datetime.utcnow().isoformat()

    job_doc = {
        "_id": job_id,
        "id": job_id,
        "userId": user_id,
        "jobTitle": title.strip(),
        "company": company.strip(),
        "description": description.strip(),
        "createdAt": created_at
    }

    db_instance.jobs.insert_one(job_doc)
    return success_response(data=job_doc, message="Job description saved successfully to MongoDB", status_code=201)


def get_job_descriptions(current_user):
    user_id = current_user.get("user_id")
    query = {"userId": user_id} if user_id else {}
    jobs_cursor = db_instance.jobs.find(query).sort("createdAt", -1)

    jobs = []
    for j in jobs_cursor:
        jobs.append({
            "id": j.get("id") or j.get("_id"),
            "_id": j.get("_id") or j.get("id"),
            "userId": j.get("userId"),
            "jobTitle": j.get("jobTitle") or j.get("title"),
            "company": j.get("company", ""),
            "description": j.get("description"),
            "createdAt": j.get("createdAt")
        })

    return success_response(data=jobs, message="Job descriptions retrieved successfully from MongoDB")


def get_job_presets():
    return success_response(data=JOB_PRESETS, message="Job presets retrieved successfully")
