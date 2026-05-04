import uuid
import boto3
from botocore.client import Config
from app.core.config import settings

def get_db_client():
	kwargs = {
		"aws_access_key_id": settings.AWS_ACCESS_KEY_ID,
		"aws_secret_access_key": settings.AWS_SECRET_ACCESS_KEY,
		"config": Config(signature_version="s3v4")
	}
	if settings.STORAGE_ENDPOINT:
		kwargs["endpoint_url"] = settings.STORAGE_ENDPOINT

	return boto3.client("s3", **kwargs)


async def save_upload(raw_bytes: bytes) -> str:
	"""
	Uploads a file to S3 and returns its public URL.
	"""
	key = f"clothing/{uuid.uuid4().hex}.png"


	client = get_db_client()
	client.put_object(
		Bucket=settings.S3_BUCKET_NAME,
		Key=key,
		Body=raw_bytes,
		ContentType="image/png"
	)
	return f"{settings.STORAGE_ENDPOINT}/{settings.S3_BUCKET_NAME}/{key}"
