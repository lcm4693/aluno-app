# app/routes/fotos.py

import os
from flask import Blueprint, send_from_directory, abort
from app.config import Config
from app.utils.error_handler import handle_errors

fotos_bp = Blueprint("fotos", __name__, url_prefix="/api/fotos")


@fotos_bp.route("/<filename>")
@handle_errors
def serve_foto(filename):
    try:
        if not filename or filename == "null":
            raise ValueError("Nome de arquivo inválido")
        return send_from_directory(Config.UPLOAD_FOLDER, filename)

    except Exception:
        try:
            return send_from_directory(Config.UPLOAD_FOLDER, "foto0.png")
        except Exception:
            abort(404)
