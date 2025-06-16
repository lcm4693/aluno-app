import logging


def configurar_logger(nome_logger=None):
    logger = logging.getLogger(nome_logger)
    logger.setLevel(logging.DEBUG)  # Nível mínimo global

    if not logger.handlers:
        # Handler para console
        ch = logging.StreamHandler()
        ch.setLevel(logging.DEBUG)

        # Formatação
        formatter = logging.Formatter(
            "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
        )
        ch.setFormatter(formatter)

        logger.addHandler(ch)

    return logger
