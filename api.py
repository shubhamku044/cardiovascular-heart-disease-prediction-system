import pickle
import numpy as np
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from sklearn.preprocessing import MinMaxScaler
from typing import List, Optional
import uvicorn

# Create FastAPI app
app = FastAPI(
    title="Cardiovascular Heart Disease Prediction API",
    description="API for predicting heart disease risk based on patient data",
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

# Define response model
class PredictionResponse(BaseModel):
    prediction: int  # 0 = low risk, 1 = high risk
    probability: float
    risk_level: str
    recommendation: str

# Load the model
class HeartDiseasePredictor:
    def __init__(self, model_path='knn_model_normalized.pkl'):
        self.load_model(model_path)
        self.scaler = MinMaxScaler()
        
    def load_model(self, model_path):
        try:
            with open(model_path, 'rb') as file:
                self.model = pickle.load(file)
        except FileNotFoundError:
            raise Exception(f"Error: Model file '{model_path}' not found.")

    def predict(self, features):
        # Reshape and normalize the features
        features_reshaped = features.reshape(1, -1)
        features_normalized = self.scaler.fit_transform(features_reshaped)
        
        # Make prediction
        prediction = self.model.predict(features_normalized)
        prediction_proba = self.model.predict_proba(features_normalized)
        
        return prediction[0], prediction_proba[0]

# Initialize predictor
predictor = HeartDiseasePredictor()

@app.get("/")
async def root():
    return {"message": "Welcome to the Cardiovascular Heart Disease Prediction API"}

@app.post("/predict", response_model=PredictionResponse)
async def predict_heart_disease(data: PatientData):
    try:
        # Convert input data to numpy array
        features = np.array([
            data.age, data.sex, data.cp, data.trestbps, data.chol, 
            data.fbs, data.restecg, data.thalach, data.exang, 
            data.oldpeak, data.slope, data.ca, data.thal
        ])
        
        # Make prediction
        prediction, probability = predictor.predict(features)
        
        # Create response
        risk_level = "High risk of heart disease" if prediction == 1 else "Low risk of heart disease"
        recommendation = "Please consult a healthcare professional for a thorough evaluation." if prediction == 1 else "Continue maintaining a healthy lifestyle with regular check-ups."
        
        return PredictionResponse(
            prediction=int(prediction),
            probability=float(probability[prediction]),
            risk_level=risk_level,
            recommendation=recommendation
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    uvicorn.run("api:app", host="0.0.0.0", port=8000, reload=True)
