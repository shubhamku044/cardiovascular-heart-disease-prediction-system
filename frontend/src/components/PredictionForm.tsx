import React, { useState } from "react";
import type { PatientData } from "../App";

interface PredictionFormProps {
  onSubmit: (data: PatientData) => void;
  loading: boolean;
}

const PredictionForm: React.FC<PredictionFormProps> = ({
  onSubmit,
  loading,
}) => {
  const [formData, setFormData] = useState<PatientData>({
    age: 50,
    sex: 1,
    cp: 0,
    trestbps: 120,
    chol: 200,
    fbs: 0,
    restecg: 0,
    thalach: 150,
    exang: 0,
    oldpeak: 0,
    slope: 0,
    ca: 0,
    thal: 0,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: parseFloat(value),
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">
        Patient Information
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Age */}
          <div className="form-group">
            <label
              htmlFor="age"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Age
            </label>
            <input
              type="number"
              id="age"
              name="age"
              value={formData.age}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="20"
              max="100"
              required
            />
          </div>

          {/* Sex */}
          <div className="form-group">
            <label
              htmlFor="sex"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Sex
            </label>
            <select
              id="sex"
              name="sex"
              value={formData.sex}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="1">Male</option>
              <option value="0">Female</option>
            </select>
          </div>

          {/* Chest Pain Type */}
          <div className="form-group">
            <label
              htmlFor="cp"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Chest Pain Type
            </label>
            <select
              id="cp"
              name="cp"
              value={formData.cp}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="0">Typical Angina</option>
              <option value="1">Atypical Angina</option>
              <option value="2">Non-anginal Pain</option>
              <option value="3">Asymptomatic</option>
            </select>
          </div>

          {/* Resting Blood Pressure */}
          <div className="form-group">
            <label
              htmlFor="trestbps"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Resting Blood Pressure (mm Hg)
            </label>
            <input
              type="number"
              id="trestbps"
              name="trestbps"
              value={formData.trestbps}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="80"
              max="200"
              required
            />
          </div>

          {/* Serum Cholesterol */}
          <div className="form-group">
            <label
              htmlFor="chol"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Serum Cholesterol (mg/dl)
            </label>
            <input
              type="number"
              id="chol"
              name="chol"
              value={formData.chol}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="100"
              max="600"
              required
            />
          </div>

          {/* Fasting Blood Sugar */}
          <div className="form-group">
            <label
              htmlFor="fbs"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Fasting Blood Sugar &gt; 120 mg/dl
            </label>
            <select
              id="fbs"
              name="fbs"
              value={formData.fbs}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="1">Yes</option>
              <option value="0">No</option>
            </select>
          </div>

          {/* Resting ECG Results */}
          <div className="form-group">
            <label
              htmlFor="restecg"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Resting ECG Results
            </label>
            <select
              id="restecg"
              name="restecg"
              value={formData.restecg}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="0">Normal</option>
              <option value="1">ST-T Wave Abnormality</option>
              <option value="2">Left Ventricular Hypertrophy</option>
            </select>
          </div>

          {/* Maximum Heart Rate */}
          <div className="form-group">
            <label
              htmlFor="thalach"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Maximum Heart Rate
            </label>
            <input
              type="number"
              id="thalach"
              name="thalach"
              value={formData.thalach}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="60"
              max="220"
              required
            />
          </div>

          {/* Exercise Induced Angina */}
          <div className="form-group">
            <label
              htmlFor="exang"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Exercise Induced Angina
            </label>
            <select
              id="exang"
              name="exang"
              value={formData.exang}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="1">Yes</option>
              <option value="0">No</option>
            </select>
          </div>

          {/* ST Depression */}
          <div className="form-group">
            <label
              htmlFor="oldpeak"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              ST Depression Induced by Exercise
            </label>
            <input
              type="number"
              id="oldpeak"
              name="oldpeak"
              value={formData.oldpeak}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="0"
              max="10"
              step="0.1"
              required
            />
          </div>

          {/* Slope */}
          <div className="form-group">
            <label
              htmlFor="slope"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Slope of Peak Exercise ST Segment
            </label>
            <select
              id="slope"
              name="slope"
              value={formData.slope}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="0">Upsloping</option>
              <option value="1">Flat</option>
              <option value="2">Downsloping</option>
            </select>
          </div>

          {/* Number of Major Vessels */}
          <div className="form-group">
            <label
              htmlFor="ca"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Number of Major Vessels Colored by Fluoroscopy
            </label>
            <select
              id="ca"
              name="ca"
              value={formData.ca}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="0">0</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
            </select>
          </div>

          {/* Thalassemia */}
          <div className="form-group">
            <label
              htmlFor="thal"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Thalassemia
            </label>
            <select
              id="thal"
              name="thal"
              value={formData.thal}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="0">Normal</option>
              <option value="1">Fixed Defect</option>
              <option value="2">Reversible Defect</option>
            </select>
          </div>
        </div>

        <div className="mt-6">
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {loading ? "Processing..." : "Predict Heart Disease Risk"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PredictionForm;
