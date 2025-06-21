# app/models/aluno_idioma.py
from sqlalchemy import Column, Integer, ForeignKey, UniqueConstraint
from app.database import Base


class AlunoIdioma(Base):
    __tablename__ = "aluno_idioma"

    id = Column(Integer, primary_key=True)
    aluno_id = Column(Integer, ForeignKey("alunos.id"), nullable=False)
    idioma_id = Column(Integer, ForeignKey("idiomas.id"), nullable=False)

    __table_args__ = (
        UniqueConstraint("aluno_id", "idioma_id", name="uq_aluno_idioma"),
    )
