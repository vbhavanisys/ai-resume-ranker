# In-memory storage for development before MongoDB integration
import uuid
import datetime

# Mock Users store
USERS_DB = [
    {
        "id": "usr_101",
        "name": "Alex Developer",
        "email": "alex@example.com",
        "password": "password123",  # In real implementation with DB, this will be hashed
        "role": "Senior Frontend Developer",
        "created_at": datetime.datetime.utcnow().isoformat()
    }
]

# Mock Resumes upload store
RESUMES_DB = [
    {
        "id": "res_101",
        "user_id": "usr_101",
        "file_name": "Senior_Frontend_Eng_Alex.pdf",
        "file_size": 245000,
        "mime_type": "application/pdf",
        "extracted_text": "Alex Developer\nSenior Frontend Engineer with 6+ years experience in React, TypeScript, Tailwind CSS, Next.js, Webpack, Node.js, REST APIs, and Jest testing.",
        "uploaded_at": "2026-03-01T10:00:00Z"
    }
]

# Mock Job Descriptions store
JOBS_DB = [
    {
        "id": "job_101",
        "user_id": "usr_101",
        "title": "Senior Frontend Engineer",
        "company": "TechCorp Inc.",
        "description": "Looking for a Senior Frontend Engineer proficient in React, TypeScript, Next.js, Redux, Docker, AWS, GraphQL, and unit testing.",
        "created_at": "2026-03-01T10:05:00Z"
    }
]

# Mock Analysis History store
ANALYSIS_DB = [
    {
        "id": "an_001",
        "user_id": "usr_101",
        "candidateName": "Alex Developer",
        "fileName": "Senior_Frontend_Eng_Alex.pdf",
        "jobTitle": "Senior Frontend Engineer",
        "companyName": "TechCorp Inc.",
        "matchScore": 88,
        "date": "2026-03-01",
        "matchedSkills": ["React", "TypeScript", "Next.js", "REST APIs", "Tailwind CSS"],
        "missingSkills": ["Docker", "AWS", "GraphQL", "Redux"],
        "suggestions": [
          {
            "title": "Highlight Cloud Experience",
            "description": "Add specific instances where you interacted with AWS or containerized applications using Docker."
          },
          {
            "title": "Quantify UI Performance Achievements",
            "description": "Include explicit metrics (e.g., 'Improved lighthouse score by 25%') to strengthen bullet points."
          }
        ],
        "originalBullet": "Built and maintained multiple frontend web applications using React.",
        "optimizedBullet": "Architected and delivered 5+ high-performance React web applications, reducing bundle size by 35% and accelerating load times."
    },
    {
        "id": "an_002",
        "user_id": "usr_101",
        "candidateName": "Alex Developer",
        "fileName": "Alex_Frontend_Dev.docx",
        "jobTitle": "Full Stack Engineer",
        "companyName": "Innovate Analytics",
        "matchScore": 72,
        "date": "2026-02-24",
        "matchedSkills": ["React", "TypeScript", "Node.js", "REST APIs"],
        "missingSkills": ["PostgreSQL", "Python", "Kubernetes", "Redis"],
        "suggestions": [
          {
            "title": "Emphasize Backend Capabilities",
            "description": "Provide details on server-side architecture, ORM experience, and database design."
          }
        ],
        "originalBullet": "Worked on backend Node APIs for data fetching.",
        "optimizedBullet": "Engineered RESTful Node.js APIs serving 100k+ daily active users with robust error handling."
    }
]
