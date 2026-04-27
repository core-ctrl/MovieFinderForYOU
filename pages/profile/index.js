// pages/profile/index.js
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import Head from "next/head";
import axios from "axios";
import { setUser, logoutUser } from "../../store/slices/authSlice";
import { Search01Icon, Logout01Icon, PasswordIcon } from "@hugeicons/core-free-icons";
import { ALL_GENRES, LANGUAGE_OPTIONS, REGION_GROUPS, REGION_OPTIONS } from "../../lib/preferenceOptions";
import AppIcon from "../../components/AppIcon";

export default function ProfilePage({ user, wishlist = [], openAuth }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const [selectedGenres, setSelectedGenres] = useState(user?.preferredGenres || []);
  const [selectedLanguages, setSelectedLanguages] = useState(user?.preferredLanguages || []);
  const [selectedRegions, setSelectedRegions] = useState(user?.preferredRegions || []);
  const [selectedRegionGroup, setSelectedRegionGroup] = useState(user?.preferredRegionGroup || "");
  const [regionSearch, setRegionSearch] = useState("");
  const [allowLocationRecommendations, setAllowLocationRecommendations] = useState(
    Boolean(user?.allowLocationRecommendations)
  );
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  // Change password state
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);

  // Logout loading state
  const [loggingOut, setLoggingOut] = useState(false);

  if (!user) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center gap-4">
        <Head><title>Profile — Movie Finder</title></Head>
        <p className="text-4xl">👤</p>
        <p className="text-xl font-bold">Sign in to view your profile</p>
        <button onClick={openAuth} className="mt-4 bg-red-600 text-white px-6 py-3 rounded-xl font-medium">
          Sign In
        </button>
      </div>
    );
  }

  const toggleGenre = (id) => {
    setSelectedGenres((prev) =>
      prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]
    );
    setSaved(false);
  };

  const toggleLanguage = (code) => {
    setSelectedLanguages((prev) =>
      prev.includes(code) ? prev.filter((item) => item !== code) : [...prev, code]
    );
    setSaved(false);
  };

  const toggleRegion = (code) => {
    setSelectedRegions((prev) =>
      prev.includes(code) ? prev.filter((item) => item !== code) : [...prev, code]
    );
    setSaved(false);
  };

  const visibleRegions = REGION_OPTIONS.filter((region) => {
    const matchesGroup = selectedRegionGroup ? region.group === selectedRegionGroup : true;
    const term = regionSearch.trim().toLowerCase();
    const matchesSearch = !term || region.label.toLowerCase().includes(term) || region.code.toLowerCase().includes(term);
    return matchesGroup && matchesSearch;
  });

  const savePreferences = async () => {
    setSaving(true);
    await axios.post("/api/user/preferences", {
      genres: selectedGenres,
      languages: selectedLanguages,
      regions: selectedRegions,
      regionGroup: selectedRegionGroup,
      allowLocationRecommendations,
    });
    dispatch(setUser({
      ...user,
      preferredGenres: selectedGenres,
      preferredLanguages: selectedLanguages,
      preferredRegions: selectedRegions,
      preferredRegionGroup: selectedRegionGroup,
      allowLocationRecommendations,
    }));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    setSaving(false);
  };

  // Handle logout
  const handleLogout = async () => {
    if (!confirm("Are you sure you want to log out?")) return;
    setLoggingOut(true);
    try {
      await dispatch(logoutUser()).unwrap();
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setLoggingOut(false);
    }
  };

  // Handle change password
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");

    // Validation
    if (passwordForm.newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters");
      return;
    }
    if (!/[A-Z]/.test(passwordForm.newPassword)) {
      setPasswordError("New password must contain an uppercase letter");
      return;
    }
    if (!/[0-9]/.test(passwordForm.newPassword)) {
      setPasswordError("New password must contain a number");
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }
    if (passwordForm.currentPassword === passwordForm.newPassword) {
      setPasswordError("New password must be different from current password");
      return;
    }

    setChangingPassword(true);
    try {
      await axios.post("/api/auth/change-password", {
        oldPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      setPasswordSuccess("Password changed successfully!");
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setTimeout(() => {
        setShowPasswordModal(false);
        setPasswordSuccess("");
      }, 2000);
    } catch (error) {
      setPasswordError(error.response?.data?.error || "Failed to change password");
    } finally {
      setChangingPassword(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white pt-28 px-4 md:px-6">
      <Head><title>Profile — Movie Finder</title></Head>

      <div className="max-w-3xl mx-auto">
        {/* Avatar + Name */}
        <div className="flex items-center justify-between gap-5 mb-10">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-full bg-red-600 flex items-center justify-center text-3xl font-bold">
              {user.name?.[0]?.toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-bold">{user.name}</h1>
              <p className="text-neutral-400 text-sm">{user.email}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-2">
            <button
              onClick={() => setShowPasswordModal(true)}
              className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-neutral-300 transition hover:bg-white/10 hover:text-white"
            >
              <AppIcon icon={PasswordIcon} size={16} />
              Change Password
            </button>
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-400 transition hover:bg-red-500/20 disabled:opacity-60"
            >
              <AppIcon icon={Logout01Icon} size={16} />
              {loggingOut ? "Logging out..." : "Logout"}
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-10">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center">
            <p className="text-3xl font-bold text-red-400">{wishlist.length}</p>
            <p className="text-sm text-neutral-400 mt-1">Saved Titles</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center">
            <p className="text-3xl font-bold text-red-400">{selectedGenres.length}</p>
            <p className="text-sm text-neutral-400 mt-1">Favourite Genres</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center">
            <p className="text-3xl font-bold text-red-400">{selectedLanguages.length}</p>
            <p className="text-sm text-neutral-400 mt-1">Preferred Languages</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center">
            <p className="text-3xl font-bold text-red-400">{selectedRegions.length}</p>
            <p className="text-sm text-neutral-400 mt-1">Preferred Regions</p>
          </div>
        </div>

        {/* Genre Preferences */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Favourite Genres</h2>
          <p className="text-sm text-neutral-400 mb-5">
            Select genres to get personalised recommendations on the home page.
          </p>
          <div className="flex flex-wrap gap-3 mb-6">
            {ALL_GENRES.map((genre) => (
              <button
                key={genre.id}
                onClick={() => toggleGenre(genre.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition ${selectedGenres.includes(genre.id)
                  ? "bg-red-600 text-white"
                  : "bg-white/10 text-neutral-300 hover:bg-white/20"
                  }`}
              >
                {genre.name}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Languages You Watch In</h2>
          <p className="text-sm text-neutral-400 mb-5">
            Choose the languages you usually enjoy. This helps us prioritize titles closer to your taste.
          </p>
          <div className="flex flex-wrap gap-3">
            {LANGUAGE_OPTIONS.map((language) => (
              <button
                key={language.code}
                onClick={() => toggleLanguage(language.code)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition ${selectedLanguages.includes(language.code)
                  ? "bg-red-600 text-white"
                  : "bg-white/10 text-neutral-300 hover:bg-white/20"
                  }`}
              >
                {language.label}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Region and Market Preferences</h2>
          <p className="text-sm text-neutral-400 mb-5">
            Pick the broad region first, then the countries or markets you watch from most often so recommendations, theater links, and platform hints stay relevant.
          </p>

          <div className="flex flex-wrap gap-3 mb-4">
            {REGION_GROUPS.map((group) => (
              <button
                key={group.id}
                onClick={() => {
                  setSelectedRegionGroup(group.id);
                  setSelectedRegions((prev) => prev.filter((code) => REGION_OPTIONS.find((region) => region.code === code)?.group === group.id));
                  setSaved(false);
                }}
                className={`px-4 py-2 rounded-full text-sm font-medium transition ${selectedRegionGroup === group.id
                  ? "bg-red-600 text-white"
                  : "bg-white/10 text-neutral-300 hover:bg-white/20"
                  }`}
              >
                {group.label}
              </button>
            ))}
          </div>

          <div className="relative mb-4">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500">
              <AppIcon icon={Search01Icon} size={15} />
            </span>
            <input
              type="text"
              value={regionSearch}
              onChange={(event) => setRegionSearch(event.target.value)}
              placeholder="Search country or market"
              className="w-full rounded-2xl border border-white/10 bg-black/20 py-3 pl-10 pr-4 text-sm text-white outline-none transition focus:border-red-500/50"
            />
          </div>

          <div className="flex flex-wrap gap-3 mb-6">
            {visibleRegions.map((region) => (
              <button
                key={region.code}
                onClick={() => toggleRegion(region.code)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition ${selectedRegions.includes(region.code)
                  ? "bg-red-600 text-white"
                  : "bg-white/10 text-neutral-300 hover:bg-white/20"
                  }`}
              >
                {region.label}
              </button>
            ))}
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="font-medium text-white">Allow location-aware recommendations</p>
                <p className="text-sm text-neutral-400">
                  Turn this on if you want us to use your chosen market and future location signals to tune results more accurately.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setAllowLocationRecommendations((value) => !value);
                  setSaved(false);
                }}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${allowLocationRecommendations
                  ? "bg-green-600/20 text-green-400 border border-green-600/30"
                  : "bg-white/10 text-neutral-300 border border-white/10"
                  }`}
              >
                {allowLocationRecommendations ? "Enabled" : "Disabled"}
              </button>
            </div>
          </div>

          <button
            onClick={savePreferences}
            className="mt-6 bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-xl font-medium transition text-sm disabled:opacity-60"
            disabled={saving}
          >
            {saved ? "✓ Saved!" : saving ? "Saving..." : "Save Preferences"}
          </button>
        </div>
      </div>

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#1a1a1a] p-6 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Change Password</h2>
              <button
                onClick={() => {
                  setShowPasswordModal(false);
                  setPasswordError("");
                  setPasswordSuccess("");
                  setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
                }}
                className="text-neutral-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleChangePassword}>
              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-neutral-300">
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition focus:border-red-500/50"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-neutral-300">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition focus:border-red-500/50"
                    required
                  />
                  <p className="mt-1 text-xs text-neutral-500">
                    Min 8 characters, 1 uppercase, 1 number
                  </p>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-neutral-300">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition focus:border-red-500/50"
                    required
                  />
                </div>

                {passwordError && (
                  <p className="text-sm text-red-400">{passwordError}</p>
                )}

                {passwordSuccess && (
                  <p className="text-sm text-green-400">{passwordSuccess}</p>
                )}
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowPasswordModal(false);
                    setPasswordError("");
                    setPasswordSuccess("");
                    setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
                  }}
                  className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 font-medium text-neutral-300 transition hover:bg-white/10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={changingPassword}
                  className="flex-1 rounded-xl bg-red-600 px-4 py-3 font-medium text-white transition hover:bg-red-700 disabled:opacity-60"
                >
                  {changingPassword ? "Changing..." : "Change Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
