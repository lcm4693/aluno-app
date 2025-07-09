# app/utils/converters_dicts.py

from app.utils.date_utils import *


def converter_alunos_tela_listagem(aluno):

    return {
        "id": aluno.id,
        "nome": aluno.nome,
        "mora": aluno.mora,
        "cidadeNatal": aluno.cidade_natal,
        "familia": aluno.familia,
        "profissao": aluno.profissao,
        "nivel": aluno.nivel,
        "hobbies": aluno.hobbies,
        "idade": aluno.idade,
        "pontos": aluno.pontos,
        "linkPerfil": aluno.link_perfil,
        "foto": aluno.foto,
        "dataPrimeiraAula": converter_data_para_front(aluno.data_primeira_aula),
        "dataAniversario": converter_data_para_front(aluno.data_aniversario),
        "paisMora": (
            {"id": aluno.pais_mora.id, "nome": aluno.pais_mora.nome}
            if aluno.pais_mora
            else None
        ),
        "paisNatal": (
            {"id": aluno.pais_natal.id, "nome": aluno.pais_natal.nome}
            if aluno.pais_natal
            else None
        ),
    }
