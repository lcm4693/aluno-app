# app/services/aula_service.py

from app.database import get_db_connection


def listar_aulas_do_aluno(aluno_id):
    conn = get_db_connection()
    cursor = conn.cursor()

    # Verifica se o aluno existe
    cursor.execute("SELECT id FROM alunos WHERE id = ? AND deletado = 0", (aluno_id,))
    if not cursor.fetchone():
        conn.close()
        return None, "Aluno não encontrado"

    # Busca as aulas
    cursor.execute(
        """
        SELECT id, data, anotacoes, comentarios, proxima_aula
        FROM aula
        WHERE aluno_id = ?
        ORDER BY data DESC
    """,
        (aluno_id,),
    )
    aulas = cursor.fetchall()
    conn.close()

    return [
        {
            "id": aula["id"],
            "dataAula": aula["data"],
            "anotacoes": aula["anotacoes"],
            "comentarios": aula["comentarios"],
            "proxima_aula": aula["proxima_aula"],
        }
        for aula in aulas
    ], None


def criar_aula_para_aluno(aluno_id, dados):
    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        cursor.execute(
            "SELECT id FROM alunos WHERE id = ? AND deletado = 0", (aluno_id,)
        )
        if not cursor.fetchone():
            return None, "Aluno não encontrado"

        cursor.execute(
            """
            INSERT INTO aula (data, anotacoes, comentarios, proxima_aula, aluno_id)
            VALUES (?, ?, ?, ?, ?)
        """,
            (
                dados.get("dataAula"),
                dados.get("anotacoes"),
                dados.get("comentarios"),
                dados.get("proximaAula"),
                aluno_id,
            ),
        )

        conn.commit()
        return cursor.lastrowid, None

    except Exception as e:
        conn.rollback()
        return None, str(e)

    finally:
        conn.close()
