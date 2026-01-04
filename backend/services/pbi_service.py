import os
import requests
import msal
from typing import Dict, Any, List

class PBIService:
    def __init__(self):
        self.client_id = os.getenv("PBI_CLIENT_ID")
        self.client_secret = os.getenv("PBI_CLIENT_SECRET")
        self.tenant_id = os.getenv("PBI_TENANT_ID")
        self.authority = f"https://login.microsoftonline.com/{self.tenant_id}"
        self.scope = ["https://analysis.windows.net/powerbi/api/.default"]
        
    def get_auth_url(self, redirect_uri: str) -> str:
        app = msal.ConfidentialClientApplication(
            self.client_id, 
            authority=self.authority,
            client_credential=self.client_secret
        )
        return app.get_authorization_request_url(self.scope, redirect_uri=redirect_uri)

    def get_token_from_code(self, code: str, redirect_uri: str) -> Dict[str, Any]:
        app = msal.ConfidentialClientApplication(
            self.client_id, 
            authority=self.authority,
            client_credential=self.client_secret
        )
        result = app.acquire_token_by_authorization_code(code, scopes=self.scope, redirect_uri=redirect_uri)
        return result

    def create_push_dataset(self, token: str, dataset_name: str, tables: List[Dict[str, Any]]) -> str:
        """
        Creates a push dataset in Power BI.
        tables format: [{"name": "TableName", "columns": [{"name": "Col1", "dataType": "string"}]}]
        """
        url = "https://api.powerbi.com/v1.0/myorg/datasets"
        headers = {
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json"
        }
        payload = {
            "name": dataset_name,
            "defaultMode": "Push",
            "tables": tables
        }
        response = requests.post(url, headers=headers, json=payload)
        if response.status_code == 201:
            return response.json().get("id")
        else:
            print(f"Error creating dataset: {response.text}")
            return ""

    def push_rows(self, token: str, dataset_id: str, table_name: str, rows: List[Dict[str, Any]]):
        url = f"https://api.powerbi.com/v1.0/myorg/datasets/{dataset_id}/tables/{table_name}/rows"
        headers = {
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json"
        }
        payload = {"rows": rows}
        response = requests.post(url, headers=headers, json=payload)
        return response.status_code == 200
