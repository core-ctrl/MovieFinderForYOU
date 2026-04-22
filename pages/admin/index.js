// pages/admin/index.js
// Hidden admin panel — NOT linked from any public UI
// Access at: /admin
import { useState, useEffect } from "react";
import Head from "next/head";
import axios from "axios";

export default function AdminPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authCheck, setAuthCheck] = useState(false);

  useEffect(() => {
    // Only show if user is admin
    axios.get("/api/auth/me")
      .then((res) => {
        if (res.data.user?.isAdmin) {
          setAuthCheck(true);
          loadStats();
        } else {
          setAuthCheck(false);
          setLoading(false);
        }
      })
      .catch(() => {
        setAuthCheck(false);
        setLoading(false);
      });
  }, []);

  const loadStats = async () => {
    try {
      const res = await axios.get("/api/admin/stats");
      setStats(res.data);
    } catch {
      setStats({ error: "Could not load stats" });
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );

  if (!authCheck)
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center gap-4">
        <p className="text-4xl">🔒</p>
        <p className="text-xl font-bold">Admin Access Only</p>
        <p className="text-neutral-400 text-sm">You need admin privileges to view this page.</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-neutral-950 text-white p-6">
      <Head>
        <title>Admin — Movie Finder</title>
      </Head>

      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">⚙️ Admin Panel</h1>
        <p className="text-neutral-400 text-sm mb-10">
          Manage Movie Finder content and users
        </p>

        {/* Stats cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {[
            { label: "Total Users", value: stats?.totalUsers ?? "—", icon: "👥" },
            { label: "Wishlists", value: stats?.totalWishlists ?? "—", icon: "❤️" },
            { label: "Movies API", value: "TMDB Live", icon: "🎬" },
            { label: "DB Status", value: "Connected", icon: "🟢" },
          ].map((s) => (
            <div
              key={s.label}
              className="bg-neutral-900 border border-white/10 rounded-2xl p-5"
            >
              <div className="text-2xl mb-2">{s.icon}</div>
              <div className="text-2xl font-bold">{s.value}</div>
              <div className="text-xs text-neutral-400 mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Recent Users */}
        {stats?.recentUsers?.length > 0 && (
          <section className="mb-12">
            <h2 className="text-xl font-bold mb-4">Recent Users</h2>
            <div className="bg-neutral-900 border border-white/10 rounded-2xl overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-neutral-400">
                    <th className="text-left p-4">Name</th>
                    <th className="text-left p-4">Email</th>
                    <th className="text-left p-4">Joined</th>
                    <th className="text-left p-4">Wishlist</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentUsers.map((u) => (
                    <tr key={u._id} className="border-b border-white/5 hover:bg-white/5">
                      <td className="p-4 font-medium">{u.name}</td>
                      <td className="p-4 text-neutral-400">{u.email}</td>
                      <td className="p-4 text-neutral-400">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-4">{u.wishlist?.length ?? 0} items</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        <div className="bg-yellow-900/20 border border-yellow-600/30 rounded-2xl p-5 text-sm text-yellow-300">
          <p className="font-medium mb-1">⚠️ Note</p>
          <p>
            This admin panel is not linked from any public page. Access it at{" "}
            <code className="bg-black/40 px-1 rounded">/admin</code>. Add an{" "}
            <code className="bg-black/40 px-1 rounded">isAdmin: true</code> field to a
            user in MongoDB to grant access.
          </p>
        </div>
      </div>
    </div>
  );
}
