# app/config.py

import os

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))


class Config:
    DB_PATH = "alunos.db"
    UPLOAD_FOLDER = os.path.join(BASE_DIR, "static", "fotos")
