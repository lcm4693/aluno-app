# app/utils/error_handler.py

from functools import wraps
from flask import jsonify
from pydantic import ValidationError
from flask_jwt_extended.exceptions import NoAuthorizationError
from jwt.exceptions import InvalidSignatureError, ExpiredSignatureError

from app.utils.logger_config import configurar_logger

logger = configurar_logger(__name__)


def handle_errors(f):
    @wraps(f)
    def wrapper(*args, **kwargs):
        try:
            return f(*args, **kwargs)

        except ValidationError as ve:
            logger.warning("Erro de validação Pydantic")
            erros_formatados = []

            for err in ve.errors():
                msg_original = err.get("msg", "Erro de validação")
                msg_limpa = msg_original.replace(
                    "Value error, ", ""
                )  # Remove prefixo desnecessário

                erros_formatados.append(
                    {
                        "campo": ".".join(str(p) for p in err.get("loc", [])),
                        "mensagem": msg_limpa,
                    }
                )
            return jsonify({"erros": erros_formatados}), 400
        except ValueError as ve:
            logger.warning(f"ValueError: {ve}")
            return jsonify({"erro": str(ve)}), 400

        except PermissionError as pe:
            logger.warning(f"PermissionError: {pe}")
            return jsonify({"erro": str(pe)}), 403

        except FileNotFoundError as fe:
            logger.warning(f"FileNotFoundError: {fe}")
            return jsonify({"erro": "Arquivo não encontrado"}), 404

        except NoAuthorizationError as e:
            logger.error("Usuário não autorizado ao recurso")
            return jsonify({"erro": "Usuário não autorizado"}), 403
        except InvalidSignatureError as e:
            logger.error("Token inválido")
            return jsonify({"erro": "Usuário não autorizado"}), 403
        except ExpiredSignatureError as e:
            logger.error("Token expirado")
            return jsonify({"erro": "Token expirado"}), 401
        except Exception as e:
            logger.error(e)
            logger.exception("Erro interno não tratado")
            return jsonify({"erro": "Erro interno do servidor"}), 500

    return wrapper
