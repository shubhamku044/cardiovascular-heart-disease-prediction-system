from fastapi import APIRouter
from app.models.predictor import HeartDiseasePredictor

router = APIRouter(tags=["health"])

# Initialize predictor
predictor = HeartDiseasePredictor()

@router.get("/health", summary="Check API health")
async def health_check() -> dict:
    """
    Check the health of the API and return the number of loaded models
    """
    return {
        "status": "healthy", 
        "models_loaded": len(predictor.models)
    }
