from flask import Blueprint, request, jsonify
from app.services.auth_service import autenticar_usuario

auth_bp = Blueprint("authentication", __name__, url_prefix="/api/auth")


@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    senha = data.get("senha")

    if not email or not senha:
        return jsonify({"erro": "Email e senha são obrigatórios"}), 400

    token = autenticar_usuario(email, senha)
    if not token:
        return jsonify({"erro": "Credenciais inválidas"}), 401

    return jsonify({"token": token}), 200
