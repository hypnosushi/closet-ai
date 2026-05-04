from rembg import remove
from rembg.sessions.base import BaseSession
import cv2
from PIL import Image
import io
import numpy as np


async def process_image(raw_bytes: bytes, rembg_session: BaseSession) -> bytes:
    """
    Processes raw image bytes into a normalized clothing photo.
    Steps:
    1. Remove background (rembg)
    2. Crop to tight bounding box (remove empty transparent space)
    3. Soften wrinkles (OpenCV bilateral filter)
    4. Normalize to 512x512 canvas preserving aspect ratio
    Returns PNG bytes with transparent background.
    """
    # 1. Remove background
    result_bytes = remove(raw_bytes, session=rembg_session)
    pil_img = Image.open(io.BytesIO(result_bytes))
    img_arr = cv2.cvtColor(np.array(pil_img), cv2.COLOR_RGBA2BGRA)

    # 2. Crop to tight bounding box of non-transparent pixels
    img = standardize(img_arr)
    if img is None:
        raise ValueError("No content found in image")

    # 3. Soften wrinkles 
    # TODO: bilateralFilter does poorly on fabric wrinkles. Consider more advanced methods like inpainting
    img = cv2.bilateralFilter(img, d=9, sigmaColor=75, sigmaSpace=75)

    # 4. Normalize to 512x512 canvas
    processed_img = pad_to_square(img, size=512)
    final_img = flatten_to_color(processed_img)
    ok, png_arr = cv2.imencode(".png", final_img)
    if not ok:
        raise ValueError("Unable to encode processed image")
    return png_arr.tobytes()

async def extract_clothing_metadata(image_url: str) -> dict[str, str]:
	"""
	Placeholder vision parser. Replace with real implementation.
	Returns extracted metadata such as name, category, color, etc.
	"""
	return {}

def crop_to_content(img: np.ndarray) -> np.ndarray | None:
	"""
	Crops an image to the tight bounding box of non-transparent pixels.
	Assumes input is BGRA with transparency.
	"""
	assert img.shape[2] == 4, "Image must have alpha channel"

	alpha = img[:, :, 3]  # extract alpha channel
	
	# find all pixels where alpha > 0 (non-transparent)
	coords = np.argwhere(alpha > 0)  # returns array of [row, col] pairs
	if coords.size == 0:
		return None
	y_min, x_min = coords.min(axis=0)
	y_max, x_max = coords.max(axis=0)

	return img[y_min:y_max+1, x_min:x_max+1]

def pad_to_square(img: np.ndarray, size:int = 768, padding: float = 0.08) -> np.ndarray:
	"""
	Pads an image to a square canvas of given size, centering the content.
	"""
	h, w = img.shape[:2]
	
	# scale down to fit within size x size
	scale = size / max(h, w) * (1-2*padding)
	new_h, new_w = int(h * scale), int(w * scale)
	resized = cv2.resize(img, (new_w, new_h), interpolation=cv2.INTER_AREA)
	
	# create blank square canvas
	canvas = np.zeros((size, size, 4), dtype=np.uint8)
	
	# center the garment on the canvas
	y_offset = (size - new_h) // 2
	x_offset = (size - new_w) // 2
	canvas[y_offset:y_offset+new_h, x_offset:x_offset+new_w] = resized
	
	return canvas

def flatten_to_color(img_bgra: np.ndarray, bg_color=(255, 255, 255)) -> np.ndarray:
	"""
	Alpha-composites a BGRA image onto a solid background color.
	Returns a BGR image (no alpha channel).
	bg_color is BGR, default is white.
	"""
	alpha = img_bgra[:, :, 3:4] / 255.0
	bgr = img_bgra[:, :, :3].astype(np.float32)
	background = np.full_like(bgr, bg_color, dtype=np.float32)
	composited = (bgr * alpha + background * (1 - alpha)).astype(np.uint8)
	return composited

def standardize(img_bgra, size=768) -> np.ndarray:
	cropped = crop_to_content(img_bgra)
	if cropped is None:
		raise ValueError("No content found in image")
	standardized = pad_to_square(cropped, size=size)
	return standardized  # always size x size, garment centered, transparent bg

