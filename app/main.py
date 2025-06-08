from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.controllers.prediction_controller import router as prediction_router
from app.controllers.health_controller import router as health_router

# Create FastAPI app
app = FastAPI(
    title="Cardiovascular Heart Disease Prediction API",
    description="API for predicting heart disease risk based on patient data using multiple ML models",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(prediction_router)
app.include_router(health_router)

@app.get("/")
async def root():
    return {"message": "Welcome to the Cardiovascular Heart Disease Prediction API"}
