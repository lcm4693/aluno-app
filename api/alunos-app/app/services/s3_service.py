import boto3
from uuid import uuid4
from app.config import Config

s3 = boto3.client(
    "s3",
    region_name=Config.AWS_S3_REGION,
    aws_access_key_id=Config.AWS_ACCESS_KEY_ID,
    aws_secret_access_key=Config.AWS_SECRET_ACCESS_KEY,
)


def upload_imagem_s3(buffer, extensao, pasta=Config.AWS_S3_PASTA):
    nome_arquivo = f"{pasta}/{uuid4()}.{extensao}"

    s3.upload_fileobj(
        buffer,
        Config.AWS_S3_BUCKET,
        nome_arquivo,
        ExtraArgs={"ContentType": "image/" + extensao},
    )

    # url = f"https://{Config.AWS_S3_BUCKET}.s3.amazonaws.com/{nome_arquivo}"
    return nome_arquivo
