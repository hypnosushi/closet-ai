import rembg

async def parse_clothing_img(file_url: str) -> dict[str, str]:
	"""
	Placeholder vision parser. Replace with real implementation.
	Returns extracted metadata such as name, category, color, etc.
	"""
	return {}


async def process_image(raw_bytes: bytes) -> bytes:
	"""
	Placeholder image processing function. Replace with real implementation.
	Processes the raw image bytes and returns the processed bytes.
	1. Remove background
	2. Soften wrinkles
	3. Remove empty transparent space
	4. Normalize size and orientation
	"""
	return raw_bytes
