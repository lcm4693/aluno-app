# app/utils/date_utils.py

from datetime import datetime, timezone, time


def converter_data_para_front(data):
    return (
        (datetime.combine(data, time.max)).replace(tzinfo=timezone.utc)
        if data
        else None
    )


def converter_data_para_banco(data):
    if data:
        return datetime.fromisoformat(data.replace("Z", "+00:00")).date()
    return None
