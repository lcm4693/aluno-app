# app/utils/file_utils.py

import os
import time
from PIL import Image
from werkzeug.utils import secure_filename
from app.config import Config

ALLOWED_EXTENSIONS = {".png", ".jpg", ".jpeg"}


def allowed_file(filename):
    ext = os.path.splitext(filename)[1].lower()
    return ext in ALLOWED_EXTENSIONS


def salvar_foto(file):
    if not allowed_file(file.filename):
        return None

    os.makedirs(Config.UPLOAD_FOLDER, exist_ok=True)
    timestamp = int(time.time())
    filename_base = secure_filename(
        file.filename.rsplit(".", 1)[0].lower().replace(" ", "_")
    )
    ext = os.path.splitext(file.filename)[1] or ".png"
    final_filename = f"{filename_base}_{timestamp}{ext}"
    foto_path = os.path.join(Config.UPLOAD_FOLDER, final_filename)

    image = Image.open(file.stream).convert("RGB")
    image.save(foto_path, format="JPEG", quality=50, optimize=True)

    return final_filename
