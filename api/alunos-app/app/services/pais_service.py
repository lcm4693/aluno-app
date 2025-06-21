# from app.database_old import get_db_connection
from app.models.pais import Pais
from app.database import get_session


def buscar_pais(id_pais: int):
    with get_session() as session:

        pais = session.query(Pais).filter(Pais.id == id_pais).first()

        if not pais:
            return None

        return {"id": pais.id, "nome": pais.nome}


def buscar_paises():
    with get_session() as session:
        paises = session.query(Pais).all()
        return [{"id": p.id, "nome": p.nome} for p in paises]
