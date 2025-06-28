# app/config.py

import os
from dotenv import load_dotenv
from datetime import timedelta

load_dotenv()  # Carrega o .env automaticamente

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))


class Config:
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")
    CORS_ORIGINS = os.getenv("CORS_ORIGINS", "").split(",")
    LOG_LEVEL = os.getenv("LOG_LEVEL")
    #### Banco
    DB_HOST = os.getenv("DB_HOST")
    DB_PORT = os.getenv("DB_PORT")
    DB_USER = os.getenv("DB_USER")
    DB_PASS = os.getenv("DB_PASS")
    DB_NAME = os.getenv("DB_NAME")
    #### TOKEN JWT
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(minutes=30)
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(hours=6)
    #### S3
    AWS_ACCESS_KEY_ID = os.getenv("AWS_ACCESS_KEY_ID")
    AWS_SECRET_ACCESS_KEY = os.getenv("AWS_SECRET_ACCESS_KEY")
    AWS_S3_BUCKET = os.getenv("AWS_S3_BUCKET")
    AWS_S3_REGION = os.getenv("AWS_S3_REGION")
    AWS_S3_PASTA = os.getenv("AWS_S3_PASTA")


# ✅ 2. Validação de variáveis de ambiente obrigatórias
def validar_variaveis():
    REQUIRED_ENV_VARS = [
        "JWT_SECRET_KEY",
        "CORS_ORIGINS",
        "LOG_LEVEL",
        "DB_HOST",
        "DB_PORT",
        "DB_USER",
        "DB_PASS",
        "DB_NAME",
        # "JWT_ACCESS_TOKEN_EXPIRES",
        # "JWT_REFRESH_TOKEN_EXPIRES",
        "AWS_ACCESS_KEY_ID",
        "AWS_SECRET_ACCESS_KEY",
        "AWS_S3_BUCKET",
        "AWS_S3_REGION",
        "AWS_S3_PASTA",
    ]
    missing = [var for var in REQUIRED_ENV_VARS if not os.getenv(var)]
    if missing:
        raise EnvironmentError(
            f"⚠️ Variáveis de ambiente faltando: {', '.join(missing)}"
        )
