# app/services/aluno_service.py

from app.database import get_db_connection
from app.utils.helpers import aluno_dict
from flask import url_for
from app.services.pais_service import buscar_pais
from app.services.idioma_service import buscar_idiomas_aluno


def inserir_aluno(dados, foto_filename, idiomas_ids, id_usuario):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute(
            """
            INSERT INTO alunos (
                nome, mora, cidade_natal, familia, profissao,
                nivel, hobbies, idade, pontos, link_perfil, foto, id_usuario, id_pais_mora, id_pais_natal
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                dados["nome"],
                dados["mora"],
                dados["cidade_natal"],
                dados["familia"],
                dados["profissao"],
                dados["nivel"],
                dados["hobbies"],
                dados["idade"],
                dados["pontos"],
                dados["link_perfil"],
                foto_filename,
                id_usuario,
                dados["moraPais"],
                dados["paisNatal"],
            ),
        )

        aluno_id = cursor.lastrowid

        for idioma_id in idiomas_ids:
            cursor.execute(
                "INSERT INTO aluno_idioma (aluno_id, idioma_id) VALUES (?, ?)",
                (aluno_id, idioma_id),
            )

        conn.commit()
        return aluno_id

    except Exception as e:
        conn.rollback()
        raise e

    finally:
        conn.close()


def buscar_lista_aluno(id_usuario=None):
    conn = get_db_connection()
    alunos = conn.execute(
        "SELECT * FROM alunos WHERE deletado = 0 AND id_usuario = ? ORDER BY nome",
        (id_usuario,),
    ).fetchall()
    conn.close()

    lista = [dict(aluno) for aluno in alunos]
    # Adiciona a URL da foto para cada aluno
    lista = [alterar_nome_foto_para_url_foto(a) for a in lista]

    return lista, None


def buscar_aluno_completo(aluno_id, id_usuario=None):
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute(
        "SELECT id, nome, mora, cidade_natal, familia, profissao, nivel, hobbies, idade, pontos, link_perfil, foto, id_pais_mora, id_pais_natal FROM alunos WHERE id = ? AND id_usuario = ? AND deletado = 0 ",
        (
            aluno_id,
            id_usuario,
        ),
    )
    row = cursor.fetchone()

    if not row:
        conn.close()
        return None, "Aluno não encontrado"

    aluno = aluno_dict(row)
    aluno["cidadeNatal"] = aluno["cidade_natal"]
    aluno.pop("cidade_natal")

    if aluno["id_pais_mora"]:
        paisMora = buscar_pais(aluno["id_pais_mora"])
        aluno["paisMora"] = paisMora
        aluno.pop("id_pais_mora")

    if aluno["id_pais_natal"]:
        paisNatal = buscar_pais(aluno["id_pais_natal"])
        aluno["paisNatal"] = paisNatal
        aluno.pop("id_pais_natal")

    # Buscar aulas do aluno
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
    aluno["aulas"] = [
        {
            "id": aula["id"],
            "dataAula": aula["data"],
            "anotacoes": aula["anotacoes"],
            "comentarios": aula["comentarios"],
            "proxima_aula": aula["proxima_aula"],
        }
        for aula in aulas
    ]

    aluno["idiomas"] = buscar_idiomas_aluno(aluno_id)

    conn.close()

    alterar_nome_foto_para_url_foto(aluno)

    return aluno, None


def alterar_nome_foto_para_url_foto(aluno):
    foto_nome = aluno.get("foto")
    if foto_nome:
        aluno["fotoUrl"] = url_for(
            "fotos.serve_foto", filename=foto_nome, _external=True
        )
    else:
        aluno["fotoUrl"] = url_for(
            "fotos.serve_foto", filename="foto0.png", _external=True
        )
    aluno.pop("foto", None)
    return aluno


def atualizar_informacoes_basicas(aluno_id, dados, id_usuario=None):
    print(dados)
    campos = [
        "mora",
        "cidadeNatal",
        "familia",
        "profissao",
        "hobbies",
        "idade",
        "pontos",
        "linkPerfil",
    ]

    valores = [dados.get(c) for c in campos]
    if dados.get("paisNatal"):
        valores.append(dados.get("paisNatal").get("id"))
    else:
        valores.append(None)

    if dados.get("paisMora"):
        valores.append(dados.get("paisMora").get("id"))
    else:
        valores.append(None)

    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        # Verifica se o aluno existe
        cursor.execute(
            "SELECT id FROM alunos WHERE id = ? AND id_usuario = ? AND deletado = 0",
            (
                aluno_id,
                id_usuario,
            ),
        )

        if not cursor.fetchone():
            return "Aluno não encontrado", 404

        # Atualiza os dados
        cursor.execute(
            """
            UPDATE alunos SET
                mora = ?, cidade_natal = ?, familia = ?, profissao = ?,
                hobbies = ?, idade = ?, pontos = ?, link_perfil = ?, id_pais_natal = ?, id_pais_mora = ?
            WHERE id = ?
            """,
            valores + [aluno_id],
        )

        conn.commit()
        return None, 200

    except Exception as e:
        print(e)
        return str(e), 500

    finally:
        conn.close()


def excluir_aluno(aluno_id, id_usuario=None):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        # Verifica se o aluno existe
        cursor.execute(
            "SELECT * FROM alunos WHERE id = ? AND id_usuario = ? AND deletado = 0",
            (
                aluno_id,
                id_usuario,
            ),
        )
        if not cursor.fetchone():
            return "Aluno não encontrado", 404

        # Marca como deletado
        cursor.execute(
            "UPDATE alunos SET deletado = 1 WHERE id = ? AND id_usuario = ?",
            (
                aluno_id,
                id_usuario,
            ),
        )
        conn.commit()

        return None, 200

    except Exception as e:
        return str(e), 500

    finally:
        conn.close()
