// lib/rateLimit.js
// Simple in-memory rate limiter
// For production use Redis instead

const attempts = new Map();

export function rateLimit({ maxAttempts = 5, windowMs = 15 * 60 * 1000 }) {
    return function check(ip) {
        const now = Date.now();
        const key = ip;
        const record = attempts.get(key);

        if (!record || now - record.start > windowMs) {
            attempts.set(key, { count: 1, start: now });
            return { allowed: true, remaining: maxAttempts - 1 };
        }

        if (record.count >= maxAttempts) {
            const retryAfter = Math.ceil((record.start + windowMs - now) / 1000);
            return { allowed: false, retryAfter };
        }

        record.count++;
        return { allowed: true, remaining: maxAttempts - record.count };
    };
}

// Pre-built limiters
export const authLimiter = rateLimit({ maxAttempts: 5, windowMs: 15 * 60 * 1000 });
export const searchLimiter = rateLimit({ maxAttempts: 30, windowMs: 60 * 1000 });

