import uuid
import boto3
from botocore.client import Config
from fastapi import UploadFile
from app.core.config import settings

def get_minio_client():
	return boto3.client(
		"s3",
		endpoint_url=settings.MINIO_ENDPOINT,
		aws_access_key_id=settings.MINIO_ACCESS_KEY,
		aws_secret_access_key=settings.MINIO_SECRET_KEY,
		config=Config(signature_version="s3v4")
	)


async def save_upload(file: UploadFile) -> str:
	"""
	Uploads a file to MinIO and returns its public URL.
	"""
	ext = file.filename.split(".")[-1] if file.filename and "." in file.filename else "jpg"
	key = f"clothing/{uuid.uuid4().hex}.{ext}"

	contents = await file.read()

	client = get_minio_client()
	client.put_object(
		Bucket=settings.MINIO_BUCKET_NAME,
		Key=key,
		Body=contents,
		ContentType=file.content_type or "image/jpeg"
	)
	return f"{settings.MINIO_ENDPOINT}/{settings.MINIO_BUCKET_NAME}/{key}"
