import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../store/authSlice";

export default function OAuthSuccess() {
  const [params] = useSearchParams();
  const token = params.get("token");
  const dispatch = useDispatch();

  useEffect(() => {
    if (!token) {
      window.location.href = "/login";
      return;
    }

    // Save token (browser commit)
    localStorage.setItem("token", token);

    // Decode role from JWT
    const payload = JSON.parse(atob(token.split(".")[1]));

    // Store role in redux
    dispatch(loginSuccess({ role: payload.role }));

    // HARD redirect so browser starts with fresh context
    setTimeout(() => {
      if (payload.role === "admin") {
        window.location.href = "/admin/payments";
      } else {
        window.location.href = "/faculty/dashboard";
      }
    }, 100);
  }, [token]);

  return null;
}
