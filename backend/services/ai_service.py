import os
import json
from openai import OpenAI
from typing import List, Dict, Any

class AIService:
    def __init__(self):
        self.client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

    def analyze_schema(self, schema: List[Dict[str, Any]]) -> Dict[str, Any]:
        schema_str = json.dumps(schema, indent=2)
        prompt = f"""
        Given the following database schema (table, column, type):
        {schema_str}
        
        Analyze this schema and provide:
        1. 3-5 key KPIs (Key Performance Indicators) that can be derived.
        2. 3-5 important metrics.
        3. 3 sample SQL queries to fetch meaningful data.
        4. Recommended visualizations (bar, line, pie, etc.) for each query.
        
        Respond ONLY in JSON format with the following structure:
        {{
            "kpis": ["KPI 1", "KPI 2"],
            "metrics": ["Metric 1", "Metric 2"],
            "suggestions": [
                {{
                    "title": "Query Title",
                    "sql": "SELECT ...",
                    "visualization": "bar"
                }}
            ]
        }}
        """
        
        try:
            response = self.client.chat.completions.create(
                model="gpt-4o",
                messages=[
                    {"role": "system", "content": "You are a data architect and business intelligence expert."},
                    {"role": "user", "content": prompt}
                ],
                response_format={ "type": "json_object" }
            )
            return json.loads(response.choices[0].message.content)
        except Exception as e:
            print(f"AI analysis error: {e}")
            return {
                "kpis": [],
                "metrics": [],
                "suggestions": []
            }

    def generate_sql(self, schema: List[Dict[str, Any]], user_request: str) -> str:
        schema_str = json.dumps(schema, indent=2)
        prompt = f"""
        Given the following schema:
        {schema_str}
        
        Generate a SQL query for this request: "{user_request}"
        Respond with ONLY the SQL query.
        """
        try:
            response = self.client.chat.completions.create(
                model="gpt-4o",
                messages=[
                    {"role": "system", "content": "You are a SQL expert."},
                    {"role": "user", "content": prompt}
                ]
            )
            return response.choices[0].message.content.strip()
        except Exception as e:
            print(f"SQL generation error: {e}")
            return ""
