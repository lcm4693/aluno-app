# app/config.py

import os
from dotenv import load_dotenv

load_dotenv()  # Carrega o .env automaticamente

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))


class Config:
    DB_PATH = "alunos.db"
    UPLOAD_FOLDER = os.path.join(BASE_DIR, "static", "fotos")
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")
    CORS_ORIGINS = os.getenv("CORS_ORIGINS", "").split(",")
    JWT_ACCESS_TOKEN_EXPIRES = 3600
