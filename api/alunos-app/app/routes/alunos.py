# app/routes/alunos.py

from flask import Blueprint, request, jsonify

from app.utils.file_utils import salvar_foto
from app.services.aluno_service import inserir_aluno
from app.services.aluno_service import buscar_aluno_completo
from app.services.aluno_service import buscar_lista_aluno
from app.services.aluno_service import atualizar_informacoes_basicas
from app.services.aluno_service import excluir_aluno
from app.utils.error_handler import handle_errors
from app.utils.validators import AlunoInputDTO
from app.utils.logger_config import configurar_logger
from flask_jwt_extended import jwt_required, get_jwt_identity

logger = configurar_logger(__name__)

alunos_bp = Blueprint("alunos", __name__, url_prefix="/api/alunos")


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

    logger.debug("get_aluno: " + str(aluno_id) + ": %", aluno)
    return jsonify(aluno), 200


@alunos_bp.route("/informacoes-basicas/<int:aluno_id>", methods=["PUT"])
@handle_errors
@jwt_required()
def put_aluno_basico(aluno_id):
    idUsuario = get_jwt_identity()

    dados = request.get_json()
    erro, status = atualizar_informacoes_basicas(aluno_id, dados, id_usuario=idUsuario)

    if erro:
        return jsonify({"erro": erro}), status

    return jsonify({"mensagem": "Informações básicas atualizadas com sucesso"}), 200


@alunos_bp.route("/<int:aluno_id>", methods=["DELETE"])
@handle_errors
@jwt_required()
def deletar_aluno(aluno_id):
    idUsuario = get_jwt_identity()

    erro, status = excluir_aluno(aluno_id, id_usuario=idUsuario)

    if erro:
        return jsonify({"erro": erro}), status

    return jsonify({"mensagem": "Aluno excluído com sucesso"}), 200
