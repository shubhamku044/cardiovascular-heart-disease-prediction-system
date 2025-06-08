import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6 shadow-lg">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold">Cardiovascular Heart Disease Prediction</h1>
        <p className="mt-2 text-blue-100">
          Predict heart disease risk using multiple machine learning models
        </p>
      </div>
    </header>
  );
};

export default Header;
