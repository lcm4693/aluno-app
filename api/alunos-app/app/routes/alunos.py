# app/routes/alunos.py

from flask import Blueprint, request, jsonify
from app.database import get_db_connection
from app.utils.file_utils import salvar_foto
from app.services.aluno_service import inserir_aluno
from app.services.aluno_service import buscar_aluno_completo
from app.services.aluno_service import buscar_lista_aluno
from app.services.aluno_service import atualizar_informacoes_basicas
from app.services.aluno_service import excluir_aluno
from app.utils.error_handler import handle_errors
from app.utils.validators import AlunoInputDTO
from app.utils.logger_config import configurar_logger
from flask_jwt_extended import jwt_required

logger = configurar_logger(__name__)

alunos_bp = Blueprint("alunos", __name__, url_prefix="/api/alunos")


@alunos_bp.route("/", methods=["GET"])
@handle_errors
@jwt_required()
def listar_alunos():
    headers = request.headers

    # Imprime todos os cabeçalhos
    for key, value in headers.items():
        print(f"{key}: {value}")

    alunos, erro = buscar_lista_aluno()
    if erro:
        return jsonify({"erro": erro}), 404
    logger.debug("Retorno lista de alunos: ", alunos)
    return jsonify(alunos)


@alunos_bp.route("/incluir", methods=["POST"])
@handle_errors
def criar_aluno_com_foto():
    form = request.form
    # dados = {
    #     "nome": form.get("nome"),
    #     "mora": form.get("mora"),
    #     "cidade_natal": form.get("cidadeNatal"),
    #     "familia": form.get("familia"),
    #     "profissao": form.get("profissao"),
    #     "nivel": form.get("nivel"),
    #     "hobbies": form.get("hobbies"),
    #     "idade": (
    #         int(form.get("idade"))
    #         if form.get("idade") and form.get("idade").isdigit()
    #         else None
    #     ),
    #     "pontos": form.get("pontos"),
    #     "link_perfil": form.get("linkPerfil"),
    # }

    form = request.form.to_dict()

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

    aluno_id = inserir_aluno(form, foto_filename, idiomas_ids)
    logger.info(f"Aluno criado com sucesso: ID {aluno_id}")

    return jsonify({"id": aluno_id, "foto": foto_filename}), 201


@alunos_bp.route("/<int:aluno_id>", methods=["GET"])
@handle_errors
def get_aluno(aluno_id):
    aluno, erro = buscar_aluno_completo(aluno_id)
    if erro:
        return jsonify({"erro": erro}), 404
    return jsonify(aluno)


@alunos_bp.route("/informacoes-basicas/<int:aluno_id>", methods=["PUT"])
@handle_errors
def put_aluno_basico(aluno_id):
    dados = request.get_json()
    erro, status = atualizar_informacoes_basicas(aluno_id, dados)

    if erro:
        return jsonify({"erro": erro}), status

    return jsonify({"mensagem": "Aluno atualizado com sucesso"}), 200


@alunos_bp.route("/<int:aluno_id>", methods=["DELETE"])
@handle_errors
def deletar_aluno(aluno_id):
    erro, status = excluir_aluno(aluno_id)

    if erro:
        return jsonify({"erro": erro}), status

    return jsonify({"mensagem": "Aluno excluído com sucesso"}), 200
