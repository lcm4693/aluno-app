from app.database import get_db_connection
from flask import jsonify, make_response
from app.utils.helpers import remover_acentos


def buscar_todos_idiomas():
    conn = get_db_connection()
    conn.create_function("sem_acento", 1, remover_acentos)

    idiomas = conn.execute(
        "SELECT id, nome FROM idiomas ORDER BY sem_acento(nome) COLLATE NOCASE"
    ).fetchall()

    conn.close()

    return [{"id": row["id"], "nome": row["nome"]} for row in idiomas]


def atualizar_idiomas_banco(aluno_id, dados, id_usuario):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute(
            "SELECT id FROM alunos WHERE id = ? AND id_usuario = ? AND deletado = 0",
            (
                aluno_id,
                id_usuario,
            ),
        )
        if not cursor.fetchone():
            return make_response(jsonify({"erro": "Aluno não encontrado"}), 404)

        # Remove idiomas antigos
        cursor.execute("DELETE FROM aluno_idioma WHERE aluno_id = ?", (aluno_id,))

        # Adiciona os novos
        for idioma_id in dados:
            cursor.execute(
                "INSERT INTO aluno_idioma (aluno_id, idioma_id) VALUES (?, ?)",
                (aluno_id, idioma_id),
            )

        conn.commit()
        return None, 200

    except Exception as e:
        conn.rollback()
        return make_response(jsonify({"erro": str(e)}), 500)

    finally:
        conn.close()
