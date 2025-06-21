# app/database.py
import json
import sqlite3
from .config import Config


def get_db_connection():
    conn = sqlite3.connect(Config.DB_PATH)
    conn.row_factory = sqlite3.Row  # Retorna dados como dicionário
    return conn


def init_db():
    with get_db_connection() as conn:
        c = conn.cursor()

        c.execute(
            """
            CREATE TABLE IF NOT EXISTS alunos (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nome TEXT,
                mora TEXT,
                cidade_natal TEXT,
                familia TEXT,
                profissao TEXT,
                nivel TEXT CHECK(nivel IN ('A1','A2','B1','B2','C1')),
                hobbies TEXT,
                idade INTEGER,
                pontos TEXT,
                link_perfil TEXT,
                foto TEXT,
                deletado INTEGER DEFAULT 0
            )
        """
        )

        c.execute(
            """
            CREATE TABLE IF NOT EXISTS idiomas (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nome TEXT
            )
        """
        )

        # Verifica se há idiomas
        c.execute("SELECT COUNT(*) FROM idiomas")
        total = c.fetchone()[0]

        if total == 0:
            c.execute(
                """
            INSERT INTO idiomas (nome) VALUES
              ('Inglês'),
              ('Espanhol'),
              ('Francês'),
              ('Alemão'),
              ('Italiano'),
              ('Chinês'),
              ('Japonês'),
              ('Russo'),
              ('Coreano'),
              ('Polonês'),
              ('Urdu'),
              ('Árabe');
            """
            )

        c.execute(
            """
            CREATE TABLE IF NOT EXISTS aluno_idioma (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                aluno_id INTEGER NOT NULL,
                idioma_id INTEGER NOT NULL,
                FOREIGN KEY (aluno_id) REFERENCES alunos(id),
                FOREIGN KEY (idioma_id) REFERENCES idiomas(id),
                UNIQUE(aluno_id, idioma_id)
            )
        """
        )

        c.execute(
            """
            CREATE TABLE IF NOT EXISTS aula (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                data DATE NOT NULL,
                anotacoes TEXT NOT NULL,
                comentarios TEXT,
                proxima_aula TEXT,
                aluno_id INTEGER NOT NULL,
                FOREIGN KEY (aluno_id) REFERENCES alunos(id) ON DELETE CASCADE
            )
        """
        )

        c.execute(
            """
            CREATE TABLE IF NOT EXISTS usuarios (
                id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
                nome TEXT NOT NULL,
                dataCadastro DATE NOT NULL DEFAULT (DATE('now')),
                senha TEXT NOT NULL,
                email TEXT NOT NULL UNIQUE,
                admin INTEGER NOT NULL DEFAULT 1,
                ativado INTEGER NOT NULL DEFAULT 1)
                ;
        """
        )

        c.execute(
            """
            CREATE TABLE IF NOT EXISTS paises (
                id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
                nome TEXT NOT NULL);
            """
        )

        # Verifica se há usuarios
        c.execute("SELECT COUNT(*) FROM paises")
        total = c.fetchone()[0]

        if total == 0:
            with open("paises.json", "r", encoding="utf-8") as f:
                dados = json.load(f)
                nomes = [pais["nomePais"] for pais in dados]
                for nome in nomes:
                    c.execute(
                        """
                        INSERT INTO paises (nome)
                            VALUES (?);

                        """,
                        (nome,),
                    )

        conn.commit()
