import React from "react";

const ErrorPage: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center p-6 bg-white rounded-lg shadow-md w-full max-w-lg">
        <div className="mb-4">
          <img
            src="https://via.placeholder.com/200" // Replace with your illustration URL
            alt="Error Illustration"
            className="mx-auto mb-4"
          />
        </div>
        <h1 className="text-3xl font-semibold text-gray-800 mb-2">
          Oops! Something went wrong.
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          Please try again later, or contact support if the issue persists.
        </p>
      </div>
    </div>
  );
};

export default ErrorPage;
