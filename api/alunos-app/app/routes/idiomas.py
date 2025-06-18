from flask import Blueprint, request, jsonify, make_response
from app.database import get_db_connection
from app.utils.helpers import remover_acentos
from app.utils.error_handler import handle_errors

idiomas_bp = Blueprint("idiomas", __name__, url_prefix="/api/idiomas")


@idiomas_bp.route("/", methods=["GET"])
@handle_errors
def listar_idiomas():
    conn = get_db_connection()
    conn.create_function("sem_acento", 1, remover_acentos)

    idiomas = conn.execute(
        "SELECT id, nome FROM idiomas ORDER BY sem_acento(nome) COLLATE NOCASE"
    ).fetchall()

    conn.close()

    return jsonify([{"id": row["id"], "nome": row["nome"]} for row in idiomas])


@idiomas_bp.route("/<int:aluno_id>", methods=["PUT"])
@handle_errors
def atualizar_idiomas(aluno_id):
    dados = request.get_json()

    if not isinstance(dados, list):
        return make_response(
            jsonify({"erro": "Dados inválidos. Esperado array de IDs"}), 400
        )

    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute(
            "SELECT id FROM alunos WHERE id = ? AND deletado = 0", (aluno_id,)
        )
        if not cursor.fetchone():
            return make_response(jsonify({"erro": "Aluno não encontrado"}), 404)

        # Remove idiomas antigos
        cursor.execute("DELETE FROM aluno_idioma WHERE aluno_id = ?", (aluno_id,))

        # Adiciona os novos
        for idioma_id in dados:
            cursor.execute(
                "INSERT INTO aluno_idioma (aluno_id, idioma_id) VALUES (?, ?)",
                (aluno_id, idioma_id),
            )

        conn.commit()
        return jsonify({"mensagem": "Idiomas atualizados com sucesso"}), 200

    except Exception as e:
        return make_response(jsonify({"erro": str(e)}), 500)

    finally:
        conn.close()
