import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../store/authSlice";
import api from "../utils/api";
const API_BASE = import.meta.env.VITE_API_BASE_URL;

function Login() {
  const dispatch = useDispatch();
  const [loginRole, setLoginRole] = useState("faculty");
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    adminId: "",
  });
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("error") === "not_registered") {
      toast.error("You are not registered by admin yet.");
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload =
      loginRole === "faculty"
        ? { email: formData.username, password: formData.password }
        : { email: formData.adminId, password: formData.password };

    try {
      const url = loginRole === "admin" ? "/admin/login" : "/faculty/login";
      const response = await api.post(url, payload);

      if (response.data.token) {
        const role = loginRole;
        dispatch(loginSuccess({ role }));
        toast.success(
          `${
            loginRole.charAt(0).toUpperCase() + loginRole.slice(1)
          } Login Successful ✅`
        );
        localStorage.setItem("token", response.data.token);
        // toast.success(`${loginRole.charAt(0).toUpperCase() + loginRole.slice(1)} Login Successful`);
        // localStorage.setItem("token", response.data.token);

        if (loginRole === "faculty") {
          localStorage.setItem("role", "faculty");
          localStorage.setItem("facultyId", response.data.id);
          navigate("/faculty/dashboard");
        } else {
          navigate("/admin/payments");
        }
      } else {
        toast.error("Unexpected response from server");
      }
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Login failed. Check console."
      );
    }
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
      {/* Floating decorative circles - EXACT same as original */}
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
            Faculty Remuneration Portal
          </h3>
        </div>

        {/* Role Tabs */}
        <div className="flex justify-center mb-8">
          {["admin", "faculty"].map((role) => (
            <motion.button
              key={role}
              className={`px-6 py-3 rounded-3xl font-bold text-sm transition-all duration-300 mx-1 flex-1 sm:flex-none cursor-pointer ${
                loginRole === role
                  ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/25"
                  : "bg-gray-200/70 text-gray-700 hover:bg-gray-300 hover:shadow-md"
              }`}
              onClick={() => setLoginRole(role)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {role.charAt(0).toUpperCase() + role.slice(1)}
            </motion.button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {loginRole === "faculty" ? (
            <motion.input
              type="text"
              name="username"
              className="w-full px-4 py-4 bg-white border-2 border-gray-300/50 rounded-3xl shadow-sm focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-300 text-base placeholder-gray-500 backdrop-blur-sm hover:border-gray-400"
              placeholder="Faculty Username"
              value={formData.username}
              onChange={handleInputChange}
              required
              whileFocus={{ scale: 1.02 }}
            />
          ) : (
            <motion.input
              type="email"
              name="adminId"
              className="w-full px-4 py-4 bg-white border-2 border-gray-300/50 rounded-3xl shadow-sm focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-300 text-base placeholder-gray-500 backdrop-blur-sm hover:border-gray-400"
              placeholder="Admin Email"
              value={formData.adminId}
              onChange={handleInputChange}
              required
              whileFocus={{ scale: 1.02 }}
            />
          )}

          <motion.input
            type="password"
            name="password"
            autoComplete="current-password" // Added this so that browser does not recommend password.
            className="w-full px-4 py-4 bg-white border-2 border-gray-300/50 rounded-3xl shadow-sm focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-300 text-base placeholder-gray-500 backdrop-blur-sm hover:border-gray-400"
            placeholder="Password"
            value={formData.password}
            onChange={handleInputChange}
            required
            whileFocus={{ scale: 1.02 }}
          />

          {/* Checkbox & Forgot Password - EXACT layout */}
          <div className="flex justify-between items-center pt-1">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                className="w-5 h-5 text-blue-600 bg-gray-100 border-2 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 shadow-sm"
                id="rememberMe"
              />
              <label
                htmlFor="rememberMe"
                className="text-sm text-gray-700 font-medium cursor-pointer select-none"
              >
                Remember Me
              </label>
            </div>
            <button
              type="button"
              className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-all duration-200 hover:underline cursor-pointer"
              onClick={() => navigate(`/forgot-password?role=${loginRole}`)}
            >
              Forgot Password?
            </button>
          </div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-4 px-6 rounded-3xl shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-300 mt-1 focus:outline-none focus:ring-4 focus:ring-blue-500/50 cursor-pointer"
            whileHover={{ y: -2, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Login
          </motion.button>
        </form>
        <div className="flex items-center my-6">
          <hr className="flex-grow border-t border-gray-300" />
          <span className="mx-4 text-gray-500 font-medium">OR</span>
          <hr className="flex-grow border-t border-gray-300" />
        </div>

        {/* Google OAuth Button */}
        <motion.button
          type="button"
          onClick={() => (window.location.href = `${API_BASE}/auth/google`)}
          className="w-full bg-white border-2 border-gray-300 hover:border-blue-500 text-gray-700 font-bold py-4 px-6 rounded-3xl shadow-md hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <img src="/google-icon.png" className="w-5 h-5" />
          Continue with Google
        </motion.button>

        {/* Footer - EXACT same */}
        <p className="text-center text-gray-500 mt-6 text-xs tracking-wide">
          © {new Date().getFullYear()} Faculty Remuneration System
        </p>
      </motion.div>
    </div>
  );
}

export default Login;
