from flask import Blueprint, request, jsonify, make_response
from app.utils.error_handler import handle_errors
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.services.idioma_service import atualizar_idiomas_banco, buscar_todos_idiomas


idiomas_bp = Blueprint("idiomas", __name__, url_prefix="/api/idiomas")


@idiomas_bp.route("/", methods=["GET"])
@handle_errors
@jwt_required()
def listar_idiomas():
    lista = buscar_todos_idiomas()
    return jsonify(lista), 200


@idiomas_bp.route("/<int:aluno_id>", methods=["PUT"])
@handle_errors
@jwt_required()
def atualizar_idiomas(aluno_id):
    idUsuario = get_jwt_identity()

    dados = request.get_json()

    if not isinstance(dados, list):
        return make_response(
            jsonify({"erro": "Dados inválidos. Esperado array de IDs"}), 400
        )

    erro, status = atualizar_idiomas_banco(aluno_id, dados, idUsuario)

    if erro:
        return jsonify({"erro": erro}), status

    return jsonify({"mensagem": "Idiomas atualizados com sucesso"}), 200
