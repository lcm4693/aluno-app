# app/utils/helpers.py

import unicodedata
from enum import Enum


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
        "id_pais_mora",
        "id_pais_natal",
    ]
    return dict(zip(keys, row))


def model_to_dict(obj):
    return {
        key: (value.name if isinstance(value, Enum) else value)
        for key, value in obj.__dict__.items()
        if not key.startswith("_")
    }
