# app/services/aula_service.py

from app.database import get_session
from app.services.shared_service import retornar_id_aluno_banco
from app.models.aula import Aula
from app.models.aluno import Aluno
from datetime import datetime
import time
from app.utils.logger_config import configurar_logger
from app.utils.date_utils import converter_data_para_front, converter_data_para_banco

logger = configurar_logger(__name__)


def listar_aulas_do_usuario(id_usuario):
    with get_session() as session:
        # Busca as aulas do usuario
        aulas = (
            session.query(
                Aula.id, Aula.data, Aula.aluno_id, Aluno.nome.label("nomeAluno")
            )
            .join(Aluno)
            .filter(Aluno.id_usuario == id_usuario, Aluno.deletado == False)
            .order_by(Aula.data.desc())
            .all()
        )

        return [
            {
                "id": aula.id,
                "dataAula": converter_data_para_front(aula.data),
                "aluno_id": aula.aluno_id,
                "nomeAluno": aula.nomeAluno,
            }
            for aula in aulas
        ], None


def listar_aulas_do_aluno(aluno_id, id_usuario):
    with get_session() as session:
        # Verifica se o aluno existe e não está deletado
        aluno = retornar_id_aluno_banco(aluno_id, id_usuario)
        if not aluno:
            return "Aluno não encontrado", 404

        # Busca as aulas do aluno
        aulas = (
            session.query(Aula)
            .filter(Aula.aluno_id == aluno_id)
            .order_by(Aula.data.desc())
            .all()
        )

        return [
            {
                "id": aula.id,
                "dataAula": aula.data,
                "anotacoes": aula.anotacoes,
                "comentarios": aula.comentarios,
                "proxima_aula": aula.proxima_aula,
            }
            for aula in aulas
        ], None


def criar_aula_para_aluno(aluno_id, dados, usuario_id):
    try:
        with get_session() as session:
            # Verifica se o aluno pertence ao usuário e não está deletado
            aluno = retornar_id_aluno_banco(aluno_id, usuario_id)
            if not aluno:
                return None, "Aluno não encontrado"

            nova_aula = Aula(
                data=converter_data_para_banco(dados.get("dataAula")),
                anotacoes=dados.get("anotacoes"),
                comentarios=dados.get("comentarios"),
                proxima_aula=dados.get("proximaAula"),
                aluno_id=aluno_id,
            )

            session.add(nova_aula)
            session.flush()  # Garante que nova_aula.id esteja disponível

            return nova_aula.id, None

    except Exception as e:
        return None, str(e)


def atualizar_aula_para_aluno(aluno_id, aula_id, usuario_id, dados):
    start = time.time()

    try:
        with get_session() as session:
            # Verifica se o aluno pertence ao usuário e não está deletado
            aluno = retornar_id_aluno_banco(aluno_id, usuario_id)
            logger.debug(f"Tempo busca aluno: {time.time() - start:.3f} segundos")
            start = time.time()

            if not aluno:
                return None, "Aluno não encontrado"

            aula = buscar_aula_aluno(aluno_id, aula_id)
            logger.debug(f"Tempo busca aula: {time.time() - start:.3f} segundos")
            start = time.time()
            if not aula:
                return None, "Aula não encontrada"

            aula.data = converter_data_para_banco(dados.get("dataAula"))
            aula.anotacoes = dados.get("anotacoes")
            aula.comentarios = dados.get("comentarios")
            aula.proxima_aula = dados.get("proximaAula")

            logger.debug(f"Tempo conversão: {time.time() - start:.3f} segundos")
            start = time.time()
            session.add(aula)
            logger.debug(f"Tempo add: {time.time() - start:.3f} segundos")
            start = time.time()
            session.flush()  # Garante que nova_aula.id esteja disponível
            logger.debug(f"Tempo flush: {time.time() - start:.3f} segundos")

            return aula.id, None

    except Exception as e:
        return None, str(e)


def buscar_aula_aluno(aluno_id, aula_id):
    with get_session() as session:
        aula = (
            session.query(Aula)
            .filter(Aula.aluno_id == aluno_id, Aula.id == aula_id)
            .first()
        )

        return aula


def buscar_aulas_sem_anotacoes(id_usuario, page, page_size):
    with get_session() as session:

        offset = (page - 1) * page_size

        aulas_sem_anotacao = (
            session.query(Aula.id, Aula.data, Aluno.nome, Aula.aluno_id)
            .join(Aluno, Aula.aluno_id == Aluno.id)
            .filter(Aluno.deletado == False)
            .filter(Aluno.id_usuario == id_usuario)
            .filter(Aula.anotacoes == None)
            .order_by(Aula.data.desc())
            .offset(offset)
            .limit(page_size)
            .all()
        )

        lista = [
            {
                "idAluno": aula.aluno_id,
                "dataAula": aula.data,
                "idAula": aula.id,
                "nomeAluno": aula.nome,
            }
            for aula in aulas_sem_anotacao
        ]

        return lista
