# run.py

from app import create_app
from app.database import init_db
from app.utils.database import executar_e_imprimir
from werkzeug.security import generate_password_hash
from app.database import get_db_connection

app = create_app()


if __name__ == "__main__":
    init_db()  # ← aqui é onde o banco será criado se não existir
    # executar_e_imprimir("SELECT * FROM usuarios")
    # executar_e_imprimir("UPDATE alunos SET id_usuario = 1")
    executar_e_imprimir("SELECT * FROM alunos")
    # executar_e_imprimir("DROP TABLE usuarios")
    # senha = generate_password_hash("visitante")
    # try:
    #     conn = get_db_connection()
    #     cursor = conn.cursor()
    #     cursor.execute(
    #         """
    #             INSERT INTO usuarios (nome, senha, email)
    #                 VALUES ('Visitante', ?, 'visitante@gmail.com');
    #         """,
    #         (senha,),
    #     )
    #     conn.commit()
    # except Exception as e:
    #     raise e

    app.run(debug=True)
