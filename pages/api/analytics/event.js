import { z } from "zod";
import { validate } from "@/middleware/validate";
import { formLimiter } from "@/lib/rateLimit";
import { getClientIp, sanitizeSearchQuery, sanitizeText } from "@/lib/security";
import { requireAuth } from "@/middleware/requireAuth";

const eventSchema = z.object({
  event: z.enum(["trailer_play", "save", "unsave", "search", "watch_now_click", "page_view"]),
  mediaId: z.number().optional(),
  mediaType: z.string().optional(),
  query: z.string().optional(),
  page: z.string().optional(),
  provider: z.string().optional(),
});

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const ip = getClientIp(req);
  const limit = formLimiter(ip);
  if (!limit.allowed) {
    return res.status(429).json({ error: "Rate limit exceeded" });
  }

  const { success, data, error } = validate(eventSchema, req.body);
  if (!success) return res.status(400).json({ error });

  res.status(200).json({ ok: true });

  setImmediate(() => {
    try {
      const decoded = requireAuth(req);
      const payload = {
        ...data,
        query: data.query ? sanitizeSearchQuery(data.query) : undefined,
        page: data.page ? sanitizeText(data.page, { maxLength: 120 }) : undefined,
        provider: data.provider ? sanitizeText(data.provider, { maxLength: 80 }) : undefined,
      };

      if (process.env.NODE_ENV === "development") {
        console.log("ANALYTICS_EVENT", { userId: decoded?.id, ...payload });
      }
    } catch {
      // Ignore analytics pipeline failures.
    }
  });
}
