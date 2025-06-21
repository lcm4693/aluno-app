from flask import Blueprint, jsonify
from app.utils.logger_config import configurar_logger
from app.utils.error_handler import handle_errors
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.database_old import get_db_connection
from app.services.pais_service import buscar_pais, buscar_paises

logger = configurar_logger(__name__)

paises_bp = Blueprint("paises", __name__, url_prefix="/api/paises")


@paises_bp.route("/", methods=["GET"])
@handle_errors
@jwt_required()
def listar_paises():
    paises = buscar_paises()
    return jsonify(paises), 200
