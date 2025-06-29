# app/utils/foto_utils.py

import os
import time
from PIL import Image
from werkzeug.utils import secure_filename
from app.config import Config
from io import BytesIO
from app.services.s3_service import upload_imagem_s3, mover_imagem_s3_backup

ALLOWED_EXTENSIONS = {".png", ".jpg", ".jpeg"}


def allowed_file(filename):
    ext = os.path.splitext(filename)[1].lower()
    return ext in ALLOWED_EXTENSIONS


def salvar_foto(file):
    if not allowed_file(file.filename):
        return None

    # Gera nome único
    extensao = "jpg"  # você está forçando JPEG

    # Converte para JPEG reduzido
    image = Image.open(file.stream).convert("RGB")
    buffer = BytesIO()
    image.save(buffer, format="JPEG", quality=50, optimize=True)
    buffer.seek(0)

    final_filename = upload_imagem_s3(buffer, extensao, Config.AWS_S3_PASTA)

    return final_filename


def mover_foto_para_backup(caminho_atual: str, aluno_id: int):
    if not caminho_atual:
        return

    # Exemplo: fotos/nome.jpg → fotos/backup/1/nome.jpg
    nome_arquivo = caminho_atual.split("/")[-1]
    caminho_destino = f"{Config.AWS_S3_PASTA}/antigas/{aluno_id}/{nome_arquivo}"

    mover_imagem_s3_backup(caminho_atual, caminho_destino)
