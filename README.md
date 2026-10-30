# Resume_Analyser_using_AI


# Resume Analyser using AI

A full-stack web app that compares your resume with a job description and your self description, then tells you how well you fit the role and how to prepare.

## Features
- Register and log in (protected routes)
- Upload a resume (PDF), paste a job description, and describe yourself
- AI-generated match score (0-100)
- Skill gaps with severity levels
- Technical and behavioural interview questions with what to cover
- A day-by-day preparation plan
- Reports saved to your account and reopened later

## Tech Stack
- **Frontend:** React, Tailwind CSS, React Router, Context API
- **Backend:** Node.js, Express
- **Database:** MongoDB with Mongoose
- **AI:** Google Gemini API
- **Other:** JWT cookie authentication, Multer (file upload), pdf-parse

## How It Works
1. The user submits a resume PDF, a job description and a self description.
2. The backend extracts the resume text and sends everything to the AI.
3. The AI returns a structured report, which is saved in MongoDB.
4. The frontend shows the report on the result page.

## Setup

### 1. Clone the repo
    git clone https://github.com/Bhupanshu/Resume_Analyser_using_AI.git
    cd Resume_Analyser_using_AI

### 2. Backend
    cd backend
    npm install

Create a `.env` file in `backend/`:

    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_secret
    GOOGLE_GENAI_API_KEY=your_api_key

Start the server (runs on port 3000):

    npm start

### 3. Frontend
    cd project_frontend
    npm install
    npm run dev

Open the URL shown in the terminal (usually http://localhost:5173).

## Screenshots
_Add screenshots of the login, input and result pages here._

## Author
Bhupanshu
