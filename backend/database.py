import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()

def get_db():
    conn = psycopg2.connect(
        dbname="vigilai",
        user="anyarajesh",
        host="localhost",
        port="5432"
    )
    return conn