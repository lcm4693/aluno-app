from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token

auth_bp = Blueprint("authentication", __name__, url_prefix="/api/auth")


@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    senha = data.get("senha")

    if email == "diego@gmail.com" and senha == "1234":
        usuario = {"sub": 1, "nome": "Admin", "admin": True}
        token = create_access_token(identity=usuario)
        return jsonify({"token": token}), 200

    return jsonify({"erro": "Credenciais inválidas"}), 401
