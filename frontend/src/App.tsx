import { useState } from 'react'
import './App.css'
import { PredictionForm, PredictionResults, Header } from './components'

// Define types for our form data and API responses
export interface PatientData {
  age: number;
  sex: number;
  cp: number;
  trestbps: number;
  chol: number;
  fbs: number;
  restecg: number;
  thalach: number;
  exang: number;
  oldpeak: number;
  slope: number;
  ca: number;
  thal: number;
}

export interface ModelPrediction {
  prediction: number;
  probability: number;
  risk_level: string;
}

export interface PredictionResponse {
  predictions: Record<string, ModelPrediction>;
  consensus_prediction: number;
  consensus_risk_level: string;
  recommendation: string;
  model_agreement_percentage: number;
}

function App() {
  const [loading, setLoading] = useState<boolean>(false);
  const [results, setResults] = useState<PredictionResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: PatientData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:8000/predict_all', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const result = await response.json();
      setResults(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      console.error('Error submitting form:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <Header />
      <main>
        <div className="content-container">
          <div className="form-container">
            <PredictionForm onSubmit={handleSubmit} loading={loading} />
          </div>
          
          {error && (
            <div className="error-message">
              <h3>Error</h3>
              <p>{error}</p>
            </div>
          )}
          
          {results && (
            <div className="results-container">
              <PredictionResults results={results} />
            </div>
          )}
        </div>
      </main>
      <footer>
        <p>© {new Date().getFullYear()} Cardiovascular Heart Disease Prediction System</p>
      </footer>
    </div>
  )
}

export default App
