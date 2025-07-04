from app.models.usuario import Usuario
from werkzeug.security import check_password_hash
from flask_jwt_extended import create_access_token, create_refresh_token
from datetime import timedelta
from app.database import get_session
from app.config import Config
from app.utils.logger_config import configurar_logger

logger = configurar_logger(__name__)


def gerar_refresh_token(id_usuario):
    logger.debug("Vai executar a chamada ao banco")
    with get_session() as session:
        usuario = (
            session.query(Usuario)
            .filter(Usuario.id == id_usuario, Usuario.ativado == 1)
            .first()
        )

        logger.debug(f"Usuário retornado: {usuario}")
        if not usuario:
            return None

        claims = {
            "nome": usuario.nome,
            "email": usuario.email,
            "admin": usuario.admin,
        }

        access_token = create_access_token(
            identity=str(usuario.id),
            additional_claims=claims,
        )

        logger.debug(f"Token gerado: {access_token}")

        return access_token


def autenticar_usuario(email: str, senha: str):
    with get_session() as session:
        usuario = (
            session.query(Usuario)
            .filter(Usuario.email == email, Usuario.ativado == 1)
            .first()
        )

        if not usuario or not check_password_hash(usuario.senha, senha):
            return None

        claims = {
            "nome": usuario.nome,
            "email": usuario.email,
            "admin": usuario.admin,
        }

        access_token = create_access_token(
            identity=str(usuario.id),
            additional_claims=claims,
            expires_delta=Config.JWT_ACCESS_TOKEN_EXPIRES,
        )

        refresh_token = create_refresh_token(identity=str(usuario.id))

        return {"access_token": access_token, "refresh_token": refresh_token}
