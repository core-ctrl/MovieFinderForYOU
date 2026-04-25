// controllers/authController.js
// Pure functions — no req/res knowledge, just business logic wrappers
import * as AuthService from "../services/authService.js";

export async function register(body) {
    const { name, email, password } = body;
    return AuthService.registerUser({ name, email, password });
}

export async function login(body) {
    const { email, password } = body;
    return AuthService.loginUser({ email, password });
}

export async function getMe(userId) {
    return AuthService.getUserById(userId);
}
