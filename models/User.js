// models/User.js
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const UserSchema = new mongoose.Schema(
  {
<<<<<<< HEAD
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 8, select: false },
    isAdmin: { type: Boolean, default: false },
    preferredGenres: { type: [Number], default: [] },
    // Password reset
    resetPasswordToken: { type: String, select: false },
    resetPasswordExpires: { type: Date, select: false },
    wishlist: [{
      mediaId: Number,
      mediaType: { type: String, enum: ["movie", "tv"] },
      title: String,
      posterPath: String,
      addedAt: { type: Date, default: Date.now },
    }],
    watchHistory: [{
      mediaId: Number,
      mediaType: { type: String, enum: ["movie", "tv"] },
      title: String,
      posterPath: String,
      watchedAt: { type: Date, default: Date.now },
    }],
=======
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
>>>>>>> 3b3f76b6b2f75cfb78a3ee46561373052120bd14
  },
  { timestamps: true }
);

<<<<<<< HEAD
=======
// Hash password before saving
>>>>>>> 3b3f76b6b2f75cfb78a3ee46561373052120bd14
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

<<<<<<< HEAD
=======
// Compare entered password with hashed password
>>>>>>> 3b3f76b6b2f75cfb78a3ee46561373052120bd14
UserSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

<<<<<<< HEAD
const User = mongoose.models.User || mongoose.model("User", UserSchema);
=======
// Prevent model recompilation error in Next.js hot-reload
const User = mongoose.models.User || mongoose.model("User", UserSchema);

>>>>>>> 3b3f76b6b2f75cfb78a3ee46561373052120bd14
export default User;
