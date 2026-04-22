// models/User.js
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
      select: false, // Never return password in queries by default
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    // Favorite genres (TMDB genre IDs)
    preferredGenres: {
      type: [Number],
      default: [],
    },
    // Wishlist - saved movies and series
    wishlist: [
      {
        mediaId: Number,
        mediaType: { type: String, enum: ["movie", "tv"] },
        title: String,
        posterPath: String,
        addedAt: { type: Date, default: Date.now },
      },
    ],
    // Watch history
    watchHistory: [
      {
        mediaId: Number,
        mediaType: { type: String, enum: ["movie", "tv"] },
        title: String,
        posterPath: String,
        watchedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

// Hash password before saving
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare entered password with hashed password
UserSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Prevent model recompilation error in Next.js hot-reload
const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;
