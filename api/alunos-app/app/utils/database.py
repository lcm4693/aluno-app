from app.database import get_db_connection


def executar_e_imprimir(query: str):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(query)

        if query.strip().lower().startswith("select"):
            resultados = cursor.fetchall()
            for row in resultados:
                print(dict(row))
        else:
            conn.commit()
            print("Query executada com sucesso.")
    except Exception as e:
        raise e
