from datetime import datetime, timedelta
from sqlalchemy import (
    Column,
    Integer,
    String,
    Boolean,
    DateTime,
    Text,
    Enum,
    Date,
    ForeignKey,
)
from sqlalchemy.ext.declarative import declarative_base
import enum
from app.utils.date_utils import *
from app.database import Base
from sqlalchemy.orm import relationship


class TipoNotificacao(str, enum.Enum):
    ANIVERSARIO = "BA"
    SEM_ANOTACAO = "SN"
    ANIVERSARIO_AULA = "AA"
    INATIVIDADE = "IN"


class Notificacao(Base):
    __tablename__ = "notificacoes"

    id = Column(Integer, primary_key=True, autoincrement=True)

    id_usuario = Column(Integer, nullable=False, index=True)

    tipo = Column(String(2), nullable=False)

    chave_unica = Column(String(255), nullable=False, index=True)

    titulo = Column(String(200), nullable=True)
    mensagem = Column(Text, nullable=True)

    lida = Column(Boolean, default=False)
    data_evento = Column(Date)
    data_criacao = Column(DateTime, default=datetime.utcnow)
    data_expiracao = Column(Date, default=get_date_in_one_week(datetime.now()))
    data_leitura = Column(DateTime, nullable=True)

    # Novas colunas:
    id_aluno = Column(Integer, ForeignKey("alunos.id"))
    id_aula = Column(Integer, ForeignKey("aula.id"))

    # Relacionamentos opcionais:
    aluno = relationship("app.models.aluno.Aluno", foreign_keys=[id_aluno])
    aula = relationship("app.models.aula.Aula", foreign_keys=[id_aula])

    def __repr__(self):
        return (
            f"<Notificacao(id={self.id}, usuario={self.id_usuario}, tipo={self.tipo}, chave_unica={self.chave_unica},"
            f"titulo='{self.titulo}', mensagem={self.mensagem}, lida={self.lida}, data_criacao={self.data_criacao}, data_leitura={self.data_leitura})>"
        )
