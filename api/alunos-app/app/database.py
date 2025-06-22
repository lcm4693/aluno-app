# app/database.py
import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from .config import Config
from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine
from contextlib import contextmanager

# ✅ 1. Carregamento do .env (apenas em ambiente de desenvolvimento)
APP_ENV = os.getenv("APP_ENV", "dev").lower()
if APP_ENV == "dev":
    load_dotenv()


# ✅ 2. Validação de variáveis de ambiente obrigatórias
def validar_variaveis():
    REQUIRED_ENV_VARS = [
        "DB_HOST",
        "DB_PORT",
        "DB_USER",
        "DB_PASS",
        "DB_NAME",
    ]
    missing = [var for var in REQUIRED_ENV_VARS if not os.getenv(var)]
    if missing:
        raise EnvironmentError(
            f"⚠️ Variáveis de ambiente faltando: {', '.join(missing)}"
        )


# ✅ 3. Montagem da URL de conexão com o banco
DATABASE_URL = (
    f"mysql+mysqlconnector://{Config.DB_USER}:{Config.DB_PASS}"
    f"@{Config.DB_HOST}:{Config.DB_PORT}/{Config.DB_NAME}?charset=utf8mb4"
)

# ✅ 4. Engine e Session do SQLAlchemy
engine = create_engine(DATABASE_URL, echo=False, pool_pre_ping=True)
SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)
Base = declarative_base()


# ✅ 5. Context manager seguro para sessões com o banco
@contextmanager
def get_session():
    session = SessionLocal()
    try:
        yield session
        session.commit()
    except:
        session.rollback()
        raise
    finally:
        session.close()
