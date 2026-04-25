cat > /home/claude / movie - finder - v2 / store / slices / uiSlice.js << 'EOF'
// store/slices/uiSlice.js
// Global UI state: modals, trailer, theme
import { createSlice } from "@reduxjs/toolkit";

const uiSlice = createSlice({
    name: "ui",
    initialState: {
        authModalOpen: false,
        authModalMode: "login",       // login | signup | forgot
        trailer: {
            open: false,
            key: null,
            title: "",
            id: null,
            type: "movie",
        },
    },
    reducers: {
        openAuthModal: (s, a) => { s.authModalOpen = true; s.authModalMode = a.payload || "login"; },
        closeAuthModal: (s) => { s.authModalOpen = false; },
        openTrailer: (s, a) => { s.trailer = { open: true, ...a.payload }; },
        closeTrailer: (s) => { s.trailer = { open: false, key: null, title: "", id: null, type: "movie" }; },
    },
});

export const { openAuthModal, closeAuthModal, openTrailer, closeTrailer } = uiSlice.actions;
export const selectAuthModalOpen = (s) => s.ui.authModalOpen;
export const selectAuthModalMode = (s) => s.ui.authModalMode;
export const selectTrailer = (s) => s.ui.trailer;
export default uiSlice.reducer;

