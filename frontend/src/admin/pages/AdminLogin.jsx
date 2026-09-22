import { useState } from "react";
import { LockKeyhole, ArrowRight, Loader2 } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

import { API_URL } from "../utils/authFetch";

export default function AdminLogin() {
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ==================================================
     INPUT CHANGE
  ================================================== */

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  /* ==================================================
     LOGIN
  ================================================== */

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        credentials: "include",

        body: JSON.stringify(form),
      });

      let data = null;

      try {
        data = await response.json();
      } catch {
        data = null;
      }

      if (!response.ok) {
        throw new Error(data?.message || "Invalid email or password.");
      }

      /*
       * If the user was originally trying to access
       * /admin/projects, return them there.
       *
       * Otherwise go to /admin.
       */
      const from =
        location.state?.from && typeof location.state.from === "string"
          ? location.state.from
          : "/admin";

      navigate(from, {
        replace: true,
      });
    } catch (error) {
      console.error("Admin login error:", error);

      setError(error instanceof Error ? error.message : "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  /* ==================================================
     UI
  ================================================== */

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="flex min-h-screen items-center justify-center px-5 py-10">
        <div className="w-full max-w-md">
          {/* BRAND */}

          <div className="mb-10 text-center">
            <p className="text-[9px] font-bold uppercase tracking-[0.35em] text-red-500">
              Being IBAN Entertainments
            </p>

            <h1 className="mt-4 font-display text-4xl font-black uppercase tracking-[-0.05em] sm:text-5xl">
              Dashboard
              <span className="text-red-500">.</span>
            </h1>

            <p className="mt-3 text-xs text-white/40">Admin control panel</p>
          </div>

          {/* CARD */}

          <div className="border border-white/10 bg-white/[0.02]">
            {/* HEADER */}

            <div className="border-b border-white/10 p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center border border-red-500/30 bg-red-500/10">
                  <LockKeyhole size={18} className="text-red-500" />
                </div>

                <div>
                  <h2 className="text-sm font-bold uppercase tracking-[0.12em]">
                    Admin Login
                  </h2>

                  <p className="mt-1 text-[10px] text-white/30">
                    Sign in to manage the studio.
                  </p>
                </div>
              </div>
            </div>

            {/* FORM */}

            <form onSubmit={handleSubmit} className="space-y-5 p-6">
              {/* ERROR */}

              {error && (
                <div className="border border-red-500/30 bg-red-500/10 px-4 py-3 text-xs text-red-400">
                  {error}
                </div>
              )}

              {/* EMAIL */}

              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-[9px] font-bold uppercase tracking-[0.2em] text-white/50"
                >
                  Email
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="admin@example.com"
                  required
                  className="h-12 w-full border border-white/10 bg-black px-4 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-red-500"
                />
              </div>

              {/* PASSWORD */}

              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-[9px] font-bold uppercase tracking-[0.2em] text-white/50"
                >
                  Password
                </label>

                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  className="h-12 w-full border border-white/10 bg-black px-4 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-red-500"
                />
              </div>

              {/* SUBMIT */}

              <button
                type="submit"
                disabled={loading}
                className="group flex h-12 w-full items-center justify-center gap-3 bg-red-500 px-5 text-[10px] font-bold uppercase tracking-[0.2em] text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 size={15} className="animate-spin" />
                    Signing In
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight
                      size={15}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* FOOTER */}

          <p className="mt-8 text-center text-[9px] uppercase tracking-[0.2em] text-white/20">
            Authorized personnel only
          </p>
        </div>
      </div>
    </main>
  );
}
