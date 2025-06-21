# app/routes/aulas.py

from flask import Blueprint, request, jsonify
from app.database_old import get_db_connection
from app.services.aula_service import listar_aulas_do_aluno, criar_aula_para_aluno
from app.utils.error_handler import handle_errors
from flask_jwt_extended import jwt_required, get_jwt_identity


aulas_bp = Blueprint("aulas", __name__, url_prefix="/api/aulas")


@aulas_bp.route("/<int:aluno_id>", methods=["GET"])
@handle_errors
@jwt_required()
def buscar_aulas_do_aluno(aluno_id):
    id_usuario = get_jwt_identity()
    resultado, erro = listar_aulas_do_aluno(aluno_id, id_usuario)

    if erro:
        return jsonify({"erro": erro}), 404

    return jsonify(resultado), 200


@aulas_bp.route("/<int:aluno_id>", methods=["POST"])
@handle_errors
@jwt_required()
def criar_aula(aluno_id):
    id_usuario = get_jwt_identity()
    dados = request.get_json()
    aula_id, erro = criar_aula_para_aluno(aluno_id, dados, id_usuario)
    if erro:
        return jsonify({"erro": erro}), 500 if aula_id is None else 404

    return jsonify({"id": aula_id, "mensagem": "Aula criada com sucesso"}), 201
