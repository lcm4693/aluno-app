from app.models.usuario import Usuario
from werkzeug.security import check_password_hash
from flask_jwt_extended import create_access_token
from datetime import timedelta
from app.database import get_session


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
            "admin": usuario.admin,  # se quiser
        }

        token = create_access_token(
            identity=str(usuario.id),
            additional_claims=claims,
            expires_delta=timedelta(hours=1),
        )
        return token
