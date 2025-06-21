from sqlalchemy import Column, Integer, String, Date
from app.database import Base


class Usuario(Base):
    __tablename__ = "usuarios"

    id = Column(Integer, primary_key=True, autoincrement=True)
    nome = Column(String(255), nullable=False)
    dataCadastro = Column(Date, nullable=False)
    senha = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    admin = Column(Integer, default=1)
    ativado = Column(Integer, default=1)
