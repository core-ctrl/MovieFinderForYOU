// models/User.js
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const UserSchema = new mongoose.Schema(
  {
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
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

UserSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.models.User || mongoose.model("User", UserSchema);
export default User;
