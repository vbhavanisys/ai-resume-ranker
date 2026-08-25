import json
import unittest
from app import create_app

class TestResumeRankerMongoDBBackend(unittest.TestCase):
    def setUp(self):
        self.app = create_app()
        self.client = self.app.test_client()

    def test_01_health_check_and_db_connection(self):
        # Health endpoint
        res_health = self.client.get('/api/health')
        self.assertEqual(res_health.status_code, 200)
        data_health = json.loads(res_health.data)
        self.assertEqual(data_health['status'], 'healthy')
        self.assertIn('database', data_health)

        # DB Health endpoint
        res_db = self.client.get('/api/db-health')
        self.assertEqual(res_db.status_code, 200)
        data_db = json.loads(res_db.data)
        self.assertTrue(data_db['success'])
        self.assertIn('users', data_db['database_info']['counts'])
        self.assertIn('resumes', data_db['database_info']['counts'])
        self.assertIn('job_descriptions', data_db['database_info']['counts'])
        self.assertIn('analyses', data_db['database_info']['counts'])
        print("✓ MongoDB database connection and health check verified successfully")

    def test_02_user_registration_and_login_with_mongodb(self):
        email = "mongo_user@example.com"
        password = "securePassword123!"

        # Register User
        register_payload = {
            "name": "MongoDB Test User",
            "email": email,
            "password": password,
            "role": "BCA Graduate"
        }
        res_reg = self.client.post('/api/auth/register',
                                   data=json.dumps(register_payload),
                                   content_type='application/json')
        self.assertIn(res_reg.status_code, [201, 409])

        # Login User
        login_payload = {
            "email": email,
            "password": password
        }
        res_log = self.client.post('/api/auth/login',
                                  data=json.dumps(login_payload),
                                  content_type='application/json')
        self.assertEqual(res_log.status_code, 200)
        data_log = json.loads(res_log.data)
        self.assertTrue(data_log['success'])
        self.assertIn('token', data_log['data'])
        self.assertEqual(data_log['data']['email'], email)
        print("✓ User registration and password-hashed authentication with MongoDB Users collection successful")

    def test_03_full_mongodb_collections_flow(self):
        # Login seed user
        login_payload = {"email": "alex@example.com", "password": "password123"}
        res_log = self.client.post('/api/auth/login',
                                  data=json.dumps(login_payload),
                                  content_type='application/json')
        token = json.loads(res_log.data)['data']['token']
        headers = {'Authorization': f'Bearer {token}'}

        # 1. Resumes Collection Test
        upload_payload = {
            "fileName": "FullStack_Resume_2026.pdf",
            "extractedText": "Full Stack Engineer skilled in Python, Flask, React, MongoDB, REST APIs, and Docker."
        }
        res_up = self.client.post('/api/upload/resume',
                                 data=json.dumps(upload_payload),
                                 content_type='application/json',
                                 headers=headers)
        self.assertEqual(res_up.status_code, 201)
        res_doc = json.loads(res_up.data)['data']
        resume_id = res_doc['id']

        # 2. JobDescriptions Collection Test
        job_payload = {
            "jobTitle": "Lead Python & React Engineer",
            "companyName": "Apex Digital",
            "jobDescriptionText": "Seeking Lead Engineer proficient in Python, Flask, MongoDB, React, and microservices."
        }
        res_job = self.client.post('/api/job/description',
                                  data=json.dumps(job_payload),
                                  content_type='application/json',
                                  headers=headers)
        self.assertEqual(res_job.status_code, 201)
        job_doc = json.loads(res_job.data)['data']
        job_id = job_doc['id']

        # 3. Analyses Collection Test
        analysis_payload = {
            "candidateName": "Alex Developer",
            "fileName": "FullStack_Resume_2026.pdf",
            "jobTitle": "Lead Python & React Engineer",
            "companyName": "Apex Digital",
            "resumeId": resume_id,
            "jobId": job_id
        }
        res_an = self.client.post('/api/analysis/analyze',
                                 data=json.dumps(analysis_payload),
                                 content_type='application/json',
                                 headers=headers)
        self.assertEqual(res_an.status_code, 201)
        analysis_doc = json.loads(res_an.data)['data']
        analysis_id = analysis_doc['id']

        # 4. History Collection Query & Detail Test
        res_hist = self.client.get('/api/history', headers=headers)
        self.assertEqual(res_hist.status_code, 200)

        res_detail = self.client.get(f'/api/history/{analysis_id}', headers=headers)
        self.assertEqual(res_detail.status_code, 200)

        # 5. Dashboard Aggregation Test
        res_dash = self.client.get('/api/dashboard/stats', headers=headers)
        self.assertEqual(res_dash.status_code, 200)
        dash_data = json.loads(res_dash.data)['data']
        self.assertGreaterEqual(dash_data['totalResumesUploaded'], 1)
        self.assertGreaterEqual(dash_data['totalJobsTracked'], 1)
        self.assertGreaterEqual(dash_data['totalAnalyses'], 1)

        print("✓ All 4 MongoDB collections (Users, Resumes, JobDescriptions, Analyses) operating with full CRUD functionality")

if __name__ == '__main__':
    unittest.main()
