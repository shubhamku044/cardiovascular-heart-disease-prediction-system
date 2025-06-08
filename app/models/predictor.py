import pickle
import numpy as np
import os
from typing import Dict, Tuple, Optional, Any, List

class HeartDiseasePredictor:
    """
    A class for loading and managing multiple heart disease prediction models
    """
    
    def __init__(self, models_dir: str = '/Users/shubhamkumar/Developer/cardiovascular-heart-disease-prediction-system/pickles'):
        """
        Initialize the predictor with models from the specified directory
        
        Args:
            models_dir: Directory containing the model pickle files
        """
        self.models_dir = models_dir
        self.models = {}
        self.scalers = {}
        self.load_models_and_scalers()
        
    def load_models_and_scalers(self) -> None:
        """Load all available models and scalers from the models directory"""
        # Load scalers
        try:
            with open(os.path.join(self.models_dir, 'standard_scaler.pkl'), 'rb') as file:
                self.scalers['standard'] = pickle.load(file)
            
            with open(os.path.join(self.models_dir, 'minmax_scaler.pkl'), 'rb') as file:
                self.scalers['minmax'] = pickle.load(file)
        except FileNotFoundError as e:
            print(f"Error loading scalers: {e}")
            
        # Define model types and scaling methods
        model_types = ['knn', 'logistic_regression', 'naive_bayes', 'random_forest']
        scaling_methods = ['scaled', 'normalized']
        
        # Load all available models
        for model_type in model_types:
            for scaling in scaling_methods:
                model_path = os.path.join(self.models_dir, f"{model_type}_model_{scaling}.pkl")
                model_key = f"{model_type}_{scaling}"
                
                try:
                    with open(model_path, 'rb') as file:
                        self.models[model_key] = pickle.load(file)
                        print(f"Loaded {model_key}")
                except FileNotFoundError:
                    print(f"Model {model_path} not found")
    
    def predict_with_all_models(self, features: np.ndarray) -> Dict[str, Dict[str, Any]]:
        """
        Make predictions using all available models
        
        Args:
            features: Array of features for prediction
            
        Returns:
            Dictionary of model predictions
        """
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
    
    def predict_with_model(self, features: np.ndarray, model_name: str) -> Tuple[int, Optional[float], str]:
        """
        Make a prediction using a specific model
        
        Args:
            features: Array of features for prediction
            model_name: Name of the model to use
            
        Returns:
            Tuple of (prediction, probability, risk_level)
        """
        if model_name not in self.models:
            raise ValueError(f"Model '{model_name}' not found")
        
        # Reshape features for transformation
        features_reshaped = features.reshape(1, -1)
        
        # Use appropriate scaler based on model name
        if '_scaled' in model_name:
            transformed_features = self.scalers['standard'].transform(features_reshaped)
        else:  # '_normalized' in model_name
            transformed_features = self.scalers['minmax'].transform(features_reshaped)
        
        # Make prediction
        model = self.models[model_name]
        prediction = model.predict(transformed_features)[0]
        
        # Get probability if available
        try:
            probability = model.predict_proba(transformed_features)[0][prediction]
        except (AttributeError, IndexError):
            probability = None
        
        # Create risk level
        risk_level = "High risk of heart disease" if prediction == 1 else "Low risk of heart disease"
        
        return int(prediction), probability, risk_level
    
    def get_consensus_prediction(self, predictions: Dict[str, Dict[str, Any]]) -> Tuple[int, str, float]:
        """
        Calculate the consensus prediction from all models
        
        Args:
            predictions: Dictionary of model predictions
            
        Returns:
            Tuple of (consensus_prediction, consensus_risk_level, agreement_percentage)
        """
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
    
    def get_available_models(self) -> List[str]:
        """
        Get a list of all available models
        
        Returns:
            List of model names
        """
        return list(self.models.keys())
