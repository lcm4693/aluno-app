# app/config.py

import os
from dotenv import load_dotenv

load_dotenv()  # Carrega o .env automaticamente

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))


class Config:
    UPLOAD_FOLDER = os.path.join(BASE_DIR, "static", "fotos")
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")
    CORS_ORIGINS = os.getenv("CORS_ORIGINS", "").split(",")
    JWT_ACCESS_TOKEN_EXPIRES = 3600
    # DB_PATH = "alunos.db"
    DB_HOST = os.getenv("DB_HOST")
    DB_PORT = os.getenv("DB_PORT")
    DB_USER = os.getenv("DB_USER")
    DB_PASS = os.getenv("DB_PASS")
    DB_NAME = os.getenv("DB_NAME")
