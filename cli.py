import pickle
import numpy as np
from sklearn.preprocessing import MinMaxScaler

class HeartDiseasePredictor:
    def __init__(self, model_path='knn_model_normalized.pkl'):
        self.load_model(model_path)
        self.scaler = MinMaxScaler()
        
    def load_model(self, model_path):
        try:
            with open(model_path, 'rb') as file:
                self.model = pickle.load(file)
        except FileNotFoundError:
            print(f"Error: Model file '{model_path}' not found.")
            exit(1)

    def get_user_input(self):
        print("\n=== Heart Disease Prediction System ===")
        print("Please enter the following information:")
        
        try:
            age = float(input("\nAge: "))
            sex = int(input("Sex (1 = male, 0 = female): "))
            cp = int(input("Chest Pain Type (0-3): "))
            trestbps = float(input("Resting Blood Pressure (in mm Hg): "))
            chol = float(input("Serum Cholesterol (in mg/dl): "))
            fbs = int(input("Fasting Blood Sugar > 120 mg/dl (1 = true, 0 = false): "))
            restecg = int(input("Resting ECG Results (0-2): "))
            thalach = float(input("Maximum Heart Rate Achieved: "))
            exang = int(input("Exercise Induced Angina (1 = yes, 0 = no): "))
            oldpeak = float(input("ST Depression Induced by Exercise: "))
            slope = int(input("Slope of Peak Exercise ST Segment (0-2): "))
            ca = int(input("Number of Major Vessels Colored by Fluoroscopy (0-3): "))
            thal = int(input("Thalassemia (0 = normal, 1 = fixed defect, 2 = reversible defect): "))

            return np.array([age, sex, cp, trestbps, chol, fbs, restecg, 
                           thalach, exang, oldpeak, slope, ca, thal])
        
        except ValueError:
            print("\nError: Please enter valid numerical values.")
            return None

    def predict(self, features):
        # Reshape and normalize the features
        features_reshaped = features.reshape(1, -1)
        features_normalized = self.scaler.fit_transform(features_reshaped)
        
        # Make prediction
        prediction = self.model.predict(features_normalized)
        prediction_proba = self.model.predict_proba(features_normalized)
        
        return prediction[0], prediction_proba[0]

    def display_result(self, prediction, probability):
        print("\n=== Prediction Results ===")
        if prediction == 1:
            print("Result: High risk of heart disease")
        else:
            print("Result: Low risk of heart disease")
            
        print(f"Confidence: {probability[prediction]*100:.2f}%")
        
        if prediction == 1:
            print("\nRecommendation: Please consult a healthcare professional for a thorough evaluation.")
        else:
            print("\nRecommendation: Continue maintaining a healthy lifestyle with regular check-ups.")

def main():
    predictor = HeartDiseasePredictor()
    
    while True:
        features = predictor.get_user_input()
        if features is not None:
            prediction, probability = predictor.predict(features)
            predictor.display_result(prediction, probability)
        
        again = input("\nWould you like to make another prediction? (y/n): ")
        if again.lower() != 'y':
            break
    
    print("\nThank you for using the Heart Disease Prediction System!")

if __name__ == "__main__":
    main()
