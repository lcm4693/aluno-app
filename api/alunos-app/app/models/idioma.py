# app/models/idioma.py
from sqlalchemy import Column, Integer, String
from app.database import Base


class Idioma(Base):
    __tablename__ = "idiomas"

    id = Column(Integer, primary_key=True)
    nome = Column(String(255), nullable=False)
