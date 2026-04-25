
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import watchlistReducer from "./slices/watchlistSlice";
import uiReducer from "./slices/uiSlice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        watchlist: watchlistReducer,
        ui: uiReducer,
    },
    middleware: (getDefault) =>
        getDefault({ serializableCheck: { ignoredPaths: ["ui.trailer"] } }),
});

export default store;