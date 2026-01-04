import psycopg2
import snowflake.connector
from typing import Dict, Any, List

class DatabaseService:
    @staticmethod
    def test_postgres(config: Dict[str, Any]) -> bool:
        try:
            conn = psycopg2.connect(
                host=config.get("host"),
                database=config.get("database"),
                user=config.get("user"),
                password=config.get("password"),
                port=config.get("port", 5432)
            )
            conn.close()
            return True
        except Exception as e:
            print(f"Postgres connection error: {e}")
            return False

    @staticmethod
    def test_snowflake(config: Dict[str, Any]) -> bool:
        try:
            conn = snowflake.connector.connect(
                user=config.get("user"),
                password=config.get("password"),
                account=config.get("account"),
                warehouse=config.get("warehouse"),
                database=config.get("database"),
                schema=config.get("schema")
            )
            conn.close()
            return True
        except Exception as e:
            print(f"Snowflake connection error: {e}")
            return False

    @staticmethod
    def get_postgres_schema(config: Dict[str, Any]) -> List[Dict[str, Any]]:
        try:
            conn = psycopg2.connect(
                host=config.get("host"),
                database=config.get("database"),
                user=config.get("user"),
                password=config.get("password"),
                port=config.get("port", 5432)
            )
            cur = conn.cursor()
            cur.execute("""
                SELECT table_name, column_name, data_type 
                FROM information_schema.columns 
                WHERE table_schema = 'public'
                ORDER BY table_name;
            """)
            rows = cur.fetchall()
            cur.close()
            conn.close()
            
            schema = []
            for row in rows:
                schema.append({
                    "table": row[0],
                    "column": row[1],
                    "type": row[2]
                })
            return schema
        except Exception as e:
            print(f"Postgres schema error: {e}")
            return []

    @staticmethod
    def get_snowflake_schema(config: Dict[str, Any]) -> List[Dict[str, Any]]:
        try:
            conn = snowflake.connector.connect(
                user=config.get("user"),
                password=config.get("password"),
                account=config.get("account"),
                warehouse=config.get("warehouse"),
                database=config.get("database"),
                schema=config.get("schema")
            )
            cur = conn.cursor()
            cur.execute(f"SHOW COLUMNS IN SCHEMA {config.get('database')}.{config.get('schema')}")
            rows = cur.fetchall()
            # row format: [table_name, column_name, data_type, ...]
            # specific index depends on snowflake version but usually:
            # 2: table_name, 3: column_name, 4: data_type
            schema = []
            for row in rows:
                schema.append({
                    "table": row[2],
                    "column": row[3],
                    "type": row[4]
                })
            cur.close()
            conn.close()
            return schema
        except Exception as e:
            print(f"Snowflake schema error: {e}")
            return []
