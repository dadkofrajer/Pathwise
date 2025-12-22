from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.portfolio.api import router as portfolio_router, test_router, eligibility_router, profile_router, essay_router

app = FastAPI(title="Portfolio Analyzer API", version="0.1.0")

# CORS middleware for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/healthz")
def healthz():
    return {"status": "ok"}

app.include_router(portfolio_router)
app.include_router(test_router)
app.include_router(eligibility_router)
app.include_router(profile_router)
app.include_router(essay_router)

