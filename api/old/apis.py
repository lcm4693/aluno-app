import os
import time
import sqlite3
import unicodedata
from flask import Flask, request, jsonify, send_from_directory, make_response
from flask_cors import CORS
from werkzeug.utils import secure_filename
from PIL import Image


app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = os.path.join("static", "fotos")
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
DB_PATH = "alunos.db"


def executar_query(query):
    """
    Imprime a query SQL que será executada.
    """
    with sqlite3.connect(DB_PATH) as conn:
        c = conn.cursor()
        print("Executando query:", query)
        c.execute(query)
        rows = c.fetchall()
        for row in rows:
            print(row)


def rodar_script():
    """
    Executa o script de carregamento no banco de dados.
    """
    executar_query("SELECT * FROM alunos WHERE id = 48")
    # executar_query("SELECT * FROM aluno_idioma")
    # executar_query("SELECT * FROM idiomas")
    # executar_query("SELECT * FROM aula")
    # executar_query(
    #     "UPDATE alunos SET nome = 'Geovanna de Melo', nivel = 'B2', foto = 'foto_1749785735.png' WHERE id = 48"
    # )


# --- Inicializa o banco se não existir ---
def init_db():
    with sqlite3.connect(DB_PATH) as conn:
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
                id SERIAL PRIMARY KEY AUTOINCREMENT,
                data DATE NOT NULL,
                anotacoes TEXT NOT NULL,
                comentarios TEXT,
                proxima_aula TEXT,
                aluno_id INTEGER NOT NULL,
            CONSTRAINT fk_aluno FOREIGN KEY (aluno_id)
            REFERENCES alunos(id)
            ON DELETE CASCADE
);
        """
        )

        conn.commit()


def remover_acentos(texto):
    if texto is None:
        return ""
    return "".join(
        c
        for c in unicodedata.normalize("NFD", texto)
        if unicodedata.category(c) != "Mn"
    )


# --- Função utilitária ---
def aluno_dict(row):
    keys = [
        "id",
        "nome",
        "mora",
        "cidade_natal",
        "familia",
        "profissao",
        "nivel",
        "hobbies",
        "idade",
        "pontos",
        "linkPerfil",
        "foto",
    ]
    return dict(zip(keys, row))


# --- Rotas API ---


@app.route("/api/alunos", methods=["GET"])
def get_alunos():
    with sqlite3.connect(DB_PATH) as conn:
        c = conn.cursor()
        c.execute("SELECT * FROM alunos WHERE deletado = 0 ORDER BY nome")
        alunos = [aluno_dict(row) for row in c.fetchall()]
    return jsonify(alunos)


@app.route("/api/alunos/informacoes-basicas/<int:aluno_id>", methods=["PUT"])
def atualizar_aluno(aluno_id):
    dados = request.get_json()
    # Extrair os campos a serem atualizados
    campos = [
        "mora",
        "cidadeNatal",
        "familia",
        "profissao",
        "hobbies",
        "idade",
        "pontos",
        "linkPerfil",
    ]
    valores = [dados.get(campo) for campo in campos]

    try:
        with sqlite3.connect(DB_PATH) as conn:
            c = conn.cursor()

            # Verifica se o aluno existe
            c.execute(
                "SELECT id FROM alunos WHERE id = ? AND deletado = 0", (aluno_id,)
            )
            if not c.fetchone():
                return make_response(jsonify({"erro": "Aluno não encontrado"}), 404)

            # Atualiza os dados
            c.execute(
                f"""
                UPDATE alunos SET
                    mora = ?, cidade_natal = ?, familia = ?, profissao = ?,
                    hobbies = ?, idade = ?, pontos = ?, link_perfil = ?
                WHERE id = ?
            """,
                valores + [aluno_id],
            )

            conn.commit()
            return jsonify({"mensagem": "Aluno atualizado com sucesso"}), 200

    except Exception as e:
        return make_response(jsonify({"erro": str(e)}), 500)


@app.route("/api/alunos/<int:aluno_id>", methods=["GET"])
def get_aluno(aluno_id):
    with sqlite3.connect(DB_PATH) as conn:
        conn.row_factory = sqlite3.Row
        c = conn.cursor()
        c.execute("SELECT * FROM alunos WHERE id = ? AND deletado = 0", (aluno_id,))
        row = c.fetchone()

        if not row:
            return jsonify({"error": "Aluno não encontrado"}), 404

        # Converter aluno para dict
        aluno = aluno_dict(row)
        aluno["cidadeNatal"] = aluno["cidade_natal"]
        aluno.pop("cidade_natal")  # Remove a chave antiga

        # Buscar aulas do aluno
        c.execute(
            "SELECT * FROM aula WHERE aluno_id = ? ORDER BY data DESC ", (aluno_id,)
        )
        aulas_rows = c.fetchall()

        # Transformar aulas em lista de dicionários
        aulas = []
        for aula in aulas_rows:
            aulas.append(
                {
                    "id": aula["id"],
                    "dataAula": aula["data"],
                    "anotacoes": aula["anotacoes"],
                    "comentarios": aula["comentarios"],
                    "proxima_aula": aula["proxima_aula"],
                }
            )

        # Adiciona as aulas no objeto do aluno
        aluno["aulas"] = aulas

        # Buscar idiomas do aluno
        c.execute("SELECT idioma_id FROM aluno_idioma WHERE aluno_id = ?", (aluno_id,))
        idiomas_rows = c.fetchall()

        # Transformar em array de strings
        idiomas = [row["idioma_id"] for row in idiomas_rows]

        # Adicionar ao objeto do aluno
        aluno["idiomas"] = idiomas

        return jsonify(aluno)


@app.route("/api/aluno_com_foto", methods=["POST"])
def criar_aluno_com_foto():
    nome = request.form.get("nome")
    mora = request.form.get("mora")
    cidade_natal = request.form.get("cidadeNatal")
    familia = request.form.get("familia")
    profissao = request.form.get("profissao")
    nivel = request.form.get("nivel")
    hobbies = request.form.get("hobbies")
    idade = request.form.get("idade")
    pontos = request.form.get("pontos")
    linkPerfil = request.form.get("linkPerfil")
    idiomas = request.form.getlist("idiomas")  # <- Lista de idiomas enviados

    idade = int(idade) if idade else None

    foto_file = request.files.get("foto")
    foto_filename = None

    ALLOWED_EXTENSIONS = {".png", ".jpg", ".jpeg"}

    def allowed_file(filename):
        return os.path.splitext(filename)[1].lower() in ALLOWED_EXTENSIONS

    if foto_file and allowed_file(foto_file.filename):
        os.makedirs(UPLOAD_FOLDER, exist_ok=True)
        timestamp = int(time.time())
        filename_base = secure_filename(
            foto_file.filename.split(".")[0].lower().replace(" ", "_")
        )
        ext = os.path.splitext(foto_file.filename)[1] or ".png"
        foto_filename = f"{filename_base}_{timestamp}{ext}"
        foto_path = os.path.join(UPLOAD_FOLDER, foto_filename)

        # 🧠 Compacta imagem com Pillow
        image = Image.open(foto_file.stream)

        image = image.convert("RGB")  # importante para evitar erros com PNGs
        image.save(foto_path, format="JPEG", quality=50, optimize=True)

    elif foto_file:
        return jsonify({"error": "Formato de imagem não suportado"}), 400

    with sqlite3.connect(DB_PATH) as conn:
        try:
            c = conn.cursor()
            c.execute(
                """
                INSERT INTO alunos (
                    nome, mora, cidade_natal, familia, profissao,
                    nivel, hobbies, idade, pontos, link_perfil, foto
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    nome,
                    mora,
                    cidade_natal,
                    familia,
                    profissao,
                    nivel,
                    hobbies,
                    idade,
                    pontos,
                    linkPerfil,
                    foto_filename,
                ),
            )
            aluno_id = c.lastrowid

            # Relacionar idiomas usando IDs diretamente
            for idioma_id in idiomas:
                print(idioma_id)
                c.execute(
                    "INSERT INTO aluno_idioma (aluno_id, idioma_id) VALUES (?, ?)",
                    (aluno_id, idioma_id),
                )

            conn.commit()
        except Exception as e:
            conn.rollback()  # <- desfaz tudo, inclusive a inserção do aluno
            print(f"Erro na criação do aluno ou inserção de idiomas: {e}")
            return jsonify({"error": "Erro ao salvar aluno"}), 500

    return jsonify({"id": aluno_id, "foto": foto_filename}), 201


@app.route("/api/alunos/<int:aluno_id>", methods=["DELETE"])
def deletar_aluno(aluno_id):
    try:
        print("CHEGOU AQUI")
        with sqlite3.connect(DB_PATH) as conn:
            c = conn.cursor()

            # Verifica se o aluno existe antes de deletar
            c.execute("SELECT * FROM alunos WHERE id = ? AND deletado = 0", (aluno_id,))
            aluno = c.fetchone()
            if not aluno:
                return make_response(
                    jsonify({"erro": "Aluno não encontrado na base de dados"}), 404
                )

            # Executa a exclusão
            c.execute("UPDATE alunos SET deletado = 1 WHERE id = ?", (aluno_id,))
            conn.commit()

            return make_response(
                jsonify({"mensagem": "Aluno excluído com sucesso"}), 200
            )

    except sqlite3.Error as e:
        print(f"[ERRO] Banco de dados: {e}")
        return make_response(jsonify({"erro": "Erro interno no banco de dados"}), 500)

    except Exception as e:
        print(f"[ERRO] Exceção inesperada: {e}")
        return make_response(jsonify({"erro": "Erro inesperado"}), 500)


@app.route("/api/idiomas/<int:aluno_id>", methods=["PUT"])
def atualizar_idiomas(aluno_id):
    dados = request.get_json()
    try:
        with sqlite3.connect(DB_PATH) as conn:
            c = conn.cursor()

            # Verifica se o aluno existe
            c.execute(
                "SELECT id FROM alunos WHERE id = ? AND deletado = 0", (aluno_id,)
            )
            if not c.fetchone():
                return make_response(jsonify({"erro": "Aluno não encontrado"}), 404)

            # Atualizar idiomas do aluno
            # 1. Remover os idiomas antigos
            c.execute("DELETE FROM aluno_idioma WHERE aluno_id = ?", (aluno_id,))

            # 2. Inserir os novos idiomas
            for idioma_id in dados:
                c.execute(
                    """
                    INSERT INTO aluno_idioma (aluno_id, idioma_id)
                    VALUES (?, ?)
                """,
                    (aluno_id, idioma_id),
                )

            conn.commit()
            return jsonify({"mensagem": "Aluno atualizado com sucesso"}), 200

    except Exception as e:
        return make_response(jsonify({"erro": str(e)}), 500)


@app.route("/api/idiomas", methods=["GET"])
def listar_idiomas():
    with sqlite3.connect(DB_PATH) as conn:
        conn.create_function("sem_acento", 1, remover_acentos)
        c = conn.cursor()
        c.execute(
            "SELECT id, nome FROM idiomas ORDER BY sem_acento(nome) COLLATE NOCASE "
        )
        idiomas = [{"id": row[0], "nome": row[1]} for row in c.fetchall()]
    return jsonify(idiomas)


@app.route("/api/alunos/foto/<filename>")
def serve_foto(filename):
    try:
        print("Arquivo: ", filename)
        if filename == "null":
            raise Exception("Filename is null")
        return send_from_directory(UPLOAD_FOLDER, filename)
    except Exception:
        # Se a imagem não for encontrada, retorna uma imagem padrão (ex: "default.jpg")
        try:
            default_image = "foto0.png"
            return send_from_directory(UPLOAD_FOLDER, default_image)
        except Exception:
            # Se nem a imagem padrão existir, retorna erro 404
            abort(404)


@app.route("/api/aluno/<aluno>/aula", methods=["POST"])
def criar_aula(aluno):
    dados = request.get_json()
    print(f"Recebendo requisição para criar aula do aluno: {dados}")
    dataAula = dados.get("dataAula")
    anotacoes = dados.get("anotacoes")
    comentarios = dados.get("comentarios")
    proximaAula = dados.get("proximaAula")

    with sqlite3.connect(DB_PATH) as conn:
        try:
            c = conn.cursor()
            c.execute(
                """
                INSERT INTO aula (
                    data, anotacoes, comentarios, proxima_aula, aluno_id) VALUES (?, ?, ?, ?, ?)
                """,
                (
                    dataAula,
                    anotacoes,
                    comentarios,
                    proximaAula,
                    aluno,
                ),
            )

            conn.commit()
        except Exception as e:
            conn.rollback()  # <- desfaz tudo, inclusive a inserção do aluno
            print(f"Erro na criação da aula: {e}")
            return jsonify({"error": "Erro ao salvar aula"}), 500

    return jsonify({"id": aluno}), 201


if __name__ == "__main__":
    rodar_script()
    init_db()
    app.run(debug=True)
