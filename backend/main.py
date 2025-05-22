from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, Column, Integer, String, DateTime, func
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from pydantic import BaseModel
from datetime import datetime, timedelta
import os

# Database setup
SQLALCHEMY_DATABASE_URL = "sqlite:///./faltadas.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Database Models
class Faltada(Base):
    __tablename__ = "faltadas"

    id = Column(Integer, primary_key=True, index=True)
    author = Column(String, index=True)
    motivo = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)

# Create tables
Base.metadata.create_all(bind=engine)

# Pydantic models
class FaltadaCreate(BaseModel):
    author: str
    motivo: str

class FaltadaResponse(FaltadaCreate):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

# FastAPI app
app = FastAPI()

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/faltadas/", response_model=FaltadaResponse)
def create_faltada(faltada: FaltadaCreate, db: Session = Depends(get_db)):
    db_faltada = Faltada(**faltada.model_dump())
    db.add(db_faltada)
    db.commit()
    db.refresh(db_faltada)
    return db_faltada

@app.get("/faltadas/", response_model=list[FaltadaResponse])
def read_faltadas(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    faltadas = db.query(Faltada).order_by(Faltada.created_at.desc()).offset(skip).limit(limit).all()
    return faltadas

@app.get("/faltadas/count")
def get_faltadas_count(db: Session = Depends(get_db)):
    # Get the most recent faltada
    last_faltada = db.query(Faltada).order_by(Faltada.created_at.desc()).first()
    
    if not last_faltada:
        # If no faltadas exist, return 0
        return {"count": 0}
    
    # Calculate days since last faltada
    now = datetime.utcnow()
    days_since = (now - last_faltada.created_at).days
    
    return {"count": days_since}

@app.delete("/faltadas/")
def clear_faltadas(db: Session = Depends(get_db)):
    try:
        db.query(Faltada).delete()
        db.commit()
        return {"message": "All faltadas have been cleared"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 