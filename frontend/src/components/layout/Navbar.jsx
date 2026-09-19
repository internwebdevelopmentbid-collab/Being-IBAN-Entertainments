import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const navigation = [
  { name: "Home", path: "/" },
  { name: "About Us", path: "/about" },
  { name: "Services", path: "/services" },
  { name: "Portfolio", path: "/portfolio" },
  { name: "Careers", path: "/careers" },
  { name: "Blog", path: "/blog" },
  { name: "Contact", path: "/contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const location = useLocation();

  /* ============================================
     SCROLL DETECTION
  ============================================ */

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  /* ============================================
     LOCK BODY SCROLL
  ============================================ */

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  /* ============================================
     CLOSE MOBILE MENU ON ROUTE CHANGE
  ============================================ */

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  /* ============================================
     ACTIVE NAVIGATION
  ============================================ */

  const isActive = (path) => {
    if (path === "/") {
      return location.pathname === "/";
    }

    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* ==================================================
          MAIN NAVBAR
      ================================================== */}

      <header
        className={`fixed left-0 right-0 top-0 z-[10000] transition-all duration-500 ${
          scrolled
            ? "border-b border-white/10 bg-black/60 backdrop-blur-2xl"
            : "border-b border-white/[0.06] bg-black/30 backdrop-blur-xl"
        }`}
      >
        {/* Red top accent */}

        <div className="absolute left-0 right-0 top-0 h-[2px] bg-red-600 shadow-[0_0_18px_rgba(220,38,38,0.8)]" />

        {/* Subtle red glass glow */}

        <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-red-600/[0.025]" />

        {/* ==================================================
            NAV CONTENT
        ================================================== */}

        <div className="relative mx-auto flex h-24 max-w-[1600px] items-center justify-between px-5 sm:px-8 lg:px-10">
          {/* Logo */}

          <Link
            to="/"
            className="group flex items-center transition-transform duration-300 hover:scale-[1.02]"
          >
            <img
              src="/images/logo.png"
              alt="Being IBAN Entertainments"
              className="h-20 w-auto object-contain sm:h-22 lg:h-30"
            />
          </Link>

          {/* ==================================================
              DESKTOP NAVIGATION
          ================================================== */}

          <nav className="hidden items-center gap-7 lg:flex xl:gap-9">
            {navigation.map((item) => {
              const active = isActive(item.path);

              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className="group relative py-3 text-[15px] font-semibold tracking-wide xl:text-base"
                >
                  <span
                    className={`transition-colors duration-300 ${
                      active
                        ? "text-white"
                        : "text-white/60 group-hover:text-white"
                    }`}
                  >
                    {item.name}
                  </span>

                  <span
                    className={`absolute bottom-0 left-0 h-[2px] bg-red-600 shadow-[0_0_8px_rgba(220,38,38,0.7)] transition-all duration-300 ${
                      active ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  />
                </Link>
              );
            })}
          </nav>

          {/* ==================================================
              DESKTOP CTA
          ================================================== */}

          <Link
            to="/contact"
            className="hidden items-center gap-3 border border-red-500/40 bg-red-600/90 px-6 py-3.5 text-sm font-bold uppercase tracking-wider text-white shadow-[0_0_25px_rgba(220,38,38,0.15)] backdrop-blur-md transition-all duration-300 hover:border-red-400 hover:bg-red-500 hover:shadow-[0_0_35px_rgba(220,38,38,0.3)] lg:flex"
          >
            Start a Project
            <ArrowUpRight size={18} />
          </Link>

          {/* ==================================================
              MOBILE MENU BUTTON
          ================================================== */}

          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="relative z-[10001] flex h-11 w-11 shrink-0 items-center justify-center border border-white/20 bg-white/[0.04] text-white backdrop-blur-xl transition-all duration-300 hover:border-red-600 hover:bg-red-600/10 hover:text-red-500 active:scale-95 lg:hidden"
            aria-label="Open menu"
            aria-expanded={mobileOpen}
          >
            <Menu size={24} strokeWidth={1.8} />
          </button>
        </div>
      </header>

      {/* ==================================================
          MOBILE MENU
      ================================================== */}

      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* ==================================================
                BACKDROP
            ================================================== */}

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="fixed inset-0 z-[49999] bg-black/60 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileOpen(false)}
            />

            {/* ==================================================
                SLIDING MOBILE MENU
            ================================================== */}

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{
                x: "100%",
                transition: {
                  duration: 0.45,
                  ease: [0.76, 0, 0.24, 1],
                },
              }}
              transition={{
                duration: 0.65,
                ease: [0.76, 0, 0.24, 1],
              }}
              className="
                fixed
                right-0
                top-0
                z-[50000]
                h-[100svh]
                w-full
                overflow-hidden
                bg-black
                sm:w-[88%]
                md:w-[70%]
                lg:hidden
              "
            >
              {/* ==================================================
                  RED BACKGROUND GLOW
              ================================================== */}

              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-40 -top-40 h-[550px] w-[550px] rounded-full bg-red-600/[0.12] blur-3xl"
              />

              <div
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-60 -left-40 h-[450px] w-[450px] rounded-full bg-red-600/[0.06] blur-3xl"
              />

              {/* ==================================================
                  MENU HEADER
              ================================================== */}

              <div
                className="
                  absolute
                  left-0
                  right-0
                  top-0
                  z-[50003]
                  flex
                  h-24
                  items-center
                  justify-between
                  border-b
                  border-white/10
                  bg-black
                  px-5
                  sm:px-8
                "
              >
                {/* Logo */}

                <Link
                  to="/"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center"
                >
                  <img
                    src="/images/logo.png"
                    alt="Being IBAN Entertainments"
                    className="h-16 w-auto object-contain sm:h-20"
                  />
                </Link>

                {/* ==================================================
                    CLOSE BUTTON
                ================================================== */}

                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="
                    relative
                    z-[50004]
                    flex
                    h-12
                    w-12
                    shrink-0
                    cursor-pointer
                    touch-manipulation
                    items-center
                    justify-center
                    border
                    border-white/25
                    bg-white/[0.08]
                    text-white
                    shadow-[0_0_25px_rgba(0,0,0,0.5)]
                    transition-all
                    duration-300
                    hover:border-red-600
                    hover:bg-red-600
                    hover:text-white
                    active:scale-90
                  "
                  aria-label="Close menu"
                  aria-expanded={mobileOpen}
                >
                  <X size={27} strokeWidth={1.8} />
                </button>
              </div>

              {/* ==================================================
                  MOBILE NAVIGATION
              ================================================== */}

              <nav
                className="
                  mobile-menu-scrollbar
                  absolute
                  inset-x-0
                  bottom-0
                  top-24
                  z-[50001]
                  overflow-y-auto
                  px-5
                  pb-36
                  pt-4
                  sm:px-8
                  sm:pt-6
                "
              >
                {navigation.map((item, index) => {
                  const active = isActive(item.path);

                  return (
                    <motion.div
                      key={item.name}
                      initial={{
                        opacity: 0,
                        x: 30,
                      }}
                      animate={{
                        opacity: 1,
                        x: 0,
                      }}
                      transition={{
                        duration: 0.45,
                        delay: 0.18 + index * 0.055,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                    >
                      <Link
                        to={item.path}
                        onClick={() => setMobileOpen(false)}
                        className={`group flex items-center border-b border-white/10 py-3.5 transition-all duration-300 sm:py-4 ${
                          active
                            ? "text-white"
                            : "text-white/55 hover:text-white"
                        }`}
                      >
                        {/* Number */}

                        <span
                          className={`mr-4 w-7 shrink-0 text-[9px] font-bold tracking-widest sm:mr-5 sm:w-8 sm:text-xs ${
                            active
                              ? "text-red-600"
                              : "text-white/25 group-hover:text-red-600"
                          }`}
                        >
                          {String(index + 1).padStart(2, "0")}
                        </span>

                        {/* Text */}

                        <span className="font-display text-[1.1rem] font-black tracking-tight transition-transform duration-300 group-hover:translate-x-1 sm:text-[1.5rem]">
                          {item.name}
                        </span>

                        {/* Arrow */}

                        <ArrowUpRight
                          size={17}
                          strokeWidth={1.7}
                          className={`ml-auto shrink-0 transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 sm:size-[20px] ${
                            active
                              ? "text-red-600"
                              : "text-white/20 group-hover:text-red-600"
                          }`}
                        />
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>

              {/* ==================================================
                  MOBILE CTA
              ================================================== */}

              <motion.div
                initial={{
                  opacity: 0,
                  y: 30,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.5,
                  delay: 0.55,
                }}
                className="
                  absolute
                  bottom-0
                  left-0
                  right-0
                  z-[50003]
                  border-t
                  border-white/10
                  bg-black
                  p-5
                  sm:p-8
                "
              >
                <Link
                  to="/contact"
                  onClick={() => setMobileOpen(false)}
                  className="
                    flex
                    items-center
                    justify-between
                    border
                    border-red-500/30
                    bg-red-600
                    px-6
                    py-4
                    text-sm
                    font-bold
                    uppercase
                    tracking-wider
                    text-white
                    shadow-[0_0_30px_rgba(220,38,38,0.15)]
                    transition-all
                    duration-300
                    hover:bg-white
                    hover:text-black
                  "
                >
                  Start a Project
                  <ArrowUpRight size={20} />
                </Link>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
