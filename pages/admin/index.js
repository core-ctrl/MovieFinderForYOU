// pages/admin/index.js
<<<<<<< HEAD
import { useState, useEffect } from "react";
import Head from "next/head";
import axios from "axios";
import { motion } from "framer-motion";
import { FaUsers, FaFilm, FaHeart, FaTrash, FaShieldAlt, FaChartBar } from "react-icons/fa";

export default function AdminPage() {
  const [authed, setAuthed]   = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats]     = useState(null);
  const [users, setUsers]     = useState([]);
  const [tab, setTab]         = useState("overview");

  useEffect(() => {
    axios.get("/api/auth/me").then(res => {
      if (res.data.user?.isAdmin) {
        setAuthed(true);
        loadAll();
      }
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const loadAll = async () => {
    const [s, u] = await Promise.all([
      axios.get("/api/admin/stats").then(r => r.data),
      axios.get("/api/admin/users").then(r => r.data),
    ]);
    setStats(s);
    setUsers(u.users || []);
  };

  const deleteUser = async (id) => {
    if (!confirm("Delete this user?")) return;
    await axios.delete(`/api/admin/users?id=${id}`);
    setUsers(u => u.filter(x => x._id !== id));
  };

  const makeAdmin = async (id) => {
    await axios.patch(`/api/admin/users`, { id, isAdmin: true });
    setUsers(u => u.map(x => x._id === id ? { ...x, isAdmin: true } : x));
  };

  if (loading) return (
    <div className="min-h-screen bg-surface-0 flex items-center justify-center">
      <div className="w-10 h-10 border-2 border-accent border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!authed) return (
    <div className="min-h-screen bg-surface-0 text-white flex flex-col items-center justify-center gap-4">
      <FaShieldAlt size={48} className="text-accent" />
      <p className="text-2xl font-bold">Admin Access Only</p>
      <p className="text-neutral-500 text-sm">Set isAdmin: true in MongoDB to access this panel.</p>
    </div>
  );

  const tabs = [
    { id: "overview", icon: <FaChartBar />, label: "Overview" },
    { id: "users",    icon: <FaUsers />,    label: "Users" },
  ];

  return (
    <div className="min-h-screen bg-surface-0 text-white">
      <Head><title>Admin — Movie Finder</title></Head>

      {/* Sidebar */}
      <div className="flex">
        <aside className="w-60 min-h-screen bg-surface-1 border-r border-white/5 fixed top-0 left-0 pt-8 px-4">
          <div className="mb-8 px-2">
            <p className="text-xs text-neutral-500 uppercase tracking-widest mb-1">Admin Panel</p>
            <h1 className="text-lg font-black gradient-text-red">MOVIEFINDER</h1>
          </div>
          <nav className="flex flex-col gap-1">
            {tabs.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  tab === t.id ? "bg-accent/15 text-accent border border-accent/20" : "text-neutral-400 hover:text-white hover:bg-white/5"
                }`}>
                {t.icon} {t.label}
              </button>
            ))}
          </nav>
          <div className="absolute bottom-6 left-4 right-4">
            <a href="/" className="flex items-center gap-2 text-xs text-neutral-600 hover:text-neutral-400 transition-colors px-3">
              ← Back to site
            </a>
          </div>
        </aside>

        {/* Main */}
        <main className="ml-60 flex-1 p-8">
          {tab === "overview" && stats && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <h2 className="text-2xl font-bold mb-8">Overview</h2>

              {/* Stats grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                {[
                  { label: "Total Users",    value: stats.totalUsers,     icon: <FaUsers />,    color: "text-blue-400" },
                  { label: "Total Wishlists",value: stats.totalWishlists, icon: <FaHeart />,    color: "text-red-400" },
                  { label: "Data Source",    value: "TMDB API",           icon: <FaFilm />,     color: "text-green-400" },
                  { label: "DB Status",      value: "Connected",          icon: <FaShieldAlt />,color: "text-emerald-400" },
                ].map(s => (
                  <div key={s.label} className="card p-5">
                    <div className={`${s.color} text-xl mb-3`}>{s.icon}</div>
                    <p className="text-2xl font-black text-white">{s.value}</p>
                    <p className="text-xs text-neutral-500 mt-1">{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Recent signups */}
              <h3 className="text-lg font-bold mb-4">Recent Signups</h3>
              <div className="card overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/5 text-neutral-500">
                      <th className="text-left p-4">Name</th>
                      <th className="text-left p-4">Email</th>
                      <th className="text-left p-4">Joined</th>
                      <th className="text-left p-4">Saved</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(stats.recentUsers || []).map(u => (
                      <tr key={u._id} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                        <td className="p-4 font-medium">{u.name}</td>
                        <td className="p-4 text-neutral-400">{u.email}</td>
                        <td className="p-4 text-neutral-400">{new Date(u.createdAt).toLocaleDateString()}</td>
                        <td className="p-4">{u.wishlist?.length ?? 0}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {tab === "users" && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold">Users ({users.length})</h2>
              </div>
              <div className="card overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/5 text-neutral-500">
                      <th className="text-left p-4">Name</th>
                      <th className="text-left p-4">Email</th>
                      <th className="text-left p-4">Joined</th>
                      <th className="text-left p-4">Saved</th>
                      <th className="text-left p-4">Role</th>
                      <th className="text-left p-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(u => (
                      <tr key={u._id} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                        <td className="p-4 font-medium">{u.name}</td>
                        <td className="p-4 text-neutral-400 text-xs">{u.email}</td>
                        <td className="p-4 text-neutral-400 text-xs">{new Date(u.createdAt).toLocaleDateString()}</td>
                        <td className="p-4">{u.wishlist?.length ?? 0}</td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${u.isAdmin ? "bg-red-500/20 text-red-400" : "bg-white/8 text-neutral-400"}`}>
                            {u.isAdmin ? "Admin" : "User"}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            {!u.isAdmin && (
                              <button onClick={() => makeAdmin(u._id)} className="text-xs px-2 py-1 bg-white/8 hover:bg-white/15 rounded-lg transition-colors">
                                Make Admin
                              </button>
                            )}
                            <button onClick={() => deleteUser(u._id)} className="text-xs px-2 py-1 bg-red-500/15 hover:bg-red-500/25 text-red-400 rounded-lg transition-colors">
                              <FaTrash size={10} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </main>
=======
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
>>>>>>> 3b3f76b6b2f75cfb78a3ee46561373052120bd14
      </div>
    </div>
  );
}
