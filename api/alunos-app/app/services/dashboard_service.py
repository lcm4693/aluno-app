from app.utils.logger_config import configurar_logger
from app.database import get_session
from sqlalchemy import func
from app.models.aluno import Aluno
from app.models.aula import Aula
from app.utils.foto_utils import *
from datetime import date, timedelta
from calendar import monthrange
from app.utils.date_utils import *
from sqlalchemy.orm import aliased

logger = configurar_logger(__name__)


def buscar_cards_estatisticas(id_usuario):
    with get_session() as session:
        total_alunos = (
            session.query(func.count(Aluno.id))
            .filter(Aluno.id_usuario == id_usuario, Aluno.deletado == False)
            .scalar()
        )

        hoje = date.today()

        primeiro_dia = date(hoje.year, hoje.month, 1)
        ultimo_dia = date(hoje.year, hoje.month, monthrange(hoje.year, hoje.month)[1])

        aulasMesAtual = (
            session.query(func.count(Aula.id))
            .filter(Aula.data >= primeiro_dia, Aula.data <= ultimo_dia)
            .scalar()
        )

        # Em Python, weekday() retorna: segunda=0 ... domingo=6
        dias_desde_domingo = (hoje.weekday() + 1) % 7  # ajusta pra domingo=0
        domingo = hoje - timedelta(days=dias_desde_domingo)

        aulas_semana = (
            session.query(func.count(Aula.id))
            .filter(Aula.data >= domingo, Aula.data <= hoje)
            .scalar()
        )

        return {
            "totalAlunos": total_alunos,
            "aulasMesAtual": aulasMesAtual,
            "aulasSemanaAtual": aulas_semana,
        }


def buscar_alunos_favoritos(id_usuario):
    quantidade_alunos_top = 3

    hoje = date.today()
    primeiro_dia = date(hoje.year, hoje.month, 1)
    ultimo_dia = date(hoje.year, hoje.month, monthrange(hoje.year, hoje.month)[1])

    with get_session() as session:
        top_alunos_mes = (
            session.query(
                Aluno.id.label("id"),
                Aluno.nome.label("nomeAluno"),
                Aluno.foto.label("foto"),
                func.count(Aula.id).label("quantidadeAulas"),
            )
            .join(Aluno, Aula.aluno_id == Aluno.id)
            .filter(Aula.data >= primeiro_dia, Aula.data <= ultimo_dia)
            .filter(Aluno.deletado == False)
            .filter(Aluno.id_usuario == id_usuario)
            .group_by(Aluno.id, Aluno.nome, Aluno.foto)
            .order_by(func.count(Aula.id).desc())
            .limit(quantidade_alunos_top)
            .all()
        )

        lista = [
            {
                "id": aluno.id,
                "nomeAluno": aluno.nomeAluno,
                "foto": aluno.foto,
                "quantidadeAulas": aluno.quantidadeAulas,
            }
            for aluno in top_alunos_mes
        ]

        lista = [alterar_nome_foto_para_url_foto(aluno) for aluno in lista]

        return lista


def buscar_alunos_ultimas_aulas(id_usuario):
    quantidade_alunos_ultimas_aulas = 5
    with get_session() as session:

        # Subquery que calcula a contagem total de aulas por aluno
        sub_total_aulas = (
            session.query(
                Aula.aluno_id.label("aluno_id"),
                func.count(Aula.id).label("quantidadeAulas"),
            )
            .group_by(Aula.aluno_id)
            .subquery()
        )

        # Aliases para evitar conflitos
        AlunoAlias = aliased(Aluno)

        # Query principal: últimas aulas
        resultado = (
            session.query(
                Aula.id.label("idAula"),
                Aula.data.label("dataAula"),
                AlunoAlias.id.label("idAluno"),
                AlunoAlias.nome.label("nomeAluno"),
                AlunoAlias.foto.label("foto"),
                sub_total_aulas.c.quantidadeAulas,
            )
            .join(AlunoAlias, Aula.aluno_id == AlunoAlias.id)
            .join(sub_total_aulas, sub_total_aulas.c.aluno_id == AlunoAlias.id)
            .filter(AlunoAlias.id_usuario == id_usuario)
            .order_by(Aula.data.desc())
            .limit(quantidade_alunos_ultimas_aulas)
            .all()
        )

        lista = [
            {
                "idAluno": aluno.idAluno,
                "nomeAluno": aluno.nomeAluno,
                "foto": aluno.foto,
                "idAula": aluno.idAula,
                "dataAula": converter_data_para_front(aluno.dataAula),
                "totalAulas": aluno.quantidadeAulas,
            }
            for aluno in resultado
        ]

        lista = [alterar_nome_foto_para_url_foto(aluno) for aluno in lista]

        return lista
