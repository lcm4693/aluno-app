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
from app.models.notificacao import Notificacao, TipoNotificacao
from app.services.notificacao_service import *
from sqlalchemy import extract, and_, or_
from datetime import date

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
            .join(Aluno, Aula.aluno_id == Aluno.id)
            .filter(Aula.data >= primeiro_dia, Aula.data <= ultimo_dia)
            .filter(Aluno.id_usuario == id_usuario, Aluno.deletado == False)
            .scalar()
        )

        # Em Python, weekday() retorna: segunda=0 ... domingo=6
        dias_desde_domingo = (hoje.weekday() + 1) % 7  # ajusta pra domingo=0
        domingo = hoje - timedelta(days=dias_desde_domingo)

        aulas_semana = (
            session.query(func.count(Aula.id))
            .filter(Aula.data >= domingo, Aula.data <= hoje)
            .join(Aluno, Aula.aluno_id == Aluno.id)
            .filter(Aluno.id_usuario == id_usuario, Aluno.deletado == False)
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


def buscar_aulas_sem_anotacoes(id_usuario, page, page_size):
    with get_session() as session:

        offset = (page - 1) * page_size

        aulas_sem_anotacao = (
            session.query(Aula.id, Aula.data, Aula.aluno_id, Aluno.nome)
            .join(Aluno, Aula.aluno_id == Aluno.id)
            .filter(Aluno.deletado == False)
            .filter(Aluno.id_usuario == id_usuario)
            .filter(
                or_(
                    Aula.anotacoes == "",
                    Aula.anotacoes == None,
                )
            )
            .order_by(Aula.data.desc())
            .offset(offset)
            .limit(page_size)
            .all()
        )

        lista = [
            {
                "idAluno": aula.aluno_id,
                "dataAula": aula.data,
                "idAula": aula.id,
                "nomeAluno": aula.nome,
            }
            for aula in aulas_sem_anotacao
        ]

        return lista


def buscar_aniversarios_alunos(id_usuario, page, page_size):
    with get_session() as session:

        offset = (page - 1) * page_size

        hoje = datetime.today()
        proximos_dias = [(hoje + timedelta(days=i)) for i in range(0, 7)]

        # Gera pares (dia, mês) para os próximos 7 dias
        dias_e_meses = [(d.day, d.month) for d in proximos_dias]

        # Cria condições OR para cada dia/mês
        condicoes = [
            and_(
                extract("day", Aluno.data_aniversario) == dia,
                extract("month", Aluno.data_aniversario) == mes,
            )
            for dia, mes in dias_e_meses
        ]

        # Monta a query
        alunos = (
            session.query(Aluno)
            .filter(
                Aluno.deletado == False, Aluno.id_usuario == id_usuario, or_(*condicoes)
            )
            .order_by(
                extract("month", Aluno.data_aniversario),
                extract("day", Aluno.data_aniversario),
            )
            .offset(offset)
            .limit(page_size)
            .all()
        )

        lista = [
            {
                "idAluno": aluno.id,
                "dataAniversario": aluno.data_aniversario,
                "nomeAluno": aluno.nome,
            }
            for aluno in alunos
        ]

        return lista


def retornar_notificacoes(id_usuario):
    notificacoes_aulas_sem_anotacao = retornar_notificacoes_aulas_sem_anotacao(
        id_usuario
    )

    notificacoes_aniversarios_alunos = retornar_notificacoes_aniversarios_aluno(
        id_usuario
    )

    lista = {
        "aulasSemAnotacao": notificacoes_aulas_sem_anotacao,
        "aniversariosAlunos": notificacoes_aniversarios_alunos,
    }

    return lista


def retornar_notificacoes_aulas_sem_anotacao(id_usuario):
    notificacoes_existentes = buscar_todas_notificacoes_usuario(
        id_usuario, TipoNotificacao.SEM_ANOTACAO.value
    )

    chaves_existentes = {n["chave_unica"] for n in notificacoes_existentes}

    logger.debug(
        f"retornar_notificacoes_aulas_sem_anotacao - Chaves existentes: {chaves_existentes}"
    )

    notificacoes_nao_lidas = [n for n in notificacoes_existentes if not n["lida"]]

    limite_total = 10
    faltam = limite_total - len(notificacoes_nao_lidas)

    if faltam <= 0:
        return  # já tem 10 ou mais não lidas, não precisa cadastrar mais

    notificacoes_a_cadastrar = []

    pagina = 1

    logger.debug(f"retornar_notificacoes_aulas_sem_anotacao - Faltam: {faltam}")

    while len(notificacoes_a_cadastrar) < faltam:
        aulas = buscar_aulas_sem_anotacoes(id_usuario, pagina, limite_total)
        if not aulas:
            break  # não há mais aulas para buscar

        for aula in aulas:
            chave_unica = f"{TipoNotificacao.SEM_ANOTACAO.value}|{aula['idAula']}"
            logger.debug(
                f"retornar_notificacoes_aulas_sem_anotacao - Chave única: {chave_unica}"
            )
            if chave_unica not in chaves_existentes:
                logger.debug(
                    f"retornar_notificacoes_aulas_sem_anotacao - Chave não tem na lista: {chave_unica}"
                )

                notificacoes_a_cadastrar.append(
                    Notificacao(
                        id_usuario=id_usuario,
                        tipo=TipoNotificacao.SEM_ANOTACAO.value,
                        chave_unica=chave_unica,
                        lida=False,
                        data_evento=aula["dataAula"],
                        data_criacao=date.today(),
                        data_expiracao=get_date_in_one_week(aula["dataAula"]),
                        id_aluno=aula["idAluno"],
                        id_aula=aula["idAula"],
                    )
                )
                if len(notificacoes_a_cadastrar) >= faltam:
                    break  # já temos 10 notificações novas

        pagina += 1  # próxima página

    if notificacoes_a_cadastrar:
        criar_notificacoes_em_lote(notificacoes_a_cadastrar)

    notificacoes_validas_mostrar = buscar_notificacoes_nao_lidas(
        id_usuario, TipoNotificacao.SEM_ANOTACAO.value
    )
    return [
        {
            "idNotificacao": notif.id,
            "nomeAluno": notif.aluno.nome,
            "idAluno": notif.aluno.id,
            "dataAula": converter_data_para_front(notif.aula.data),
            "idAula": notif.aula.id,
        }
        for notif in notificacoes_validas_mostrar
    ]


def retornar_notificacoes_aniversarios_aluno(id_usuario):
    notificacoes_existentes = buscar_todas_notificacoes_usuario(
        id_usuario, TipoNotificacao.ANIVERSARIO.value
    )

    chaves_existentes = {n["chave_unica"] for n in notificacoes_existentes}

    notificacoes_nao_lidas = [n for n in notificacoes_existentes if not n["lida"]]

    limite_total = 10
    faltam = limite_total - len(notificacoes_nao_lidas)

    if faltam <= 0:
        return  # já tem 10 ou mais não lidas, não precisa cadastrar mais

    notificacoes_a_cadastrar = []

    pagina = 1

    while len(notificacoes_a_cadastrar) < faltam:
        alunos = buscar_aniversarios_alunos(id_usuario, pagina, limite_total)
        if not alunos:
            break  # não há mais nada para buscar

        for aluno in alunos:
            chave_unica = f"{TipoNotificacao.ANIVERSARIO.value}|{aluno['idAluno']}"
            if chave_unica not in chaves_existentes:
                notificacoes_a_cadastrar.append(
                    Notificacao(
                        id_usuario=id_usuario,
                        tipo=TipoNotificacao.ANIVERSARIO.value,
                        chave_unica=chave_unica,
                        lida=False,
                        data_evento=aluno["dataAniversario"],
                        data_criacao=date.today(),
                        data_expiracao=get_date_in_one_week(date.today()),
                        id_aluno=aluno["idAluno"],
                        id_aula=None,
                    )
                )
                if len(notificacoes_a_cadastrar) >= faltam:
                    break  # já temos 10 notificações novas
        pagina += 1  # próxima página

    if notificacoes_a_cadastrar:
        criar_notificacoes_em_lote(notificacoes_a_cadastrar)

    notificacoes_validas_mostrar = buscar_notificacoes_nao_lidas(
        id_usuario, TipoNotificacao.ANIVERSARIO.value
    )
    return [
        {
            "idNotificacao": notif.id,
            "nomeAluno": notif.aluno.nome,
            "idAluno": notif.aluno.id,
            "dataAniversario": converter_data_para_front(notif.data_evento),
        }
        for notif in notificacoes_validas_mostrar
    ]


def atualizar_notificacao_marcar_como_lida(notificacao_id, id_usuario):
    with get_session() as session:
        notificacao = (
            session.query(Notificacao)
            .filter(
                Notificacao.id == notificacao_id,
                Notificacao.id_usuario == id_usuario,
                Notificacao.lida == False,
            )
            .first()
        )

        if not notificacao:
            return "Notificação não encontrada", 404

        notificacao.lida = True

        session.add(notificacao)  # opcional, mas explícito

        return (None, 200)
