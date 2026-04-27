import { connectDB } from "@/lib/mongodb";
import Feedback from "@/models/Feedback";
import { getUserFromRequest } from "@/lib/auth";
import User from "@/models/User";
import mongoose from "mongoose";

export default async function handler(req, res) {
    try {
        // Authenticate and authorize admin
        const decoded = getUserFromRequest(req);
        if (!decoded) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        await connectDB();

        const user = await User.findById(decoded.id).select("isAdmin");
        if (!user?.isAdmin) {
            return res.status(403).json({ error: "Forbidden" });
        }

        // GET — List all feedback
        if (req.method === "GET") {
            const feedback = await Feedback.find({})
                .sort({ createdAt: -1 })
                .limit(200);

            return res.status(200).json({ feedback });
        }

        // DELETE — Remove feedback by ID
        if (req.method === "DELETE") {
            const { id } = req.query;

            if (!id || !mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({ error: "Invalid feedback ID" });
            }

            await Feedback.findByIdAndDelete(id);

            return res.status(200).json({ message: "Feedback deleted" });
        }

        return res.status(405).json({ error: "Method not allowed" });
    } catch (err) {
        console.error("Admin feedback API error:", err);
        return res.status(500).json({ error: "Internal server error" });
    }
}

