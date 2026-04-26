import cookie from "cookie";
import { buildAuthorizeUrl, createOAuthState, getOAuthConfig, oauthConfigured } from "@/lib/oauth";

function redirectWithError(req, res, provider, message) {
    const base = process.env.NEXT_PUBLIC_APP_URL || `${req.headers["x-forwarded-proto"] || "http"}://${req.headers.host}`;
    return res.redirect(`${base}/?authMode=login&authError=${encodeURIComponent(message)}&provider=${provider}`);
}

export default async function handler(req, res) {
    const provider = String(req.query.provider || "");
    const config = getOAuthConfig(provider, req);

    if (!config) {
        return redirectWithError(req, res, provider, "Unsupported sign-in provider.");
    }

    if (!oauthConfigured(config)) {
        return redirectWithError(req, res, provider, `${config.label} sign-in is not configured yet.`);
    }

    const state = createOAuthState();
    res.setHeader(
        "Set-Cookie",
        cookie.serialize(`oauth_state_${provider}`, state, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 10,
            path: "/",
        })
    );

    return res.redirect(buildAuthorizeUrl(config, state));
}
