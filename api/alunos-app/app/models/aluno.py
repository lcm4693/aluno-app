# app/models/aluno.py
from sqlalchemy import Column, Integer, String, Text, Enum, ForeignKey, Boolean, Date
from sqlalchemy.orm import relationship
from app.database import Base


class Aluno(Base):
    __tablename__ = "alunos"

    id = Column(Integer, primary_key=True)
    nome = Column(String(255))
    mora = Column(String(255))
    cidade_natal = Column(String(255))
    familia = Column(Text)
    profissao = Column(String(255))
    nivel = Column(Enum("A1", "A2", "B1", "B2", "C1", name="nivel_enum"))
    hobbies = Column(Text)
    idade = Column(Integer)
    pontos = Column(Text)
    link_perfil = Column(Text)
    foto = Column(Text)
    deletado = Column(Boolean, default=False)
    data_primeira_aula = Column(Date)

    id_usuario = Column(Integer, ForeignKey("usuarios.id"))
    id_pais_mora = Column(Integer, ForeignKey("paises.id"))
    id_pais_natal = Column(Integer, ForeignKey("paises.id"))

    # ✅ Relacionamentos
    pais_mora = relationship("app.models.pais.Pais", foreign_keys=[id_pais_mora])
    pais_natal = relationship("app.models.pais.Pais", foreign_keys=[id_pais_natal])
    usuario = relationship("Usuario")
    aulas = relationship("Aula", order_by="desc(Aula.data)")

    def to_dict(self):
        return {
            "id": self.id,
            "nome": self.nome,
            "mora": self.mora,
            "cidade_natal": self.cidade_natal,
            "familia": self.familia,
            "profissao": self.profissao,
            "nivel": self.nivel,
            "hobbies": self.hobbies,
            "idade": self.idade,
            "pontos": self.pontos,
            "link_perfil": self.link_perfil,
            "foto": self.foto,
            "deletado": self.deletado,
            "id_usuario": self.id_usuario,
            "id_pais_mora": self.id_pais_mora,
            "id_pais_natal": self.id_pais_natal,
            "data_primeira_aula": self.data_primeira_aula,
        }
