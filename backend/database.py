import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()

def get_db():
    database_url = os.getenv("DATABASE_URL")
    
    if database_url:
        # Production - use DATABASE_URL from environment
        conn = psycopg2.connect(database_url)
    else:
        # Local development fallback
        conn = psycopg2.connect(
            dbname="vigilai",
            user="anyarajesh",
            host="localhost",
            port="5432"
        )
    return conn