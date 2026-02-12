import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Only read JWT – no API calls, no CORS, no sessions
export const fetchUserRole = createAsyncThunk(
  "auth/fetchUserRole",
  async () => {
    const token = localStorage.getItem("token");
    if (!token) return { isLoggedIn: false };

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return { isLoggedIn: true, role: payload.role };
    } catch {
      localStorage.removeItem("token");
      return { isLoggedIn: false };
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    isLoggedIn: false,
    userRole: null,
    authChecked: false,
  },
  reducers: {
    loginSuccess(state, action) {
      state.isLoggedIn = true;
      state.userRole = action.payload.role;
      state.authChecked = true;
    },
    logout(state) {
      state.isLoggedIn = false;
      state.userRole = null;
      state.authChecked = true;
      localStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchUserRole.fulfilled, (state, action) => {
      state.isLoggedIn = action.payload.isLoggedIn;
      state.userRole = action.payload.role || null;
      state.authChecked = true;
    });
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice;
