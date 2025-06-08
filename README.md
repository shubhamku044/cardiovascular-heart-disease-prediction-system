# Cardiovascular Heart Disease Prediction System

A comprehensive system for predicting heart disease risk using multiple machine learning models. This project includes model training, a RESTful API for serving predictions, and a user-friendly frontend interface.

## Project Structure

```
├── app/                    # Backend API application
│   ├── controllers/        # API route handlers
│   ├── models/             # Model loading and prediction logic
│   ├── schemas/            # Pydantic data models
│   └── main.py             # FastAPI application entry point
├── frontend/               # Frontend React application
│   ├── src/                # Source code
│   │   ├── components/     # React components
│   │   └── App.tsx         # Main application component
├── pickles/                # Serialized ML models and scalers
├── generate_model_pickles.py  # Script to train and save models
├── model_loader.py         # Utility for loading models
├── run.py                  # Script to run the API server
└── requirements.txt        # Python dependencies
```

## Features

- **Multiple ML Models**: Uses KNN, Logistic Regression, Naive Bayes, and Random Forest classifiers
- **Consensus Prediction**: Combines results from all models for more reliable predictions
- **Detailed Risk Analysis**: Provides risk level and recommendations based on predictions
- **Modern Frontend**: User-friendly interface built with React and styled with Tailwind CSS
- **RESTful API**: Well-structured FastAPI backend with proper organization

## Setup Instructions

### Backend Setup

1. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

2. Generate model pickle files (if not already present):
   ```bash
   python generate_model_pickles.py
   ```

3. Run the API server:
   ```bash
   python run.py
   ```
   The API will be available at http://localhost:8000

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```
   The frontend will be available at http://localhost:5173

## API Endpoints

- `GET /`: Welcome message
- `GET /health`: API health check
- `GET /models`: List all available prediction models
- `POST /predict_all`: Get predictions from all models with consensus
- `POST /predict/{model_name}`: Get prediction from a specific model

## Input Features

The prediction API expects the following patient data:

- `age`: Patient's age
- `sex`: Gender (1 = male, 0 = female)
- `cp`: Chest pain type (0-3)
- `trestbps`: Resting blood pressure (mm Hg)
- `chol`: Serum cholesterol (mg/dl)
- `fbs`: Fasting blood sugar > 120 mg/dl (1 = true, 0 = false)
- `restecg`: Resting ECG results (0-2)
- `thalach`: Maximum heart rate achieved
- `exang`: Exercise induced angina (1 = yes, 0 = no)
- `oldpeak`: ST depression induced by exercise
- `slope`: Slope of peak exercise ST segment (0-2)
- `ca`: Number of major vessels colored by fluoroscopy (0-3)
- `thal`: Thalassemia (0 = normal, 1 = fixed defect, 2 = reversible defect)

## Example Usage

```python
import requests

# Sample patient data
data = {
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

# Get predictions from all models
response = requests.post("http://localhost:8000/predict_all", json=data)

# Print results
print(response.json())
```