# run.py

from app import create_app
from app.config import validar_variaveis
from werkzeug.security import generate_password_hash


validar_variaveis()

app = create_app()


if __name__ == "__main__":
    app.run(debug=True)
