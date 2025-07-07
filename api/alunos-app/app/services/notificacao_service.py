# app/services/notificacao_service.py

from app.utils.logger_config import configurar_logger
from app.database import get_session
from app.models.notificacao import Notificacao
from app.utils.helpers import *
from app.models.notificacao import *
from sqlalchemy.orm import joinedload

logger = configurar_logger(__name__)


def buscar_todas_notificacoes_usuario(id_usuario, tipo_notificacao: TipoNotificacao):
    hoje = date.today()

    with get_session() as session:
        notificacoes_aluno = (
            session.query(Notificacao)
            .filter(Notificacao.id_usuario == id_usuario)
            .filter(Notificacao.tipo == tipo_notificacao)
            .filter(Notificacao.lida == False)
            # .filter(Notificacao.data_expiracao >= hoje)  # só notificações ainda válidas
            .order_by(Notificacao.data_criacao.desc())
            .all()
        )

        # lista = [model_to_dict(notificacao) for notificacao in notificacoes_aluno]
        lista = [model_to_dict(notificacao) for notificacao in notificacoes_aluno]

        return lista


def criar_notificacoes_em_lote(notificacoes):
    with get_session() as session:
        session.add_all(notificacoes)
        session.commit()


def buscar_notificacoes_nao_lidas(id_usuario: int, tipo: str):
    limite = 10
    with get_session() as session:
        notificacoes_aluno = (
            session.query(Notificacao)
            .filter(
                Notificacao.id_usuario == id_usuario,
                Notificacao.tipo == tipo,
                Notificacao.lida == False,
                Notificacao.data_expiracao >= date.today(),
            )
            .options(
                joinedload(Notificacao.aluno),
                joinedload(Notificacao.aula),
            )
            .order_by(Notificacao.data_evento.desc())
            .limit(limite)
            .all()
        )

        session.expunge_all()  # desconecta mas mantém os dados carregados

        lista = notificacoes_aluno

        return lista
