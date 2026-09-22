import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

import { getCurrentAdmin } from "../utils/authFetch";

export default function AdminProtectedRoute() {
  const location = useLocation();

  const [status, setStatus] = useState("checking");

  useEffect(() => {
    let mounted = true;

    const checkAuth = async () => {
      try {
        setStatus("checking");

        /*
         * Check the current admin session.
         *
         * getCurrentAdmin() uses:
         *
         * GET /api/auth/me
         *
         * If the access token has expired,
         * adminFetch() automatically calls:
         *
         * POST /api/auth/refresh
         *
         * and retries /api/auth/me.
         */
        await getCurrentAdmin();

        if (!mounted) {
          return;
        }

        setStatus("authenticated");
      } catch (error) {
        console.error("Admin auth check failed:", error);

        if (!mounted) {
          return;
        }

        setStatus("unauthenticated");
      }
    };

    checkAuth();

    return () => {
      mounted = false;
    };
  }, []);

  /* ==================================================
     CHECKING SESSION
  ================================================== */

  if (status === "checking") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        <div className="text-center">
          <div className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-white/10 border-t-red-500" />

          <p className="mt-4 text-[9px] font-bold uppercase tracking-[0.25em] text-white/30">
            Checking session
          </p>
        </div>
      </div>
    );
  }

  /* ==================================================
     NOT AUTHENTICATED
  ================================================== */

  if (status === "unauthenticated") {
    const returnTo = location.pathname + location.search + location.hash;

    return (
      <Navigate
        to="/admin/login"
        replace
        state={{
          from: returnTo,
        }}
      />
    );
  }

  /* ==================================================
     AUTHENTICATED
  ================================================== */

  return <Outlet />;
}
