from fastapi import APIRouter, HTTPException, Depends
from app.schemas.patient import PatientData, ModelPrediction, AllPredictionsResponse, SingleModelResponse
from app.models.predictor import HeartDiseasePredictor
import numpy as np
from typing import List

router = APIRouter(tags=["predictions"])

# Initialize predictor
predictor = HeartDiseasePredictor()

@router.get("/models", summary="List all available models")
async def list_models() -> dict:
    """
    List all available prediction models
    """
    return {"available_models": predictor.get_available_models()}

@router.post("/predict_all", response_model=AllPredictionsResponse, summary="Get predictions from all models")
async def predict_with_all_models(data: PatientData) -> AllPredictionsResponse:
    """
    Make predictions using all available models and return a consensus result
    """
    try:
        # Convert input data to numpy array
        features = np.array([
            data.age, data.sex, data.cp, data.trestbps, data.chol, 
            data.fbs, data.restecg, data.thalach, data.exang, 
            data.oldpeak, data.slope, data.ca, data.thal
        ])
        
        # Get predictions from all models
        all_predictions = predictor.predict_with_all_models(features)
        
        # Get consensus prediction
        consensus, risk_level, agreement = predictor.get_consensus_prediction(all_predictions)
        
        # Create recommendation based on consensus
        if consensus == 1:
            recommendation = "Please consult a healthcare professional for a thorough evaluation."
        else:
            recommendation = "Continue maintaining a healthy lifestyle with regular check-ups."
        
        # Format predictions for response model
        formatted_predictions = {}
        for model_key, pred in all_predictions.items():
            if pred["prediction"] is not None:
                formatted_predictions[model_key] = ModelPrediction(
                    prediction=pred["prediction"],
                    probability=pred["probability"] if pred["probability"] is not None else 0.0,
                    risk_level=pred["risk_level"]
                )
        
        return AllPredictionsResponse(
            predictions=formatted_predictions,
            consensus_prediction=consensus,
            consensus_risk_level=risk_level,
            recommendation=recommendation,
            model_agreement_percentage=agreement
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/predict/{model_name}", response_model=SingleModelResponse, summary="Get prediction from a specific model")
async def predict_with_specific_model(data: PatientData, model_name: str) -> SingleModelResponse:
    """
    Make a prediction using a specific model
    """
    if model_name not in predictor.models:
        raise HTTPException(status_code=404, detail=f"Model '{model_name}' not found")
    
    try:
        # Convert input data to numpy array
        features = np.array([
            data.age, data.sex, data.cp, data.trestbps, data.chol, 
            data.fbs, data.restecg, data.thalach, data.exang, 
            data.oldpeak, data.slope, data.ca, data.thal
        ])
        
        # Make prediction
        prediction, probability, risk_level = predictor.predict_with_model(features, model_name)
        
        # Create recommendation
        recommendation = "Please consult a healthcare professional for a thorough evaluation." if prediction == 1 else "Continue maintaining a healthy lifestyle with regular check-ups."
        
        return SingleModelResponse(
            model=model_name,
            prediction=prediction,
            probability=float(probability) if probability is not None else 0.0,
            risk_level=risk_level,
            recommendation=recommendation
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
