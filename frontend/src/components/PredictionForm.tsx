import React, { useState, useEffect } from "react";
import type { PatientData } from "../App";

interface PredictionFormProps {
  onSubmit: (data: PatientData) => void;
  loading: boolean;
}

const PredictionForm: React.FC<PredictionFormProps> = ({
  onSubmit,
  loading,
}) => {
  // Track form section visibility for animation
  const [activeSection, setActiveSection] = useState<string>("demographics");

  // Track form completion percentage
  const [completionPercentage, setCompletionPercentage] = useState(0);

  // Track hover state for form fields
  const [hoveredField, setHoveredField] = useState<string | null>(null);

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

  // Calculate completion percentage whenever form data changes
  useEffect(() => {
    // Count filled fields (non-zero or explicitly set)
    const filledFields = Object.entries(formData).filter(([key, value]) => {
      // For binary fields, any value is considered filled
      if (["sex", "fbs", "exang"].includes(key)) return true;
      // For other fields, non-zero values are considered filled
      return value !== 0;
    }).length;

    const totalFields = Object.keys(formData).length;
    const percentage = Math.round((filledFields / totalFields) * 100);
    setCompletionPercentage(percentage);
  }, [formData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]:
        name === "age" ||
        name === "trestbps" ||
        name === "chol" ||
        name === "thalach"
          ? parseInt(value)
          : parseFloat(value),
    });
  };

  const handleSectionChange = (section: string) => {
    setActiveSection(section);
  };

  const handleFieldHover = (fieldName: string | null) => {
    setHoveredField(fieldName);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-2 text-gray-800 flex items-center">
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
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
        Patient Information
      </h2>

      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex justify-between mb-1">
          <span className="text-sm font-medium text-gray-700">
            Form Completion
          </span>
          <span className="text-sm font-medium text-gray-700">
            {completionPercentage}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5 shadow-inner">
          <div
            className="h-2.5 rounded-full bg-red-600 transition-all duration-500 ease-out"
            style={{ width: `${completionPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* Section Navigation */}
      <div className="flex border-b border-gray-200 mb-6 overflow-x-auto p-4 gap-4">
        <button
          type="button"
          onClick={() => handleSectionChange("demographics")}
          className={`py-2 px-4 font-medium text-sm whitespace-nowrap transition-all duration-200 flex items-center hover:transform-none ${
            activeSection === "demographics"
              ? "border-b-2 border-red-500 text-red-600"
              : "text-gray-600 hover:text-red-500"
          }`}
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
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
          Demographics
        </button>
        <button
          type="button"
          onClick={() => handleSectionChange("vitals")}
          className={`py-2 px-4 font-medium text-sm whitespace-nowrap transition-all duration-200 flex items-center hover:transform-none ${
            activeSection === "vitals"
              ? "border-b-2 border-red-500 text-red-600"
              : "text-gray-600 hover:text-red-500"
          }`}
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
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
          Vital Signs
        </button>
        <button
          type="button"
          onClick={() => handleSectionChange("tests")}
          className={`py-2 px-4 font-medium text-sm whitespace-nowrap transition-all duration-200 flex items-center hover:transform-none ${
            activeSection === "tests"
              ? "border-b-2 border-red-500 text-red-600"
              : "text-gray-600 hover:text-red-500"
          }`}
        >
          Test Results
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Demographics Section */}
        <div
          className={`grid grid-cols-1 md:grid-cols-2 gap-4 transition-opacity duration-300 ${
            activeSection === "demographics"
              ? "opacity-100"
              : "opacity-0 h-0 overflow-hidden"
          }`}
        >
          {/* Age */}
          <div
            className={`form-group transition-all duration-200 ${
              hoveredField === "age" ? "border-l-4 border-red-500 pl-2" : ""
            }`}
            onMouseEnter={() => handleFieldHover("age")}
            onMouseLeave={() => handleFieldHover(null)}
          >
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              min="20"
              max="100"
              required
            />
          </div>

          {/* Sex */}
          <div
            className={`form-group transition-all duration-200 ${
              hoveredField === "sex" ? "border-l-4 border-blue-500 pl-2" : ""
            }`}
            onMouseEnter={() => handleFieldHover("sex")}
            onMouseLeave={() => handleFieldHover(null)}
          >
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            >
              <option value="1">Male</option>
              <option value="0">Female</option>
            </select>
          </div>
        </div>

        {/* Vitals Section */}
        <div
          className={`grid grid-cols-1 md:grid-cols-2 gap-4 transition-opacity duration-300 ${
            activeSection === "vitals"
              ? "opacity-100"
              : "opacity-0 h-0 overflow-hidden"
          }`}
        >
          {/* Chest Pain Type */}
          <div
            className={`form-group transition-all duration-200 ${
              hoveredField === "cp" ? "border-l-4 border-blue-500 pl-2" : ""
            }`}
            onMouseEnter={() => handleFieldHover("cp")}
            onMouseLeave={() => handleFieldHover(null)}
          >
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            >
              <option value="0">Typical Angina</option>
              <option value="1">Atypical Angina</option>
              <option value="2">Non-anginal Pain</option>
              <option value="3">Asymptomatic</option>
            </select>
          </div>

          {/* Resting Blood Pressure */}
          <div
            className={`form-group transition-all duration-200 ${
              hoveredField === "trestbps"
                ? "border-l-4 border-blue-500 pl-2"
                : ""
            }`}
            onMouseEnter={() => handleFieldHover("trestbps")}
            onMouseLeave={() => handleFieldHover(null)}
          >
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              min="80"
              max="200"
              required
            />
          </div>

          {/* Serum Cholesterol */}
          <div
            className={`form-group transition-all duration-200 ${
              hoveredField === "chol" ? "border-l-4 border-blue-500 pl-2" : ""
            }`}
            onMouseEnter={() => handleFieldHover("chol")}
            onMouseLeave={() => handleFieldHover(null)}
          >
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              min="100"
              max="600"
              required
            />
          </div>

          {/* Fasting Blood Sugar */}
          <div
            className={`form-group transition-all duration-200 ${
              hoveredField === "fbs" ? "border-l-4 border-blue-500 pl-2" : ""
            }`}
            onMouseEnter={() => handleFieldHover("fbs")}
            onMouseLeave={() => handleFieldHover(null)}
          >
            <label
              htmlFor="fbs"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Fasting Blood Sugar {">"} 120 mg/dl
            </label>
            <select
              id="fbs"
              name="fbs"
              value={formData.fbs}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            >
              <option value="1">Yes</option>
              <option value="0">No</option>
            </select>
          </div>

          {/* Max Heart Rate */}
          <div
            className={`form-group transition-all duration-200 ${
              hoveredField === "thalach"
                ? "border-l-4 border-blue-500 pl-2"
                : ""
            }`}
            onMouseEnter={() => handleFieldHover("thalach")}
            onMouseLeave={() => handleFieldHover(null)}
          >
            <label
              htmlFor="thalach"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Maximum Heart Rate Achieved
            </label>
            <input
              type="number"
              id="thalach"
              name="thalach"
              value={formData.thalach}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              min="60"
              max="220"
              required
            />
          </div>

          {/* Exercise Induced Angina */}
          <div
            className={`form-group transition-all duration-200 ${
              hoveredField === "exang" ? "border-l-4 border-blue-500 pl-2" : ""
            }`}
            onMouseEnter={() => handleFieldHover("exang")}
            onMouseLeave={() => handleFieldHover(null)}
          >
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            >
              <option value="1">Yes</option>
              <option value="0">No</option>
            </select>
          </div>
        </div>

        {/* Tests Section */}
        <div
          className={`grid grid-cols-1 md:grid-cols-2 gap-4 transition-opacity duration-300 ${
            activeSection === "tests"
              ? "opacity-100"
              : "opacity-0 h-0 overflow-hidden"
          }`}
        >
          {/* Resting ECG */}
          <div
            className={`form-group transition-all duration-200 ${
              hoveredField === "restecg"
                ? "border-l-4 border-blue-500 pl-2"
                : ""
            }`}
            onMouseEnter={() => handleFieldHover("restecg")}
            onMouseLeave={() => handleFieldHover(null)}
          >
            <label
              htmlFor="restecg"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Resting Electrocardiographic Results
            </label>
            <select
              id="restecg"
              name="restecg"
              value={formData.restecg}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            >
              <option value="0">Normal</option>
              <option value="1">ST-T Wave Abnormality</option>
              <option value="2">Left Ventricular Hypertrophy</option>
            </select>
          </div>

          {/* ST Depression */}
          <div
            className={`form-group transition-all duration-200 ${
              hoveredField === "oldpeak"
                ? "border-l-4 border-blue-500 pl-2"
                : ""
            }`}
            onMouseEnter={() => handleFieldHover("oldpeak")}
            onMouseLeave={() => handleFieldHover(null)}
          >
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              min="0"
              max="10"
              step="0.1"
              required
            />
          </div>

          {/* Slope */}
          <div
            className={`form-group transition-all duration-200 ${
              hoveredField === "slope" ? "border-l-4 border-blue-500 pl-2" : ""
            }`}
            onMouseEnter={() => handleFieldHover("slope")}
            onMouseLeave={() => handleFieldHover(null)}
          >
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            >
              <option value="0">Upsloping</option>
              <option value="1">Flat</option>
              <option value="2">Downsloping</option>
            </select>
          </div>

          {/* Number of Major Vessels */}
          <div
            className={`form-group transition-all duration-200 ${
              hoveredField === "ca" ? "border-l-4 border-blue-500 pl-2" : ""
            }`}
            onMouseEnter={() => handleFieldHover("ca")}
            onMouseLeave={() => handleFieldHover(null)}
          >
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            >
              <option value="0">0</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
            </select>
          </div>

          {/* Thalassemia */}
          <div
            className={`form-group transition-all duration-200 ${
              hoveredField === "thal" ? "border-l-4 border-red-500 pl-2" : ""
            }`}
            onMouseEnter={() => handleFieldHover("thal")}
            onMouseLeave={() => handleFieldHover(null)}
          >
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            >
              <option value="0">Normal</option>
              <option value="1">Fixed Defect</option>
              <option value="2">Reversible Defect</option>
            </select>
          </div>
        </div>

        <div className="mt-6 flex flex-col space-y-4">
          {/* Section Navigation Buttons */}
          <div className="flex justify-between">
            {activeSection === "demographics" ? (
              <div></div>
            ) : (
              <button
                type="button"
                onClick={() =>
                  handleSectionChange(
                    activeSection === "vitals" ? "demographics" : "vitals"
                  )
                }
                className="py-2 px-4 bg-gray-200 text-gray-700 font-medium rounded-md hover:bg-gray-300 transition-colors duration-200 flex items-center shadow-sm"
              >
                <svg
                  className="w-5 h-5 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Previous
              </button>
            )}

            {activeSection === "tests" ? (
              <button
                type="submit"
                disabled={loading}
                className={`ml-auto py-2 px-6 bg-red-600 text-white font-semibold rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200 ${
                  loading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "Processing..." : "Submit"}
              </button>
            ) : (
              <button
                type="button"
                onClick={() =>
                  handleSectionChange(
                    activeSection === "demographics" ? "vitals" : "tests"
                  )
                }
                className="ml-auto py-2 px-4 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 transition-colors duration-200 flex items-center shadow-sm"
              >
                Next
                <svg
                  className="w-5 h-5 ml-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            )}
          </div>

          {/* Submit Button (visible only on final step) */}
          {activeSection === "tests" && (
            <div className="flex items-center justify-center mt-4">
              <div className="text-sm text-gray-500 mr-2">
                All fields complete!
              </div>
              <svg
                className="w-5 h-5 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default PredictionForm;
