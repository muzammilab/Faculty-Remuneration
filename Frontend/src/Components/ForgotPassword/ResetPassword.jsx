import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";

export default function VerifyOTP() {
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const email = localStorage.getItem("resetEmail");
  const role = localStorage.getItem("resetRole");

  const reset = async (e) => {
    e.preventDefault();

    // Trim whitespace from passwords
    const trimmedPassword = password.trim();
    const trimmedConfirmPassword = confirmPassword.trim();

    // Check if passwords are empty
    if (!trimmedPassword || !trimmedConfirmPassword) {
      toast.error("Please fill in all password fields");
      return;
    }

    // Check if passwords match
    if (trimmedPassword !== trimmedConfirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    // Check password length
    if (trimmedPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      await api.post("/reset-password/", {
        email,
        role,
        otp,
        newPassword: trimmedPassword,
        confirmPassword: trimmedConfirmPassword,
      });
      toast.success("Password updated successfully ✅");
      localStorage.clear();
      setTimeout(() => navigate("/login"), 1500);
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid OTP");
    }
    setLoading(false);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6 relative"
      style={{
        background:
          "linear-gradient(135deg, rgba(13, 110, 253, 0.5), rgba(13, 110, 253, 0.25)), url('/college-banner.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Floating decorative circles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="bg-blue-500/20 rounded-full"
          style={{ width: 120, height: 120, top: 50, left: 30 }}
          animate={{ y: [0, 20, 0] }}
          transition={{ repeat: Infinity, duration: 6 }}
        />
        <motion.div
          className="bg-emerald-500/15 rounded-full"
          style={{ width: 80, height: 80, bottom: 100, right: 50 }}
          animate={{ y: [0, -15, 0] }}
          transition={{ repeat: Infinity, duration: 5 }}
        />
      </div>

      {/* Main Card */}
      <motion.div
        className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 p-8 w-full max-w-sm relative z-10"
        style={{ maxWidth: "420px" }}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, type: "spring", stiffness: 80 }}
      >
        {/* Header with RCOE Logo */}
        <div className="text-center mb-8">
          <img
            src="/rcoe-logo.jpg"
            alt="RCOE Logo"
            className="w-16 h-16 mx-auto mb-4 rounded-xl shadow-lg object-cover border-2 border-gray-200"
          />
          <h3 className="text-2xl font-bold text-blue-600 mb-1 tracking-tight">
            Verify OTP & Reset Password
          </h3>
          <p className="text-gray-600 text-sm">
            Enter the OTP sent to your email and set a new password
          </p>
        </div>

        {/* Form */}
        <form onSubmit={reset} className="space-y-4">
          {/* OTP Input */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              OTP Code
            </label>
            <motion.input
              type="text"
              maxLength={6}
              className="w-full px-4 py-4 bg-white border-2 border-gray-300/50 rounded-3xl shadow-sm focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-300 placeholder-gray-500 backdrop-blur-sm hover:border-gray-400 text-center text-2xl font-bold tracking-widest"
              placeholder="000000"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              required
              disabled={loading}
              whileFocus={{ scale: 1.02 }}
            />
          </motion.div>

          {/* New Password Input */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              New Password
            </label>
            <motion.input
              type="password"
              className="w-full px-4 py-4 bg-white border-2 border-gray-300/50 rounded-3xl shadow-sm focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-300 text-base placeholder-gray-500 backdrop-blur-sm hover:border-gray-400"
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              whileFocus={{ scale: 1.02 }}
            />
          </motion.div>

          {/* Confirm Password Input */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Confirm Password
            </label>
            <motion.input
              type="password"
              className={`w-full px-4 py-4 bg-white border-2 rounded-3xl shadow-sm focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-300 text-base placeholder-gray-500 backdrop-blur-sm hover:border-gray-400 ${
                confirmPassword && password
                  ? password.trim() === confirmPassword.trim()
                    ? "border-emerald-400"
                    : "border-red-400"
                  : "border-gray-300/50"
              }`}
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={loading}
              whileFocus={{ scale: 1.02 }}
            />
            {confirmPassword && password && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className={`text-xs mt-1.5 ml-1 ${
                  password.trim() === confirmPassword.trim()
                    ? "text-emerald-600"
                    : "text-red-600"
                }`}
              >
                {password.trim() === confirmPassword.trim()
                  ? "✓ Passwords match"
                  : "✗ Passwords do not match"}
              </motion.p>
            )}
          </motion.div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-4 px-6 rounded-3xl shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-300 mt-1 focus:outline-none focus:ring-4 focus:ring-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none cursor-pointer"
            whileHover={{ y: loading ? 0 : -2, scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Resetting...
              </span>
            ) : (
              "Reset Password"
            )}
          </motion.button>
        </form>

        {/* Back to Login */}
        <div className="mt-6 text-center">
          <motion.button
            type="button"
            onClick={() => navigate("/login")}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-all duration-200 hover:underline flex items-center justify-center mx-auto gap-1 cursor-pointer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            ← Back to Login
          </motion.button>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-500 mt-6 text-xs tracking-wide">
          © {new Date().getFullYear()} Faculty Remuneration System
        </p>
      </motion.div>
    </div>
  );
}
