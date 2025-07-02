from flask import Blueprint, request, jsonify
from app.utils.logger_config import configurar_logger
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.config import Config
from app.utils.error_handler import handle_errors
from app.services.dashboard_service import *

logger = configurar_logger(__name__)

dashboard_bp = Blueprint("dashboard", __name__, url_prefix="/api/dashboard")


@dashboard_bp.route("/cards-estatisticas", methods=["GET"])
@handle_errors
@jwt_required()
def buscar_estatisticas():
    idUsuario = get_jwt_identity()

    cardsEstatisticas = buscar_cards_estatisticas(idUsuario)

    return jsonify(cardsEstatisticas)


@dashboard_bp.route("/alunos_favoritos", methods=["GET"])
@handle_errors
@jwt_required()
def recuperar_alunos_favoritos():
    idUsuario = get_jwt_identity()

    alunos_favoritos = buscar_alunos_favoritos(idUsuario)
    logger.debug(f"Retorno: {alunos_favoritos}")
    return jsonify(alunos_favoritos)
