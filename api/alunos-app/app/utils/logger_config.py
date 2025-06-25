import logging
from app.config import Config


def configurar_logger(nome_logger=None):
    logger = logging.getLogger(nome_logger)

    logLevelEnv = Config.LOG_LEVEL
    logLevel = logging.INFO

    if logLevelEnv == "ERROR":
        logLevel = logging.ERROR
    elif logLevelEnv == "DEBUG":
        logLevel = logging.DEBUG

    logger.setLevel(logLevel)  # Nível mínimo global

    if not logger.handlers:
        # Handler para console
        ch = logging.StreamHandler()
        ch.setLevel(logLevel)

        # Formatação
        formatter = logging.Formatter(
            "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
        )
        ch.setFormatter(formatter)

        logger.addHandler(ch)

    return logger
