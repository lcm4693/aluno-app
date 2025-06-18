# app/database.py

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

        conn.commit()
