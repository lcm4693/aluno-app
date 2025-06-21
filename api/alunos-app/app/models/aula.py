# app/models/aula.py
from sqlalchemy import Column, Integer, Text, Date, ForeignKey
from app.database import Base


class Aula(Base):
    __tablename__ = "aula"

    id = Column(Integer, primary_key=True)
    data = Column(Date, nullable=False)
    anotacoes = Column(Text, nullable=False)
    comentarios = Column(Text)
    proxima_aula = Column(Text)
    aluno_id = Column(Integer, ForeignKey("alunos.id"), nullable=False)
