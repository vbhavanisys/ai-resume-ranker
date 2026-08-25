from app.db import db_instance
from app.utils.response_utils import success_response, error_response

def get_analysis_history(current_user):
    user_id = current_user.get("user_id")
    query = {"userId": user_id} if user_id else {}
    cursor = db_instance.analyses.find(query).sort("createdAt", -1)

    records = []
    for r in cursor:
        r_item = dict(r)
        r_item["id"] = r_item.get("_id") or r_item.get("id")
        records.append(r_item)

    return success_response(data=records, message="Analysis history retrieved successfully from MongoDB")


def get_analysis_detail(analysis_id, current_user):
    record = db_instance.analyses.find_one({"_id": analysis_id}) or db_instance.analyses.find_one({"id": analysis_id})
    if not record:
        return error_response(f"Analysis record with ID '{analysis_id}' not found", status_code=404)

    record["id"] = record.get("_id") or record.get("id")
    return success_response(data=record, message="Analysis detail retrieved successfully")


def delete_analysis_record(analysis_id, current_user):
    record = db_instance.analyses.find_one({"_id": analysis_id}) or db_instance.analyses.find_one({"id": analysis_id})
    if not record:
        return error_response(f"Analysis record with ID '{analysis_id}' not found", status_code=404)

    db_instance.analyses.delete_one({"_id": record["_id"]})
    record["id"] = record.get("_id") or record.get("id")
    return success_response(data=record, message="Analysis record deleted successfully from MongoDB")
