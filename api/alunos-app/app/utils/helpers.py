# app/utils/helpers.py

import unicodedata


def remover_acentos(texto):
    """
    Remove acentos de uma string.
    """
    if texto is None:
        return ""
    return "".join(
        c
        for c in unicodedata.normalize("NFD", texto)
        if unicodedata.category(c) != "Mn"
    )


def aluno_dict(row):
    """
    Converte uma linha de resultado do banco em dicionário de aluno.
    """
    keys = [
        "id",
        "nome",
        "mora",
        "cidade_natal",
        "familia",
        "profissao",
        "nivel",
        "hobbies",
        "idade",
        "pontos",
        "linkPerfil",
        "foto",
    ]
    return dict(zip(keys, row))
