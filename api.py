import pickle
import numpy as np
from fastapi import FastAPI, HTTPException, Query
from pydantic import BaseModel
from typing import List, Dict, Optional, Any
import uvicorn
import os

# Create FastAPI app
app = FastAPI(
    title="Enhanced Cardiovascular Heart Disease Prediction API",
    description="API for predicting heart disease risk based on patient data using multiple ML models",
    version="1.0.0"
)

# Define input data model
class PatientData(BaseModel):
    age: float
    sex: int  # 1 = male, 0 = female
    cp: int  # Chest Pain Type (0-3)
    trestbps: float  # Resting Blood Pressure (in mm Hg)
    chol: float  # Serum Cholesterol (in mg/dl)
    fbs: int  # Fasting Blood Sugar > 120 mg/dl (1 = true, 0 = false)
    restecg: int  # Resting ECG Results (0-2)
    thalach: float  # Maximum Heart Rate Achieved
    exang: int  # Exercise Induced Angina (1 = yes, 0 = no)
    oldpeak: float  # ST Depression Induced by Exercise
    slope: int  # Slope of Peak Exercise ST Segment (0-2)
    ca: int  # Number of Major Vessels Colored by Fluoroscopy (0-3)
    thal: int  # Thalassemia (0 = normal, 1 = fixed defect, 2 = reversible defect)

    class Config:
        schema_extra = {
            "example": {
                "age": 63,
                "sex": 1,
                "cp": 3,
                "trestbps": 145,
                "chol": 233,
                "fbs": 1,
                "restecg": 0,
                "thalach": 150,
                "exang": 0,
                "oldpeak": 2.3,
                "slope": 0,
                "ca": 0,
                "thal": 1
            }
        }

# Define response model for a single model prediction
class ModelPrediction(BaseModel):
    prediction: int  # 0 = low risk, 1 = high risk
    probability: float
    risk_level: str

# Define response model for all predictions
class AllPredictionsResponse(BaseModel):
    predictions: Dict[str, ModelPrediction]
    consensus_prediction: int
    consensus_risk_level: str
    recommendation: str
    model_agreement_percentage: float

# Class to load and manage all models
class HeartDiseasePredictor:
    def __init__(self):
        self.models = {}
        self.scalers = {}
        self.load_models_and_scalers()
        
    def load_models_and_scalers(self):
        """Load all available models and scalers"""
        # Load scalers
        try:
            with open('standard_scaler.pkl', 'rb') as file:
                self.scalers['standard'] = pickle.load(file)
            
            with open('minmax_scaler.pkl', 'rb') as file:
                self.scalers['minmax'] = pickle.load(file)
        except FileNotFoundError as e:
            print(f"Error loading scalers: {e}")
            
        # Define model types and scaling methods
        model_types = ['knn', 'logistic_regression', 'naive_bayes', 'random_forest']
        scaling_methods = ['scaled', 'normalized']
        
        # Load all available models
        for model_type in model_types:
            for scaling in scaling_methods:
                model_path = f"{model_type}_model_{scaling}.pkl"
                model_key = f"{model_type}_{scaling}"
                
                try:
                    with open(model_path, 'rb') as file:
                        self.models[model_key] = pickle.load(file)
                        print(f"Loaded {model_key}")
                except FileNotFoundError:
                    print(f"Model {model_path} not found")
    
    def predict_with_all_models(self, features):
        """Make predictions using all available models"""
        results = {}
        
        # Reshape features for transformation
        features_reshaped = features.reshape(1, -1)
        
        # Transform features with both scalers
        features_scaled = self.scalers['standard'].transform(features_reshaped)
        features_normalized = self.scalers['minmax'].transform(features_reshaped)
        
        # Make predictions with all models
        for model_key, model in self.models.items():
            try:
                # Use appropriate features based on model type
                if '_scaled' in model_key:
                    transformed_features = features_scaled
                else:  # '_normalized' in model_key
                    transformed_features = features_normalized
                
                # Make prediction
                prediction = model.predict(transformed_features)[0]
                
                # Get probability if available
                try:
                    probability = model.predict_proba(transformed_features)[0][prediction]
                except (AttributeError, IndexError):
                    probability = None
                
                # Create risk level
                risk_level = "High risk of heart disease" if prediction == 1 else "Low risk of heart disease"
                
                # Store results
                results[model_key] = {
                    "prediction": int(prediction),
                    "probability": float(probability) if probability is not None else None,
                    "risk_level": risk_level
                }
            except Exception as e:
                print(f"Error with model {model_key}: {e}")
                results[model_key] = {
                    "prediction": None,
                    "probability": None,
                    "risk_level": f"Error: {str(e)}"
                }
        
        return results
    
    def get_consensus_prediction(self, predictions):
        """Calculate the consensus prediction from all models"""
        valid_predictions = [p["prediction"] for p in predictions.values() if p["prediction"] is not None]
        
        if not valid_predictions:
            return None, None, 0
        
        # Count predictions
        positive_count = sum(1 for p in valid_predictions if p == 1)
        total_count = len(valid_predictions)
        
        # Calculate consensus
        consensus = 1 if positive_count / total_count > 0.5 else 0
        agreement_percentage = (max(positive_count, total_count - positive_count) / total_count) * 100
        
        # Create risk level
        risk_level = "High risk of heart disease" if consensus == 1 else "Low risk of heart disease"
        
        return consensus, risk_level, agreement_percentage

# Initialize predictor
predictor = HeartDiseasePredictor()

@app.get("/")
async def root():
    return {"message": "Welcome to the Enhanced Cardiovascular Heart Disease Prediction API"}

@app.get("/models")
async def list_models():
    """List all available models"""
    return {"available_models": list(predictor.models.keys())}

@app.post("/predict_all", response_model=AllPredictionsResponse)
async def predict_with_all_models(data: PatientData):
    """Make predictions using all available models"""
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

@app.post("/predict/{model_name}")
async def predict_with_specific_model(data: PatientData, model_name: str):
    """Make a prediction using a specific model"""
    if model_name not in predictor.models:
        raise HTTPException(status_code=404, detail=f"Model '{model_name}' not found")
    
    try:
        # Convert input data to numpy array
        features = np.array([
            data.age, data.sex, data.cp, data.trestbps, data.chol, 
            data.fbs, data.restecg, data.thalach, data.exang, 
            data.oldpeak, data.slope, data.ca, data.thal
        ])
        
        # Reshape features for transformation
        features_reshaped = features.reshape(1, -1)
        
        # Use appropriate scaler based on model name
        if '_scaled' in model_name:
            transformed_features = predictor.scalers['standard'].transform(features_reshaped)
        else:  # '_normalized' in model_name
            transformed_features = predictor.scalers['minmax'].transform(features_reshaped)
        
        # Make prediction
        model = predictor.models[model_name]
        prediction = model.predict(transformed_features)[0]
        
        # Get probability if available
        try:
            probability = model.predict_proba(transformed_features)[0][prediction]
        except (AttributeError, IndexError):
            probability = None
        
        # Create response
        risk_level = "High risk of heart disease" if prediction == 1 else "Low risk of heart disease"
        recommendation = "Please consult a healthcare professional for a thorough evaluation." if prediction == 1 else "Continue maintaining a healthy lifestyle with regular check-ups."
        
        return {
            "model": model_name,
            "prediction": int(prediction),
            "probability": float(probability) if probability is not None else None,
            "risk_level": risk_level,
            "recommendation": recommendation
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    return {"status": "healthy", "models_loaded": len(predictor.models)}

if __name__ == "__main__":
    uvicorn.run("enhanced_api:app", host="0.0.0.0", port=8000, reload=True)
