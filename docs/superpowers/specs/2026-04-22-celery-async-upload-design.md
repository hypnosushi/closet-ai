# Celery Async Image Processing — Design Spec

**Date:** 2026-04-22
**Branch:** rembg-integration-for-image-processing

---

## Goal

Move image processing off the FastAPI request thread into a Celery background task. The user gets an immediate response, sees a loading toast while the image is processed, then lands on a review page pre-filled with the processed image and extracted metadata to confirm before saving to the DB.

---

## Message Transport

Redis is used as both broker and backend. Redis works well for small messages but can congest on large payloads — raw image files can be several MBs, so we do not pass bytes through the broker.

Instead, the API saves the raw upload to S3 first and passes only the S3 key (a short string) to the task. The worker fetches the raw file from S3, processes it, and overwrites it with the processed PNG.

---

## Data Flow

```
POST /wardrobe/upload
  → read file bytes
  → save raw file to S3 (e.g. raw/uuid.jpg)
  → dispatch process_upload Celery task (s3_key as arg)
  → return {task_id} immediately (HTTP 202)

Celery worker (separate process):
  → fetch raw file from S3 by key
  → process_image()              — rembg background removal + normalization
  → save_upload()                — overwrite S3 object with processed PNG
  → extract_clothing_metadata()  — vision metadata extraction (placeholder for now)
  → store {img_url, metadata} in Redis via Celery result backend

Frontend polls GET /tasks/{task_id} every 2s:
  → PENDING  → keep showing loading toast
  → SUCCESS  → dismiss toast, navigate to review page with result
  → FAILURE  → dismiss toast, show error toast

Review page:
  → shows processed image + form pre-filled with metadata
  → user edits if needed, hits confirm
  → POST /wardrobe → item saved to DB
```

**Orphaned S3 files:** If the user abandons the review page, the processed image remains in S3 with no DB record. Accepted for now — a periodic cleanup Celery task is future work.

---

## Architecture

### New files

**`server/app/worker.py`** — Celery app instance
- Creates the Celery app pointed at Redis (broker + result backend)
- Uses `worker_process_init` signal to load the rembg session once per worker process into a module-level variable
- This avoids loading a new session per task call — 4 worker processes = 4 sessions total

**`server/app/tasks/image.py`** — `process_upload` task
- Receives `s3_key` (string) — not raw bytes
- Fetches raw file from S3, reads bytes
- Reads rembg session from module-level variable set at worker init
- Calls `process_image()`, `save_upload()`, `extract_clothing_metadata()`
- Returns `{"img_url": str, "metadata": dict}`

### Modified files

**`server/app/api/routes/wardrobe.py`**
- `POST /wardrobe/upload` — saves raw upload to S3, dispatches task with s3_key, returns `{"task_id": str}` with HTTP 202
- New `GET /tasks/{task_id}` endpoint — calls `AsyncResult(task_id)`, returns status + result

**`server/app/main.py`**
- Remove rembg session from `app.state` lifespan — worker manages its own session now

---

## Task Result Schema

```json
{
  "status": "PENDING" | "SUCCESS" | "FAILURE",
  "img_url": "http://minio:9000/closet-ai/abc123.png",
  "metadata": {
    "name": "Blue Jacket",
    "category": "tops",
    "color": "blue",
    "material": "cotton",
    "brand": "",
    "price": null
  }
}
```

---

## Frontend Changes

- `POST /wardrobe/upload` → store returned `task_id`
- Start polling `GET /tasks/{task_id}` every 2s
- Show loading toast while `status === "PENDING"`
- On `SUCCESS`: navigate to review page, passing `img_url` + `metadata` as route state
- On `FAILURE`: show error toast
- Review page: pre-filled form with confirm button → `POST /wardrobe`

---

## rembg Session in the Worker

FastAPI stores the rembg session in `app.state` — Celery workers are separate processes and cannot access this. The worker loads its own session using Celery's `worker_process_init` signal:

```python
# worker.py
_rembg_session = None

@worker_process_init.connect
def init_worker(**kwargs):
    global _rembg_session
    _rembg_session = new_session("u2net")
```

This runs once when each worker process starts, not once per task.

---

## What This Does Not Include

- Cleanup job for orphaned S3 files (future work)
- WebSocket notifications (polling is sufficient for now)
- Real vision metadata extraction (`extract_clothing_metadata` remains a placeholder)
- Task progress reporting (just PENDING/SUCCESS/FAILURE)
