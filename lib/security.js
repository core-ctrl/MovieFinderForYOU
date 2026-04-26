const SCANNER_USER_AGENTS = /(sqlmap|nikto|nessus|acunetix|nmap|masscan|zgrab|dirbuster|wpscan)/i;

export function getClientIp(req) {
  const forwarded = req.headers["x-forwarded-for"];

  if (Array.isArray(forwarded)) {
    return forwarded[0] || req.socket?.remoteAddress || "unknown";
  }

  if (typeof forwarded === "string") {
    return forwarded.split(",")[0].trim();
  }

  return req.socket?.remoteAddress || "unknown";
}

export function sanitizeText(value, { maxLength = 200, preserveNewLines = false } = {}) {
  const input = typeof value === "string" ? value : String(value || "");
  const withoutTags = input.replace(/<[^>]*>?/g, "");
  const controlCharsPattern = preserveNewLines ? /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]+/g : /[\u0000-\u001F\u007F]+/g;
  const withoutControlChars = withoutTags.replace(controlCharsPattern, "");

  return withoutControlChars
    .replace(/[<>`$]/g, "")
    .replace(/\s+/g, preserveNewLines ? " " : " ")
    .trim()
    .slice(0, maxLength);
}

export function sanitizeEmail(email) {
  return sanitizeText(email, { maxLength: 160 }).toLowerCase();
}

export function sanitizeSearchQuery(query) {
  return sanitizeText(query, { maxLength: 100 }).replace(/[{}[\]|\\]/g, "");
}

export function setPublicCache(res, value = "public, s-maxage=300, stale-while-revalidate=600") {
  res.setHeader("Cache-Control", value);
}

export function isLikelyScanner(userAgent = "") {
  return SCANNER_USER_AGENTS.test(userAgent);
}

export function createApiError(message, status = 400) {
  return { error: message, status };
}
