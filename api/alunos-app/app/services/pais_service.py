from app.database import get_db_connection


def buscar_pais(id_pais=None):
    conn = get_db_connection()
    pais = conn.execute(
        "SELECT * FROM paises WHERE id = ?",
        (id_pais,),
    ).fetchone()
    conn.close()

    return {"id": pais["id"], "nome": pais["nome"]}


def buscar_paises():
    conn = get_db_connection()
    paises = conn.execute("SELECT * FROM paises ").fetchall()
    conn.close()

    return [{"id": row["id"], "nome": row["nome"]} for row in paises]
