import React from "react";
import type { PredictionResponse } from "../App";

interface PredictionResultsProps {
  results: PredictionResponse;
}

const PredictionResults: React.FC<PredictionResultsProps> = ({ results }) => {
  // Format the probability as a percentage
  const formatProbability = (probability: number): string => {
    return `${(probability * 100).toFixed(2)}%`;
  };

  // Get a color based on risk level
  const getRiskColor = (prediction: number): string => {
    return prediction === 1 ? "text-red-600" : "text-green-600";
  };

  // Get a background color based on risk level for the consensus section
  const getConsensusBgColor = (prediction: number): string => {
    return prediction === 1
      ? "bg-red-50 border-red-200"
      : "bg-green-50 border-green-200";
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mt-6">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">
        Prediction Results
      </h2>

      {/* Consensus Prediction */}
      <div
        className={`p-4 rounded-md border mb-6 ${getConsensusBgColor(
          results.consensus_prediction
        )}`}
      >
        <h3 className="text-xl font-semibold mb-2">Consensus Prediction</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600">Risk Level:</p>
            <p
              className={`text-lg font-bold ${getRiskColor(
                results.consensus_prediction
              )}`}
            >
              {results.consensus_risk_level}
            </p>
          </div>
          <div>
            <p className="text-gray-600">Model Agreement:</p>
            <p className="text-lg font-bold">
              {results.model_agreement_percentage.toFixed(1)}%
            </p>
          </div>
        </div>
        <div className="mt-4">
          <p className="text-gray-600">Recommendation:</p>
          <p className="text-lg">{results.recommendation}</p>
        </div>
      </div>

      {/* Individual Model Predictions */}
      <h3 className="text-xl font-semibold mb-3">
        Individual Model Predictions
      </h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Model
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Prediction
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Probability
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Risk Level
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {Object.entries(results.predictions).map(
              ([modelName, prediction]) => (
                <tr key={modelName}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {modelName
                      .replace("_", " ")
                      .replace(/\b\w/g, (l) => l.toUpperCase())}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {prediction.prediction === 1 ? "Positive" : "Negative"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatProbability(prediction.probability)}
                  </td>
                  <td
                    className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${getRiskColor(
                      prediction.prediction
                    )}`}
                  >
                    {prediction.risk_level}
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PredictionResults;
