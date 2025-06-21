# run.py

from app.database import validar_variaveis  # ⬅️ Executa só uma vez

validar_variaveis()

from app import create_app

from werkzeug.security import generate_password_hash

app = create_app()


if __name__ == "__main__":
    app.run(debug=True)
