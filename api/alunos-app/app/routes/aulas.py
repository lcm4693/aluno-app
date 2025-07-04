# app/routes/aulas.py

from flask import Blueprint, request, jsonify
from app.services.aula_service import (
    listar_aulas_do_aluno,
    criar_aula_para_aluno,
    atualizar_aula_para_aluno,
    listar_aulas_do_usuario,
)
from app.utils.error_handler import handle_errors
from flask_jwt_extended import jwt_required, get_jwt_identity
import time
from app.utils.logger_config import configurar_logger

logger = configurar_logger(__name__)

aulas_bp = Blueprint("aulas", __name__, url_prefix="/api/aulas")


@aulas_bp.route("/", methods=["GET"])
@handle_errors
@jwt_required()
def buscar_aulas_do_usuario():
    id_usuario = get_jwt_identity()
    resultado, erro = listar_aulas_do_usuario(id_usuario)

    if erro:
        return jsonify({"erro": erro}), 404

    return jsonify(resultado), 200


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
    logger.debug("Entrada:", dados)
    aula_id, erro = criar_aula_para_aluno(aluno_id, dados, id_usuario)
    if erro:
        return jsonify({"erro": erro}), 500 if aula_id is None else 404

    return jsonify({"id": aula_id, "mensagem": "Aula criada com sucesso"}), 201


@aulas_bp.route("/<int:aluno_id>/<int:aula_id>", methods=["PUT"])
@handle_errors
@jwt_required()
def editar_aula(aluno_id, aula_id):
    start = time.time()
    id_usuario = get_jwt_identity()
    dados = request.get_json()
    aula_id, erro = atualizar_aula_para_aluno(aluno_id, aula_id, id_usuario, dados)
    if erro:
        return jsonify({"erro": erro}), 500 if aula_id is None else 404

    retorno = jsonify({"id": aula_id, "mensagem": "Aula atualizada com sucesso"})
    logger.info(f"Tempo total: {time.time() - start:.3f} segundos")
    return retorno, 201
