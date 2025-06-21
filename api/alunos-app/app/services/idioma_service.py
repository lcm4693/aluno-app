# from flask import jsonify, make_response
# from app.utils.helpers import remover_acentos
from app.models.idioma import Idioma
from app.models.aluno_idioma import AlunoIdioma
from app.database import get_session
from sqlalchemy.exc import SQLAlchemyError
from app.services.shared_service import buscar_aluno_basico


def buscar_todos_idiomas():
    with get_session() as session:
        idiomas = session.query(Idioma).order_by(Idioma.nome.asc()).all()
        return [{"id": i.id, "nome": i.nome} for i in idiomas]


def buscar_idiomas_aluno(aluno_id):
    with get_session() as session:
        resultados = (
            session.query(Idioma)
            .join(AlunoIdioma, Idioma.id == AlunoIdioma.idioma_id)
            .filter(AlunoIdioma.aluno_id == aluno_id)
            .order_by(Idioma.nome.asc())
            .all()
        )

        return [{"id": i.id, "nome": i.nome} for i in resultados]


def atualizar_idiomas_banco(aluno_id, dados, id_usuario):
    try:
        with get_session() as session:
            aluno = buscar_aluno_basico(aluno_id, id_usuario)

            if not aluno:
                return {"erro": "Aluno não encontrado"}, 404

            # Remove os idiomas antigos
            session.query(AlunoIdioma).filter(AlunoIdioma.aluno_id == aluno_id).delete()

            # Insere os novos idiomas
            for idioma in dados:
                novo = AlunoIdioma(aluno_id=aluno_id, idioma_id=idioma["id"])
                session.add(novo)

            return None, 200

    except SQLAlchemyError as e:
        return {"erro": str(e)}, 500
