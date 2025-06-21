from sqlalchemy import Column, Integer, String
from app.database import Base


class Pais(Base):
    __tablename__ = "paises"

    id = Column(Integer, primary_key=True)
    nome = Column(String(255), nullable=False)
