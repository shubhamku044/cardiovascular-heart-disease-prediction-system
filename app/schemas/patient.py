from pydantic import BaseModel
from typing import Dict, Optional

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

class ModelPrediction(BaseModel):
    prediction: int  # 0 = low risk, 1 = high risk
    probability: float
    risk_level: str

class AllPredictionsResponse(BaseModel):
    predictions: Dict[str, ModelPrediction]
    consensus_prediction: int
    consensus_risk_level: str
    recommendation: str
    model_agreement_percentage: float

class SingleModelResponse(BaseModel):
    model: str
    prediction: int
    probability: float
    risk_level: str
    recommendation: str
