import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../lib/axios";

// ── Async thunks ────────────────────────────────────────────────
export const fetchCurrentUser = createAsyncThunk(
    "auth/fetchCurrentUser",
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await api.get("/api/auth/me");
            return data.user;
        } catch {
            return rejectWithValue(null);
        }
    }
);

export const loginUser = createAsyncThunk(
    "auth/login",
    async ({ email, password }, { rejectWithValue }) => {
        try {
            const { data } = await api.post("/api/auth/login", { email, password });
            return data.user;
        } catch (err) {
            return rejectWithValue(err.response?.data?.error || "Login failed");
        }
    }
);

export const registerUser = createAsyncThunk(
    "auth/register",
    async ({ name, email, password }, { rejectWithValue }) => {
        try {
            const { data } = await api.post("/api/auth/register", { name, email, password });
            return data.user;
        } catch (err) {
            return rejectWithValue(err.response?.data?.error || "Registration failed");
        }
    }
);

export const logoutUser = createAsyncThunk("auth/logout", async () => {
    await api.post("/api/auth/logout");
    return null;
});

// ── Slice ────────────────────────────────────────────────────────
const authSlice = createSlice({
    name: "auth",
    initialState: {
        user: null,
        status: "idle",   // idle | loading | succeeded | failed
        error: null,
        initialized: false,
    },
    reducers: {
        clearError: (state) => { state.error = null; },
        setUser: (state, action) => { state.user = action.payload; },
    },
    extraReducers: (builder) => {
        // fetchCurrentUser
        builder
            .addCase(fetchCurrentUser.pending, (s) => { s.status = "loading"; })
            .addCase(fetchCurrentUser.fulfilled, (s, a) => { s.user = a.payload; s.status = "succeeded"; s.initialized = true; })
            .addCase(fetchCurrentUser.rejected, (s) => { s.user = null; s.status = "idle"; s.initialized = true; });

        // loginUser
        builder
            .addCase(loginUser.pending, (s) => { s.status = "loading"; s.error = null; })
            .addCase(loginUser.fulfilled, (s, a) => { s.user = a.payload; s.status = "succeeded"; })
            .addCase(loginUser.rejected, (s, a) => { s.status = "failed"; s.error = a.payload; });

        // registerUser
        builder
            .addCase(registerUser.pending, (s) => { s.status = "loading"; s.error = null; })
            .addCase(registerUser.fulfilled, (s, a) => { s.user = a.payload; s.status = "succeeded"; })
            .addCase(registerUser.rejected, (s, a) => { s.status = "failed"; s.error = a.payload; });

        // logoutUser
        builder.addCase(logoutUser.fulfilled, (s) => { s.user = null; s.status = "idle"; });
    },
});

export const { clearError, setUser } = authSlice.actions;
export const selectUser = (state) => state.auth.user;
export const selectAuthStatus = (state) => state.auth.status;
export const selectAuthError = (state) => state.auth.error;
export const selectInitialized = (state) => state.auth.initialized;
export default authSlice.reducer;
