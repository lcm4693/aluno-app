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


# from flask import Blueprint, request, jsonify
# from flask_jwt_extended import create_access_token
# from app.database_old import get_db_connection
# from datetime import timedelta
# from werkzeug.security import check_password_hash

# auth_bp = Blueprint("authentication", __name__, url_prefix="/api/auth")


# @auth_bp.route("/login", methods=["POST"])
# def login():
#     data = request.get_json()
#     email = data.get("email")
#     senha = data.get("senha")

#     if not email or not senha:
#         return jsonify({"erro": "Email e senha são obrigatórios"}), 400

#     conn = get_db_connection()
#     cursor = conn.cursor(dictionary=True)

#     cursor.execute("SELECT * FROM usuarios WHERE email = %s AND ativado = 1", (email,))
#     row = cursor.fetchone()
#     conn.close()

#     if not row:
#         return jsonify({"erro": "Credenciais inválidas"}), 401

#     # Criar token com claims
#     usuario = {
#         "nome": row["nome"],
#         "email": row["email"],
#         "senha": row["senha"],
#         # "admin": (row["admin"]),  # ou outro critério
#     }

#     if not check_password_hash(usuario["senha"], senha):
#         return jsonify({"erro": "Credenciais inválidas"}), 401

#     token = create_access_token(
#         identity=str(row["id"]),
#         additional_claims=usuario,
#         expires_delta=timedelta(hours=1),  # ajuste se quiser
#     )
#     return jsonify({"token": token}), 200
