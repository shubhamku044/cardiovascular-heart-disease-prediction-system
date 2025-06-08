#!/usr/bin/env python3
"""
Generate Pickle Files for Machine Learning Models

This script generates pickle files for all the machine learning models used in the 
cardiovascular heart disease prediction system. It creates both scaled and normalized 
versions of each model.

Models included:
- KNeighborsClassifier (already exists but recreated for consistency)
- LogisticRegression
- GaussianNB (Naive Bayes)
- RandomForestClassifier
"""

import pickle
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, MinMaxScaler
from sklearn.neighbors import KNeighborsClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.naive_bayes import GaussianNB
from sklearn.ensemble import RandomForestClassifier

# Load the dataset
print("Loading dataset...")
data = pd.read_csv('Data/heart.csv')

# Split features and target
X = data.drop('target', axis=1)
y = data['target']

# Split data into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Scale the features
print("Scaling features...")
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# Normalize the features
print("Normalizing features...")
normalizer = MinMaxScaler()
X_train_normalized = normalizer.fit_transform(X_train)
X_test_normalized = normalizer.transform(X_test)

# Save the scalers
print("Saving scalers...")
with open('standard_scaler.pkl', 'wb') as file:
    pickle.dump(scaler, file)

with open('minmax_scaler.pkl', 'wb') as file:
    pickle.dump(normalizer, file)

# Dictionary to store all models
models = {
    'knn': {
        'scaled': KNeighborsClassifier(n_neighbors=3),
        'normalized': KNeighborsClassifier(n_neighbors=3)
    },
    'logistic_regression': {
        'scaled': LogisticRegression(random_state=100),
        'normalized': LogisticRegression(random_state=100)
    },
    'naive_bayes': {
        'scaled': GaussianNB(),
        'normalized': GaussianNB()
    },
    'random_forest': {
        'scaled': RandomForestClassifier(max_depth=10, random_state=100),
        'normalized': RandomForestClassifier(max_depth=10, random_state=100)
    }
}

# Train and save all models
for model_name, model_variants in models.items():
    print(f"Training and saving {model_name} models...")
    
    # Train and save scaled model
    model_variants['scaled'].fit(X_train_scaled, y_train)
    with open(f'{model_name}_model_scaled.pkl', 'wb') as file:
        pickle.dump(model_variants['scaled'], file)
    
    # Train and save normalized model
    model_variants['normalized'].fit(X_train_normalized, y_train)
    with open(f'{model_name}_model_normalized.pkl', 'wb') as file:
        pickle.dump(model_variants['normalized'], file)

print("All models have been trained and saved successfully!")
print("Generated pickle files:")
for model_name in models.keys():
    print(f"- {model_name}_model_scaled.pkl")
    print(f"- {model_name}_model_normalized.pkl")
print("- standard_scaler.pkl")
print("- minmax_scaler.pkl")
