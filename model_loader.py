#!/usr/bin/env python3
"""
Model Loader Utility

This utility provides functions to load different machine learning models
for the cardiovascular heart disease prediction system.
"""

import pickle
import os
import numpy as np
from sklearn.preprocessing import StandardScaler, MinMaxScaler

class ModelLoader:
    """
    A utility class for loading and managing different machine learning models
    for heart disease prediction.
    """
    
    AVAILABLE_MODELS = [
        'knn',
        'logistic_regression',
        'naive_bayes',
        'random_forest'
    ]
    
    def __init__(self, model_type='knn', scaling='normalized'):
        """
        Initialize the model loader.
        
        Args:
            model_type (str): Type of model to load ('knn', 'logistic_regression', 
                             'naive_bayes', 'random_forest')
            scaling (str): Scaling method ('scaled' or 'normalized')
        """
        self.model = None
        self.scaler = None
        self.model_type = model_type
        self.scaling = scaling
        
        # Load the model and appropriate scaler
        self.load_model()
        
    def load_model(self):
        """Load the specified model and its corresponding scaler."""
        if self.model_type not in self.AVAILABLE_MODELS:
            raise ValueError(f"Model type must be one of {self.AVAILABLE_MODELS}")
        
        if self.scaling not in ['scaled', 'normalized']:
            raise ValueError("Scaling must be either 'scaled' or 'normalized'")
        
        # Determine model and scaler file paths
        model_path = f"{self.model_type}_model_{self.scaling}.pkl"
        
        if self.scaling == 'scaled':
            scaler_path = "standard_scaler.pkl"
        else:  # normalized
            scaler_path = "minmax_scaler.pkl"
        
        # Check if files exist
        if not os.path.exists(model_path):
            raise FileNotFoundError(f"Model file {model_path} not found")
        
        if not os.path.exists(scaler_path):
            raise FileNotFoundError(f"Scaler file {scaler_path} not found")
        
        # Load model and scaler
        with open(model_path, 'rb') as file:
            self.model = pickle.load(file)
            
        with open(scaler_path, 'rb') as file:
            self.scaler = pickle.load(file)
            
        print(f"Successfully loaded {self.model_type} model with {self.scaling} scaling")
    
    def predict(self, features):
        """
        Make a prediction using the loaded model.
        
        Args:
            features (array-like): Features to use for prediction
            
        Returns:
            tuple: (prediction, probability)
        """
        if self.model is None or self.scaler is None:
            raise ValueError("Model or scaler not loaded")
        
        # Reshape features if needed
        if len(features.shape) == 1:
            features = features.reshape(1, -1)
        
        # Apply appropriate scaling
        features_transformed = self.scaler.transform(features)
        
        # Make prediction
        prediction = self.model.predict(features_transformed)
        
        # Get probability if the model supports it
        try:
            probability = self.model.predict_proba(features_transformed)
            return prediction[0], probability[0]
        except AttributeError:
            # If model doesn't support predict_proba
            return prediction[0], None
    
    def list_available_models(self):
        """List all available models in the system."""
        available_models = []
        
        for model_type in self.AVAILABLE_MODELS:
            for scaling in ['scaled', 'normalized']:
                model_path = f"{model_type}_model_{scaling}.pkl"
                if os.path.exists(model_path):
                    available_models.append(f"{model_type}_{scaling}")
        
        return available_models


# Example usage
if __name__ == "__main__":
    # List all available models
    loader = ModelLoader()
    print("Available models:")
    for model in loader.list_available_models():
        print(f"- {model}")
    
    # Example prediction
    print("\nExample prediction:")
    # Sample data: age, sex, cp, trestbps, chol, fbs, restecg, thalach, exang, oldpeak, slope, ca, thal
    sample = np.array([63, 1, 3, 145, 233, 1, 0, 150, 0, 2.3, 0, 0, 1])
    
    for model_type in loader.AVAILABLE_MODELS:
        for scaling in ['scaled', 'normalized']:
            try:
                model = ModelLoader(model_type=model_type, scaling=scaling)
                prediction, probability = model.predict(sample)
                prob_str = f"{probability[prediction]:.4f}" if probability is not None else "N/A"
                print(f"{model_type}_{scaling}: Prediction={prediction}, Probability={prob_str}")
            except Exception as e:
                print(f"{model_type}_{scaling}: Error - {str(e)}")
