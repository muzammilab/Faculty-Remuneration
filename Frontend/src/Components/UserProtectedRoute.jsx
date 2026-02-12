import React, { useState, useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ allowedRoles }) => {
  // const [userRole, setUserRole] = useState(null);
  // const [loading, setLoading] = useState(true);
  const { isLoggedIn, authChecked, userRole } = useSelector(
    (state) => state.authSlice
  );

  if (!authChecked) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="relative w-14 h-14">
          <div className="absolute inset-0 rounded-full border-4 border-blue-500/30 animate-pulse"></div>
          <div className="absolute inset-0 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    console.log(isLoggedIn, authChecked, userRole);
    return <Navigate to="/" replace />;
  }

  return allowedRoles.includes(userRole) ? (
    <Outlet />
  ) : (
    <Navigate to="/unauthorized" replace />
  );
};

export default ProtectedRoute;
