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
      minlength: 8,
      select: false,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    authProviders: {
      type: [String],
      default: ["credentials"],
    },
    googleId: {
      type: String,
      sparse: true,
    },
    githubId: {
      type: String,
      sparse: true,
    },
    avatar: {
      type: String,
      default: "",
    },
    preferredGenres: {
      type: [Number],
      default: [],
    },
    preferredLanguages: {
      type: [String],
      default: [],
    },
    preferredRegions: {
      type: [String],
      default: [],
    },
    preferredRegionGroup: {
      type: String,
      default: "",
    },
    allowLocationRecommendations: {
      type: Boolean,
      default: false,
    },
    resetPasswordToken: {
      type: String,
      select: false,
    },
    resetPasswordExpires: {
      type: Date,
      select: false,
    },
    wishlist: [
      {
        mediaId: Number,
        mediaType: { type: String, enum: ["movie", "tv"] },
        title: String,
        posterPath: String,
        addedAt: { type: Date, default: Date.now },
      },
    ],
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

UserSchema.pre("save", async function savePassword(next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  return next();
});

UserSchema.methods.comparePassword = async function comparePassword(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;
