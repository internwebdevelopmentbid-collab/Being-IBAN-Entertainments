import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

import { API_URL, authFetch } from "../utils/authFetch";

export default function AdminProtectedRoute() {
  const location = useLocation();

  const [status, setStatus] = useState("checking");

  useEffect(() => {
    let mounted = true;

    const checkAuth = async () => {
      try {
        setStatus("checking");

        /*
         * First check the current access token.
         *
         * authFetch() automatically attempts
         * /auth/refresh if /auth/me returns 401.
         */
        const response = await authFetch(`${API_URL}/auth/me`, {
          method: "GET",
        });

        if (!mounted) {
          return;
        }

        if (response.ok) {
          setStatus("authenticated");
          return;
        }

        /*
         * Both access token and refresh/session token
         * are invalid/expired.
         */
        setStatus("unauthenticated");
      } catch (error) {
        console.error("Admin auth check failed:", error);

        if (mounted) {
          setStatus("unauthenticated");
        }
      }
    };

    checkAuth();

    return () => {
      mounted = false;
    };
  }, []);

  /* ==================================================
     CHECKING
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
     UNAUTHENTICATED
  ================================================== */

  if (status === "unauthenticated") {
    return (
      <Navigate
        to="/admin/login"
        replace
        state={{
          from: location.pathname,
        }}
      />
    );
  }

  /* ==================================================
     AUTHENTICATED
  ================================================== */

  return <Outlet />;
}
