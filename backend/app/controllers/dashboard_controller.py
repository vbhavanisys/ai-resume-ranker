from app.db import db_instance
from app.utils.response_utils import success_response

def get_dashboard_summary(current_user):
    user_id = current_user.get("user_id")
    user_filter = {"userId": user_id} if user_id else {}

    total_analyses = db_instance.analyses.count_documents(user_filter)
    total_resumes = db_instance.resumes.count_documents(user_filter)
    total_jobs = db_instance.jobs.count_documents(user_filter)

    recent_cursor = db_instance.analyses.find(user_filter).sort("createdAt", -1).limit(5)
    recent_analyses = []
    scores = []

    for a in recent_cursor:
        score = a.get("matchScore") or a.get("resumeScore", 0)
        scores.append(score)
        a_item = dict(a)
        a_item["id"] = a_item.get("_id") or a_item.get("id")
        recent_analyses.append(a_item)

    avg_score = round(sum(scores) / len(scores)) if scores else 0

    stats = {
        "user": current_user,
        "totalAnalyses": total_analyses,
        "totalResumesUploaded": total_resumes,
        "totalJobsTracked": total_jobs,
        "averageMatchScore": avg_score,
        "recentAnalyses": recent_analyses
    }

    return success_response(data=stats, message="Dashboard metrics retrieved successfully from MongoDB")
