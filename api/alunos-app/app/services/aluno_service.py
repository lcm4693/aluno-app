# app/services/aluno_service.py

from app.models.aluno import Aluno
from flask import url_for
from app.services.idioma_service import buscar_idiomas_aluno
from sqlalchemy.orm import joinedload
from app.database import get_session
from app.services.shared_service import retornar_id_aluno_banco
from app.models.aluno_idioma import AlunoIdioma
from datetime import datetime
from app.config import Config
from app.utils.date_utils import converter_data_para_front, converter_data_para_banco
from app.utils.foto_utils import salvar_foto, mover_foto_para_backup


def inserir_aluno(dados, foto_filename, idiomas_ids, id_usuario):
    try:
        with get_session() as session:
            aluno = Aluno(
                nome=dados.get("nome"),
                mora=dados.get("mora"),
                cidade_natal=dados.get("cidade_natal"),
                familia=dados.get("familia"),
                profissao=dados.get("profissao"),
                nivel=dados.get("nivel"),
                hobbies=dados.get("hobbies"),
                idade=dados.get("idade"),
                pontos=dados.get("pontos"),
                link_perfil=dados.get("link_perfil"),
                foto=foto_filename,
                id_usuario=id_usuario,
                id_pais_mora=dados.get("moraPais") if dados.get("moraPais") else None,
                id_pais_natal=(
                    dados.get("paisNatal") if dados.get("paisNatal") else None
                ),
            )

            session.add(aluno)
            session.flush()  # garante que aluno.id já está disponível

            for idioma_id in idiomas_ids:
                relacao = AlunoIdioma(aluno_id=aluno.id, idioma_id=idioma_id)
                session.add(relacao)

            # commit é automático no context manager se não houver exceções
            return aluno.id, 200
    except Exception as e:
        raise RuntimeError(f"Erro ao inserir aluno: {e}")


def buscar_lista_aluno(id_usuario=None):
    try:
        with get_session() as session:

            query = session.query(Aluno).filter_by(deletado=0)

            if id_usuario:
                query = query.filter_by(id_usuario=id_usuario)

            alunos = query.order_by(Aluno.nome).all()

            lista = [aluno.to_dict() for aluno in alunos]
            lista = [alterar_nome_foto_para_url_foto(a) for a in lista]

            return lista, None

    except Exception as e:
        print(f"Erro ao buscar alunos: {e}")
        return [], str(e)

    finally:
        session.close()


def buscar_aluno_completo(aluno_id, id_usuario):
    with get_session() as session:
        aluno = (
            session.query(Aluno)
            .options(
                joinedload(Aluno.aulas),
                joinedload(Aluno.pais_mora),
                joinedload(Aluno.pais_natal),
            )  # Carrega aulas automaticamente
            .filter(
                Aluno.id == aluno_id,
                Aluno.id_usuario == id_usuario,
                Aluno.deletado == 0,
            )
            .first()
        )

        if not aluno:
            return None, "Aluno não encontrado"

        # Convertendo para dict manualmente (ou use um serializador depois)
        aluno_dict_resultado = {
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
            "aulas": [
                {
                    "id": aula.id,
                    "dataAula": converter_data_para_front(aula.data),
                    "anotacoes": aula.anotacoes,
                    "comentarios": aula.comentarios,
                    "proximaAula": aula.proxima_aula,
                }
                for aula in aluno.aulas
            ],
            "idiomas": buscar_idiomas_aluno(aluno.id),
        }

        alterar_nome_foto_para_url_foto(aluno_dict_resultado)

        return aluno_dict_resultado, None


def alterar_nome_foto_para_url_foto(aluno):
    foto_nome = aluno.get("foto")
    if foto_nome:
        aluno["fotoUrl"] = (
            f"https://{Config.AWS_S3_BUCKET}.s3.{Config.AWS_S3_REGION}.amazonaws.com/{foto_nome}"
        )
    else:
        aluno["fotoUrl"] = (
            f"https://{Config.AWS_S3_BUCKET}.s3.{Config.AWS_S3_REGION}.amazonaws.com/{Config.AWS_S3_PASTA}/foto0.png"
        )
    aluno.pop("foto", None)
    return aluno


def atualizar_informacoes_basicas(aluno_id, dados, id_usuario):
    with get_session() as session:
        aluno = retornar_id_aluno_banco(aluno_id, id_usuario)

        if not aluno:
            return "Aluno não encontrado", 404

        # Atualização dos campos
        aluno.mora = dados.get("mora")
        aluno.cidade_natal = dados.get("cidadeNatal")
        aluno.familia = dados.get("familia")
        aluno.profissao = dados.get("profissao")
        aluno.hobbies = dados.get("hobbies")
        aluno.idade = dados.get("idade")
        aluno.pontos = dados.get("pontos")
        aluno.link_perfil = dados.get("linkPerfil")

        aluno.data_aniversario = converter_data_para_banco(dados.get("dataAniversario"))

        # Relacionamentos com países
        aluno.id_pais_natal = (
            dados.get("paisNatal", {}).get("id") if dados.get("paisNatal") else None
        )
        aluno.id_pais_mora = (
            dados.get("paisMora", {}).get("id") if dados.get("paisMora") else None
        )

        session.add(aluno)  # opcional, mas explícito
        # commit é feito automaticamente no get_session()

        return None, 200


def excluir_aluno(aluno_id, id_usuario=None):
    with get_session() as session:
        aluno = retornar_id_aluno_banco(aluno_id, id_usuario)

        if not aluno:
            return "Aluno não encontrado", 404

        aluno.deletado = True
        session.add(aluno)  # opcional, mas explícito
        return None, 200


def atualizar_data_primeira_aula(aluno_id, data_primeira_aula, id_usuario):
    with get_session() as session:
        aluno = retornar_id_aluno_banco(aluno_id, id_usuario)

        if not aluno:
            return "Aluno não encontrado", 404

        aluno.data_primeira_aula = converter_data_para_banco(data_primeira_aula)

        session.add(aluno)  # opcional, mas explícito
        # commit é feito automaticamente no get_session()

        return None, 200


def alterar_foto_usuario(file, aluno_id: int, id_usuario: int):
    with get_session() as session:
        aluno = (
            session.query(Aluno)
            .filter(
                Aluno.id == aluno_id,
                Aluno.id_usuario == id_usuario,
                Aluno.deletado == 0,
            )
            .first()
        )

        if not aluno:
            return None, "Aluno não encontrado"

        mover_foto_para_backup(aluno.foto, aluno.id)
        final_filename = salvar_foto(file)
        aluno.foto = final_filename
        session.add(aluno)

        return final_filename
