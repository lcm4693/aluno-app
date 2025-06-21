from app.database import get_session
from app.models.aluno import Aluno


def buscar_aluno_basico(aluno_id: int, id_usuario: int):
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
