# app/__init__.py

from flask import Flask, jsonify
from flask_cors import CORS
from .config import Config
from .routes.alunos import alunos_bp
from .routes.idiomas import idiomas_bp
from .routes.aulas import aulas_bp
from .routes.fotos import fotos_bp
from .routes.paises import paises_bp
from .routes.authentication import auth_bp
from flask_jwt_extended import JWTManager
from app.utils.logger_config import configurar_logger


logger = configurar_logger(__name__)


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    app.url_map.strict_slashes = False

    jwt = JWTManager(app)

    # logger.info(f"CORS: {Config.CORS_ORIGINS}")

    CORS(
        app,
        resources={
            r"/api/*": {
                "origins": Config.CORS_ORIGINS,
                "allow_headers": ["Authorization", "Content-Type"],
                "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            }
        },
    )

    # Registro dos blueprints
    app.register_blueprint(alunos_bp)
    app.register_blueprint(idiomas_bp)
    app.register_blueprint(aulas_bp)
    app.register_blueprint(fotos_bp)
    app.register_blueprint(auth_bp)
    app.register_blueprint(paises_bp)

    # ERROS GLOBAIS
    @app.errorhandler(404)
    def not_found(e):
        return jsonify({"erro": "Rota não encontrada"}), 404

    @app.errorhandler(405)
    def metodo_nao_permitido(e):
        return jsonify({"erro": "Método HTTP não permitido"}), 405

    @app.errorhandler(500)
    def erro_interno(e):
        return jsonify({"erro": "Erro interno no servidor"}), 500

    return app
