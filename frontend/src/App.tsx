import { useState } from "react";
import "./App.css";
import { PredictionForm, PredictionResults, Header } from "./components";

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
      const response = await fetch("http://localhost:8000/predict_all", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const result = await response.json();
      setResults(result);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
      console.error("Error submitting form:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container min-h-screen flex flex-col w-full">
      <Header />
      <main className="pt-36 pb-16 flex-grow w-full">
        <div className="container mx-auto px-4 w-full">
          <section
            id="about"
            className="mb-12 opacity-0 animate-fadeIn"
            style={{
              animation: "fadeIn 0.8s ease-out forwards",
              animationDelay: "0.2s",
            }}
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
              <svg
                className="w-6 h-6 mr-2 text-red-600"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                  clipRule="evenodd"
                />
              </svg>
              About This System
            </h2>
            <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-red-500">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                <div className="md:w-1/3 flex justify-center">
                  <div className="rounded-full bg-red-50 p-4 w-48 h-48 flex items-center justify-center">
                    <svg
                      className="w-32 h-32 text-red-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                        d="M9 12h6m-3-3v6"
                      />
                    </svg>
                  </div>
                </div>
                <div className="md:w-2/3">
                  <p className="text-gray-700 leading-relaxed">
                    This cardiovascular heart disease prediction system uses
                    multiple machine learning models to provide a comprehensive
                    risk assessment. By analyzing various patient metrics, our
                    system can help identify potential heart disease risks with
                    higher accuracy through model consensus.
                  </p>
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-red-50 p-4 rounded-md border border-red-100 hover:shadow-md transition-shadow duration-300">
                      <h3 className="font-semibold text-red-800">
                        Multiple Models
                      </h3>
                      <p className="text-sm text-gray-600">
                        Uses KNN, Logistic Regression, Naive Bayes, and Random
                        Forest models
                      </p>
                    </div>
                    <div className="bg-red-50 p-4 rounded-md border border-red-100 hover:shadow-md transition-shadow duration-300">
                      <h3 className="font-semibold text-red-800">
                        Consensus Prediction
                      </h3>
                      <p className="text-sm text-gray-600">
                        Combines results from all models for more reliable
                        assessment
                      </p>
                    </div>
                    <div className="bg-red-50 p-4 rounded-md border border-red-100 hover:shadow-md transition-shadow duration-300">
                      <h3 className="font-semibold text-red-800">
                        Detailed Analysis
                      </h3>
                      <p className="text-sm text-gray-600">
                        Provides risk level and personalized recommendations
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section
            id="models"
            className="mb-12 opacity-0"
            style={{
              animation: "fadeIn 0.8s ease-out forwards",
              animationDelay: "0.4s",
            }}
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
              <svg
                className="w-6 h-6 mr-2 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
                />
              </svg>
              Prediction Models
            </h2>
            <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-red-500">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="md:w-1/4 flex justify-center">
                  <div className="bg-red-50 rounded-lg p-4 flex items-center justify-center">
                    <svg
                      className="w-32 h-32 text-red-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                        d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                </div>
                <div className="md:w-3/4">
                  <p className="text-gray-700 mb-4">
                    Our system uses the following machine learning models, each
                    with their own strengths in predicting heart disease risk:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border border-red-200 rounded-md p-4 hover:bg-red-50 transition-colors duration-300 flex items-start">
                      <div className="mr-3 text-red-500">
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold text-red-800">
                          K-Nearest Neighbors (KNN)
                        </h3>
                        <p className="text-sm text-gray-600">
                          Effective at finding patterns based on similarity to
                          known cases
                        </p>
                      </div>
                    </div>
                    <div className="border border-red-200 rounded-md p-4 hover:bg-red-50 transition-colors duration-300 flex items-start">
                      <div className="mr-3 text-red-500">
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold text-red-800">
                          Logistic Regression
                        </h3>
                        <p className="text-sm text-gray-600">
                          Excellent for binary classification with probability
                          estimates
                        </p>
                      </div>
                    </div>
                    <div className="border border-red-200 rounded-md p-4 hover:bg-red-50 transition-colors duration-300 flex items-start">
                      <div className="mr-3 text-red-500">
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
                          <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold text-red-800">
                          Naive Bayes
                        </h3>
                        <p className="text-sm text-gray-600">
                          Fast and efficient with strong theoretical foundation
                        </p>
                      </div>
                    </div>
                    <div className="border border-red-200 rounded-md p-4 hover:bg-red-50 transition-colors duration-300 flex items-start">
                      <div className="mr-3 text-red-500">
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold text-red-800">
                          Random Forest
                        </h3>
                        <p className="text-sm text-gray-600">
                          Robust ensemble method that reduces overfitting
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section
            className="opacity-0"
            style={{
              animation: "fadeIn 0.8s ease-out forwards",
              animationDelay: "0.6s",
            }}
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
              <svg
                className="w-6 h-6 mr-2 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Predict Your Risk
            </h2>
            <div className="form-container border-l-4 border-red-500 bg-white p-6 rounded-lg shadow-md">
              <PredictionForm onSubmit={handleSubmit} loading={loading} />
            </div>
          </section>

          {error && (
            <div
              className="error-message mt-8 animate-slideIn"
              style={{
                animation: "slideIn 0.5s ease-out forwards",
              }}
            >
              <h3 className="text-red-700 font-bold">Error</h3>
              <p>{error}</p>
            </div>
          )}

          {results && (
            <div
              className="results-container mt-8"
              style={{
                animation: "slideUp 0.7s ease-out forwards",
                opacity: 0,
                transform: "translateY(20px)",
              }}
            >
              <PredictionResults results={results} />
            </div>
          )}
        </div>
      </main>
      <footer className="bg-gradient-to-r from-red-700 to-red-900 text-white py-8 px-4 shadow-inner w-full">
        <div className="max-w-6xl mx-auto px-4 w-full">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <svg
                className="w-6 h-6 mr-2 text-red-300"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                  clipRule="evenodd"
                />
              </svg>
              <p>
                © {new Date().getFullYear()} Cardiovascular Health Predictor
              </p>
            </div>
            <div className="flex space-x-6">
              <a
                href="#about"
                className="bg-white/40 hover:bg-white/60 text-gray-800 px-3 py-1 rounded-md transition-colors duration-200 flex items-center"
              >
                <svg
                  className="w-4 h-4 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                About
              </a>
              <a
                href="#models"
                className="bg-white/40 hover:bg-white/60 text-gray-800 px-3 py-1 rounded-md transition-colors duration-200 flex items-center"
              >
                <svg
                  className="w-4 h-4 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
                  />
                </svg>
                Models
              </a>
              <a
                href="https://github.com/shubhamku044/cardiovascular-heart-disease-prediction-system"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/40 hover:bg-white/60 text-gray-800 px-3 py-1 rounded-md transition-colors duration-200 flex items-center"
              >
                <svg
                  className="w-4 h-4 mr-1"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                GitHub
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
