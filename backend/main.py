import os
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from dotenv import load_dotenv

from backend.services.database import DatabaseService
from backend.services.ai_service import AIService
from backend.services.pbi_service import PBIService

load_dotenv()

app = FastAPI(title="DataBridge AI API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Models
class DBConfig(BaseModel):
    type: str # "postgres" or "snowflake"
    host: Optional[str] = None
    database: str
    user: str
    password: str
    port: Optional[int] = 5432
    account: Optional[str] = None
    warehouse: Optional[str] = None
    schema: Optional[str] = "public"

class SQLRequest(BaseModel):
    schema: List[Dict[str, Any]]
    prompt: str

# Endpoints
@app.post("/test-connection")
async def test_connection(config: DBConfig):
    if config.type == "postgres":
        success = DatabaseService.test_postgres(config.dict())
    elif config.type == "snowflake":
        success = DatabaseService.test_snowflake(config.dict())
    else:
        raise HTTPException(status_code=400, detail="Invalid database type")
    
    return {"success": success}

@app.post("/fetch-schema")
async def fetch_schema(config: DBConfig):
    if config.type == "postgres":
        schema = DatabaseService.get_postgres_schema(config.dict())
    elif config.type == "snowflake":
        schema = DatabaseService.get_snowflake_schema(config.dict())
    else:
        raise HTTPException(status_code=400, detail="Invalid database type")
    
    return {"schema": schema}

@app.post("/analyze-schema")
async def analyze_schema(schema: List[Dict[str, Any]]):
    ai = AIService()
    analysis = ai.analyze_schema(schema)
    return analysis

@app.post("/generate-sql")
async def generate_sql(request: SQLRequest):
    ai = AIService()
    sql = ai.generate_sql(request.schema, request.prompt)
    return {"sql": sql}

@app.get("/pbi-auth-url")
async def get_pbi_auth_url(redirect_uri: str):
    pbi = PBIService()
    return {"url": pbi.get_auth_url(redirect_uri)}

@app.get("/pbi-callback")
async def pbi_callback(code: str, redirect_uri: str):
    pbi = PBIService()
    token_resp = pbi.get_token_from_code(code, redirect_uri)
    return token_resp

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
