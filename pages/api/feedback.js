import { connectDB } from "@/lib/mongodb";
import Feedback from "@/models/Feedback";
import { validate, feedbackSchema } from "@/middleware/validate";

export default async function handler(req, res) {
    try {
        await connectDB();

        if (req.method === "POST") {
            const { success, data, error } = validate(feedbackSchema, req.body);
            if (!success) {
                return res.status(400).json({ error });
            }

            const feedback = await Feedback.create({
                userEmail: data.userEmail || "",
                message: data.message,
            });

            return res.status(201).json({
                message: "Feedback submitted successfully",
                feedback: {
                    _id: feedback._id,
                    userEmail: feedback.userEmail,
                    message: feedback.message,
                    createdAt: feedback.createdAt,
                },
            });
        }

        return res.status(405).json({ error: "Method not allowed" });
    } catch (err) {
        console.error("Feedback API error:", err);
        return res.status(500).json({ error: "Internal server error" });
    }
}

