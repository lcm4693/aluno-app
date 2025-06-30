# app/utils/date_utils.py

from datetime import datetime, timezone, date, time


def converter_data_para_front(data):
    if not data:
        return None

    if isinstance(data, datetime):
        return data.replace(microsecond=0).isoformat()

    if isinstance(data, date):
        return datetime.combine(data, time.min).isoformat()

    return str(data)  # fallback


def converter_data_para_banco(data):
    if data:
        return datetime.fromisoformat(data.replace("Z", "+00:00")).date()
    return None
