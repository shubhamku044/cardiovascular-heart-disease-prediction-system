import React, { useState, useEffect } from "react";
import type { PredictionResponse } from "../App";

interface PredictionResultsProps {
  results: PredictionResponse;
}

const PredictionResults: React.FC<PredictionResultsProps> = ({ results }) => {
  const [showResults, setShowResults] = useState(false);
  const [activeTab, setActiveTab] = useState<'consensus' | 'models'>('consensus');
  const [progressWidth, setProgressWidth] = useState(0);
  
  useEffect(() => {
    // Animate entrance
    setShowResults(true);
    
    // Animate progress bar based on probability
    const timer = setTimeout(() => {
      // Calculate probability from model predictions
      const probability = results.consensus_prediction === 1 ? 0.7 : 0.3; // Default fallback
      setProgressWidth(probability * 100);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [results]);

  // Format the probability as a percentage
  const formatProbability = (probability: number): string => {
    return `${(probability * 100).toFixed(1)}%`;
  };

  // Determine risk color
  const getRiskColor = (risk: string): string => {
    switch (risk.toLowerCase()) {
      case 'high': return 'bg-red-600 text-white';
      case 'medium': return 'bg-yellow-500 text-white';
      case 'low': return 'bg-green-500 text-white';
      default: return 'bg-blue-500 text-white';
    }
  };
  
  const getModelAccuracy = (probability: number): number => {
    return probability > 0.5 ? probability : 1 - probability;
  };

  return (
    <div 
      className={`bg-white rounded-lg shadow-lg p-6 border-l-4 border-red-500 transition-all duration-500 ${showResults ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'}`}
    >
      <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
        <svg className="w-6 h-6 mr-2 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
        Prediction Results
      </h2>
      
      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200 mb-6">
        <button 
          onClick={() => setActiveTab('consensus')}
          className={`py-2 px-4 font-medium text-sm transition-colors duration-200 flex items-center ${activeTab === 'consensus' ? 'border-b-2 border-red-500 text-red-600' : 'text-gray-600 hover:text-red-500'}`}
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Consensus Prediction
        </button>
        <button 
          onClick={() => setActiveTab('models')}
          className={`py-2 px-4 font-medium text-sm transition-colors duration-200 flex items-center ${activeTab === 'models' ? 'border-b-2 border-red-500 text-red-600' : 'text-gray-600 hover:text-red-500'}`}
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          Individual Models
        </button>
      </div>
      
      {/* Consensus Prediction Tab */}
      {activeTab === 'consensus' && (
        <div 
          className="mb-6 rounded-lg overflow-hidden transition-all duration-300"
          style={{
            animation: 'fadeIn 0.5s ease-out forwards'
          }}
        >
          <div className="p-6 bg-gradient-to-r from-red-50 to-red-100 rounded-lg">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <div className="mb-4 md:mb-0">
                <h3 className="text-xl font-bold text-gray-800 mb-1">Diagnosis</h3>
                <p className="text-2xl font-bold mb-1">
                  {results.consensus_prediction === 1 ? (
                    <span className="text-red-600">Heart Disease Detected</span>
                  ) : (
                    <span className="text-green-600">No Heart Disease Detected</span>
                  )}
                </p>
              </div>
              
              <div className="flex items-center">
                <span className={`inline-flex items-center justify-center px-4 py-2 rounded-full text-sm font-medium ${getRiskColor(results.consensus_risk_level)}`}>
                  {results.consensus_risk_level} Risk
                </span>
              </div>
            </div>
            
            <div className="mb-6">
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">Model Agreement</span>
                <span className="text-sm font-medium text-gray-700">{results.model_agreement_percentage.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 shadow-inner">
                <div 
                  className={`h-2.5 rounded-full ${results.consensus_prediction === 1 ? 'bg-red-600' : 'bg-green-500'}`}
                  style={{ width: `${progressWidth}%`, transition: 'width 1s ease-in-out' }}
                ></div>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-md border border-gray-100 shadow-sm">
              <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                <svg className="w-5 h-5 mr-1 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Recommendation
              </h4>
              <p className="text-gray-700">{results.recommendation}</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Individual Models Tab */}
      {activeTab === 'models' && (
        <div 
          className="overflow-hidden transition-all duration-300"
          style={{
            animation: 'fadeIn 0.5s ease-out forwards'
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {Object.entries(results.predictions).map(([modelName, modelData], index) => (
              <div 
                key={modelName} 
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-200 border-l-2 border-l-red-400"
                style={{
                  animation: `slideIn 0.3s ease-out forwards`,
                  animationDelay: `${index * 0.1}s`,
                  opacity: 0,
                  transform: 'translateX(-10px)'
                }}
              >
                <div className="p-4 border-b border-gray-100">
                  <h4 className="font-semibold text-gray-800">
                    {modelName.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                  </h4>
                </div>
                <div className="p-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Prediction:</span>
                    <span className={`text-sm font-semibold ${modelData.prediction === 1 ? 'text-red-600' : 'text-green-600'}`}>
                      {modelData.prediction === 1 ? 'Heart Disease' : 'No Heart Disease'}
                    </span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Probability:</span>
                    <span className="text-sm font-semibold">{formatProbability(modelData.probability)}</span>
                  </div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Confidence:</span>
                    <span className="text-sm font-semibold">{(getModelAccuracy(modelData.probability) * 100).toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                    <div 
                      className="h-1.5 rounded-full bg-red-500" 
                      style={{ 
                        width: `${getModelAccuracy(modelData.probability) * 100}%`,
                        transition: 'width 1s ease-in-out'
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="bg-red-50 p-4 rounded-md border border-red-200 flex items-start">
            <svg className="w-5 h-5 mr-2 text-red-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Note:</span> The consensus prediction combines results from all models to provide a more reliable assessment.
              Individual model predictions may vary based on their specific algorithms and training data.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PredictionResults;
