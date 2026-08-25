import os
import pymongo
import mongomock
from werkzeug.security import generate_password_hash, check_password_hash
import datetime

class MongoDatabase:
    def __init__(self):
        self.client = None
        self.db = None
        self.is_mock = False
        self.collections = {}

    def init_db(self, app):
        mongodb_uri = app.config.get('MONGODB_URI', 'mongodb://localhost:27017/resumerank_db')
        db_name = app.config.get('MONGODB_DB_NAME', 'resumerank_db')

        try:
            # Attempt to connect to real MongoDB with short timeout
            client = pymongo.MongoClient(mongodb_uri, serverSelectionTimeoutMS=2000)
            # Test connection
            client.admin.command('ping')
            self.client = client
            self.db = client[db_name]
            self.is_mock = False
            print(f"✅ Connected to MongoDB at: {mongodb_uri} (Database: {db_name})")
        except Exception as err:
            print(f"⚠️ Real MongoDB connection unavailable ({err}). Falling back to MongoMock in-memory database.")
            self.client = mongomock.MongoClient()
            self.db = self.client[db_name]
            self.is_mock = True

        # Initialize collections
        self.users = self.db['users']
        self.resumes = self.db['resumes']
        self.jobs = self.db['job_descriptions']
        self.analyses = self.db['analyses']

        # Ensure indexes if real mongo
        if not self.is_mock:
            try:
                self.users.create_index('email', unique=True)
            except Exception as e:
                print("Index creation notice:", e)

        # Seed initial sample data if empty
        self._seed_initial_data()

    def _seed_initial_data(self):
        if self.users.count_documents({}) == 0:
            default_user = {
                "_id": "usr_101",
                "name": "Alex Developer",
                "email": "alex@example.com",
                "password": generate_password_hash("password123"),
                "role": "Senior Frontend Developer",
                "createdAt": datetime.datetime.utcnow().isoformat()
            }
            self.users.insert_one(default_user)

        if self.resumes.count_documents({}) == 0:
            default_resume = {
                "_id": "res_101",
                "userId": "usr_101",
                "filename": "Senior_Frontend_Eng_Alex.pdf",
                "extractedText": "Alex Developer\nSenior Frontend Engineer with 6+ years experience in React, TypeScript, Tailwind CSS, Next.js, REST APIs, and Jest.",
                "uploadedAt": "2026-03-01T10:00:00Z"
            }
            self.resumes.insert_one(default_resume)

        if self.jobs.count_documents({}) == 0:
            default_job = {
                "_id": "job_101",
                "userId": "usr_101",
                "jobTitle": "Senior Frontend Engineer",
                "description": "Looking for a Senior Frontend Engineer proficient in React, TypeScript, Next.js, Redux, Docker, AWS, GraphQL, and unit testing.",
                "createdAt": "2026-03-01T10:05:00Z"
            }
            self.jobs.insert_one(default_job)

        if self.analyses.count_documents({}) == 0:
            default_analysis = {
                "_id": "an_001",
                "userId": "usr_101",
                "resumeId": "res_101",
                "jobId": "job_101",
                "candidateName": "Alex Developer",
                "fileName": "Senior_Frontend_Eng_Alex.pdf",
                "jobTitle": "Senior Frontend Engineer",
                "companyName": "TechCorp Inc.",
                "resumeScore": 88,
                "jobMatchPercentage": 88,
                "matchedSkills": ["React", "TypeScript", "Next.js", "REST APIs", "Tailwind CSS"],
                "missingSkills": ["Docker", "AWS", "GraphQL", "Redux"],
                "keywords": ["React", "TypeScript", "Frontend", "UI", "APIs"],
                "strengths": ["Strong TypeScript and React expertise", "Modern component architecture"],
                "weaknesses": ["Limited containerization experience mentioned"],
                "suggestions": [
                    {
                        "title": "Highlight Cloud Experience",
                        "description": "Add specific instances where you interacted with AWS or containerized applications using Docker."
                    }
                ],
                "originalBullet": "Built and maintained multiple frontend web applications using React.",
                "optimizedBullet": "Architected and delivered 5+ high-performance React web applications, reducing bundle size by 35%.",
                "createdAt": "2026-03-01T10:10:00Z"
            }
            self.analyses.insert_one(default_analysis)

db_instance = MongoDatabase()
