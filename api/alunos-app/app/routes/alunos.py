# app/routes/alunos.py

from flask import Blueprint, request, jsonify

from app.utils.foto_utils import salvar_foto
from app.services.aluno_service import (
    inserir_aluno,
    atualizar_informacoes_basicas,
    buscar_lista_aluno,
    buscar_aluno_completo,
    excluir_aluno,
    atualizar_data_primeira_aula,
    alterar_foto_usuario,
    buscar_lista_aluno_para_menu,
    atualizar_nome_nivel,
)
from app.utils.error_handler import handle_errors
from app.utils.validators import AlunoInputDTO
from app.utils.logger_config import configurar_logger
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.config import Config

logger = configurar_logger(__name__)

alunos_bp = Blueprint("alunos", __name__, url_prefix="/api/alunos")


@alunos_bp.route("/lista-menu", methods=["GET"])
@handle_errors
@jwt_required()
def listar_alunos_para_lista_menu():

    idUsuario = get_jwt_identity()
    logger.debug(f"Buscar usuários para menu usuário: {idUsuario}")

    alunos = buscar_lista_aluno_para_menu(id_usuario=idUsuario)

    logger.debug(f"Retorno: {alunos}")

    return jsonify(alunos)


@alunos_bp.route("/", methods=["GET"])
@handle_errors
@jwt_required()
def listar_alunos():
    idUsuario = get_jwt_identity()

    alunos, erro = buscar_lista_aluno(id_usuario=idUsuario)
    if erro:
        return jsonify({"erro": erro}), 404
    return jsonify(alunos)


@alunos_bp.route("/incluir", methods=["POST"])
@handle_errors
@jwt_required()
def criar_aluno_com_foto():
    idUsuario = get_jwt_identity()
    form = request.form.to_dict()
    print(form)
    # ✅ Converte idade (se vier preenchida)
    idade_raw = form.get("idade", "").strip()
    form["idade"] = int(idade_raw) if idade_raw.isdigit() else None

    # ✅ Renomeia campos para o formato esperado pelo DTO
    form["cidade_natal"] = form.pop("cidadeNatal", None)
    form["link_perfil"] = form.pop("linkPerfil", None)

    # ✅ Validação com Pydantic
    aluno_validado = AlunoInputDTO(**form)

    dados = aluno_validado.model_dump()
    logger.debug(f"Dados validados com sucesso: {dados}")

    idiomas = request.form.getlist("idiomas")
    idiomas_ids = [int(i) for i in idiomas if i.strip().isdigit()]
    logger.debug(f"Idiomas processados: {idiomas_ids}")

    foto_file = request.files.get("foto")
    foto_filename = salvar_foto(foto_file) if foto_file else None

    if foto_file and not foto_filename:
        logger.error("Formato de imagem não suportado")
        return jsonify({"error": "Formato de imagem não suportado"}), 400

    aluno_id = inserir_aluno(form, foto_filename, idiomas_ids, id_usuario=idUsuario)
    logger.info(f"Aluno criado com sucesso: ID {aluno_id}")

    return (
        jsonify(
            {
                "id": aluno_id,
                "foto": foto_filename,
                "mensagem": "Aluno cadastrado com sucesso",
            }
        ),
        201,
    )


@alunos_bp.route("/<int:aluno_id>", methods=["GET"])
@handle_errors
@jwt_required()
def get_aluno(aluno_id):
    idUsuario = get_jwt_identity()
    aluno, erro = buscar_aluno_completo(aluno_id, id_usuario=idUsuario)
    if erro:
        return jsonify({"erro": erro}), 404

    logger.debug(f"get_aluno: {aluno_id} - {aluno}")
    return jsonify(aluno), 200


@alunos_bp.route("/informacoes-basicas/<int:aluno_id>", methods=["PUT"])
@handle_errors
@jwt_required()
def put_aluno_basico(aluno_id):
    idUsuario = get_jwt_identity()

    dados = request.get_json()
    logger.debug(f"Entrada - put_aluno_basico: {dados}")

    erro, status = atualizar_informacoes_basicas(aluno_id, dados, id_usuario=idUsuario)

    if erro:
        return jsonify({"erro": erro}), status

    retorno = {"mensagem": "Informações básicas atualizadas com sucesso"}
    logger.debug(f"Retorno - put_aluno_basico: {retorno}")

    return jsonify(retorno), 200


@alunos_bp.route("/nome-nivel/<int:aluno_id>", methods=["PUT"])
@handle_errors
@jwt_required()
def put_nome_nivel_aluno(aluno_id):
    idUsuario = get_jwt_identity()

    dados = request.get_json()
    logger.debug(f"Entrada - put_nome_nivel_aluno: {dados}")

    erro, status = atualizar_nome_nivel(aluno_id, dados, id_usuario=idUsuario)

    if erro:
        return jsonify({"erro": erro}), status

    retorno = {"mensagem": "Informações atualizadas com sucesso"}
    logger.debug(f"Retorno - put_nome_nivel_aluno: {retorno}")

    return jsonify(retorno), 200


@alunos_bp.route("/<int:aluno_id>", methods=["DELETE"])
@handle_errors
@jwt_required()
def deletar_aluno(aluno_id):
    idUsuario = get_jwt_identity()

    erro, status = excluir_aluno(aluno_id, id_usuario=idUsuario)

    if erro:
        return jsonify({"erro": erro}), status

    return jsonify({"mensagem": "Aluno excluído com sucesso"}), 200


@alunos_bp.route("/primeira-aula/<int:aluno_id>", methods=["PUT"])
@handle_errors
@jwt_required()
def put_aluno_primeira_aula(aluno_id):
    idUsuario = get_jwt_identity()

    data_primeira_aula = request.get_json()
    erro, status = atualizar_data_primeira_aula(
        aluno_id, data_primeira_aula, id_usuario=idUsuario
    )

    if erro:
        return jsonify({"erro": erro}), status

    return jsonify({"mensagem": "Informação atualizada com sucesso"}), 200


@alunos_bp.route("/upload-foto/<int:aluno_id>", methods=["POST"])
@handle_errors
@jwt_required()
def incluir_foto(aluno_id):
    idUsuario = get_jwt_identity()
    if "foto" not in request.files:
        return jsonify({"erro": "Nenhum arquivo enviado"}), 400

    foto = request.files["foto"]

    if foto.filename == "":
        return jsonify({"erro": "Nome do arquivo vazio"}), 400

    foto_filename = alterar_foto_usuario(foto, aluno_id, idUsuario) if foto else None

    if foto and not foto_filename:
        logger.error("Formato de imagem não suportado")
        return jsonify({"error": "Formato de imagem não suportado"}), 400

    url = f"https://{Config.AWS_S3_BUCKET}.s3.amazonaws.com/{foto_filename}"

    return jsonify({"url": url}), 200
