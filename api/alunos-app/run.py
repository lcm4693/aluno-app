# run.py

from app import create_app
from app.database import init_db

app = create_app()

if __name__ == "__main__":
    init_db()  # ← aqui é onde o banco será criado se não existir
    app.run(debug=True)
