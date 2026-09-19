import { useState } from "react";
import { NavLink } from "react-router-dom";

import {
  LayoutDashboard,
  Home,
  Users,
  BriefcaseBusiness,
  FolderOpen,
  BadgeCheck,
  Newspaper,
  Images,
  Contact,
  LogOut,
  ChevronLeft,
  ChevronRight,
  X,
  Loader2,
  Megaphone,
} from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const navigation = [
  {
    section: "Dashboard",
    items: [
      {
        label: "Overview",
        to: "/admin",
        icon: LayoutDashboard,
      },
    ],
  },

  {
    section: "Website",
    items: [
      {
        label: "Home",
        to: "/admin/home",
        icon: Home,
      },
      {
        label: "Members",
        to: "/admin/members",
        icon: Users,
      },
      {
        label: "Services",
        to: "/admin/services",
        icon: BriefcaseBusiness,
      },
      {
        label: "Sponsors",
        to: "/admin/sponsors",
        icon: BadgeCheck,
      },
      {
        label: "Poster",
        to: "/admin/poster",
        icon: Megaphone,
      },
    ],
  },

  {
    section: "Content",
    items: [
      {
        label: "Projects",
        to: "/admin/projects",
        icon: FolderOpen,
      },
      {
        label: "Careers",
        to: "/admin/careers",
        icon: BriefcaseBusiness,
      },
      {
        label: "Blog",
        to: "/admin/blog",
        icon: Newspaper,
      },
      {
        label: "Media Library",
        to: "/admin/media",
        icon: Images,
      },
    ],
  },

  {
    section: "Communication",
    items: [
      {
        label: "Contacts",
        to: "/admin/contacts",
        icon: Contact,
      },
    ],
  },
];

export default function AdminSidebar({
  collapsed,
  mobileOpen,
  onClose,
  onToggle,
}) {
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    const confirmed = window.confirm("Log out of the admin area?");

    if (!confirmed) return;

    try {
      setLoggingOut(true);

      await fetch(`${API_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      /*
       * Always redirect even if the logout request fails.
       * The protected route will verify the session again.
       */
      window.location.href = "/admin/login";
    }
  };

  return (
    <>
      {/* MOBILE OVERLAY */}

      {mobileOpen && (
        <button
          type="button"
          aria-label="Close admin menu"
          onClick={onClose}
          className="fixed inset-0 z-[49998] bg-black/70 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-[50000] flex flex-col border-r border-white/10 bg-[#080808] transition-all duration-300 ${
          collapsed ? "w-[76px]" : "w-[270px]"
        } ${
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* ==================================================
            HEADER
        ================================================== */}

        <div className="flex h-[76px] shrink-0 items-center justify-between border-b border-white/10 px-4">
          <div
            className={`overflow-hidden whitespace-nowrap transition-all duration-300 ${
              collapsed ? "w-0 opacity-0" : "w-auto opacity-100"
            }`}
          >
            <p className="font-display text-sm font-black tracking-[-0.03em]">
              BEING IBAN
            </p>

            <p className="mt-0.5 text-[8px] font-bold uppercase tracking-[0.28em] text-red-500">
              Admin Studio
            </p>
          </div>

          {/* MOBILE CLOSE */}

          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center text-white/50 hover:text-white lg:hidden"
            aria-label="Close menu"
          >
            <X size={20} strokeWidth={1.7} />
          </button>

          {/* DESKTOP COLLAPSE */}

          <button
            type="button"
            onClick={onToggle}
            className="hidden h-9 w-9 items-center justify-center border border-white/10 text-white/50 transition hover:border-red-500/50 hover:bg-red-500/10 hover:text-white lg:flex"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronRight size={17} /> : <ChevronLeft size={17} />}
          </button>
        </div>

        {/* ==================================================
            NAVIGATION
        ================================================== */}

        <nav className="admin-sidebar-scrollbar flex-1 overflow-y-auto px-3 py-5">
          {navigation.map((group) => (
            <div key={group.section} className="mb-7">
              <p
                className={`mb-2 px-3 text-[9px] font-bold uppercase tracking-[0.25em] text-white/25 ${
                  collapsed ? "pointer-events-none opacity-0" : ""
                }`}
              >
                {group.section}
              </p>

              <div className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;

                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      end={item.to === "/admin"}
                      onClick={onClose}
                      title={collapsed ? item.label : undefined}
                      className={({ isActive }) =>
                        `group flex items-center gap-3 px-3 py-3 text-xs font-semibold transition-all ${
                          isActive
                            ? "bg-red-500 text-white"
                            : "text-white/45 hover:bg-white/[0.04] hover:text-white"
                        } ${collapsed ? "justify-center" : ""}`
                      }
                    >
                      <Icon size={17} strokeWidth={1.7} className="shrink-0" />

                      <span
                        className={`whitespace-nowrap transition-all duration-200 ${
                          collapsed
                            ? "pointer-events-none w-0 overflow-hidden opacity-0"
                            : "w-auto opacity-100"
                        }`}
                      >
                        {item.label}
                      </span>
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* ==================================================
            LOGOUT
        ================================================== */}

        <div className="border-t border-white/10 p-3">
          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            title={collapsed ? "Logout" : undefined}
            className={`flex w-full items-center gap-3 px-3 py-3 text-xs font-semibold text-white/40 transition hover:bg-red-500/10 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-50 ${
              collapsed ? "justify-center" : ""
            }`}
          >
            {loggingOut ? (
              <Loader2
                size={17}
                strokeWidth={1.7}
                className="shrink-0 animate-spin"
              />
            ) : (
              <LogOut size={17} strokeWidth={1.7} className="shrink-0" />
            )}

            <span
              className={`whitespace-nowrap transition-all duration-200 ${
                collapsed
                  ? "pointer-events-none w-0 overflow-hidden opacity-0"
                  : "opacity-100"
              }`}
            >
              {loggingOut ? "Logging out..." : "Logout"}
            </span>
          </button>
        </div>
      </aside>
    </>
  );
}
