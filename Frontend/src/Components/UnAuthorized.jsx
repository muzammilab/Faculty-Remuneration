import React from "react";
import { useNavigate } from "react-router-dom";
import { FaExclamationTriangle, FaArrowLeft, FaHome } from "react-icons/fa";

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-slate-50 to-gray-100">
      <div className="flex items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-md w-full space-y-6">
          {/* Main Error Card */}
          <div className="bg-white/80 backdrop-blur border border-gray-200 rounded-2xl shadow-sm p-8 text-center">
            {/* Warning Icon */}
            <div className="mx-auto w-20 h-20 bg-red-100 rounded-2xl flex items-center justify-center mb-6">
              <FaExclamationTriangle className="text-red-500 text-3xl" />
            </div>

            {/* Title */}
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight mb-2">
              Unauthorized Access
            </h1>

            {/* Description */}
            <p className="text-gray-600 mb-8 leading-relaxed">
              You don't have permission to view this page. Please log in with the correct account.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate("/")}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl shadow-sm hover:shadow-md hover:-translate-y-[1px] transition-all font-medium text-sm"
              >
                <FaHome size={16} />
                Go to Login
              </button>

              <button
                onClick={() => navigate(-1)}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-white/60 backdrop-blur border border-gray-200 text-gray-700 rounded-xl shadow-sm hover:shadow-md hover:-translate-y-[1px] transition-all font-medium text-sm hover:bg-gray-50"
              >
                <FaArrowLeft size={16} />
                Go Back
              </button>
            </div>

            {/* Footer Accent */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-xs text-gray-500 tracking-wider uppercase font-semibold">
                Access Denied • Role Required
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
