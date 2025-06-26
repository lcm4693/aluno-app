# app/database.py
import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from .config import Config
from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine
from contextlib import contextmanager
from sqlalchemy.pool import QueuePool  # explícito

# ✅ 1. Carregamento do .env (apenas em ambiente de desenvolvimento)
APP_ENV = os.getenv("APP_ENV", "dev").lower()
if APP_ENV == "dev":
    load_dotenv()


# ✅ 3. Montagem da URL de conexão com o banco
DATABASE_URL = (
    f"mysql+mysqldb://{Config.DB_USER}:{Config.DB_PASS}"
    f"@{Config.DB_HOST}:{Config.DB_PORT}/{Config.DB_NAME}?charset=utf8mb4"
)

# ✅ 4. Engine e Session do SQLAlchemy
engine = create_engine(
    DATABASE_URL,
    echo=False,  # imprime as queries executadas
    pool_pre_ping=True,
    poolclass=QueuePool,
    pool_size=5,  # número de conexões persistentes no pool
    max_overflow=10,  # quantas extras ele pode abrir temporariamente
    pool_timeout=30,  # tempo em segundos para esperar uma conexão do pool)
)
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
