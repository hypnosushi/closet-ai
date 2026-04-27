from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from rembg import new_session
from app.api.routes import chat, auth
from app.models import Base
from app.db.session import engine
from app.api.routes import wardrobe

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup code
    Base.metadata.create_all(bind=engine)
    app.state.rembg_session = new_session("u2net")
    yield
    
app = FastAPI(title="Closet AI", lifespan=lifespan)

# CORS config
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Vite dev server
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
    allow_credentials=True,  # Allow cookies and auth headers
)

app.include_router(wardrobe.router)
app.include_router(chat.router)
app.include_router(auth.router)


@app.get("/health")
async def health():
    return {"status": "ok"}
