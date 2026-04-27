import argparse
from app.services.vision import process_image
from rembg import new_session
from pathlib import Path

SCRIPT_DIR = Path(__file__).resolve().parent  # scripts/
ASSETS_DIR = SCRIPT_DIR.parent / "assets"     # server/assets/

rembg_session = new_session("u2net")

def main(filename: str , filename_out: str):
    print(f"Opening image: {filename}")
    with open(filename, "rb") as f:
        raw_bytes = f.read()
    print("Processing image...")
    processed_image = process_image(raw_bytes, rembg_session)
    print(f"Saving processed image to: {filename_out}")
    with open(filename_out, "wb") as f:
        f.write(processed_image)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Test image processing pipeline")
    parser.add_argument("--input", type=str, default=str(ASSETS_DIR / "jacket.jpg"))
    parser.add_argument("--output", type=str, default=str(ASSETS_DIR / "processed_jacket.png"))
    args = parser.parse_args()
    main(filename=args.input, filename_out=args.output)
    