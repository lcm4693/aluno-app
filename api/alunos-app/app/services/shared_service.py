from app.database import get_session
from app.models.aluno import Aluno
from sqlalchemy.orm import load_only


def retornar_id_aluno_banco(aluno_id: int, id_usuario: int):
    with get_session() as session:
        aluno = (
            session.query(Aluno)
            .filter(
                Aluno.id == aluno_id,
                Aluno.id_usuario == id_usuario,
                Aluno.deletado == False,
            )
            .first()
        )

        return aluno  # pode ser None se não encontrado
