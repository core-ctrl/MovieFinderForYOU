const attempts = new Map();

export function rateLimit({ maxAttempts = 10, windowMs = 60 * 1000 }) {
  return function check(identifier = "anonymous") {
    const now = Date.now();
    const key = identifier;
    const record = attempts.get(key);

    if (!record || now - record.start > windowMs) {
      attempts.set(key, { count: 1, start: now });
      return { allowed: true, remaining: maxAttempts - 1 };
    }

    if (record.count >= maxAttempts) {
      const retryAfter = Math.ceil((record.start + windowMs - now) / 1000);
      return { allowed: false, retryAfter };
    }

    record.count += 1;
    attempts.set(key, record);
    return { allowed: true, remaining: maxAttempts - record.count };
  };
}

export const authLimiter = rateLimit({ maxAttempts: 5, windowMs: 15 * 60 * 1000 });
export const searchLimiter = rateLimit({ maxAttempts: 40, windowMs: 60 * 1000 });
export const formLimiter = rateLimit({ maxAttempts: 8, windowMs: 10 * 60 * 1000 });
