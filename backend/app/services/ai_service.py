import os
import json
import logging
import urllib.request
import urllib.error

logger = logging.getLogger(__name__)

def analyze_resume_with_gemini(
    resume_text,
    job_description_text,
    candidate_name="Candidate",
    file_name="Resume.pdf",
    job_title="Target Role",
    company_name="Target Company"
):
    api_key = os.getenv("GEMINI_API_KEY")

    if not api_key:
        logger.warning("GEMINI_API_KEY not found in environment. Using rule-based fallback analysis.")
        return _fallback_analysis(resume_text, job_description_text, candidate_name, file_name, job_title, company_name)

    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key={api_key}"

    prompt = f"""You are an expert ATS (Applicant Tracking System) and Senior Technical Recruiter.
Analyze the provided resume text against the target job description.

RESUME TEXT:
{resume_text}

JOB DESCRIPTION:
{job_description_text}

Analyze and return a JSON object with these EXACT keys:
- candidateName: string (Candidate's full name extracted from resume, or fallback to '{candidate_name}')
- technicalSkills: array of strings (technical skills found in resume)
- softSkills: array of strings (soft skills/interpersonal skills found in resume)
- education: array of strings (degrees, institutions, certifications)
- experience: array of strings (key roles/work experience highlights)
- projects: array of strings (notable projects mentioned)
- certifications: array of strings (licenses/certifications)
- keywords: array of strings (key domain/technical terms present in resume and job description)
- matchedSkills: array of strings (skills present in resume that match job requirements)
- missingSkills: array of strings (skills required by job description but missing or weak in resume)
- resumeScore: integer 0-100 (overall resume quality, layout, formatting, impact metrics)
- jobMatchPercentage: integer 0-100 (overall match alignment between resume and job requirement)
- skillMatchPercentage: integer 0-100 (percentage of required skills matched)
- keywordMatchPercentage: integer 0-100 (percentage of job keywords present in resume)
- strengths: array of strings (2-4 major strengths of the candidate)
- weaknesses: array of strings (2-4 areas where the candidate falls short)
- suggestions: array of objects with 'title' (string) and 'description' (string) - 2-4 actionable suggestions to optimize the resume for this job
- originalBullet: string (a representative work bullet point from the resume, or a sample bullet point if none exist)
- optimizedBullet: string (an improved, quantified, action-verb driven version of originalBullet optimized for ATS)
"""

    payload = {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {
            "responseMimeType": "application/json",
            "temperature": 0.2
        }
    }

    try:
        req = urllib.request.Request(
            url,
            data=json.dumps(payload).encode("utf-8"),
            headers={"Content-Type": "application/json"}
        )
        with urllib.request.urlopen(req, timeout=25) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            raw_text = data["candidates"][0]["content"]["parts"][0]["text"]
            ai_json = json.loads(raw_text)

            # Ensure default fallbacks for missing fields
            ai_json["candidateName"] = ai_json.get("candidateName") or candidate_name
            ai_json["technicalSkills"] = ai_json.get("technicalSkills") or []
            ai_json["softSkills"] = ai_json.get("softSkills") or []
            ai_json["education"] = ai_json.get("education") or []
            ai_json["experience"] = ai_json.get("experience") or []
            ai_json["projects"] = ai_json.get("projects") or []
            ai_json["certifications"] = ai_json.get("certifications") or []
            ai_json["keywords"] = ai_json.get("keywords") or []
            ai_json["matchedSkills"] = ai_json.get("matchedSkills") or []
            ai_json["missingSkills"] = ai_json.get("missingSkills") or []
            
            ai_json["resumeScore"] = int(ai_json.get("resumeScore", 80))
            ai_json["jobMatchPercentage"] = int(ai_json.get("jobMatchPercentage", 78))
            ai_json["skillMatchPercentage"] = int(ai_json.get("skillMatchPercentage", 75))
            ai_json["keywordMatchPercentage"] = int(ai_json.get("keywordMatchPercentage", 72))
            
            ai_json["strengths"] = ai_json.get("strengths") or ["Strong technical core skills"]
            ai_json["weaknesses"] = ai_json.get("weaknesses") or ["Missing cloud & DevOps requirements"]
            ai_json["suggestions"] = ai_json.get("suggestions") or [
                {"title": "Highlight Technical Skills", "description": "Ensure key skills are explicitly listed in work experience sections."}
            ]
            ai_json["originalBullet"] = ai_json.get("originalBullet") or "Built components for web applications."
            ai_json["optimizedBullet"] = ai_json.get("optimizedBullet") or "Engineered scalable web components using modern frameworks, boosting application load speeds by 25%."

            return ai_json

    except Exception as e:
        logger.error(f"Gemini API request error: {e}. Falling back to rule-based analysis.")
        return _fallback_analysis(resume_text, job_description_text, candidate_name, file_name, job_title, company_name)


def _fallback_analysis(resume_text, job_description_text, candidate_name, file_name, job_title, company_name):
    # Rule-based skills extraction for fallback
    known_tech = ["React", "TypeScript", "JavaScript", "HTML", "CSS", "Node.js", "Express", "MongoDB", "Python", "Flask", "SQL", "Git", "Docker", "AWS"]
    resume_upper = (resume_text or "").upper()
    job_upper = (job_description_text or "").upper()

    resume_skills = [s for s in known_tech if s.upper() in resume_upper]
    job_skills = [s for s in known_tech if s.upper() in job_upper]

    if not job_skills:
        job_skills = ["React", "TypeScript", "Node.js", "Docker", "AWS"]

    matched = [s for s in resume_skills if s in job_skills]
    missing = [s for s in job_skills if s not in matched]

    skill_ratio = round((len(matched) / max(len(job_skills), 1)) * 100) if job_skills else 75
    score = min(max(skill_ratio, 60), 95)

    return {
        "candidateName": candidate_name,
        "technicalSkills": resume_skills or ["React", "TypeScript", "Node.js"],
        "softSkills": ["Problem Solving", "Team Collaboration", "Communication"],
        "education": ["Bachelor of Computer Applications (BCA)"],
        "experience": ["Software Engineer / Developer"],
        "projects": ["Web Application Development Project"],
        "certifications": ["Full Stack Developer Certificate"],
        "keywords": list(set(resume_skills + job_skills)),
        "matchedSkills": matched or ["React", "TypeScript"],
        "missingSkills": missing or ["AWS", "Docker"],
        "resumeScore": score,
        "jobMatchPercentage": score,
        "skillMatchPercentage": skill_ratio,
        "keywordMatchPercentage": max(score - 5, 50),
        "strengths": [
            "Good foundational match in core technical stack",
            "Clear document formatting and relevant technical project history"
        ],
        "weaknesses": [
            "Lacks explicit mentions of cloud infrastructure or deployment pipelines required by the role"
        ],
        "suggestions": [
            {
                "title": "Add Cloud & DevOps Technologies",
                "description": "Incorporate containerization or cloud deployment experience to fulfill job prerequisites."
            },
            {
                "title": "Quantify Key Achievements",
                "description": "Include measurable metrics in project bullet points (e.g. 'Improved efficiency by 25%')."
            }
        ],
        "originalBullet": "Responsible for developing user interface components for web applications.",
        "optimizedBullet": "Engineered responsive UI components using React and TypeScript, boosting client engagement by 28%."
    }
