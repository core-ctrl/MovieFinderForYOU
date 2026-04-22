// pages/api/auth/logout.js
import cookie from "cookie";

export default function handler(req, res) {
  // Clear the token cookie
  res.setHeader(
    "Set-Cookie",
    cookie.serialize("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 0,
      path: "/",
    })
  );

  return res.status(200).json({ message: "Logged out" });
}
