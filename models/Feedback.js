import mongoose from "mongoose";

const FeedbackSchema = new mongoose.Schema(
    {
        userEmail: {
            type: String,
            trim: true,
            default: "",
        },
        message: {
            type: String,
            required: [true, "Message is required"],
            trim: true,
            minlength: [1, "Message cannot be empty"],
            maxlength: [2000, "Message cannot exceed 2000 characters"],
        },
    },
    { timestamps: true }
);

const Feedback = mongoose.models.Feedback || mongoose.model("Feedback", FeedbackSchema);

export default Feedback;

