# DataBridge AI

An AI-powered connector that links Snowflake or PostgreSQL to Power BI for seamless visualization.

## Tech Stack
- **Frontend**: React, Tailwind CSS, Framer Motion, Lucide React
- **Backend**: FastAPI, Pydantic, SQLAlchemy/Snowflake Connector
- **Auth**: OAuth 2.0 (Microsoft Entra ID)
- **AI**: OpenAI GPT-4o for Schema analysis and SQL generation

## Features
- **Modern Landing Page**: Clean SaaS UI with smooth animations.
- **Secure Connector**: Input credentials for Snowflake or PostgreSQL.
- **AI Intelligence**: Automatic schema introspection, KPI suggestions, and SQL generation.
- **Power BI Integration**: OAuth-based login and REST API integration to push data.

## Setup Instructions

### Backend
1. Navigate to `backend` folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Set up environment variables in `.env` (root directory):
   ```env
   OPENAI_API_KEY=your_key
   PBI_CLIENT_ID=your_id
   PBI_CLIENT_SECRET=your_secret
   PBI_TENANT_ID=your_tenant_id
   ```
4. Run the server:
   ```bash
   uvicorn main:app --reload
   ```

### Frontend
1. Navigate to `frontend` folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```

## Deployment on Vercel

This project is configured for a seamless monorepo deployment on Vercel.

1.  **Connect to GitHub**: Push your code to a GitHub repository.
2.  **Import to Vercel**: Create a new project in Vercel and select the repository.
3.  **Framework Preset**: Select **Other** (Vercel will detect `vercel.json`).
4.  **Environment Variables**: Add the following in Vercel Project Settings:
    *   `OPENAI_API_KEY`
    *   `PBI_CLIENT_ID`
    *   `PBI_CLIENT_SECRET`
    *   `PBI_TENANT_ID`
5.  **Deploy**: Vercel will build the React frontend and deploy the FastAPI backend as Serverless Functions.
