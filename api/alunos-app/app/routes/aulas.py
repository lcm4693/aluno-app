# app/routes/aulas.py

from flask import Blueprint, request, jsonify
from app.database import get_db_connection
from app.services.aula_service import listar_aulas_do_aluno, criar_aula_para_aluno
from app.utils.error_handler import handle_errors

aulas_bp = Blueprint("aulas", __name__, url_prefix="/api/aulas")


@aulas_bp.route("/<int:aluno_id>", methods=["POST"])
@handle_errors
def criar_aula(aluno_id):
    dados = request.get_json()

    data_aula = dados.get("dataAula")
    anotacoes = dados.get("anotacoes")
    comentarios = dados.get("comentarios")
    proxima_aula = dados.get("proximaAula")

    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        # Verifica se o aluno existe
        cursor.execute(
            "SELECT id FROM alunos WHERE id = ? AND deletado = 0", (aluno_id,)
        )
        if not cursor.fetchone():
            return jsonify({"erro": "Aluno não encontrado"}), 404

        # Cria nova aula
        cursor.execute(
            """
            INSERT INTO aula (data, anotacoes, comentarios, proxima_aula, aluno_id)
            VALUES (?, ?, ?, ?, ?)
            """,
            (data_aula, anotacoes, comentarios, proxima_aula, aluno_id),
        )

        conn.commit()
        return jsonify({"mensagem": "Aula criada com sucesso"}), 201

    except Exception as e:
        conn.rollback()
        return jsonify({"erro": str(e)}), 500

    finally:
        conn.close()


@aulas_bp.route("/<int:aluno_id>", methods=["GET"])
@handle_errors
def listar_aulas_do_aluno(aluno_id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute(
            "SELECT id FROM alunos WHERE id = ? AND deletado = 0", (aluno_id,)
        )
        if not cursor.fetchone():
            return jsonify({"erro": "Aluno não encontrado"}), 404

        cursor.execute(
            """
            SELECT id, data, anotacoes, comentarios, proxima_aula
            FROM aula
            WHERE aluno_id = ?
            ORDER BY data DESC
            """,
            (aluno_id,),
        )

        aulas = cursor.fetchall()
        conn.close()

        return jsonify(
            [
                {
                    "id": aula["id"],
                    "dataAula": aula["data"],
                    "anotacoes": aula["anotacoes"],
                    "comentarios": aula["comentarios"],
                    "proxima_aula": aula["proxima_aula"],
                }
                for aula in aulas
            ]
        )

    except Exception as e:
        return jsonify({"erro": str(e)}), 500


@aulas_bp.route("/<int:aluno_id>", methods=["GET"])
@handle_errors
def get_aulas(aluno_id):
    aulas, erro = listar_aulas_do_aluno(aluno_id)
    if erro:
        return jsonify({"erro": erro}), 404
    return jsonify(aulas)


@aulas_bp.route("/<int:aluno_id>", methods=["POST"])
@handle_errors
def post_aula(aluno_id):
    dados = request.get_json()
    aula_id, erro = criar_aula_para_aluno(aluno_id, dados)

    if erro:
        return jsonify({"erro": erro}), 500 if aula_id is None else 404

    return jsonify({"id": aula_id, "mensagem": "Aula criada com sucesso"}), 201
