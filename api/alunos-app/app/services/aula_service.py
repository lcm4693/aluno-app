# app/services/aula_service.py

from app.database import get_session
from app.services.shared_service import buscar_aluno_basico
from app.models.aula import Aula
from datetime import datetime


def listar_aulas_do_aluno(aluno_id, id_usuario):
    with get_session() as session:
        # Verifica se o aluno existe e não está deletado
        aluno = buscar_aluno_basico(aluno_id, id_usuario)
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
            aluno = buscar_aluno_basico(aluno_id, usuario_id)
            if not aluno:
                return None, "Aluno não encontrado"

            data_convertida = datetime.fromisoformat(
                dados.get("dataAula").replace("Z", "+00:00")
            ).date()

            nova_aula = Aula(
                data=data_convertida,
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
