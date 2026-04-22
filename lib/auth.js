// lib/auth.js
// JWT utilities for signing and verifying tokens

import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES = "7d"; // Token valid for 7 days

if (!JWT_SECRET) {
  throw new Error("Please set JWT_SECRET in your .env.local file");
}

// Create a JWT token for a user
export function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES });
}

// Verify and decode a JWT token
// Returns decoded payload or null if invalid
export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

// Extract user from the request cookie (server-side)
export function getUserFromRequest(req) {
  const token = req.cookies?.token;
  if (!token) return null;
  return verifyToken(token);
}
