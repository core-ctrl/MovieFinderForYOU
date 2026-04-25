//home/claude / movie - finder - v2 / pages / api / analytics / event.js << 'EOF'
// pages/api/analytics/event.js
// Track user events: trailer_play, save, search, click
import { connectDB } from "@/lib/mongodb";
import { requireAuth } from "@/middleware/requireAuth";
import { z } from "zod";
import { validate } from "@/middleware/validate";

const eventSchema = z.object({
    event: z.enum(["trailer_play", "save", "unsave", "search", "click", "page_view"]),
    mediaId: z.number().optional(),
    mediaType: z.string().optional(),
    query: z.string().optional(),
    page: z.string().optional(),
});

export default async function handler(req, res) {
    if (req.method !== "POST") return res.status(405).end();

    const { success, data, error } = validate(eventSchema, req.body);
    if (!success) return res.status(400).json({ error });

    // Non-blocking — respond immediately
    res.status(200).json({ ok: true });

    // Process event asynchronously
    setImmediate(async () => {
        try {
            const decoded = requireAuth(req);
            // In production: write to analytics DB or send to Mixpanel / GA4 Measurement Protocol
            // For now: log for development visibility
            if (process.env.NODE_ENV === "development") {
                console.log(`📊 Event: ${data.event}`, { userId: decoded?.id, ...data });
            }
            // TODO: await AnalyticsService.track({ userId: decoded?.id, ...data });
        } catch { }
    });
}