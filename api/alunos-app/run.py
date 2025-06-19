# run.py

from app import create_app
from app.database import init_db
from app.utils.database import executar_e_imprimir


init_db()  # ← aqui é onde o banco será criado se não existir

app = create_app()


if __name__ == "__main__":
    # executar_e_imprimir("SELECT * FROM IDIOMAS")
    app.run(debug=True)
